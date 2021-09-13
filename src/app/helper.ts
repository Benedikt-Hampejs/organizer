export function calculatePriortyByDay(day: Date) {
    return ((day.getFullYear() * 100 + day.getMonth()) * 100 + day.getDate()) * 100;
  }