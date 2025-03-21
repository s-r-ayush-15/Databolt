document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('airQualityForm');
    const results = document.getElementById('results');
    const prediction = document.getElementById('prediction');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            temperature: parseFloat(formData.get('temperature')),
            humidity: parseFloat(formData.get('humidity')),
            pm25: parseFloat(formData.get('pm25')),
            pm10: parseFloat(formData.get('pm10')),
            no2: parseFloat(formData.get('no2')),
            so2: parseFloat(formData.get('so2')),
            co: parseFloat(formData.get('co')),
            industrialProximity: parseFloat(formData.get('industrialProximity')),
            populationDensity: parseInt(formData.get('populationDensity'))
        };

        try {
            // Send data to Flask API for prediction
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.error) {
                prediction.textContent = `Error: ${result.error}`;
            } else {
                prediction.textContent = `Predicted Air Quality: ${result.prediction}`;
            }

            results.classList.remove('hidden');
        } catch (error) {
            prediction.textContent = 'Error while predicting. Please try again.';
            results.classList.remove('hidden');
        }
    });
});
