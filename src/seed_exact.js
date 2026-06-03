import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const allStudents = [
  // MWF 7.00 AM -> MWF700AM
  { name: 'ARCHITA PTUSTY', batch: 'MWF700AM', phone: '9692644087', parent_phone: '9776610501' },
  { name: 'BARSHA JENA', batch: 'MWF700AM', phone: '7008416220', parent_phone: '8596979917' },
  { name: 'PRIYANKA NAYAK', batch: 'MWF700AM', phone: '6370074967', parent_phone: '9692644104' },
  { name: 'LAXMI PRIYA NAYAK', batch: 'MWF700AM', phone: '8260819223', parent_phone: '7735203855' },
  { name: 'MANIKA GOURDA', batch: 'MWF700AM', phone: '9437558621', parent_phone: '7846995822' },
  { name: 'ANNAPURNA GAHAN', batch: 'MWF700AM', phone: '9692726399', parent_phone: '8456044550' },
  { name: 'SASMITA ROUT', batch: 'MWF700AM', phone: '7894088644', parent_phone: '9938818315' },
  { name: 'P. ABHIPSA KUMARI', batch: 'MWF700AM', phone: '7847930334', parent_phone: '8144064510' },
  { name: 'ASHARANI NAYAK', batch: 'MWF700AM', phone: '7735253792', parent_phone: '7606896175' },
  { name: 'NABANITA DAS', batch: 'MWF700AM', phone: '7788947078', parent_phone: '7077336749' },
  { name: 'TANUSHREE NAYAK', batch: 'MWF700AM', phone: '9178665131', parent_phone: '9178665131' },
  { name: 'SONALI NAYAK', batch: 'MWF700AM', phone: '9437888366', parent_phone: '9439779983' },
  { name: 'AVIJEET SARANGI', batch: 'MWF700AM', phone: '8249647575', parent_phone: '9337470158' },
  { name: 'BUISHNU JENA', batch: 'MWF700AM', phone: '7854813285', parent_phone: '8093203677' },
  { name: 'ANUP KU NAYAK', batch: 'MWF700AM', phone: '7008024086', parent_phone: '7749934959' },
  { name: 'TANMAY PRADHAN', batch: 'MWF700AM', phone: 'N/A', parent_phone: 'N/A' },

  // MWF 8.00 AM -> MWF800AM
  { name: 'SANJIB RAUTRAY', batch: 'MWF800AM', phone: '8658212983', parent_phone: '9938742509' },
  { name: 'RUTURAJ PAIKRAY', batch: 'MWF800AM', phone: '9861970091', parent_phone: '9861978549' },
  { name: 'LAXMIDHAR MAHARANA', batch: 'MWF800AM', phone: '8144562438', parent_phone: '8984691334' },
  { name: 'BABHANI RATH', batch: 'MWF800AM', phone: '9124531592', parent_phone: '9938090662' },
  { name: 'SURYASNATA SAHU', batch: 'MWF800AM', phone: '8917362779', parent_phone: '8249294479' },

  // MWF 6.30 PM -> MWF630PM
  { name: 'SUVASHREE SAHOO', batch: 'MWF630PM', phone: 'N/A', parent_phone: 'N/A' },
  { name: 'RAJASHREE DAS', batch: 'MWF630PM', phone: '9937918892', parent_phone: '9337731103' },
  { name: 'MD ARAS', batch: 'MWF630PM', phone: '9078826457', parent_phone: '7657057252' },
  { name: 'SUBASIS SAHOO', batch: 'MWF630PM', phone: 'N/A', parent_phone: 'N/A' },
  { name: 'ASHIS BEHERA', batch: 'MWF630PM', phone: 'N/A', parent_phone: 'N/A' },
  { name: 'SURAJ NAYAK', batch: 'MWF630PM', phone: '9861763301', parent_phone: '9937774003' },
  { name: 'ADITYA BARIK', batch: 'MWF630PM', phone: '9777032199', parent_phone: '9178328741' },
  { name: 'SUSIL SWAIN', batch: 'MWF630PM', phone: '7008783974', parent_phone: '9861032403' },
  { name: 'ALOK NAYAK', batch: 'MWF630PM', phone: '9827215774', parent_phone: '8079879141' },
  { name: 'TAPAS NAYAK', batch: 'MWF630PM', phone: '8144535840', parent_phone: '8908077605' },

  // MWF 7.30 PM -> MWF730PM
  { name: 'SUJATA DAS', batch: 'MWF730PM', phone: '9692113488', parent_phone: '8093193787' },
  { name: 'OM KUMAR OJHA', batch: 'MWF730PM', phone: '9776008597', parent_phone: '9853605383' },
  { name: 'SANDIP KU JENA', batch: 'MWF730PM', phone: '9244702553', parent_phone: '9178769385' },
  { name: 'RASHMI R. JENA', batch: 'MWF730PM', phone: '8144358243', parent_phone: '6371280932' },
  { name: 'ARYAN SETHI', batch: 'MWF730PM', phone: '8917432182', parent_phone: '6371237602' },
  { name: 'ABHIJIT NAYAK', batch: 'MWF730PM', phone: '9861354054', parent_phone: '7992716171' },

  // TTS 7.00 AM -> TTS700AM
  { name: 'BARSHA ADITYA PRIYADARSHI', batch: 'TTS700AM', phone: '9827703863', parent_phone: '8144131391' },
  { name: 'ISHA PARIDA', batch: 'TTS700AM', phone: '6009058509', parent_phone: '8837411926' },
  { name: 'GOUTAM SUBUDHI', batch: 'TTS700AM', phone: '7894827686', parent_phone: '8144426268' },
  { name: 'CHINMAY SAHOO', batch: 'TTS700AM', phone: '7847888187', parent_phone: '7735599403' },
  { name: 'BHABANI P. RATH', batch: 'TTS700AM', phone: '9124531592', parent_phone: '9938090662' },
  { name: 'TANMAY PATRA', batch: 'TTS700AM', phone: '7008496216', parent_phone: '8763041754' },

  // TTS 8.00 AM -> TTS800AM
  { name: 'ARCHITA PRADHAN', batch: 'TTS800AM', phone: '7848014608', parent_phone: '7848014608' },
  { name: 'ARUPA PRADHAN', batch: 'TTS800AM', phone: '7848014608', parent_phone: '7848014608' },
  { name: 'SUBHALAXMI SAHOO', batch: 'TTS800AM', phone: '7077039898', parent_phone: '9938959470' },
  { name: 'RASMITA NAYAK', batch: 'TTS800AM', phone: '9937221955', parent_phone: '7328896547' },
  { name: 'SRIYASHREE SAHOO', batch: 'TTS800AM', phone: '7991039592', parent_phone: '7377237016' },
  { name: 'KHIRABDI TANAYA DAS', batch: 'TTS800AM', phone: '8455970106', parent_phone: '9777742686' },
  { name: 'BISHNU PRIYA DAS', batch: 'TTS800AM', phone: '7749040644', parent_phone: '9777675815' },
  { name: 'SONPRIYA DAS', batch: 'TTS800AM', phone: '7735322439', parent_phone: '8144241044' },
  { name: 'PUJA DAS', batch: 'TTS800AM', phone: '9692314911', parent_phone: '9861882119' },
  { name: 'SUBHASHREE THAPPA', batch: 'TTS800AM', phone: '9090265822', parent_phone: '9090265822' },
  { name: 'DIPTI RANJAN DAS', batch: 'TTS800AM', phone: '8926107576', parent_phone: '9777675815' },
  { name: 'JYOTIRANJAN DAS', batch: 'TTS800AM', phone: '7848085212', parent_phone: '9777675815' },
  { name: 'RAJESH KUMAR PAIKRAY', batch: 'TTS800AM', phone: '8249797063', parent_phone: '7504664143' },

  // TTS 6.30 PM -> TTS630PM
  { name: 'NEHA DAKUA', batch: 'TTS630PM', phone: '8249936158', parent_phone: '9556473662' },
  { name: 'SANGITA MANSINGH', batch: 'TTS630PM', phone: '7684983518', parent_phone: '7077345360' },
  { name: 'ANUSHREE BEHERA', batch: 'TTS630PM', phone: '8144001477', parent_phone: '8270771871' },
  { name: 'SNEHANJALI MOHARANA', batch: 'TTS630PM', phone: '7606064209', parent_phone: '8658633739' },
  { name: 'ANKITA BASANTARA', batch: 'TTS630PM', phone: '9090002054', parent_phone: '9776463604' },
  { name: 'SWAPNALIPSHA SAHOO', batch: 'TTS630PM', phone: '9040251322', parent_phone: '7077580818' },
  { name: 'BIKASH BHUE', batch: 'TTS630PM', phone: '8260886487', parent_phone: '9937514880' },
  { name: 'SAI SADA SUNDAR SINGH', batch: 'TTS630PM', phone: '8917241417', parent_phone: '7978199292' },
  { name: 'RITESH GANDA', batch: 'TTS630PM', phone: '8908606082', parent_phone: '6371027285' },
  { name: 'SOURAV BARIK', batch: 'TTS630PM', phone: '9348751192', parent_phone: '9861065229' }
];

async function seedExact() {
  console.log('Fetching course id...');
  const { data: courses } = await supabase.from('courses').select('id, course_name').limit(1);
  if (!courses || courses.length === 0) {
    console.log('No courses found, make sure courses exist.');
    return;
  }
  const courseId = courses[0].id;

  console.log('Upserting students...');
  for (const s of allStudents) {
    s.course_id = courseId;
    s.course = 'PGDCA'; // satisfy existing NOT NULL constraint
    
    // Check if student exists by name
    const { data: existing } = await supabase
      .from('students')
      .select('id')
      .eq('name', s.name)
      .single();

    if (existing) {
      // Update
      const { error } = await supabase
        .from('students')
        .update(s)
        .eq('id', existing.id);
      if (error) console.error('Error updating:', s.name, error);
      else console.log('Updated:', s.name);
    } else {
      // Insert
      const { error } = await supabase
        .from('students')
        .insert(s);
      if (error) console.error('Error inserting:', s.name, error);
      else console.log('Inserted:', s.name);
    }
  }

  console.log('Cleaning up old students not in the images...');
  const namesToKeep = allStudents.map(s => s.name);
  const { data: dbStudents } = await supabase.from('students').select('id, name');
  
  if (dbStudents) {
    const idsToDelete = dbStudents
      .filter(s => !namesToKeep.includes(s.name))
      .map(s => s.id);

    if (idsToDelete.length > 0) {
      console.log(`Deleting ${idsToDelete.length} old students...`);
      // Delete child records first
      await supabase.from('attendance').delete().in('student_id', idsToDelete);
      await supabase.from('fee_payments').delete().in('student_id', idsToDelete);
      
      // Delete students
      const { error } = await supabase.from('students').delete().in('id', idsToDelete);
      if (error) console.error('Error deleting old students:', error);
      else console.log('Successfully deleted old students.');
    } else {
      console.log('No old students to delete.');
    }
  }

  console.log('All exact data seeded and cleaned up.');
}

seedExact();
