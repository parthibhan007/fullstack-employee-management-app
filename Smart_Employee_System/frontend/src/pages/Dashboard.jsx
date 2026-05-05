import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    API.get("/employees").then(res => setEmployees(res.data));
  }, []);

  const highRisk = employees.filter(e => e.riskLevel === "High").length;
  const lowRisk = employees.filter(e => e.riskLevel === "Low").length;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total Employees: {employees.length}</p>
      <p>High Risk: {highRisk}</p>
      <p>Low Risk: {lowRisk}</p>
    </div>
  );
}