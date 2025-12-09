import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function CreateProject() {
      const navigate = useNavigate();

      const [form, setForm] = useState({
            name: '',
            location: '',
            phone: '',
            email: '',
            startDate: '',
            endDate: ''
      });

      const [errors, setErrors] = useState({});
      const validate = () => {
            const newErrors = {};
            const name = form.name.trim();
            const location = form.location.trim();
            const phone = form.phone.trim();
            const email = form.email.trim();

            if (!name) newErrors.name = 'Project name is required';
            if (!location) newErrors.location = 'Location is required';
            if (!phone) newErrors.phone = 'Phone is required';
            else if (!/^\d{10}$/.test(phone)) newErrors.phone = 'Phone must be 10 digits';
            if (!email) newErrors.email = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
            if (!form.startDate) newErrors.startDate = 'Start date is required';
            if (!form.endDate) newErrors.endDate = 'End date is required';
            else if (form.startDate && form.endDate && form.startDate > form.endDate)
                  newErrors.endDate = 'End date cannot be before start date';

            return newErrors;
      };

      const handleChange = (e) => {
            const { name, value } = e.target;

            setForm(prev => ({ ...prev, [name]: value }));

            setErrors(prevErrors => {
                  const { [name]: removed, ...rest } = prevErrors;

                  if (name === 'name' && value.trim() !== '') return rest;
                  if (name === 'location' && value.trim() !== '') return rest;
                  if (name === 'phone' && /^\d{10}$/.test(value)) return rest;
                  if (name === 'email' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return rest;
                  if ((name === 'startDate' || name === 'endDate') && value !== '') return rest;

                  return prevErrors; 
            });
      };

      const handleSubmit = async (e) => {
            e.preventDefault();

            const validationErrors = validate();
            if (Object.keys(validationErrors).length > 0) {
                  setErrors(validationErrors);
                  return; 
            }

            try {
                  await api.post('/projects', form);
                  navigate('/projects');
            } catch (err) {
                  alert(err.response?.data?.msg || 'Error creating project');
            }
      };

      return (
            <div className="card auth-card">
                  <h2>Create Project</h2>
                  <form className="form" onSubmit={handleSubmit}>
                        <label>Project Name</label>
                        <input
                              name="name"
                              value={form.name}
                              onChange={handleChange}
                        />
                        {errors.name && <div className="error" style={{ color: 'red' }}>{errors.name}</div>}

                        <label>Location</label>
                        <input
                              name="location"
                              value={form.location}
                              onChange={handleChange}
                        />
                        {errors.location && <div className="error" style={{ color: 'red' }}>{errors.location}</div>}

                        <label>Phone</label>
                        <input
                              name="phone"
                              value={form.phone}
                              onChange={handleChange}
                        />
                        {errors.phone && <div className="error" style={{ color: 'red' }}>{errors.phone}</div>}

                        <label>Email</label>
                        <input
                              name="email"
                              value={form.email}
                              onChange={handleChange}
                        />
                        {errors.email && <div className="error" style={{ color: 'red' }}>{errors.email}</div>}

                        <label>Start Date</label>
                        <input
                              type="date"
                              name="startDate"
                              value={form.startDate}
                              onChange={handleChange}
                        />
                        {errors.startDate && <div className="error" style={{ color: 'red' }}>{errors.startDate}</div>}

                        <label>End Date</label>
                        <input
                              type="date"
                              name="endDate"
                              value={form.endDate}
                              onChange={handleChange}
                        />
                        {errors.endDate && <div className="error" style={{ color: 'red' }}>{errors.endDate}</div>}

                        <button className="btn" type="submit">Create</button>
                  </form>
            </div>
      );
}
