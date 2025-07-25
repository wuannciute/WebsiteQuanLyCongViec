// client/src/pages/ForgotPassword.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    // Stage 1: 'enter-email', Stage 2: 'enter-otp'
    const [stage, setStage] = useState('enter-email'); 
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    // Hàm xử lý khi gửi yêu cầu mã OTP
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: 'Đang gửi yêu cầu...' });
        try {
            const res = await fetch('http://localhost:5000/api/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.err || 'Có lỗi xảy ra.');
            }
            
            setMessage({ type: 'success', text: data.msg });
            setStage('enter-otp'); // Chuyển sang giai đoạn 2
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    // Hàm xử lý khi đặt lại mật khẩu
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: 'Đang xử lý...' });
        try {
            const res = await fetch('http://localhost:5000/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.err || 'Có lỗi xảy ra.');
            }

            setMessage({ type: 'success', text: data.msg + ' Bạn sẽ được chuyển đến trang đăng nhập sau 3 giây.' });
            
            // Chờ 3 giây rồi chuyển về trang đăng nhập
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
            {stage === 'enter-email' ? (
                <form onSubmit={handleRequestOtp}>
                    <h2>Quên Mật khẩu</h2>
                    <p>Vui lòng nhập email của bạn để nhận mã khôi phục.</p>
                    <div style={{ marginBottom: '15px' }}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                        Gửi mã khôi phục
                    </button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword}>
                    <h2>Đặt lại mật khẩu</h2>
                    <p>Một mã OTP đã được gửi đến email: <strong>{email}</strong></p>
                     <div style={{ marginBottom: '15px' }}>
                        <label>Mã OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                     <div style={{ marginBottom: '15px' }}>
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                        Cập nhật mật khẩu
                    </button>
                </form>
            )}

            {message.text && (
                <p style={{ marginTop: '15px', color: message.type === 'error' ? 'red' : 'green' }}>
                    {message.text}
                </p>
            )}
        </div>
    );
};

export default ForgotPassword;