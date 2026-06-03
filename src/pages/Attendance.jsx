import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format, subDays } from 'date-fns';
import * as XLSX from 'xlsx';
import { Check, X, MessageCircle } from 'lucide-react';
import './Attendance.css';

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [absentToday, setAbsentToday] = useState([]);
  
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchBatchesAndCourses();
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [selectedBatch, selectedCourse]);

  async function fetchBatchesAndCourses() {
    const { data: bData } = await supabase.from('students').select('batch');
    if (bData) {
      const uniqueBatches = [...new Set(bData.map(d => d.batch).filter(Boolean))];
      setBatches(uniqueBatches);
    }
    
    const { data: cData } = await supabase.from('courses').select('id, course_name');
    if (cData) setCourses(cData);
  }

  async function fetchStudents() {
    let query = supabase.from('students').select(`*, courses!inner(course_name)`).order('name');
    
    if (selectedBatch) query = query.eq('batch', selectedBatch);
    if (selectedCourse) query = query.eq('course', selectedCourse);

    const { data } = await query;
    if (data) {
      setStudents(data);
      fetchAttendanceForStudents(data);
    }
  }

  async function fetchAttendanceForStudents(studentList) {
    const studentIds = studentList.map(s => s.id);
    
    if (studentIds.length === 0) return;

    const { data } = await supabase
      .from('attendance')
      .select('*')
      .eq('date', today)
      .in('student_id', studentIds);

    const recordMap = {};
    const absentList = [];
    if (data) {
      data.forEach(record => {
        recordMap[record.student_id] = record.status;
        if (record.status === 'Absent') {
          const student = studentList.find(s => s.id === record.student_id);
          if (student) absentList.push(student);
        }
      });
    }
    setAttendanceRecords(recordMap);
    setAbsentToday(absentList);
  }

  async function exportToExcel() {
    const oneWeekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    
    const studentIds = students.map(s => s.id);
    if (studentIds.length === 0) return alert("No students to export");

    const { data } = await supabase
      .from('attendance')
      .select('*')
      .gte('date', oneWeekAgo)
      .in('student_id', studentIds);

    const exportData = students.map(student => {
      const row = { "Student Name": student.name, "Batch": student.batch };
      
      for (let i = 6; i >= 0; i--) {
        const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
        row[d] = '-';
      }

      if (data) {
        const studentRecords = data.filter(r => r.student_id === student.id);
        studentRecords.forEach(record => {
          row[record.date] = record.status;
        });
      }
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "7-Day Attendance");
    XLSX.writeFile(workbook, `Attendance_Export_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  }

  async function markAttendance(studentId, status) {
    const { data: existing } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .eq('date', today)
      .single();

    if (existing) {
      await supabase
        .from('attendance')
        .update({ status })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('attendance')
        .insert({ student_id: studentId, date: today, status });
    }

    setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
    
    if (status === 'Absent') {
      const student = students.find(s => s.id === studentId);
      if (student && !absentToday.find(a => a.id === studentId)) {
        setAbsentToday(prev => [...prev, student]);
      }
    } else {
      setAbsentToday(prev => prev.filter(a => a.id !== studentId));
    }
  }

  const sendWhatsApp = (student) => {
    const msg = `Dear Parent, your child ${student.name} was absent on ${today}. Please ensure regular attendance.`;
    const encodedMsg = encodeURIComponent(msg);
    let phone = student.parent_phone || student.phone;
    if (phone && !phone.startsWith('91') && phone.length === 10) {
      phone = '91' + phone;
    }
    window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
  };

  return (
    <div className="attendance-page animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Attendance Management</h1>
        <button className="btn-success" onClick={exportToExcel}>
          Export 7-Day Excel
        </button>
      </div>
      
      <div className="filters card">
        <div className="form-group" style={{ marginBottom: 0, flex: 1, maxWidth: '250px' }}>
          <label>Filter by Batch</label>
          <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
            <option value="">All Batches</option>
            {batches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0, flex: 1, maxWidth: '250px' }}>
          <label>Filter by Course</label>
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
            <option value="">All Courses</option>
            {courses.map(c => <option key={c.id} value={c.course_name}>{c.course_name}</option>)}
          </select>
        </div>
      </div>

      <div className="layout-grid" style={{ animationDelay: '0.1s' }}>
        <div className="main-col">
          <div className="card table-container">
            <h2>Students List ({today})</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Batch</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.batch} <br/><small className="text-secondary">{student.courses?.course_name}</small></td>
                    <td>
                      {attendanceRecords[student.id] === 'Present' && <span className="badge badge-success">Present</span>}
                      {attendanceRecords[student.id] === 'Absent' && <span className="badge badge-danger">Absent</span>}
                      {!attendanceRecords[student.id] && <span className="badge badge-warning">Not Marked</span>}
                    </td>
                    <td>
                      <div className="action-btns">
                        <button 
                          className="btn-success icon-btn" 
                          onClick={() => markAttendance(student.id, 'Present')}
                          title="Mark Present"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          className="btn-danger icon-btn" 
                          onClick={() => markAttendance(student.id, 'Absent')}
                          title="Mark Absent"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="side-col">
          <div className="card absent-card">
            <h2 className="text-danger">Absent Students Today</h2>
            {absentToday.length === 0 ? (
              <p className="text-secondary">No absent students today.</p>
            ) : (
              <ul className="absent-list">
                {absentToday.map(student => (
                  <li key={student.id} className="absent-item">
                    <div>
                      <h4>{student.name}</h4>
                      <p>{student.parent_phone || student.phone}</p>
                    </div>
                    <button 
                      className="btn-success whatsapp-btn" 
                      onClick={() => sendWhatsApp(student)}
                    >
                      <MessageCircle size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
