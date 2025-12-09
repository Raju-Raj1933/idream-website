import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Projects from './pages/Projects';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';
import CreateProject from './pages/CreateProject';


function App() {
  return (
    <div className='parentWrapper'>
      <Navbar />
      <main style={{ padding: '16px' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/createProject" element={<CreateProject />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
