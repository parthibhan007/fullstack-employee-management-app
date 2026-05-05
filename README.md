 🚀 Smart Employee Attrition & Performance Management System

 📌 Overview
This project is a full-stack Employee Management System designed to help organizations manage employee data, track performance, and identify attrition risk using rule-based logic.

It provides a centralized platform for HR teams to make data-driven decisions.

---
<img width="881" height="588" alt="Image" src="https://github.com/user-attachments/assets/957deedf-73d7-4f64-a154-73ba1bed7344" />
 🎯 Problem Statement
Many organizations struggle with:
- Managing employee data efficiently
- Tracking employee performance
- Identifying employees at risk of leaving (attrition)
- Making data-driven HR decisions

---
<img width="1918" height="871" alt="Image" src="https://github.com/user-attachments/assets/23d31d7c-e51d-407a-80af-d847823f29c9" />

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


<img width="705" height="856" alt="Image" src="https://github.com/user-attachments/assets/30ef10f4-b642-4ad9-a57b-1285ebdd629a" />



