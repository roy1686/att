import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const mappings = {
  'TUESDAY, THURDAY & SATURDAY 8.00 AM': 'TTS800AM',
  'TUESDAY, THURDAY & SATURDAY 9.00 AM': 'TTS900AM',
  'TUESDAY, THURDAY & SATURDAY 6.30 PM': 'TTS630PM',
  'TUESDAY, THURDAY & SATURDAY 7.30 AM': 'TTS730AM',
  'MONDAY, WEDNESDAY & FRIDAY 7.00 AM': 'MWF700AM',
  'MONDAY, WEDNESDAY & FRIDAY 8.00 AM': 'MWF800AM',
  'MONDAY, WEDNESDAY & FRIDAY 8.30 AM': 'MWF830AM',
  'MONDAY, WEDNESDAY & FRIDAY 6.30 PM': 'MWF630PM',
  'MONDAY, WEDNESDAY & FRIDAY 7.30 PM': 'MWF730PM'
};

async function updateBatches() {
  console.log('Updating batch names...');
  for (const [oldName, newName] of Object.entries(mappings)) {
    const { error } = await supabase
      .from('students')
      .update({ batch: newName })
      .eq('batch', oldName);
    if (error) {
      console.error(`Error updating ${oldName}:`, error);
    } else {
      console.log(`Updated ${oldName} to ${newName}`);
    }
  }
  console.log('Done updating batch names.');
}

updateBatches();
