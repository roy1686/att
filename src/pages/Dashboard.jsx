import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, BookOpen, UserCheck, AlertCircle } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    totalCourses: 0,
    overdueFeesCount: 0
  });

  useEffect(() => {
    async function fetchStats() {
      // Fetch students count
      const { count: studentCount } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true });

      // Fetch courses count
      const { count: courseCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      // Fetch today's attendance
      const today = new Date().toISOString().split('T')[0];
      const { count: presentCount } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('date', today)
        .eq('status', 'Present');

      // For overdue fees, we need to check students who haven't paid.
      // This is complex, so let's just count students for now or use a mock logic.
      // In a real system we'd calculate this based on the payment schedules.
      
      setStats({
        totalStudents: studentCount || 0,
        presentToday: presentCount || 0,
        totalCourses: courseCount || 0,
        overdueFeesCount: 0 // placeholder
      });
    }

    fetchStats();
  }, []);

  return (
    <div className="dashboard animate-fade-in">
      <h1 className="page-title">Dashboard</h1>
      
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon bg-blue"><Users size={24} /></div>
          <div className="stat-content">
            <h3>Total Students</h3>
            <p className="stat-value">{stats.totalStudents}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon bg-green"><UserCheck size={24} /></div>
          <div className="stat-content">
            <h3>Present Today</h3>
            <p className="stat-value">{stats.presentToday}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon bg-purple"><BookOpen size={24} /></div>
          <div className="stat-content">
            <h3>Total Courses</h3>
            <p className="stat-value">{stats.totalCourses}</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon bg-red"><AlertCircle size={24} /></div>
          <div className="stat-content">
            <h3>Overdue Fees</h3>
            <p className="stat-value">{stats.overdueFeesCount}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h2>Recent Activity</h2>
          <p className="text-secondary">Dashboard content will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}
