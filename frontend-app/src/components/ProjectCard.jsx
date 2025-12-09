import React from 'react';

export default function ProjectCard({ project, onRequest }) {
      if (!project || Object.keys(project).length === 0) {
            return <div className="empty-state">No project data available</div>;
      }

      const { name, location, phone, email, startDate, endDate } = project;
      return (
            <div className="card project-card">
                  <h4>{name}</h4>
                  <div>{location}</div>
                  <div>Phone: {phone}</div>
                  <div>Email: {email}</div>
                  <div>Start: {startDate ? new Date(startDate).toLocaleDateString() : '-'}</div>
                  <div>End: {endDate ? new Date(endDate).toLocaleDateString() : '-'}</div>
                  <div style={{ marginTop: 8 }}>
                        <button className="btn" onClick={onRequest}>Request Access</button>
                  </div>
            </div>
      );
}

