import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateBatches() {
  console.log("Fetching distinct batches from students...");
  
  // Get all students
  const { data: students, error: sErr } = await supabase.from('students').select('batch');
  if (sErr) {
    console.error("Error fetching students:", sErr);
    return;
  }
  
  // Extract unique batches, filtering out empty ones
  const uniqueBatches = [...new Set(students.map(s => s.batch).filter(b => b && b.trim() !== ''))];
  
  console.log(`Found ${uniqueBatches.length} unique batches:`, uniqueBatches);
  
  if (uniqueBatches.length === 0) {
    console.log("No batches found to migrate.");
    return;
  }
  
  // Check what's already in the batches table to avoid duplicates
  const { data: existingBatches, error: eErr } = await supabase.from('batches').select('batch_name');
  if (eErr) {
    console.error("Error fetching existing batches:", eErr);
    // Continue anyway or abort? If table doesn't exist, this will throw an error
    if (eErr.code === '42P01') {
       console.error("The batches table doesn't exist yet! The user needs to run the SQL first.");
       return;
    }
  }
  
  const existingNames = (existingBatches || []).map(b => b.batch_name);
  
  const batchesToInsert = uniqueBatches
    .filter(b => !existingNames.includes(b))
    .map(b => ({ batch_name: b }));
    
  if (batchesToInsert.length === 0) {
    console.log("All batches are already migrated.");
    return;
  }
  
  console.log(`Inserting ${batchesToInsert.length} new batches...`);
  
  const { error: iErr } = await supabase.from('batches').insert(batchesToInsert);
  
  if (iErr) {
    console.error("Error inserting batches:", iErr);
  } else {
    console.log("Migration successful!");
  }
}

migrateBatches();
