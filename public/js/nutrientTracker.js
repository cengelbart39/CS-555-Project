let userData = [];

function getSelectedPeriod() {
  return document.getElementById('tracking-period').value || 'daily';
}

async function loadUserData() {
  const period = getSelectedPeriod();
  try {
    const response = await fetch(`/api/nutrition?period=${period}`);
    if (response.ok) {
      userData = await response.json();
      const today = new Date().toISOString().split('T')[0];
      const todayData = userData.find(r => r.date === today);
      if (todayData) {
        document.getElementById('current-protein').value = todayData.protein;
        document.getElementById('current-carbs').value   = todayData.carbs;
        document.getElementById('current-fat').value     = todayData.fat;
      }
    }
  } catch (err) {
    console.error('Error loading data:', err);
  }
  updateBars();
}

async function loadGoals() {
  try {
    const res = await fetch('/api/goals');
    if (!res.ok) return;
    const { protein, carbs, fat } = await res.json();
    document.getElementById('goal-protein').value = protein;
    document.getElementById('goal-carbs').value   = carbs;
    document.getElementById('goal-fat').value     = fat;
  } catch (err) {
    console.error('Error loading goals:', err);
  }
  updateBars();
}

document.getElementById('save-goals').addEventListener('click', async () => {
  const fb = document.getElementById('goals-feedback');
  const payload = {
    protein: +document.getElementById('goal-protein').value,
    carbs:   +document.getElementById('goal-carbs').value,
    fat:     +document.getElementById('goal-fat').value
  };
  try {
    const res = await fetch('/api/goals', {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    fb.textContent = res.ok ? 'Goals saved!' : 'Save failed';
  } catch (err) {
    console.error('Error saving goals:', err);
    fb.textContent = 'Save failed';
  }
  updateBars();
});

document.getElementById('tracking-period').addEventListener('change', loadUserData);

function updateBars() {
    const proteinGoal = document.getElementById('protein-goal').value;
    const currentProtein = document.getElementById('current-protein').value;
    const proteinPercent = (currentProtein / proteinGoal) * 100;
    document.getElementById('protein-bar').style.width = proteinPercent + '%';
    document.getElementById('protein-goal-line').style.left = '100%';

    const carbsGoal = document.getElementById('carbs-goal').value;
    const currentCarbs = document.getElementById('current-carbs').value;
    const carbsPercent = (currentCarbs / carbsGoal) * 100;
    document.getElementById('carbs-bar').style.width = carbsPercent + '%';
    document.getElementById('carbs-goal-line').style.left = '100%';

    const fatGoal = document.getElementById('fat-goal').value;
    const currentFat = document.getElementById('current-fat').value;
    const fatPercent = (currentFat / fatGoal) * 100;
    document.getElementById('fat-bar').style.width = fatPercent + '%';
    document.getElementById('fat-goal-line').style.left = '100%';
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateBars);
});

document.getElementById('tracking-period').addEventListener('change', function() {
    const period = this.value;
    // Adjust goals based on the selected period if needed
    // For example, multiply daily goals by 7 for weekly, by 30 for monthly, etc.
    updateBars();
});

updateBars();
    
      
    // Load user's nutrition data when page loads
    async function loadUserData() {
      try {
        const response = await fetch('/api/nutrition');
        if (response.ok) {
          userData = await response.json();
          // If there's data for today, load it
          const today = new Date().toISOString().split('T')[0];
          const todayData = userData.find(record => record.date === today);
          
          if (todayData) {
            document.getElementById('protein-goal').value = 100; // Default goal
            document.getElementById('current-protein').value = todayData.protein;
            
            document.getElementById('carbs-goal').value = 200; // Default goal
            document.getElementById('current-carbs').value = todayData.carbs;
            
            document.getElementById('fat-goal').value = 70; // Default goal
            document.getElementById('current-fat').value = todayData.fat;
            
            updateBars();
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
    
    // User Story 10: Save or update today's nutrition data
async function saveNutritionData() {
  const protein = document.getElementById('current-protein').value;
  const carbs   = document.getElementById('current-carbs').value;
  const fat     = document.getElementById('current-fat').value;
  const today   = new Date().toISOString().split('T')[0];
  const period  = getSelectedPeriod();
      
  const todayData = userData.find(r => r.date === today);

  try {
    let res;
    if (todayData) {
      res = await fetch(`/api/nutrition/${todayData._id}?period=${period}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ protein, carbs, fat })
      });
    } else {
      res = await fetch(`/api/nutrition?period=${period}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ protein, carbs, fat, date: today })
      });
    }
    if (res.ok) {
      alert('Data saved successfully!');
      await loadUserData();
    } else {
      const errText = await res.text();
      alert('Failed to save data: ' + errText);
    }
  } catch (err) {
    console.error('Error saving nutrition data:', err);
    alert('An unexpected error occurred.');
  }
}
  // Add a save button to the form
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save Data';
  saveButton.style.marginTop = '20px';
  saveButton.style.padding = '10px';
  saveButton.style.backgroundColor = '#4caf50';
  saveButton.style.color = 'white';
  saveButton.style.border = 'none';
  saveButton.style.borderRadius = '4px';
  saveButton.style.cursor = 'pointer';
  saveButton.onclick = saveNutritionData;
    
  document.body.appendChild(saveButton);
    
  // Load user data and goals when page loads
  window.addEventListener('DOMContentLoaded', () => {
    loadGoals();
    loadUserData();
  });;