document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('airQualityForm');
    const results = document.getElementById('results');
    const prediction = document.getElementById('prediction');

    function calculateAirQuality(data) {
        // This is a simplified mock prediction logic
        // In a real application, this would be replaced with an actual ML model
        const pm25Weight = data.pm25 > 35 ? 2 : 1;
        const pm10Weight = data.pm10 > 50 ? 2 : 1;
        const score = (
            (data.pm25 * pm25Weight) +
            (data.pm10 * pm10Weight) +
            (data.no2 * 0.5) +
            (data.so2 * 0.3) +
            (data.co * 100)
        ) / (data.industrialProximity + 1);

        if (score < 50) return 'Good';
        if (score < 100) return 'Moderate';
        if (score < 150) return 'Poor';
        return 'Hazardous';
    }

    function getPredictionClass(pred) {
        return pred.toLowerCase();
    }

    form.addEventListener('submit', (e) => {
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
            populationDensity: parseFloat(formData.get('populationDensity'))
        };

        const result = calculateAirQuality(data);
        
        // Remove previous prediction classes
        results.classList.remove('good', 'moderate', 'poor', 'hazardous');
        
        // Add new prediction class and show results
        results.classList.add(getPredictionClass(result));
        results.classList.remove('hidden');
        prediction.textContent = result;
    });
});