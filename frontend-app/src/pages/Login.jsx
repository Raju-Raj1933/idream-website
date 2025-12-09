import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
      const [form, setForm] = useState({ username: '', password: '' });
      const [error, setError] = useState(null);
      const navigate = useNavigate();

      const submit = async (e) => {
            e.preventDefault();
            setError(null);
            try {
                  await api.post('/auth/login', form);
                  navigate('/projects');
            } catch (err) {
                  setError(err.response?.data?.msg || 'Login failed');
            }
      };

      return (
            <div className="card auth-card">
                  <h2>Login</h2>
                  <form onSubmit={submit} className="form">
                        <label>Email</label>
                        <input type="email" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
                        <label>Password</label>
                        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                        <button className="btn" type="submit">Login</button>
                        {error && <div className="error">{error}</div>}
                  </form>
                  <div style={{ marginTop: 12 }}>Don't have account? <Link to="/signup">Sign up</Link></div>
            </div>
      );
}
