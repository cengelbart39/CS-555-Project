const calendarEl = document.getElementById('calendar');
const monthSelect = document.getElementById('month');
const yearSelect = document.getElementById('year');

document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.getElementById('back-to-main');
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.location.href = '/'; // Adjust if needed
    });
  }
});

// Populate month and year dropdowns
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

for (let m = 0; m < 12; m++) {
  const option = document.createElement('option');
  option.value = m;
  option.text = new Date(0, m).toLocaleString('default', { month: 'long' });
  if (m === currentMonth) option.selected = true;
  monthSelect.appendChild(option);
}

for (let y = currentYear - 5; y <= currentYear + 5; y++) {
  const option = document.createElement('option');
  option.value = y;
  option.text = y;
  if (y === currentYear) option.selected = true;
  yearSelect.appendChild(option);
}

// Fetch real calorie totals from backend
async function fetchDailyCalories() {
  try {
    const res = await fetch('/api/meals/daily-totals', {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Failed to fetch daily totals');
    const data = await res.json();

    const totals = {};
    data.forEach(entry => {
      totals[entry.date] = entry.totalCalories;
    });

    return totals;
  } catch (e) {
    console.error('[ERROR] Fetching daily totals:', e);
    return {};
  }
}

// Generate calendar and apply real data
async function generateCalendar() {
  calendarEl.innerHTML = ''; // Clear previous calendar

  const year = parseInt(yearSelect.value);
  const month = parseInt(monthSelect.value);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const caloriesByDate = await fetchDailyCalories();

  // Fill in empty slots before first day
  for (let i = 0; i < firstDay; i++) {
    const cell = document.createElement('div');
    calendarEl.appendChild(cell);
  }

  // Fill in the days
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    const dayNum = document.createElement('div');
    dayNum.className = 'day-number';
    dayNum.textContent = day;
    cell.appendChild(dayNum);

    const cal = document.createElement('div');
    cal.className = 'calories';

    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;

    const total = caloriesByDate[dateStr];
    cal.textContent = total !== undefined ? `${total} cal` : '0 cal';

    cell.appendChild(cal);
    calendarEl.appendChild(cell);
  }
}

// Regenerate calendar on dropdown change
monthSelect.addEventListener('change', generateCalendar);
yearSelect.addEventListener('change', generateCalendar);

window.addEventListener('DOMContentLoaded', generateCalendar);