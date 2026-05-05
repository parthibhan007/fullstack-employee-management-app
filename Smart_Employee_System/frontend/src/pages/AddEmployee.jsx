import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AddEmployee() {
  const [form, setForm] = useState({
    name: "",
    role: "",
    department: "",
    salary: "",
    attendance: "",
    rating: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    await API.post("/employees", form);
    alert("Employee Added");
    navigate("/employees");
  };

  return (
    <div>
      <h2>Add Employee</h2>

      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})}/>
      <input placeholder="Role" onChange={e => setForm({...form, role: e.target.value})}/>
      <input placeholder="Department" onChange={e => setForm({...form, department: e.target.value})}/>
      <input placeholder="Salary" onChange={e => setForm({...form, salary: e.target.value})}/>
      <input placeholder="Attendance" onChange={e => setForm({...form, attendance: e.target.value})}/>
      <input placeholder="Rating" onChange={e => setForm({...form, rating: e.target.value})}/>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}