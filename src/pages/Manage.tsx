import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

type Base = { id:number; name:string; location?:string };
type Equipment = { id:number; code:string; name:string; unit:string };
type User = { id:string; username:string; email?:string; roleId:number; baseId?:number };

export default function Manage(){
  const [bases,setBases]=useState<Base[]>([]);
  const [equipment,setEquipment]=useState<Equipment[]>([]);
  const [users,setUsers]=useState<User[]>([]);
  const [msg,setMsg]=useState<string|null>(null);
  const [err,setErr]=useState<string|null>(null);

  // base form
  const [bName,setBName]=useState(''); const [bLoc,setBLoc]=useState('');

  // equipment form
  const [code,setCode]=useState(''); const [ename,setEname]=useState(''); const [unit,setUnit]=useState('');

  // user form
  const [uname,setUname]=useState(''); const [uemail,setUemail]=useState(''); const [upass,setUpass]=useState(''); const [urole,setUrole]=useState('logistics_officer'); const [ubase,setUbase]=useState<number|undefined>(undefined);

  async function loadAll(){
    try{
      const b = await apiFetch('/admin/bases'); setBases(b.bases || []);
      const e = await apiFetch('/admin/equipment'); setEquipment(e.equipment || []);
      const u = await apiFetch('/admin/users'); setUsers(u.users || []);
    }catch(err:any){ setErr(err?.error || String(err)); }
  }
  useEffect(()=>{ loadAll(); },[]);

  async function createBase(){
    setMsg(null); setErr(null);
    try{
      const res = await apiFetch('/admin/bases',{ method:'POST', body: JSON.stringify({ name:bName, location:bLoc })});
      setMsg('Base created'); setBName(''); setBLoc(''); loadAll();
    }catch(err:any){ setErr(err?.error || String(err)); }
  }

  async function createEquipment(){
    setMsg(null); setErr(null);
    try{
      await apiFetch('/admin/equipment',{ method:'POST', body: JSON.stringify({ code, name:ename, unit })});
      setMsg('Equipment created'); setCode(''); setEname(''); setUnit(''); loadAll();
    }catch(err:any){ setErr(err?.error || String(err)); }
  }

  async function createUser(){
    setMsg(null); setErr(null);
    try{
      await apiFetch('/admin/users',{ method:'POST', body: JSON.stringify({ username:uname, email:uemail, password:upass, roleName:urole, baseId:ubase })});
      setMsg('User created'); setUname(''); setUemail(''); setUpass(''); loadAll();
    }catch(err:any){ setErr(err?.error || String(err)); }
  }

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 420px',gap:18}}>
      <div className="card">
        <h3>Manage — Bases & Equipment</h3>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div>
            <h4>Create Base</h4>
            <label className="label">Name</label>
            <input className="input" value={bName} onChange={e=>setBName(e.target.value)} />
            <label className="label">Location</label>
            <input className="input" value={bLoc} onChange={e=>setBLoc(e.target.value)} />
            <div style={{marginTop:8}}><button className="btn btn-primary" onClick={createBase}>Create Base</button></div>
          </div>

          <div>
            <h4>Create Equipment</h4>
            <label className="label">Code</label>
            <input className="input" value={code} onChange={e=>setCode(e.target.value)} />
            <label className="label">Name</label>
            <input className="input" value={ename} onChange={e=>setEname(e.target.value)} />
            <label className="label">Unit</label>
            <input className="input" value={unit} onChange={e=>setUnit(e.target.value)} placeholder="each, rounds, etc." />
            <div style={{marginTop:8}}><button className="btn btn-primary" onClick={createEquipment}>Create Equipment</button></div>
          </div>
        </div>

        <div style={{marginTop:18}}>
          <h4>Existing Bases</h4>
          <table className="table">
            <thead><tr><th>ID</th><th>Name</th><th>Location</th></tr></thead>
            <tbody>{bases.map(b=> <tr key={b.id}><td>{b.id}</td><td>{b.name}</td><td>{b.location}</td></tr>)}</tbody>
          </table>
        </div>

        <div style={{marginTop:12}}>
          <h4>Existing Equipment</h4>
          <table className="table">
            <thead><tr><th>ID</th><th>Code</th><th>Name</th><th>Unit</th></tr></thead>
            <tbody>{equipment.map(e=> <tr key={e.id}><td>{e.id}</td><td>{e.code}</td><td>{e.name}</td><td>{e.unit}</td></tr>)}</tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3>Create User</h3>
        <label className="label">Username</label>
        <input className="input" value={uname} onChange={e=>setUname(e.target.value)} />
        <label className="label">Email</label>
        <input className="input" value={uemail} onChange={e=>setUemail(e.target.value)} />
        <label className="label">Password</label>
        <input className="input" type="password" value={upass} onChange={e=>setUpass(e.target.value)} />
        <label className="label">Role</label>
        <select className="input" value={urole} onChange={e=>setUrole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="base_commander">Base Commander</option>
          <option value="logistics_officer">Logistics Officer</option>
        </select>
        <label className="label">Assign Base (optional)</label>
        <select className="input" value={ubase ?? ''} onChange={e=>setUbase(e.target.value ? Number(e.target.value) : undefined)}>
          <option value="">— none —</option>
          {bases.map(b=> <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>

        <div style={{marginTop:10}}>
          <button className="btn btn-primary" onClick={createUser}>Create User</button>
        </div>

        <div style={{marginTop:14}}>
          <h4>Existing Users</h4>
          <table className="table">
            <thead><tr><th>Username</th><th>Email</th><th>Role</th><th>Base</th></tr></thead>
            <tbody>
              {users.map(u=> <tr key={u.id}><td>{u.username}</td><td>{u.email}</td><td>{u.roleId}</td><td>{u.baseId ?? '-'}</td></tr>)}
            </tbody>
          </table>
        </div>

        {msg && <div className="success" style={{marginTop:8}}>{msg}</div>}
        {err && <div className="error" style={{marginTop:8}}>{err}</div>}
      </div>
    </div>
  );
}
