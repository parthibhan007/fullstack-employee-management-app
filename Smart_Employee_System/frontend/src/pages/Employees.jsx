import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const res = await API.get("/employees");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteEmployee = async (id) => {
    await API.delete(`/employees/${id}`);
    fetchData();
  };

  const editEmployee = (emp) => {
    navigate("/edit", { state: emp });
  };

  return (
    <div>
      <h2>Employees</h2>

      {employees.map(emp => (
        <div key={emp._id} style={{border: "1px solid black", margin: "10px", padding: "10px"}}>
          <p>{emp.name} - {emp.role}</p>
          <p>
            Risk: 
            <span style={{color: emp.riskLevel === "High" ? "red" : "green"}}>
              {emp.riskLevel}
            </span>
          </p>

          <button onClick={() => editEmployee(emp)}>Edit</button>
          <button onClick={() => deleteEmployee(emp._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}