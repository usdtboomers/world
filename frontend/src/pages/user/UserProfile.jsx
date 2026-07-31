import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../../api/axios";
import { ArrowLeft, Save, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import MessageModal from '../../components/modals/MessageModal';

function UserProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    walletAddress: user?.walletAddress || '',
    upiId: user?.upiId || '', // Added based on image structure
  });

  const [isUpdatingWallet, setIsUpdatingWallet] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        walletAddress: user.walletAddress || '',
        upiId: user.upiId || '',
      });
    }
  }, [user]);

  const [loginPassword, setLoginPassword] = useState('');
  const [newLoginPassword, setNewLoginPassword] = useState('');
  const [currentTxnPassword, setCurrentTxnPassword] = useState('');
  const [newTxnPassword, setNewTxnPassword] = useState('');

  const [messageModal, setMessageModal] = useState({
    open: false, title: '', message: '', type: 'info',
  });

  const showMessage = (title, message, type = 'info') =>
    setMessageModal({ open: true, title, message, type });

  const handleUpdateWallet = async () => {
    if (!formData.walletAddress) {
      return showMessage('Missing Info', 'Please enter a valid wallet address.', 'warning');
    }
    try {
      setIsUpdatingWallet(true);
      await api.put(`/user/update-wallet/${user.userId}`, { walletAddress: formData.walletAddress });
      showMessage('Success ✅', 'Your Account Details have been updated successfully.', 'success');
    } catch (err) {
      showMessage('Error', err.response?.data?.message || 'Failed to update details.', 'error');
    } finally {
      setIsUpdatingWallet(false);
    }
  };

  const handleChangePassword = async type => {
    let payload;
    if (type === 'login') {
      if (!loginPassword || !newLoginPassword) return showMessage('Missing Fields', 'Please enter current and new login password.', 'warning');
      payload = { oldPassword: loginPassword, newPassword: newLoginPassword };
    } else {
      if (!currentTxnPassword || !newTxnPassword) return showMessage('Missing Fields', 'Please enter current and new transaction password.', 'warning');
      payload = { oldTxnPassword: currentTxnPassword, newTxnPassword };
    }

    try {
      await api.put(`/user/change-password/${user.userId}`, payload);
      showMessage('Password Updated 🔐', 'Your password has been changed successfully.', 'success');

      if(type === 'login') {
          setLoginPassword('');
          setNewLoginPassword('');
      } else {
          setCurrentTxnPassword('');
          setNewTxnPassword('');
      }
    } catch (err) {
      showMessage('Error', err.response?.data?.message || 'Password update failed.', 'error');
    }
  };

  if (!user) {
    return (
        <div className="min-h-screen bg-[#0b1221] text-[#eab308] flex justify-center items-center font-bold text-xl">
            Please login first.
        </div>
    );
  }

  // Format the joining date to match the image style (e.g., "28-Jul-2026")
  const joinDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
    : 'N/A';

  return (
   <div className="min-h-screen bg-[#0b1221] text-gray-300 font-sans pb-20 pt-6 md:pt-10">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
          
          {/* Header & Back Button */}
          <div className="flex items-center gap-4 mb-10">
              
              <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-wide">
                 User Detail
              </h1>
          </div>

          {/* ================= SECTION 1: Edit User Details ================= */}
          <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#eab308] border-b border-gray-700 pb-3 mb-2">
                  Edit User Details
              </h2>
              
              <div className="flex flex-col">
                  {/* Row: Sponsor ID */}
                  <div className="flex flex-col md:flex-row py-4 border-b border-gray-800">
                      <div className="w-full md:w-1/3 font-bold text-white text-base md:text-lg mb-1 md:mb-0">Sponsor ID</div>
                      <div className="w-full md:w-2/3 text-gray-400 text-base">{user.sponsorId || 'N/A'}</div>
                  </div>

                  {/* Row: My Name */}
                  <div className="flex flex-col md:flex-row py-4 border-b border-gray-800">
                      <div className="w-full md:w-1/3 font-bold text-white text-base md:text-lg mb-1 md:mb-0">My Name</div>
                      <div className="w-full md:w-2/3 text-gray-400 text-base">{user.name || 'N/A'}</div>
                  </div>

                  {/* Row: My User ID */}
                  <div className="flex flex-col md:flex-row py-4 border-b border-gray-800">
                      <div className="w-full md:w-1/3 font-bold text-white text-base md:text-lg mb-1 md:mb-0">My User ID</div>
                      <div className="w-full md:w-2/3 text-gray-400 text-base">{user.userId || 'N/A'}</div>
                  </div>

                  {/* Row: Joining */}
                  <div className="flex flex-col md:flex-row py-4 border-b border-gray-800">
                      <div className="w-full md:w-1/3 font-bold text-white text-base md:text-lg mb-1 md:mb-0">Joining</div>
                      <div className="w-full md:w-2/3 text-gray-400 text-base">{joinDate}</div>
                  </div>

                  {/* Row: Email */}
                  <div className="flex flex-col md:flex-row py-4 border-b border-gray-800">
                      <div className="w-full md:w-1/3 font-bold text-white text-base md:text-lg mb-1 md:mb-0">Email</div>
                      <div className="w-full md:w-2/3 text-gray-400 text-base">{user.email || 'N/A'}</div>
                  </div>

                  {/* Row: Country */}
                  <div className="flex flex-col md:flex-row py-4 border-b border-gray-800">
                      <div className="w-full md:w-1/3 font-bold text-white text-base md:text-lg mb-1 md:mb-0">Country</div>
                      <div className="w-full md:w-2/3 text-gray-400 text-base">{user.country || 'India'}</div>
                  </div>
              </div>
          </div>

          {/* ================= SECTION 2: Edit Account Details ================= */}
          <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#eab308] border-b border-gray-700 pb-3 mb-2 flex items-center justify-between">
                  <span>Edit Account Details</span>
                  <button 
                      onClick={handleUpdateWallet}
                      disabled={isUpdatingWallet}
                      className="text-sm bg-[#eab308] text-[#0b1221] px-4 py-1.5 rounded font-black uppercase flex items-center gap-2 hover:bg-yellow-400 disabled:opacity-50"
                  >
                      {isUpdatingWallet ? "Saving..." : <><Save size={16} /> Save</>}
                  </button>
              </h2>

              <div className="flex flex-col">
                  {/* Row: Wallet */}
                  <div className="flex flex-col md:flex-row py-4 border-b border-gray-800 items-start md:items-center">
                      <div className="w-full md:w-1/3 font-bold text-white text-base md:text-lg mb-2 md:mb-0">Wallet (BEP20)</div>
                      <div className="w-full md:w-2/3">
                          <input 
                              type="text"
                              value={formData.walletAddress}
                              onChange={(e) => setFormData({...formData, walletAddress: e.target.value})}
                              placeholder="Enter USDT BEP20 Wallet Address"
                              className="w-full bg-[#131c31] border border-gray-700 text-[#eab308] px-4 py-2 rounded focus:outline-none focus:border-[#eab308] transition-all font-mono text-sm"
                          />
                      </div>
                  </div>

               
              </div>
          </div>

          {/* ================= SECTION 3: Security Settings (Reformatted to match structure) ================= */}
          <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-[#eab308] border-b border-gray-700 pb-3 mb-2">
                  Security Settings
              </h2>

              <div className="flex flex-col mt-4">
                  {/* Login Password Section */}
                  <div className="bg-[#131c31] p-4 rounded-lg border border-gray-800 mb-6">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-[#eab308]"/> Change Login Password</h3>
                      <div className="flex flex-col md:flex-row gap-4">
                          <input type="password" placeholder="Current Login Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="flex-1 bg-[#0b1221] border border-gray-700 rounded px-4 py-2 text-white focus:border-[#eab308] outline-none text-sm placeholder-gray-600" />
                          <input type="password" placeholder="New Login Password" value={newLoginPassword} onChange={e => setNewLoginPassword(e.target.value)} className="flex-1 bg-[#0b1221] border border-gray-700 rounded px-4 py-2 text-white focus:border-[#eab308] outline-none text-sm placeholder-gray-600" />
                          <button onClick={() => handleChangePassword('login')} className="bg-[#eab308]/10 text-[#eab308] hover:bg-[#eab308] hover:text-[#0b1221] border border-[#eab308]/30 font-bold px-6 py-2 rounded transition-all text-sm">
                              Update
                          </button>
                      </div>
                  </div>

                  {/* Transaction Password Section */}
                  <div className="bg-[#131c31] p-4 rounded-lg border border-gray-800">
                      <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Lock size={18} className="text-[#eab308]"/> Change Transaction Password</h3>
                      <div className="flex flex-col md:flex-row gap-4">
                          <input type="password" placeholder="Current Txn Password" value={currentTxnPassword} onChange={e => setCurrentTxnPassword(e.target.value)} className="flex-1 bg-[#0b1221] border border-gray-700 rounded px-4 py-2 text-white focus:border-[#eab308] outline-none text-sm placeholder-gray-600" />
                          <input type="password" placeholder="New Txn Password" value={newTxnPassword} onChange={e => setNewTxnPassword(e.target.value)} className="flex-1 bg-[#0b1221] border border-gray-700 rounded px-4 py-2 text-white focus:border-[#eab308] outline-none text-sm placeholder-gray-600" />
                          <button onClick={() => handleChangePassword('txn')} className="bg-[#eab308]/10 text-[#eab308] hover:bg-[#eab308] hover:text-[#0b1221] border border-[#eab308]/30 font-bold px-6 py-2 rounded transition-all text-sm">
                              Update
                          </button>
                      </div>
                  </div>
              </div>
          </div>

      </div>

      <MessageModal
        isOpen={messageModal.open}
        onClose={() => setMessageModal({ ...messageModal, open: false })}
        title={messageModal.title}
        message={messageModal.message}
        type={messageModal.type}
        zIndex={11000}
      />

   </div>
  );
}

export default UserProfile;