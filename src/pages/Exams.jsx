import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, Save } from 'lucide-react';

export default function Exams() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [examName, setExamName] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      fetchStudents(selectedBatch);
    } else {
      setStudents([]);
    }
  }, [selectedBatch]);

  async function fetchBatches() {
    const { data } = await supabase.from('students').select('batch');
    if (data) {
      const uniqueBatches = [...new Set(data.map(d => d.batch).filter(Boolean))];
      setBatches(uniqueBatches);
    }
  }

  async function fetchStudents(batch) {
    const { data } = await supabase.from('students').select('*').eq('batch', batch).order('name');
    if (data) setStudents(data);
    // Note: We are keeping marks locally until saved.
    // If you want to load previously saved marks, it would require joining exams and exam_marks.
  }

  const handleMarkChange = (studentId, val) => {
    setMarks(prev => ({ ...prev, [studentId]: val }));
  };

  const handleSaveMarks = async (student) => {
    if (!examName || !totalMarks) {
      alert("Please enter Exam Name and Total Marks first!");
      return;
    }
    
    const obtainedMarks = marks[student.id];
    if (obtainedMarks === undefined || obtainedMarks === '') {
      alert("Please enter obtained marks for this student.");
      return;
    }

    try {
      // 1. Get or create exam record
      let { data: examData, error: examErr } = await supabase
        .from('exams')
        .select('id')
        .eq('exam_name', examName)
        .eq('batch', selectedBatch)
        .single();

      let examId;
      if (!examData) {
        const { data: newExam, error: insertErr } = await supabase
          .from('exams')
          .insert({ exam_name: examName, total_marks: parseInt(totalMarks), batch: selectedBatch })
          .select('id')
          .single();
          
        if (insertErr) throw insertErr;
        examId = newExam.id;
      } else {
        examId = examData.id;
      }

      // 2. Upsert exam_marks (if using a conflict strategy, but let's just delete old one and insert for simplicity, or use upsert if unique constraint exists)
      // Delete existing just in case to act like upsert without ON CONFLICT setup
      await supabase.from('exam_marks').delete().eq('exam_id', examId).eq('student_id', student.id);

      const { error: marksErr } = await supabase
        .from('exam_marks')
        .insert({
          exam_id: examId,
          student_id: student.id,
          obtained_marks: parseInt(obtainedMarks)
        });

      if (marksErr) throw marksErr;
      alert(`Marks saved successfully for ${student.name}!`);

    } catch (err) {
      console.error(err);
      alert("Error saving marks: " + err.message);
    }
  };

  const sendWhatsApp = (student) => {
    const obtainedMarks = marks[student.id] || 0;
    const msg = `Hello, this is a message from GIST Institute.\nYour ward ${student.name} has scored ${obtainedMarks} out of ${totalMarks || 0} in ${examName || 'the exam'}.\nPlease contact us for further details.`;
    
    const encodedMsg = encodeURIComponent(msg);
    let phone = student.parent_phone || student.phone;
    if (!phone) {
      alert("No phone number available for this student.");
      return;
    }
    if (!phone.startsWith('91') && phone.length === 10) {
      phone = '91' + phone;
    }
    window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
  };

  return (
    <div className="exams-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Exams & Marks Entry</h1>
      </div>

      <div className="filters card" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
          <label>Select Batch</label>
          <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
            <option value="">-- Choose Batch --</option>
            {batches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        
        <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
          <label>Exam Name</label>
          <input 
            type="text" 
            placeholder="e.g. Unit Test 1" 
            value={examName} 
            onChange={(e) => setExamName(e.target.value)} 
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '150px' }}>
          <label>Total Marks</label>
          <input 
            type="number" 
            placeholder="e.g. 100" 
            value={totalMarks} 
            onChange={(e) => setTotalMarks(e.target.value)} 
          />
        </div>
      </div>

      {selectedBatch && (
        <div className="card table-container" style={{ marginTop: '1.5rem' }}>
          <h2>Students in {selectedBatch}</h2>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Parent Phone</th>
                <th>Obtained Marks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td><strong>{student.name}</strong></td>
                  <td>{student.parent_phone || student.phone || '-'}</td>
                  <td>
                    <input 
                      type="number" 
                      style={{ width: '80px', padding: '0.5rem' }} 
                      value={marks[student.id] || ''} 
                      onChange={(e) => handleMarkChange(student.id, e.target.value)} 
                      placeholder="0"
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-secondary icon-btn" title="Save Marks" onClick={() => handleSaveMarks(student)}>
                        <Save size={18} />
                      </button>
                      <button className="btn-success icon-btn" title="Send WhatsApp" onClick={() => sendWhatsApp(student)}>
                        <MessageCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No students found in this batch.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
