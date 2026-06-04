import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'papa@123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }} className="animate-fade-in">
      <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            background: 'var(--gradient-primary)', 
            width: '60px', height: '60px', 
            borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-neon)'
          }}>
            <Lock size={30} color="white" />
          </div>
        </div>
        
        <h2 style={{ marginBottom: '0.5rem' }}>Admin Login</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Sign in to GIST Computer Education</p>
        
        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Username</label>
            <input 
              required 
              type="text" 
              placeholder="Enter username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
            />
          </div>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Password</label>
            <input 
              required 
              type="password" 
              placeholder="Enter password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'left' }}>{error}</p>}
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
