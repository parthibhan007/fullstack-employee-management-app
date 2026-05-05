const calculateRisk = (attendance, rating) => {
  if (attendance < 50 && rating < 2) return "High";
  if (attendance < 70 && rating < 3) return "Medium";
  return "Low";
};

module.exports = calculateRisk;