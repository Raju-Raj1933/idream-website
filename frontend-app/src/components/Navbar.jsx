import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Navbar() {
      const [open, setOpen] = useState(false);
      const navigate = useNavigate();

      const handleLogout = async () => {
            try {
                  await api.post("/auth/logout");
                  navigate("/login");
            } catch (err) {
                  console.error(err);
                  navigate("/login");
            }
      };
      return (
            <>
                  <nav className="nav">
                        <div className="nav-left">
                              <Link to="/projects" className="brand">
                                    Ubiquitous PMS
                              </Link>
                        </div>
                        <div className="nav-links-desktop">
                              <Link to="/projects" className="nav-link">Projects</Link>
                              <Link to="/createProject" className="nav-link">Create</Link>
                              <Link to="/reports" className="nav-link">Reports</Link>
                              <button className="btn" onClick={handleLogout}>Logout</button>
                        </div>
                        <button className="hamburger" onClick={() => setOpen(true)}>
                              ☰
                        </button>
                  </nav>
                  <div className={`sidebar ${open ? "show" : ""}`}>
                        <button className="close-btn" onClick={() => setOpen(false)}>×</button>

                        <Link to="/projects" className="side-link" onClick={() => setOpen(false)}>
                              Projects
                        </Link>

                        <Link to="/createProject" className="side-link" onClick={() => setOpen(false)}>
                              Create
                        </Link>

                        <Link to="/reports" className="side-link" onClick={() => setOpen(false)}>
                              Reports
                        </Link>

                        <button className="side-btn" onClick={handleLogout}>
                              Logout
                        </button>
                  </div>
                  {open && <div className="overlay" onClick={() => setOpen(false)}></div>}
            </>
      );
}


