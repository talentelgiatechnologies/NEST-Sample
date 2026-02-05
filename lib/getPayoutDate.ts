export function getPayoutDate() {
  const date = new Date();
  
  // Add 3 days
  date.setDate(date.getDate() + 3);

  // Get the day of week (0 = Sunday, 2 = Tuesday, etc.)
  const day = date.getDay();

  // If it's already Tuesday, return it
  if (day === 2) return date;

  // Else find next Tuesday
  const daysUntilTuesday = (9 - day) % 7; // ensures positive difference
  date.setDate(date.getDate() + daysUntilTuesday);

  return date;
}