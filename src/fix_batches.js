import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fixBatches() {
  const { data: students } = await supabase.from('students').select('*').is('batch', null);
  console.log(`Found ${students.length} students with no batch name.`);

  for (const s of students) {
    if (s.course) {
      // e.g. "TTS8.00AM" -> "TTS800AM"
      let newBatch = s.course.replace(/[\.\s]/g, '');
      
      // Basic validation if it looks like a batch name
      if (newBatch.includes('AM') || newBatch.includes('PM')) {
        const { error } = await supabase.from('students').update({ batch: newBatch }).eq('id', s.id);
        if (error) {
          console.error(`Error updating ${s.name}:`, error);
        } else {
          console.log(`Fixed ${s.name}: set batch to ${newBatch}`);
        }
      } else {
        // If course doesn't look like a batch, just assign a default or try to guess
        console.log(`Could not guess batch for ${s.name} from course: ${s.course}`);
      }
    }
  }
  console.log('Finished fixing batch names.');
}

fixBatches();
