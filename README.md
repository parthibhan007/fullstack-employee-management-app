 🚀 Smart Employee Attrition & Performance Management System

 📌 Overview
This project is a full-stack Employee Management System designed to help organizations manage employee data, track performance, and identify attrition risk using rule-based logic.

It provides a centralized platform for HR teams to make data-driven decisions.

---

 🎯 Problem Statement
Many organizations struggle with:
- Managing employee data efficiently
- Tracking employee performance
- Identifying employees at risk of leaving (attrition)
- Making data-driven HR decisions

---

 💡 Solution
This system solves the above problems by:
- Providing full CRUD operations for employee management
- Tracking performance metrics like attendance and ratings
- Calculating attrition risk (Low / Medium / High)
- Displaying insights through a dashboard

---

 ⚙️ Tech Stack

 Frontend
- React (Vite)
- Axios
- React Router

 Backend
- Node.js
- Express.js

 Database
- MongoDB

---

 🔥 Features

 ✅ Employee Management
- Add employee
- View employee list
- Update employee details
- Delete employee

 📊 Performance Tracking
- Attendance tracking
- Performance rating

 ⚠️ Attrition Risk Detection
- Rule-based logic:
  - Low attendance + low rating → High risk
  - Medium conditions → Medium risk
  - Otherwise → Low risk

 📈 Dashboard
- Total employees
- High risk employees
- Low risk employees

---

 🧠 Business Logic (Attrition Prediction)

```js
if (attendance < 50 && rating < 2) return "High";
if (attendance < 70 && rating < 3) return "Medium";
return "Low";
```

Project Structure : -

employee-management-system/
│
├── backend/
│   ├── config/
│   │    └── db.js
│   │
│   ├── controllers/
│   │    ├── authController.js
│   │    ├── employeeController.js
│   │    └── performanceController.js
│   │
│   ├── models/
│   │    ├── User.js
│   │    ├── Employee.js
│   │    └── Performance.js
│   │
│   ├── routes/
│   │    ├── authRoutes.js
│   │    ├── employeeRoutes.js
│   │    └── performanceRoutes.js
│   │
│   ├── utils/
│   │    └── riskCalculator.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │    ├── pages/
│   │    │    ├── Dashboard.jsx
│   │    │    ├── Employees.jsx
│   │    │    ├── AddEmployee.jsx
│   │    │    └── Login.jsx
│   │    │
│   │    ├── components/
│   │    │    └── Navbar.jsx
│   │    │
│   │    ├── services/
│   │    │    └── api.js
│   │    │
│   │    ├── App.jsx
│   │    └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md








