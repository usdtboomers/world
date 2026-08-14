import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const UserLogin = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [savedUsers, setSavedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const inputRef = useRef(null);

  // AUTOMATIC HARD REFRESH LOGIC
  useEffect(() => {
    const hasRefreshed = sessionStorage.getItem('site_updated_refresh');
    if (!hasRefreshed) {
      sessionStorage.setItem('site_updated_refresh', 'true');
      window.location.reload(); 
    }
  }, []);

  // AUTO-LOGIN FROM ADMIN
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get('token');
    const urlUser = queryParams.get('user');
    
    if (urlToken && urlUser) {
      try {
        const userData = JSON.parse(decodeURIComponent(urlUser));
        localStorage.setItem('token', urlToken);
        localStorage.setItem('user', JSON.stringify(userData));
        login(userData, urlToken);
        window.history.replaceState({}, document.title, '/login');
        window.location.href = '/dashboard'; 
      } catch (err) {
        setError('Invalid login link from Admin.');
      }
    }
  }, [location.search, login]);

  // Saved Users Logic
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('savedUsers') || '[]');
    setSavedUsers(users);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (userId === '') {
      setFilteredUsers(savedUsers);
    } else {
      setFilteredUsers(
        savedUsers.filter(u => u.id.toLowerCase().includes(userId.toLowerCase()))
      );
    }
  }, [userId, savedUsers]);

  const handleUserSelect = (id) => {
    const user = savedUsers.find(u => u.id === id);
    if (user) {
      setUserId(user.id);
      setPassword(user.password);
      setRememberMe(true);
      setDropdownOpen(false);
      // Yahan se auto-login ka koi trigger nahi hoga. User ko explicitly button dabana padega.
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fpPromise = FingerprintJS.load();
      const fp = await fpPromise;
      const result = await fp.get();
      const visitorId = result.visitorId;
      
      const res = await api.post('/auth/login', { userId, password, deviceId: visitorId });
      const { token, user } = res.data;
      
      login(user, token);
      
      if (rememberMe) {
        const updatedUsers = savedUsers.filter(u => u.id !== userId);
        updatedUsers.unshift({ id: userId, password });
        localStorage.setItem('savedUsers', JSON.stringify(updatedUsers));
        setSavedUsers(updatedUsers);
      }
      
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard', { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  // --- INLINE STYLES FOR EXACT IMAGE MATCH ---
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'url("/background.jpg") no-repeat center center fixed', 
    backgroundSize: 'cover',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px'
  };

  const loginBoxStyle = {
    background: 'rgba(50, 50, 50, 0.75)', 
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '20px', 
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
    overflow: 'hidden', 
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.1)'
  };

  const topHeader = {
    width: '100%',
    height: '100px',
    background: 'linear-gradient(135deg, rgba(0, 180, 219, 0.8) 0%, rgba(0, 131, 176, 0.8) 100%)',
    clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0% 100%)',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0
  };

  const contentWrapper = {
    position: 'relative',
    zIndex: 1,
    padding: '40px 30px 30px 30px',
  };

  const inputGroupStyle = {
    position: 'relative',
    marginBottom: '25px',
  };

  const inputStyle = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(255, 255, 255, 0.5)', 
    padding: '10px 10px 5px 30px',
    color: 'white',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-bottom 0.3s ease'
  };

  const iconStyle = {
    position: 'absolute',
    left: '0',
    top: '10px',
    color: '#03a9f4',
    fontSize: '16px'
  };

  const btnStyle = {
    width: '100%',
    background: 'linear-gradient(to right, #03a9f4, #0083b0)', 
    color: 'white',
    border: 'none',
    padding: '14px',
    fontSize: '16px',
    cursor: loading ? 'wait' : 'pointer',
    marginTop: '10px',
    opacity: loading ? 0.8 : 1,
    fontWeight: 'bold',
    borderRadius: '8px',
    letterSpacing: '1px',
    boxShadow: '0 5px 15px rgba(3, 169, 244, 0.4)'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'rgba(30, 30, 30, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxHeight: '150px',
    overflowY: 'auto',
    zIndex: 50,
    borderRadius: '8px',
    marginTop: '5px'
  };

  return (
    <div style={containerStyle}>
      <div style={loginBoxStyle}>
        
        {/* Top Gradient Shape (Matches Register) */}
        <div style={topHeader}></div>

        <div style={contentWrapper}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img src="/logo.jpg" alt="worldfinance" style={{ height: '55px', borderRadius: '8px', marginBottom: '10px' }} />
            <h3 style={{ color: '#fff', fontWeight: '600', fontSize: '20px', margin: 0 }}>Sign Into Your Account</h3>
          </div>

          {/* {error && (
            <div style={{ background: 'rgba(255, 60, 60, 0.2)', color: '#ffb3b3', padding: '12px', marginBottom: '20px', fontSize: '13px', borderRadius: '6px', border: '1px solid rgba(255,0,0,0.3)', textAlign: 'center' }}>
              ⚠️ {error}
            </div>
          )} */}

          <form onSubmit={handleLogin}>
            
            {/* User ID Field */}
            <div style={inputGroupStyle} ref={inputRef}>
              <i className="fa fa-envelope-o" style={iconStyle}></i>
             <input
  type="text"
  placeholder="USER ID"
  value={userId}
  // 🔥 YAHAN CHANGE KIYA HAI: e.target.value.toUpperCase()
  onChange={(e) => setUserId(e.target.value.toUpperCase())}
  onFocus={() => setDropdownOpen(true)}
  required
  // 🔥 YAHAN CHANGE KIYA HAI: style mein textTransform add kar diya
  style={{ ...inputStyle, textTransform: 'uppercase' }}
/>
              {/* Dropdown for saved users */}
              {dropdownOpen && filteredUsers.length > 0 && (
                <div style={dropdownStyle}>
                  {filteredUsers.map((u, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleUserSelect(u.id)}
                      style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', display: 'flex', alignItems: 'center' }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(3, 169, 244, 0.3)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <i className="fa fa-user" style={{marginRight: '10px', color: '#03a9f4'}}></i> {u.id}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div style={inputGroupStyle}>
              <i className="fa fa-lock" style={iconStyle}></i>
              <input
                type="password"
                placeholder="USER PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  style={{ cursor: 'pointer', width: '16px', height: '16px', marginRight: '8px' }} 
                />
                <label htmlFor="remember" style={{ color: '#e0e0e0', fontSize: '14px', cursor: 'pointer' }}>Remember me</label>
              </div>
              <Link to="/forgot-password" style={{ color: '#03a9f4', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'LOGGING IN...' : 'LOGIN NOW'}
            </button>
          </form>

          {/* Footer Link */}
          <p style={{ textAlign: 'center', marginTop: '25px', color: '#ccc', fontSize: '14px' }}>
              Don't have an account? <Link to="/register" style={{ color: '#03a9f4', textDecoration: 'none', fontWeight: 'bold' }}>Register here</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default UserLogin;