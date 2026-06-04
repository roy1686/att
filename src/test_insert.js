import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testInsert() {
  console.log("Testing student insert...");
  const studentPayload = {
      name: 'Test Student',
      batch: 'TestBatch',
      course_id: null,
      course: 'N/A',
      phone: '1234567890',
      parent_phone: '1234567890',
      admission_date: '2026-06-04'
  };

  const { data: sData, error: sErr } = await supabase.from('students').insert(studentPayload).select('id');
  if (sErr) {
    console.error('Student insert error:', sErr);
  } else {
    console.log('Student insert success:', sData);
    
    // Test fee payment
    console.log("Testing fee payment insert...");
    const feePayload = {
      student_id: sData[0].id,
      amount_paid: 500,
      payment_type: 'Monthly Fee',
      months_paid: ['Jan', 'Feb'],
      payment_date: '2026-06-04'
    };
    
    const { error: fErr } = await supabase.from('fee_payments').insert(feePayload);
    if (fErr) {
      console.error('Fee insert error:', fErr);
    } else {
      console.log('Fee insert success');
    }
    
    // cleanup
    await supabase.from('fee_payments').delete().eq('student_id', sData[0].id);
    await supabase.from('students').delete().eq('id', sData[0].id);
  }
}

testInsert();
