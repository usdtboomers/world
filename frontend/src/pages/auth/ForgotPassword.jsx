import React, { useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/forgot-password', { userId });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- SAME LOGIN PAGE STYLES ---
  const containerStyle = {
    minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
    background: 'url("/background.jpg") no-repeat center center fixed', backgroundSize: 'cover',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px'
  };

  const boxStyle = {
    background: 'rgba(50, 50, 50, 0.75)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
    overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)'
  };

  const topHeader = {
    width: '100%', height: '100px', position: 'absolute', top: 0, left: 0, zIndex: 0,
    background: 'linear-gradient(135deg, rgba(0, 180, 219, 0.8) 0%, rgba(0, 131, 176, 0.8) 100%)',
    clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0% 100%)'
  };

  const inputStyle = {
    width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
    padding: '10px 10px 5px 30px', color: 'white', fontSize: '15px', outline: 'none', boxSizing: 'border-box'
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <div style={topHeader}></div>
        <div style={{ position: 'relative', zIndex: 1, padding: '40px 30px 30px 30px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img src="/logo.jpg" alt="Logo" style={{ height: '55px', borderRadius: '8px', marginBottom: '10px' }} />
            <h3 style={{ color: '#fff', fontWeight: '600', fontSize: '20px', margin: 0 }}>Forgot Password</h3>
            <p style={{ color: '#ccc', fontSize: '13px', marginTop: '5px' }}>Enter your User ID to get a reset link</p>
          </div>

          {error && <div style={{ background: 'rgba(255, 60, 60, 0.2)', color: '#ffb3b3', padding: '12px', marginBottom: '20px', fontSize: '13px', borderRadius: '6px', border: '1px solid rgba(255,0,0,0.3)', textAlign: 'center' }}>⚠️ {error}</div>}
          {message && <div style={{ background: 'rgba(40, 167, 69, 0.2)', color: '#b3ffcc', padding: '12px', marginBottom: '20px', fontSize: '13px', borderRadius: '6px', border: '1px solid rgba(0,255,0,0.3)', textAlign: 'center' }}>✅ {message}</div>}

          <form onSubmit={handleForgot}>
            <div style={{ position: 'relative', marginBottom: '25px' }}>
              <i className="fa fa-user" style={{ position: 'absolute', left: '0', top: '10px', color: '#03a9f4', fontSize: '16px' }}></i>
              <input type="text" placeholder="ENTER USER ID" value={userId} onChange={(e) => setUserId(e.target.value)} required style={inputStyle} />
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', background: 'linear-gradient(to right, #03a9f4, #0083b0)', color: 'white', border: 'none',
              padding: '14px', fontSize: '16px', cursor: loading ? 'wait' : 'pointer', fontWeight: 'bold', borderRadius: '8px', letterSpacing: '1px', boxShadow: '0 5px 15px rgba(3, 169, 244, 0.4)'
            }}>
              {loading ? 'SENDING...' : 'SEND RESET LINK'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '25px', color: '#ccc', fontSize: '14px' }}>
            Remembered your password? <Link to="/login" style={{ color: '#03a9f4', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;