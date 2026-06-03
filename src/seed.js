import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const courses = [
  { course_name: 'PGDCA', duration_months: 12, admission_fee: 1500, monthly_fee: 700, total_fee: null, total_course_fee: 0 },
  { course_name: 'OSCIT and Tally', duration_months: 3, admission_fee: 600, monthly_fee: 0, total_fee: 4000, total_course_fee: 4000 }
];

const studentsData = [
  // TUESDAY, THURDAY & SATURDAY 8.00 AM
  { name: 'ARCHITA PRADHAN', phone: '7848014608', parent_phone: '7848014608', batch: 'TUESDAY, THURDAY & SATURDAY 8.00 AM' },
  { name: 'ARUPA PRADHAN', phone: '7848014608', parent_phone: '7848014608', batch: 'TUESDAY, THURDAY & SATURDAY 8.00 AM' },
  { name: 'SUBHALAXMI SAHOO', phone: '7077039898', parent_phone: '9938959470', batch: 'TUESDAY, THURDAY & SATURDAY 8.00 AM' },
  { name: 'RASMITA NAYAK', phone: '9937221955', parent_phone: '7328896547', batch: 'TUESDAY, THURDAY & SATURDAY 8.00 AM' },
  { name: 'SRIYASHREE SAHOO', phone: '7991039592', parent_phone: '7377237016', batch: 'TUESDAY, THURDAY & SATURDAY 8.00 AM' },
  { name: 'KHIRABDI TANAYA DAS', phone: '8455970106', parent_phone: '9777742686', batch: 'TUESDAY, THURDAY & SATURDAY 8.00 AM' },
  { name: 'BISHNU PRIYA DAS', phone: '7749040644', parent_phone: '9777675815', batch: 'TUESDAY, THURDAY & SATURDAY 8.00 AM' },
  { name: 'SONPRIYA DAS', phone: '7735322439', parent_phone: '8144241044', batch: 'TUESDAY, THURDAY & SATURDAY 8.00 AM' },
  { name: 'PUJA DAS', phone: '9692314911', parent_phone: '9861882119', batch: 'TUESDAY, THURDAY & SATURDAY 8.00 AM' },
  { name: 'SUBHASHREE THAPPA', phone: '9090265822', parent_phone: '9090265822', batch: 'TUESDAY, THURDAY & SATURDAY 8.00 AM' },
  { name: 'DIPTI RANJAN DAS', phone: '8926107576', parent_phone: '9777675815', batch: 'TUESDAY, THURDAY & SATURDAY 8.00 AM' },
  { name: 'JYOTIRANJAN DAS', phone: '7848085212', parent_phone: '9777675815', batch: 'TUESDAY, THURDAY & SATURDAY 8.00 AM' },
  { name: 'RAJESH KUMAR PAIKRAY', phone: '8249797063', parent_phone: '7504664143', batch: 'TUESDAY, THURDAY & SATURDAY 8.00 AM' },

  // TUESDAY, THURDAY & SATURDAY 6.30 PM
  { name: 'NEHA DAKUA', phone: '8249936158', parent_phone: '9556473662', batch: 'TUESDAY, THURDAY & SATURDAY 6.30 PM' },
  { name: 'SANGITA MANSINGH', phone: '7684983518', parent_phone: '7077345360', batch: 'TUESDAY, THURDAY & SATURDAY 6.30 PM' },
  { name: 'ANUSHREE BEHERA', phone: '8144001477', parent_phone: '8270771871', batch: 'TUESDAY, THURDAY & SATURDAY 6.30 PM' },
  { name: 'SNEHANJALI MOHARANA', phone: '7606064209', parent_phone: '8658633739', batch: 'TUESDAY, THURDAY & SATURDAY 6.30 PM' },
  { name: 'ANKITA BASANTARA', phone: '9090002054', parent_phone: '9776463604', batch: 'TUESDAY, THURDAY & SATURDAY 6.30 PM' },
  { name: 'SWAPNALIPSHA SAHOO', phone: '9040251322', parent_phone: '7077580818', batch: 'TUESDAY, THURDAY & SATURDAY 6.30 PM' },
  { name: 'BIKASH BHUE', phone: '8260886487', parent_phone: '9937514880', batch: 'TUESDAY, THURDAY & SATURDAY 6.30 PM' },
  { name: 'SAI SADA SUNDAR SINGH', phone: '8917241417', parent_phone: '7978199292', batch: 'TUESDAY, THURDAY & SATURDAY 6.30 PM' },
  { name: 'RITESH GANDA', phone: '8908606082', parent_phone: '6371027285', batch: 'TUESDAY, THURDAY & SATURDAY 6.30 PM' },
  { name: 'SOURAV BARIK', phone: '9348751192', parent_phone: '9861065229', batch: 'TUESDAY, THURDAY & SATURDAY 6.30 PM' },

  // MONDAY, WEDNESDAY & FRIDAY 7.00 AM
  { name: 'ARCHITA PTUSTY', phone: '9692644087', parent_phone: '9776610501', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.00 AM' },
  { name: 'BARSHA JENA', phone: '7008416220', parent_phone: '8596979917', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.00 AM' },
  { name: 'PRIYANKA NAYAK', phone: '6370074967', parent_phone: '9692644104', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.00 AM' },
  { name: 'LAXMI PRIYA NAYAK', phone: '8260819223', parent_phone: '7735203855', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.00 AM' },
  { name: 'MANIKA GOURDA', phone: '9437558621', parent_phone: '7846995822', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.00 AM' },
  { name: 'ANNAPURNA GAHAN', phone: '9692726399', parent_phone: '8456044550', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.00 AM' },
  { name: 'SASMITA ROUT', phone: '7894088644', parent_phone: '9938818315', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.00 AM' },
  { name: 'P. ABHIPSA KUMARI', phone: '7847930334', parent_phone: '8144064510', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.00 AM' },
  { name: 'ASHARANI NAYAK', phone: '7735253792', parent_phone: '7606896175', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.00 AM' },
  { name: 'NABANITA DAS', phone: '7788947078', parent_phone: '7077336749', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.00 AM' },
  { name: 'TANUSHREE NAYAK', phone: '9178665131', parent_phone: '9178665131', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.00 AM' },
  { name: 'SONALI NAYAK', phone: '9437888366', parent_phone: '9139779983', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.00 AM' },
  { name: 'AVIJEET SARANGI', phone: '8249647575', parent_phone: '9337470158', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.00 AM' },
  { name: 'BUISHNU JENA', phone: '7854813285', parent_phone: '8093203677', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.00 AM' },
  { name: 'ANUP KU NAYAK', phone: '7008024086', parent_phone: '7749934959', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.00 AM' },
  
  // MONDAY, WEDNESDAY & FRIDAY 8.00 AM
  { name: 'SANJIB RAUTRAY', phone: '8658212983', parent_phone: '9938742509', batch: 'MONDAY, WEDNESDAY & FRIDAY 8.00 AM' },
  { name: 'RUTURAJ PAIKRAY', phone: '9861970091', parent_phone: '9861978549', batch: 'MONDAY, WEDNESDAY & FRIDAY 8.00 AM' },
  { name: 'LAXMIDHAR MAHARANA', phone: '8144562438', parent_phone: '8984691334', batch: 'MONDAY, WEDNESDAY & FRIDAY 8.00 AM' },
  { name: 'BABHANI RATH', phone: '9124531592', parent_phone: '9938090662', batch: 'MONDAY, WEDNESDAY & FRIDAY 8.00 AM' },
  { name: 'SURYASNATA SAHU', phone: '8917362779', parent_phone: '8249294479', batch: 'MONDAY, WEDNESDAY & FRIDAY 8.00 AM' },

  // MONDAY, WEDNESDAY & FRIDAY 6.30 PM
  { name: 'SUVASHREE SAHOO', phone: '', parent_phone: '', batch: 'MONDAY, WEDNESDAY & FRIDAY 6.30 PM' },
  { name: 'RAJASHREE DAS', phone: '9937918892', parent_phone: '9337731103', batch: 'MONDAY, WEDNESDAY & FRIDAY 6.30 PM' },
  { name: 'MD ARAS', phone: '9078826457', parent_phone: '7657057252', batch: 'MONDAY, WEDNESDAY & FRIDAY 6.30 PM' },
  { name: 'SUBASIS SAHOO', phone: '', parent_phone: '', batch: 'MONDAY, WEDNESDAY & FRIDAY 6.30 PM' },
  { name: 'ASHIS BEHERA', phone: '', parent_phone: '', batch: 'MONDAY, WEDNESDAY & FRIDAY 6.30 PM' },
  { name: 'SURAJ NAYAK', phone: '9861763301', parent_phone: '9937774003', batch: 'MONDAY, WEDNESDAY & FRIDAY 6.30 PM' },
  { name: 'ADITYA BARIK', phone: '9777032199', parent_phone: '9178328741', batch: 'MONDAY, WEDNESDAY & FRIDAY 6.30 PM' },
  { name: 'SUSIL SWAIN', phone: '7008783974', parent_phone: '9861032403', batch: 'MONDAY, WEDNESDAY & FRIDAY 6.30 PM' },
  { name: 'ALOK NAYAK', phone: '9827215774', parent_phone: '8079879141', batch: 'MONDAY, WEDNESDAY & FRIDAY 6.30 PM' },
  { name: 'TAPAS NAYAK', phone: '8144535840', parent_phone: '8908077605', batch: 'MONDAY, WEDNESDAY & FRIDAY 6.30 PM' },

  // MONDAY, WEDNESDAY & FRIDAY 7.30 PM
  { name: 'SUJATA DAS', phone: '9692113488', parent_phone: '8093193787', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.30 PM' },
  { name: 'OM KUMAR OJHA', phone: '9776008597', parent_phone: '9853605383', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.30 PM' },
  { name: 'SANDIP KU JENA', phone: '9244702553', parent_phone: '9178769385', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.30 PM' },
  { name: 'RASHMI R. JENA', phone: '8144358243', parent_phone: '6371280932', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.30 PM' },
  { name: 'ARYAN SETHI', phone: '8917432182', parent_phone: '6371237602', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.30 PM' },
  { name: 'ABHIJIT NAYAK', phone: '9861354054', parent_phone: '7992716171', batch: 'MONDAY, WEDNESDAY & FRIDAY 7.30 PM' }
];

async function seed() {
  console.log('Seeding courses...');
  for (let c of courses) {
    const { data: existing, error: fetchErr } = await supabase
      .from('courses')
      .select('*')
      .eq('course_name', c.course_name)
      .single();
    
    if (!existing) {
      const { error: insErr } = await supabase.from('courses').insert(c);
      if (insErr) console.error('Error inserting course:', insErr.message);
    }
  }

  console.log('Fetching PGDCA course id...');
  const { data: defaultCourse } = await supabase
    .from('courses')
    .select('id')
    .eq('course_name', 'PGDCA')
    .single();

  const course_id = defaultCourse?.id;

  console.log('Seeding students...');
  for (let s of studentsData) {
    s.course_id = course_id;
    s.course = 'PGDCA'; // satisfy existing NOT NULL constraint
    
    const { data: existing } = await supabase
      .from('students')
      .select('*')
      .eq('name', s.name)
      .eq('batch', s.batch)
      .single();

    if (!existing) {
      const { error } = await supabase.from('students').insert(s);
      if (error) console.error('Error inserting student:', s.name, error.message);
      else console.log('Inserted', s.name);
    } else {
      console.log('Skipped', s.name, '- already exists');
    }
  }

  console.log('Seeding done.');
}

seed();
