import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
      const [data, setData] = useState({ projects: [], users: [], pending: [] });
      const [err, setErr] = useState(null);
      const navigate = useNavigate();

      const fetch = async () => {
            try {
                  const res = await api.get('/projects');
                  console.log(res.data);
                  setData(res.data);
            } catch (e) {
                  setErr(e.response?.data?.msg || 'Error fetching');
                  if (e.response?.status === 401) navigate('/login');
            }
      };

      useEffect(() => { fetch(); }, []);

      const requestAccess = async (projectId) => {
            try {
                  await api.post(`/projects/${projectId}/request`);
                  fetch();
            } catch (e) { console.error(e); }
      };

      const handleApprove = async (projectId, userId, action) => {
            try {
                  await api.post(`/projects/${projectId}/approve`, { userId, action });
                  fetch();
            } catch (e) { console.error(e); }
      };

      return (
            <div>
                  <h2>Projects</h2>
                  {err && <div className="error">{err}</div>}
                  <div className="grid">
                        {data.projects?.map(p => <ProjectCard key={p._id} project={p} onRequest={() => requestAccess(p._id)} />)}
                  </div>

                  {data.users && data.users.length > 0 && (
                        <div className="card" style={{ marginTop: 20 }}>
                              <h3>All Users</h3>
                         <div className="table-wrapper">
                              <table className="table">
                                    <thead><tr><th>Username</th><th>Email</th><th>Role</th></tr></thead>
                                    <tbody>
                                          {data.users.map(u => <tr key={u._id}><td>{u.username}</td><td>{u.email}</td><td>{u.role}</td></tr>)}
                                    </tbody>
                              </table>
                        </div>

                              <h3 style={{ marginTop: 12 }}>Pending Requests</h3>
                              {data.pending?.length ? data.pending.map(pr => (
                                    <div key={pr._id} className="card small">
                                          <div><strong>{pr.name}</strong></div>
                                          <div>Requests: {pr.requests?.map(r => r.username).join(', ')}</div>
                                          <div style={{ marginTop: 8 }}>
                                                {pr.requests?.map(r => (
                                                      <span key={r._id} style={{ marginRight: 8 }}>
                                                            <button className="btn small pend-req" onClick={() => handleApprove(pr._id, r._id, 'approve')}>Approve {r.username}</button>
                                                            <button className="btn small outline" onClick={() => handleApprove(pr._id, r._id, 'deny')}>Deny</button>
                                                      </span>
                                                ))}
                                          </div>
                                    </div>
                              )) : <div>No pending requests</div>}
                        </div>
                  )}
            </div>
      );
}
