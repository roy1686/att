import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', batch: '', course_id: '', phone: '', parent_phone: '', admission_date: '' });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: cData } = await supabase.from('courses').select('id, course_name');
    if (cData) setCourses(cData);

    const { data: sData } = await supabase.from('students').select(`
      *,
      courses ( course_name )
    `).order('name');
    
    if (sData) setStudents(sData);
  }

  const openModal = (student = null) => {
    if (student) {
      setFormData({
        ...student,
        course_id: student.course_id || '',
        admission_date: student.admission_date || ''
      });
    } else {
      setFormData({ id: null, name: '', batch: '', course_id: '', phone: '', parent_phone: '', admission_date: new Date().toISOString().split('T')[0] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      batch: formData.batch,
      course_id: formData.course_id || null,
      phone: formData.phone,
      parent_phone: formData.parent_phone,
      admission_date: formData.admission_date || null
    };

    if (formData.id) {
      await supabase.from('students').update(payload).eq('id', formData.id);
    } else {
      await supabase.from('students').insert(payload);
    }
    
    closeModal();
    fetchData();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this student?')) {
      await supabase.from('students').delete().eq('id', id);
      fetchData();
    }
  };

  return (
    <div className="students-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Students Management</h1>
        <button className="btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add Student
        </button>
      </div>

      <div className="card table-container" style={{ marginTop: '1.5rem' }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Batch</th>
              <th>Course</th>
              <th>Phone</th>
              <th>Parent Phone</th>
              <th>Admission Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td><strong>{student.name}</strong></td>
                <td>{student.batch}</td>
                <td>{student.courses?.course_name || '-'}</td>
                <td>{student.phone || '-'}</td>
                <td>{student.parent_phone || '-'}</td>
                <td>{student.admission_date || '-'}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn-secondary icon-btn" onClick={() => openModal(student)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-danger icon-btn" onClick={() => handleDelete(student.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{formData.id ? 'Edit Student' : 'Add Student'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Batch Name</label>
                <input type="text" value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Course</label>
                <select value={formData.course_id} onChange={e => setFormData({...formData, course_id: e.target.value})}>
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Student Phone</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Parent Phone (WhatsApp)</label>
                <input type="text" value={formData.parent_phone} onChange={e => setFormData({...formData, parent_phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Admission Date</label>
                <input type="date" value={formData.admission_date} onChange={e => setFormData({...formData, admission_date: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
