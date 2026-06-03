import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './Courses.css';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, course_name: '', duration_months: '', admission_fee: '', monthly_fee: '', total_fee: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    const { data } = await supabase.from('courses').select('*').order('course_name');
    if (data) setCourses(data);
  }

  const openModal = (course = null) => {
    if (course) {
      setFormData(course);
    } else {
      setFormData({ id: null, course_name: '', duration_months: '', admission_fee: '', monthly_fee: '', total_fee: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      course_name: formData.course_name,
      duration_months: parseInt(formData.duration_months),
      admission_fee: parseFloat(formData.admission_fee),
      monthly_fee: parseFloat(formData.monthly_fee || 0),
      total_fee: parseFloat(formData.total_fee || 0)
    };

    if (formData.id) {
      await supabase.from('courses').update(payload).eq('id', formData.id);
    } else {
      await supabase.from('courses').insert(payload);
    }
    
    closeModal();
    fetchCourses();
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this course?')) {
      await supabase.from('courses').delete().eq('id', id);
      fetchCourses();
    }
  };

  return (
    <div className="courses-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Course Management</h1>
        <button className="btn-primary" onClick={() => openModal()}>
          <Plus size={18} /> Add Course
        </button>
      </div>

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Duration (Months)</th>
              <th>Admission Fee</th>
              <th>Monthly Fee</th>
              <th>Total Fee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course.id}>
                <td><strong>{course.course_name}</strong></td>
                <td>{course.duration_months}</td>
                <td>₹{course.admission_fee}</td>
                <td>₹{course.monthly_fee}</td>
                <td>{course.total_fee ? `₹${course.total_fee}` : '-'}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn-secondary icon-btn" onClick={() => openModal(course)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-danger icon-btn" onClick={() => handleDelete(course.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>No courses found. Add a new course.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{formData.id ? 'Edit Course' : 'Add Course'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Course Name</label>
                <input required type="text" value={formData.course_name} onChange={e => setFormData({...formData, course_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Duration (Months)</label>
                <input required type="number" min="1" value={formData.duration_months} onChange={e => setFormData({...formData, duration_months: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Admission Fee (₹)</label>
                <input required type="number" min="0" value={formData.admission_fee} onChange={e => setFormData({...formData, admission_fee: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Monthly Fee (₹)</label>
                <input type="number" min="0" value={formData.monthly_fee} onChange={e => setFormData({...formData, monthly_fee: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Total Fee (₹) [Optional]</label>
                <input type="number" min="0" value={formData.total_fee || ''} onChange={e => setFormData({...formData, total_fee: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
