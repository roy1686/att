import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Fees from './pages/Fees';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="students" element={<Students />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="fees" element={<Fees />} />
          <Route path="student/:id" element={<StudentDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
