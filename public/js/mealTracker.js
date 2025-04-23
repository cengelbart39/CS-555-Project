document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addMealForm');
    const mealDateInput = document.getElementById('mealDate');
    const mealsContainer = document.getElementById('meals-container');

    if (mealDateInput) {
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        mealDateInput.value = today;
    }
  
    async function loadMeals() {
      try {
        const res = await fetch('/api/meals');
        if (!res.ok) throw new Error('Failed to load meals');
        const meals = await res.json();
        const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
        mealsContainer.innerHTML = '';
  
        categories.forEach(cat => {
          const section = document.createElement('section');
          section.innerHTML = `<h2>${cat}</h2><ul></ul>`;
          const ul = section.querySelector('ul');
          
          meals
            .filter(m => m.category === cat)
            .forEach(m => {
              const li = document.createElement('li');
              li.textContent = `${m.date} — ${m.name} (${m.calories} kcal)`;
              ul.appendChild(li);
            });
          mealsContainer.appendChild(section);
        });
      } catch (err) {
        console.error(err);
        mealsContainer.textContent = 'Error loading meals.';
      }
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
  
      try {
        const res = await fetch('/api/meals', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          alert('Meal added successfully!');
          form.reset(); // resets the form after submission
          if (mealDateInput) {
            mealDateInput.value = new Date().toISOString().split('T')[0];
          }
          await loadMeals();
        } else {
          const error = await res.text();
          alert('Failed to add meal: ' + error);
        }
      } catch (err) {
        console.error('Error submitting form:', err);
        alert('An unexpected error occurred.');
      }
    });
    loadMeals();
  });