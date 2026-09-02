const categoryBaseValues = {
  'T-Shirt': 500,
  'Shirt': 700,
  'Jeans': 900,
  'Dress': 1200,
  'Jacket': 1600,
  'Ethnic Wear': 1400,
  'Footwear': 1300,
  'Accessories': 600,
};

const brandMultipliers = {
  'Premium': 1.50,
  'Popular': 1.20,
  'Standard': 1.00,
  'Budget': 0.75,
  'Unknown': 0.65,
};

const conditionMultipliers = {
  'New with tags': 1.00,
  'Like new': 0.85,
  'Good': 0.65,
  'Fair': 0.40,
};

export const calculateSwapPoints = (category, brand, condition, ageMonths = 0) => {
  const base = categoryBaseValues[category] || 800;
  const brandMult = brandMultipliers[brand] || 1.0;
  const condMult = conditionMultipliers[condition] || 0.65;
  
  // Age multiplier: items lose ~2% value per month, max 50% loss
  const ageMult = Math.max(0.5, 1 - (ageMonths * 0.02));

  const rawPoints = base * brandMult * condMult * ageMult;
  
  // Round to nearest 50
  return Math.round(rawPoints / 50) * 50;
};

export const isFairMatch = (pointsA, pointsB) => {
  const diff = Math.abs(pointsA - pointsB);
  const max = Math.max(pointsA, pointsB);
  
  if (max === 0) return true; // Avoid division by zero
  
  const diffPercentage = diff / max;
  return diffPercentage <= 0.20; // Within 20%
};
