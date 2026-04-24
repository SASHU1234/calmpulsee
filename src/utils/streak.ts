/**
 * Normalizes a date string to Local Date only (YYYY-MM-DD).
 */
function normalizeDateStr(dateStr: string | number | Date): string {
  const d = new Date(dateStr);
  return d.toISOString().split("T")[0];
}

/**
 * Calculates the current consecutive streak based on an array of log dates.
 * A streak increments for consecutive days leading up to Today or Yesterday.
 */
export function calculateStreak(logs: any[]): number {
  if (!logs || logs.length === 0) return 0;

  // Extract unique dates logged descending
  const uniqueDates = Array.from(new Set(logs.map(lg => normalizeDateStr(lg.date))));
  uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const todayStr = normalizeDateStr(new Date());
  
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = normalizeDateStr(yesterdayDate);

  // If the latest logged date isn't today OR yesterday, streak is broken
  const latestLog = uniqueDates[0];
  if (latestLog !== todayStr && latestLog !== yesterdayStr) {
      return 0; // Streak completely broken
  }

  let streak = 0;
  let currentDateToCheck = new Date(latestLog);

  for (const logDate of uniqueDates) {
      const expectedStr = normalizeDateStr(currentDateToCheck);
      
      if (logDate === expectedStr) {
          streak++;
          currentDateToCheck.setDate(currentDateToCheck.getDate() - 1);
      } else {
          break; // Streak ends
      }
  }

  return streak;
}

/**
 * Returns an array of size 7 containing boolean statuses corresponding to 
 * [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday] of the CURRENT week.
 * True = active that day, False = missed or future
 */
export function getCurrentWeeklyStatus(logs: any[]): boolean[] {
  const uniqueDates = new Set(logs.map(lg => normalizeDateStr(lg.date)));
  
  // Array to hold statuses for Mon-Sun
  const weeklyStatus = [false, false, false, false, false, false, false];
  
  const today = new Date();
  // Get current day of week (0 = Sunday, 1 = Monday ...)
  let currentDay = today.getDay(); 
  
  // Convert standard (Sunday=0) to our sequence (Monday=0 -> Sunday=6)
  const mappingArr = currentDay === 0 ? 6 : currentDay - 1;

  // Step backwards through the week starting from today
  for (let i = 0; i <= mappingArr; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - (mappingArr - i));
      const dateStr = normalizeDateStr(checkDate);
      
      if (uniqueDates.has(dateStr)) {
          weeklyStatus[i] = true;
      }
  }

  return weeklyStatus;
}
