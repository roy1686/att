import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Plus, Search, MessageCircle } from 'lucide-react';
import './Fees.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Fees() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  
  // Payment Form State
  const [selectedStudent, setSelectedStudent] = useState('');
  const [paymentType, setPaymentType] = useState('Monthly Fee');
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [amountPaid, setAmountPaid] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Step 1 Filters
  const [searchStudent, setSearchStudent] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterBatch, setFilterBatch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    const { data } = await supabase.from('students').select(`
      *,
      courses ( course_name, monthly_fee, admission_fee )
    `).order('name');
    if (data) setStudents(data);
  }

  const handleNextStep = () => setModalStep(prev => prev + 1);
  const handlePrevStep = () => setModalStep(prev => prev - 1);
  
  const closeModal = () => {
    setIsModalOpen(false);
    setModalStep(1);
    setSelectedStudent('');
    setPaymentType('Monthly Fee');
    setSelectedMonths([]);
    setAmountPaid('');
    setReceiptNumber('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setSearchStudent('');
    setFilterCourse('');
    setFilterBatch('');
  };

  const toggleMonth = (month) => {
    setSelectedMonths(prev => 
      prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
    );
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      student_id: selectedStudent,
      amount_paid: parseFloat(amountPaid),
      payment_type: paymentType,
      months_paid: paymentType === 'Monthly Fee' ? selectedMonths : [],
      receipt_number: receiptNumber || null,
      payment_date: paymentDate
    };

    const { error } = await supabase.from('fee_payments').insert(payload);
    
    if (error) {
      alert("Error adding payment: " + error.message);
      console.error(error);
    } else {
      closeModal();
      alert("Payment added successfully!");
      // Refresh the page or fetch data to update UI
      fetchStudents();
    }
  };

  // Mock overdue list for demonstration since complex SQL joins are needed
  const overdueStudents = students.slice(0, 3); // mock data

  const sendWhatsApp = (student) => {
    const msg = `Dear Parent, fees for ${student.name} is pending. Kindly pay as soon as possible.`;
    const encodedMsg = encodeURIComponent(msg);
    let phone = student.parent_phone || student.phone;
    if (phone && !phone.startsWith('91') && phone.length === 10) phone = '91' + phone;
    window.open(`https://wa.me/${phone}?text=${encodedMsg}`, '_blank');
  };

  const uniqueCourses = [...new Set(students.map(s => s.courses?.course_name).filter(Boolean))];
  const uniqueBatches = [...new Set(students.map(s => s.batch).filter(Boolean))];

  const filteredModalStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchStudent.toLowerCase());
    const matchesCourse = filterCourse ? s.courses?.course_name === filterCourse : true;
    const matchesBatch = filterBatch ? s.batch === filterBatch : true;
    return matchesSearch && matchesCourse && matchesBatch;
  });

  return (
    <div className="fees-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Fees Management</h1>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Payment
        </button>
      </div>

      <div className="card table-container" style={{ marginTop: '1.5rem' }}>
        <h2>Students Overview</h2>
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Course</th>
              <th>Admission Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} onClick={() => navigate(`/student/${student.id}`)} style={{cursor: 'pointer'}}>
                <td><strong>{student.name}</strong></td>
                <td>{student.courses?.course_name || 'N/A'}</td>
                <td>{student.admission_date || '-'}</td>
                <td><span className="badge badge-warning">Pending Check</span></td>
                <td>
                  <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); navigate(`/student/${student.id}`); }}>
                    View Dashboard
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card overdue-card" style={{ marginTop: '1.5rem' }}>
        <h2 className="text-danger">Overdue Students</h2>
        <div className="overdue-list">
          {overdueStudents.map(student => (
             <div key={student.id} className="overdue-item">
               <div>
                 <h4>{student.name}</h4>
                 <p>{student.courses?.course_name} - Multiple pending months</p>
               </div>
               <button className="btn-success whatsapp-btn" onClick={() => sendWhatsApp(student)}>
                 <MessageCircle size={18} />
               </button>
             </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Payment - Step {modalStep}</h2>
            <form onSubmit={handlePaymentSubmit}>
              {modalStep === 1 && (
                <div className="step-content">
                  <div className="filters card" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                      <label>Search Name</label>
                      <input type="text" placeholder="Type name..." value={searchStudent} onChange={e => setSearchStudent(e.target.value)} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                      <label>Filter Course</label>
                      <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)}>
                        <option value="">All Courses</option>
                        {uniqueCourses.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                      <label>Filter Batch</label>
                      <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)}>
                        <option value="">All Batches</option>
                        {uniqueBatches.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Select Student</label>
                    <select required value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} size={5} style={{ height: 'auto' }}>
                      {filteredModalStudents.length === 0 && <option disabled>No students match filters</option>}
                      {filteredModalStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.batch || 'No Batch'} - {s.courses?.course_name || 'No Course'})</option>)}
                    </select>
                  </div>
                </div>
              )}

              {modalStep === 2 && (
                <div className="step-content">
                  <div className="form-group">
                    <label>Payment Type</label>
                    <select value={paymentType} onChange={e => setPaymentType(e.target.value)}>
                      <option value="Monthly Fee">Monthly Fee</option>
                      <option value="Admission Fee">Admission Fee</option>
                    </select>
                  </div>
                </div>
              )}

              {modalStep === 3 && paymentType === 'Monthly Fee' && (
                <div className="step-content">
                  <label>Select Months</label>
                  <div className="months-grid">
                    {MONTHS.map(m => (
                      <div 
                        key={m} 
                        className={`month-chip ${selectedMonths.includes(m) ? 'selected' : ''}`}
                        onClick={() => toggleMonth(m)}
                      >
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {((modalStep === 3 && paymentType === 'Admission Fee') || modalStep === 4) && (
                <div className="step-content">
                  <div className="form-group">
                    <label>Amount Paid (₹)</label>
                    <input required type="number" min="1" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} placeholder="Enter amount..." />
                  </div>
                  <div className="form-group">
                    <label>Receipt Number</label>
                    <input type="text" value={receiptNumber} onChange={e => setReceiptNumber(e.target.value)} placeholder="e.g. REC-1001" />
                  </div>
                  <div className="form-group">
                    <label>Payment Date</label>
                    <input required type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} />
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  {modalStep > 1 && <button type="button" className="btn-secondary" onClick={handlePrevStep}>Back</button>}
                  {((modalStep === 3 && paymentType === 'Admission Fee') || modalStep === 4) ? (
                    <button type="submit" className="btn-primary">Submit Payment</button>
                  ) : (
                    <button type="button" className="btn-primary" onClick={handleNextStep} disabled={modalStep===1 && !selectedStudent}>Next</button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
