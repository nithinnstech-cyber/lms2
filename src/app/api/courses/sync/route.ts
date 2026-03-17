import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Helper function to map title/description to category
function determineCategory(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('docker') || lowerText.includes('container')) return 'Docker';
  if (lowerText.includes('network') || lowerText.includes('cisco') || lowerText.includes('ccna')) return 'Networking';
  if (lowerText.includes('kubernetes') || lowerText.includes('k8s') || lowerText.includes('helm')) return 'Kubernetes';
  if (lowerText.includes('linux') || lowerText.includes('ubuntu') || lowerText.includes('bash') || lowerText.includes('shell')) return 'Linux';
  if (lowerText.includes('aws') || lowerText.includes('gcp') || lowerText.includes('azure') || lowerText.includes('cloud')) return 'Cloud';
  if (lowerText.includes('devops') || lowerText.includes('ci') || lowerText.includes('cd') || lowerText.includes('jenkins')) return 'DevOps';
  if (lowerText.includes('python') || lowerText.includes('django') || lowerText.includes('flask')) return 'Python';
  if (lowerText.includes('git') || lowerText.includes('github') || lowerText.includes('version control')) return 'Git';
  if (lowerText.includes('security') || lowerText.includes('cyber') || lowerText.includes('ethical hack')) return 'Security';
  
  return 'General';
}

function extractTags(text: string): string[] {
  const lowerText = text.toLowerCase();
  const tags: string[] = [];
  const trackedTags = ['docker', 'kubernetes', 'python', 'react', 'node', 'aws', 'gcp', 'azure', 'linux', 'git', 'ci/cd', 'frontend', 'backend'];
  
  trackedTags.forEach(tag => {
    if (lowerText.includes(tag)) {
      tags.push(tag);
    }
  });
  
  return tags;
}

export async function GET(request: Request) {
  try {
    const url = 'https://collection-for-coursera-courses.p.rapidapi.com/rapidapi/course/get_institution.php';
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
        'x-rapidapi-host': 'collection-for-coursera-courses.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        // Log specific failure mode with context
        const errorText = await response.text();
        console.error(`[RapidAPI Sync Error] Status: ${response.status} | Context: Failed to fetch courses from external provider. Response: ${errorText}`);
        throw new Error(`RapidAPI responded with ${response.status}`);
    }
    const data = await response.json();

    // Setup Supabase admin client (Service Role required to bypass RLS for inserts on courses)
    // Note: To bypass RLS and insert courses, we either need a service_role key, or RLS allows auth/anon to write. 
    // The instructions specified "only service role can insert/update".
    // We will use standard anon key if service role isn't provided, but in strict prod this should be service_role
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) { return cookieStore.get(name)?.value; },
            set(name: string, value: string, options: CookieOptions) {},
            remove(name: string, options: CookieOptions) {},
          },
        }
    );

    let synced = 0;
    let skipped = 0;

    // Depending on RapidAPI structure, data might be an array or data.courses. Assuming it's an array for mapping.
    const coursesToSync = Array.isArray(data) ? data : (data.courses || data.items || []);

    for (const item of coursesToSync) {
      const title = item.title || item.name || '';
      const summary = item.description || item.summary || '';
      const combinedText = `${title} ${summary}`;
      
      const category = determineCategory(combinedText);
      const tags = extractTags(combinedText);
      
      const coursePayload = {
        external_id: item.id || Math.random().toString(), // fallback if API structure varies
        title: title,
        description: summary,
        category: category,
        tech_tags: tags,
        thumbnail_url: item.logo || item.photoUrl || '',
        course_url: item.link || item.url || '',
        institution: item.institution || item.partner || 'Coursera',
        difficulty: item.difficulty || 'Beginner',
        rating: item.rating ? parseFloat(item.rating) : null,
      };

      const { data: upsertData, error } = await supabase
        .from('courses')
        .upsert(coursePayload, { onConflict: 'external_id' });

      if (error) {
        // Log specific failure mode with context
        console.error(`[Supabase Upsert Error] Course: ${title} | External ID: ${item.id || 'N/A'} | Context: Failed to insert or update course record in database. Details: ${error.message}`);
        skipped++;
      } else {
        synced++;
      }
    }

    return NextResponse.json({ synced, skipped, total_found: coursesToSync.length });
  } catch (error: any) {
    console.error("Failed to sync courses from RapidAPI:", error.message);
    return NextResponse.json({ error: 'Failed to sync courses', details: error.message }, { status: 500 });
  }
}
