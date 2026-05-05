import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={{marginBottom: "20px"}}>
      <Link to="/dashboard">Dashboard</Link> | 
      <Link to="/employees">Employees</Link> | 
      <Link to="/add">Add Employee</Link>
    </div>
  );
}