import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './Courses.css';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  
  // Modals state
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  
  // Forms state
  const [courseFormData, setCourseFormData] = useState({ id: null, course_name: '', duration_months: '', admission_fee: '', monthly_fee: '', total_fee: '' });
  const [batchFormData, setBatchFormData] = useState({ id: null, batch_name: '' });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: coursesData } = await supabase.from('courses').select('*').order('course_name');
    if (coursesData) setCourses(coursesData);
    
    const { data: batchesData } = await supabase.from('batches').select('*').order('batch_name');
    if (batchesData) setBatches(batchesData);
  }

  const openCourseModal = (course = null) => {
    if (course) {
      setCourseFormData(course);
    } else {
      setCourseFormData({ id: null, course_name: '', duration_months: '', admission_fee: '', monthly_fee: '', total_fee: '' });
    }
    setIsCourseModalOpen(true);
  };

  const openBatchModal = (batch = null) => {
    if (batch) {
      setBatchFormData(batch);
    } else {
      setBatchFormData({ id: null, batch_name: '' });
    }
    setIsBatchModalOpen(true);
  };

  const closeCourseModal = () => setIsCourseModalOpen(false);
  const closeBatchModal = () => setIsBatchModalOpen(false);

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      course_name: courseFormData.course_name,
      duration_months: parseInt(courseFormData.duration_months),
      admission_fee: parseFloat(courseFormData.admission_fee),
      monthly_fee: parseFloat(courseFormData.monthly_fee || 0),
      total_fee: parseFloat(courseFormData.total_fee || 0)
    };

    if (courseFormData.id) {
      await supabase.from('courses').update(payload).eq('id', courseFormData.id);
    } else {
      await supabase.from('courses').insert(payload);
    }
    
    closeCourseModal();
    fetchData();
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    const payload = { batch_name: batchFormData.batch_name };

    if (batchFormData.id) {
      await supabase.from('batches').update(payload).eq('id', batchFormData.id);
    } else {
      await supabase.from('batches').insert(payload);
    }
    
    closeBatchModal();
    fetchData();
  };

  const handleCourseDelete = async (id) => {
    if (confirm('Are you sure you want to delete this course?')) {
      await supabase.from('courses').delete().eq('id', id);
      fetchData();
    }
  };

  const handleBatchDelete = async (id) => {
    if (confirm('Are you sure you want to delete this batch?')) {
      await supabase.from('batches').delete().eq('id', id);
      fetchData();
    }
  };

  return (
    <div className="courses-page animate-fade-in">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Course & Batch Management</h1>
      </div>

      {/* COURSES SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Courses</h2>
        <button className="btn-primary" onClick={() => openCourseModal()}>
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
                    <button className="btn-secondary icon-btn" onClick={() => openCourseModal(course)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-danger icon-btn" onClick={() => handleCourseDelete(course.id)}>
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

      {/* BATCHES SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', marginBottom: '1rem' }}>
        <h2>Batches</h2>
        <button className="btn-primary" onClick={() => openBatchModal()}>
          <Plus size={18} /> Add Batch
        </button>
      </div>

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>Batch Name</th>
              <th style={{ width: '150px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map(batch => (
              <tr key={batch.id}>
                <td><strong>{batch.batch_name}</strong></td>
                <td>
                  <div className="action-btns">
                    <button className="btn-secondary icon-btn" onClick={() => openBatchModal(batch)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="btn-danger icon-btn" onClick={() => handleBatchDelete(batch.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {batches.length === 0 && (
              <tr>
                <td colSpan="2" style={{ textAlign: 'center' }}>No batches found. Add a new batch.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* COURSE MODAL */}
      {isCourseModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{courseFormData.id ? 'Edit Course' : 'Add Course'}</h2>
            <form onSubmit={handleCourseSubmit}>
              <div className="form-group">
                <label>Course Name</label>
                <input required type="text" value={courseFormData.course_name} onChange={e => setCourseFormData({...courseFormData, course_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Duration (Months)</label>
                <input required type="number" min="1" value={courseFormData.duration_months} onChange={e => setCourseFormData({...courseFormData, duration_months: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Admission Fee (₹)</label>
                <input required type="number" min="0" value={courseFormData.admission_fee} onChange={e => setCourseFormData({...courseFormData, admission_fee: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Monthly Fee (₹)</label>
                <input type="number" min="0" value={courseFormData.monthly_fee} onChange={e => setCourseFormData({...courseFormData, monthly_fee: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Total Fee (₹) [Optional]</label>
                <input type="number" min="0" value={courseFormData.total_fee || ''} onChange={e => setCourseFormData({...courseFormData, total_fee: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={closeCourseModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BATCH MODAL */}
      {isBatchModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{batchFormData.id ? 'Edit Batch' : 'Add Batch'}</h2>
            <form onSubmit={handleBatchSubmit}>
              <div className="form-group">
                <label>Batch Name</label>
                <input required type="text" placeholder="e.g. MWF 7:00 AM" value={batchFormData.batch_name} onChange={e => setBatchFormData({...batchFormData, batch_name: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={closeBatchModal}>Cancel</button>
                <button type="submit" className="btn-primary">Save Batch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
