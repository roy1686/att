import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, User, BookOpen, Calendar, CreditCard } from 'lucide-react';
import './StudentDashboard.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function StudentDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data: sData } = await supabase
        .from('students')
        .select('*, courses(*)')
        .eq('id', id)
        .single();
      
      if (sData) setStudent(sData);

      const { data: pData } = await supabase
        .from('fee_payments')
        .select('*')
        .eq('student_id', id);
        
      if (pData) setPayments(pData);
    }
    fetchData();
  }, [id]);

  if (!student) return <div className="p-8">Loading...</div>;

  const totalFee = student.courses?.total_fee || (student.courses?.monthly_fee * student.courses?.duration_months) || 0;
  const totalPaid = payments.reduce((acc, curr) => acc + Number(curr.amount_paid), 0);
  const remaining = totalFee - totalPaid;
  const progressPercent = totalFee > 0 ? Math.min(100, Math.round((totalPaid / totalFee) * 100)) : 0;

  // Calculate month-wise status
  const monthStatus = {};
  MONTHS.forEach(m => monthStatus[m] = 'Unpaid');
  
  payments.forEach(p => {
    if (p.payment_type === 'Monthly Fee' && p.months_paid) {
      p.months_paid.forEach(m => {
        // Simplified logic: assume full payment for selected months for now
        monthStatus[m] = 'Paid';
      });
    }
  });

  return (
    <div className="student-dashboard animate-fade-in">
      <button className="btn-secondary back-btn" onClick={() => navigate('/fees')}>
        <ArrowLeft size={16} /> Back to Fees
      </button>

      <div className="profile-header card">
        <div className="avatar">
          <User size={48} />
        </div>
        <div className="info">
          <h1>{student.name}</h1>
          <p className="text-secondary">{student.batch}</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card info-card">
          <h2>Course Details</h2>
          <div className="detail-row">
            <BookOpen size={18} className="text-secondary" />
            <span>{student.courses?.course_name || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <Calendar size={18} className="text-secondary" />
            <span>Admitted: {student.admission_date || '-'}</span>
          </div>
          <div className="detail-row">
            <CreditCard size={18} className="text-secondary" />
            <span>Duration: {student.courses?.duration_months || 0} Months</span>
          </div>
        </div>

        <div className="card payment-summary">
          <h2>Payment Summary</h2>
          <div className="summary-stats">
            <div>
              <p className="text-secondary">Total Fees</p>
              <h3>₹{totalFee}</h3>
            </div>
            <div>
              <p className="text-secondary">Total Paid</p>
              <h3 className="text-success">₹{totalPaid}</h3>
            </div>
            <div>
              <p className="text-secondary">Remaining</p>
              <h3 className="text-danger">₹{remaining}</h3>
            </div>
          </div>
          
          <div className="progress-container mt-4">
            <div className="progress-label">
              <span>Overall Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <h2>Month-wise Status</h2>
        <div className="timeline-grid">
          {MONTHS.map(m => (
            <div key={m} className={`timeline-item ${monthStatus[m].toLowerCase()}`}>
              <div className="month-name">{m}</div>
              <div className="status-indicator"></div>
              <div className="status-text">{monthStatus[m]}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card mt-4">
        <h2>Payment History</h2>
        <table className="mt-4">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Months</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td>{p.payment_date}</td>
                <td>{p.payment_type}</td>
                <td>{p.months_paid?.join(', ') || '-'}</td>
                <td><span className="text-success">+₹{p.amount_paid}</span></td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan="4" style={{textAlign:'center'}}>No payments recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
