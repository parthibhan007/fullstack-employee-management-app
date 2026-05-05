import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

export default function EditEmployee() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: state.name,
    role: state.role,
    department: state.department,
    salary: state.salary,
    attendance: state.attendance,
    rating: state.rating
  });

  const handleUpdate = async () => {
    await API.put(`/employees/${state._id}`, form);
    alert("Employee Updated");
    navigate("/employees");
  };

  return (
    <div>
      <h2>Edit Employee</h2>

      <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
      <input value={form.role} onChange={e => setForm({...form, role: e.target.value})}/>
      <input value={form.department} onChange={e => setForm({...form, department: e.target.value})}/>
      <input value={form.salary} onChange={e => setForm({...form, salary: e.target.value})}/>
      <input value={form.attendance} onChange={e => setForm({...form, attendance: e.target.value})}/>
      <input value={form.rating} onChange={e => setForm({...form, rating: e.target.value})}/>

      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}