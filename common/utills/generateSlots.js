const generateSlots = () => {
  const slots = [];
  let hour = 9;
  slots.push(`0${hour}:00 - 0${hour}:30`);
  slots.push(`0${hour}:30 - ${hour + 1}:00`);
  hour++;
  for (hour; hour < 17; hour++) {
    slots.push(`${hour}:00 - ${hour}:30`);
    slots.push(`${hour}:30 - ${hour + 1}:00`);
  }
  return slots;
};
export default generateSlots;