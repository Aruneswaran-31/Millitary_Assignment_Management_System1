import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';


export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('adminpass');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(null);
    try {
      const data:any = await apiFetch('/login',{ method:'POST', body: JSON.stringify({ username, password })});
      const token = data?.token;
      if (!token) return setError('Login failed');
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err:any) {
      setError(err?.error || err?.message || 'Login failed');
    }
  }

  return (
    <div style={{maxWidth:420, margin:'40px auto'}}>
      <div className="card">
        <h2>Login</h2>
        <form onSubmit={submit}>
          <div className="form-row">
            <div style={{flex:1}}>
              <label className="label">Username</label>
              <input className="input" value={username} onChange={e=>setUsername(e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div style={{flex:1}}>
              <label className="label">Password</label>
              <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
          </div>
          <div style={{display:'flex',gap:8, marginTop:8}}>
            <button className="btn btn-primary" type="submit">Login</button>
            <button type="button" className="btn btn-outline" onClick={() => { setUsername('admin'); setPassword('adminpass'); }}>Use seed</button>
          </div>
          {error && <div className="error" style={{marginTop:8}}>{error}</div>}
        </form>
      </div>
    </div>
  );
}
