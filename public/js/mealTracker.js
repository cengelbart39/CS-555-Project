document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addMealForm');

    // Set default value of date input to the current date
    const mealDateInput = document.getElementById('mealDate');
    if (mealDateInput) {
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        mealDateInput.value = today;
    }
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
  
      try {
        const res = await fetch('/api/meals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
  
        if (res.ok) {
          alert('Meal added successfully!');
          form.reset(); // resets the form after submission
        } else {
          const error = await res.text();
          alert('Failed to add meal: ' + error);
        }
      } catch (err) {
        console.error('Error submitting form:', err);
        alert('An unexpected error occurred.');
      }
    });
  });