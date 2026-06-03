import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Intro.css';

export default function Intro() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="intro-container">
      <div className="intro-content">
        <h1 className="intro-title">GIST Computer Education</h1>
        <p className="intro-subtitle">Attendance Management System</p>
        <p className="intro-author">By: Pravat Kumar Hota</p>
        <div className="loader"></div>
      </div>
    </div>
  );
}
