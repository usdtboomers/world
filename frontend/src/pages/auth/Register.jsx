import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // UPI hata diya gaya hai
    const [formData, setFormData] = useState({
        sponsorId: '', 
        name: '',
        email: '',
        mobile: '',
        password: '',
        agreeTerms: false
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    // URL se Referral (ref) ID fetch karne ke liye
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ref = params.get('ref');
        if (ref) {
            setFormData(prev => ({ ...prev, sponsorId: ref }));
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.agreeTerms) {
            setError("Please agree to the terms of service.");
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            
            // Success Modal Data Set karna
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            
            setModalData({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                userId: res.data.userId,
                trxPassword: res.data.transactionPassword || 'Check Email', // Backend se aayega
                date: formattedDate
            });

            setLoading(false);
            setShowModal(true); // Modal open karo
            
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Check backend connection.");
            setLoading(false);
        }
    };

    // --- MAIN UI STYLES ---
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

    const registerBoxStyle = {
        background: 'rgba(50, 50, 50, 0.75)', 
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '20px', 
        width: '100%',
        maxWidth: '450px', 
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
        padding: '30px 25px 25px 25px',
    };

    const inputGroupStyle = {
        position: 'relative',
        marginBottom: '20px',
    };

    const inputStyle = {
        width: '100%',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.5)', 
        padding: '8px 10px 5px 30px',
        color: 'white',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-bottom 0.3s ease'
    };

    const iconStyle = {
        position: 'absolute',
        left: '0',
        top: '8px',
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

    // --- MODAL STYLES (MATCHING YOUR IMAGE) ---
    const modalOverlay = {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        padding: '20px'
    };

    const modalContent = {
        backgroundColor: '#0a0a0a', // Pure dark background
        borderRadius: '20px',
        padding: '30px 20px',
        width: '100%',
        maxWidth: '380px',
        position: 'relative',
        fontFamily: "'Segoe UI', Tahoma, sans-serif"
    };

    const successCircle = {
        width: '60px',
        height: '60px',
        backgroundColor: '#4ade80', // Green color
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 15px',
        color: 'black',
        fontSize: '30px',
        fontWeight: 'bold'
    };

    const detailsBox = {
        backgroundColor: '#171717', // Slightly lighter dark box
        borderRadius: '12px',
        padding: '15px',
        marginBottom: '20px'
    };

    const dataRow = {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px dashed #333',
        fontSize: '14px'
    };

    const labelStyle = { color: '#a3a3a3' }; // Grey text
    const valueStyle = { color: '#ffffff', fontWeight: 'bold' }; // White text

    const loginBtn = {
        width: '100%',
        backgroundColor: '#3b82f6', // Blue button matching image
        color: 'white',
        border: 'none',
        padding: '12px',
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px'
    };

    return (
        <div style={containerStyle}>
            <div style={registerBoxStyle}>
                
                <div style={topHeader}></div>

                <div style={contentWrapper}>
                    <div style={{ textAlign: 'center', marginBottom: '25px', marginTop: '10px' }}>
                        <img src="/logo.jpg" alt="World Finance" style={{ height: '55px', borderRadius: '8px', marginBottom: '10px' }} />
                        <h3 style={{ color: '#fff', fontWeight: '600', fontSize: '20px', margin: 0 }}>Create An Account</h3>
                    </div>

                    {error && (
                        <div style={{ background: 'rgba(255, 60, 60, 0.2)', color: '#ffb3b3', padding: '12px', marginBottom: '20px', fontSize: '13px', borderRadius: '6px', border: '1px solid rgba(255,0,0,0.3)', textAlign: 'center' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        
                        <div style={inputGroupStyle}>
                            <i className="fa fa-user-circle" style={iconStyle}></i>
                            <input type="text" name="sponsorId" value={formData.sponsorId} onChange={handleChange} placeholder="Sponsor ID *" required style={inputStyle} />
                        </div>

                        <div style={inputGroupStyle}>
                            <i className="fa fa-user" style={iconStyle}></i>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name *" required style={inputStyle} />
                        </div>

                        <div style={inputGroupStyle}>
                            <i className="fa fa-envelope" style={iconStyle}></i>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Id *" required style={inputStyle} />
                        </div>

                        <div style={inputGroupStyle}>
                            <i className="fa fa-phone" style={iconStyle}></i>
                            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile No. *" required style={inputStyle} />
                        </div>

                        <div style={inputGroupStyle}>
                            <i className="fa fa-lock" style={iconStyle}></i>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Set Login Password *" required style={inputStyle} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', marginTop: '15px' }}>
                            <input 
                                type="checkbox" 
                                name="agreeTerms" 
                                id="terms" 
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                style={{ cursor: 'pointer', width: '16px', height: '16px', marginRight: '10px' }} 
                            />
                            <label htmlFor="terms" style={{ color: '#e0e0e0', fontSize: '14px', cursor: 'pointer' }}>I agree to the terms of service</label>
                        </div>

                        <button type="submit" disabled={loading} style={btnStyle}>
                            {loading ? 'PROCESSING...' : 'REGISTER NOW'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '25px', color: '#ccc', fontSize: '14px' }}>
                        Already have an account? <Link to="/login" style={{ color: '#03a9f4', textDecoration: 'none', fontWeight: 'bold' }}>Login here</Link>
                    </p>

                </div>
            </div>

            {/* SUCCESS MODAL POPUP */}
            {showModal && modalData && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <button 
                            onClick={() => navigate('/login')} 
                            style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: '#666', fontSize: '20px', cursor: 'pointer' }}>
                            ✕
                        </button>
                        
                        <div style={successCircle}>✓</div>
                        
                        <h2 style={{ color: '#0ea5e9', textAlign: 'center', fontSize: '22px', margin: '0 0 5px 0' }}>Registration Successful!</h2>
                        <p style={{ color: '#e5e5e5', textAlign: 'center', fontSize: '14px', margin: '0 0 20px 0' }}>Welcome to World Finance</p>

                        <div style={detailsBox}>
                            <div style={dataRow}>
                                <span style={labelStyle}>Full Name:</span> 
                                <span style={valueStyle}>{modalData.name}</span>
                            </div>
                            <div style={dataRow}>
                                <span style={labelStyle}>User ID:</span> 
                                <span style={valueStyle}>{modalData.userId}</span>
                            </div>
                            <div style={dataRow}>
                                <span style={labelStyle}>Password:</span> 
                                <span style={valueStyle}>{modalData.password}</span>
                            </div>
                            <div style={dataRow}>
                                <span style={labelStyle}>Trx Password:</span> 
                                <span style={valueStyle}>{modalData.trxPassword}</span>
                            </div>
                            <div style={dataRow}>
                                <span style={labelStyle}>Date:</span> 
                                <span style={valueStyle}>{modalData.date}</span>
                            </div>
                            <div style={{...dataRow, borderBottom: 'none'}}>
                                <span style={labelStyle}>Email:</span> 
                                <span style={valueStyle}>{modalData.email}</span>
                            </div>
                        </div>

                        <button onClick={() => navigate('/login')} style={loginBtn}>
                            ➜ Login to Your Account
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;