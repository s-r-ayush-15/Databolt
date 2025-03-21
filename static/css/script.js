document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('airQualityForm');
    const results = document.getElementById('results');
    const prediction = document.getElementById('prediction');
    const chartContainer = document.getElementById('chartContainer');
    let myChart = null; // Bar Chart
    let pieChart = null; // Pie Chart
    let radarChart = null; // Radar Chart

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the form from submitting the traditional way

        // Collect form data
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

        // Send data to Flask API for prediction
        try {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.error) {
                prediction.textContent = `Error: ${result.error}`;
            } else {
                prediction.textContent = `Predicted Air Quality: ${result.prediction}`;
                visualizeData(data, result.prediction);
            }

            results.classList.remove('hidden');
        } catch (error) {
            prediction.textContent = 'Error while predicting. Please try again.';
            results.classList.remove('hidden');
        }
    });

    // Function to visualize the data
    function visualizeData(inputData, prediction) {
        // Destroy previous charts if they exist
        if (myChart) myChart.destroy();
        if (pieChart) pieChart.destroy();
        if (radarChart) radarChart.destroy();

        const labels = Object.keys(inputData);
        const values = Object.values(inputData);

        // Bar Chart
        const ctx = document.getElementById('airQualityChart').getContext('2d');
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Parameter Values',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: { responsive: true }
        });

        // Pie Chart
        const pieCtx = document.getElementById('pieChart').getContext('2d');
        pieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Parameter Distribution',
                    data: values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(153, 102, 255, 0.6)'
                    ],
                    borderWidth: 1
                }]
            },
            options: { responsive: true }
        });

        // Radar Chart
        const radarCtx = document.getElementById('radarChart').getContext('2d');
        radarChart = new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Parameter Comparison',
                    data: values,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Show chart container
        chartContainer.classList.remove('hidden');
    }
});
