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
    
    
    let userData = [];
    
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
    
    // Save nutrition data
    async function saveNutritionData() {
      const protein = document.getElementById('current-protein').value;
      const carbs = document.getElementById('current-carbs').value;
      const fat = document.getElementById('current-fat').value;
      const today = new Date().toISOString().split('T')[0];
      
      // Check if we already have a record for today
      const todayData = userData.find(record => record.date === today);
      
      try {
        if (todayData) {
          // Update existing record
          await fetch(`/api/nutrition/${todayData._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ protein, carbs, fat })
          });
        } else {
          // Create new record
          await fetch('/api/nutrition', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ protein, carbs, fat, date: today })
          });
        }
        
        alert('Data saved successfully!');
        loadUserData(); // Reload the data after saving
      } catch (error) {
        console.error('Error saving data:', error);
        alert('Failed to save data');
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
    
    // Load user data when page loads
    window.addEventListener('DOMContentLoaded', loadUserData);