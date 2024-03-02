// index.js

const express = require('express');
const axios = require('axios');

const app = express();
const port = 3002;

// Replace these values with your actual API key
const apiKey = 'key';

// Get the first day of the current month
const currentDate = new Date();
const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
const startDate = firstDayOfMonth.toISOString().split('T')[0];
const endDate = currentDate.toISOString().split('T')[0];
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

app.get('/applovin', async (req, res) => {
  try {
    const apiUrl = `https://r.applovin.com/maxReport?api_key=${apiKey}&columns=day,impressions,ecpm,estimated_revenue&format=json&start=${startDate}&end=${endDate}&sort_day=DESC`;
    const response = await axios.get(apiUrl);
    const data = response.data.results;

    // Calculate total estimated revenue
    const totalEstimatedRevenue = data.reduce((total, entry) => total + parseFloat(entry.estimated_revenue), 0);

    // Generate Bootstrap HTML table
    const tableHTML = `
      <table class="table table-bordered">
        <thead class="thead-white">
          <tr>
          <th >Total Estimated Revenue for ${ monthNames[currentDate.getMonth()] }</th>
          <th colspan="3" class="text-center">$${totalEstimatedRevenue.toFixed(2)}</th>
            
          </tr>
          <tr>
            <th >Day</th>
            <th >Impressions</th>
            <th >eCPM</th>
            <th >Estimated Revenue</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(entry => `
            <tr>
              <td>${entry.day}</td>
              <td>${entry.impressions}</td>
              <td>$${parseFloat(entry.ecpm).toFixed(2)}</td>
              <td>$${parseFloat(entry.estimated_revenue).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
        
      </table>
    `;

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
        <title>AppLovin Revenue Data</title>
      </head>
      <body>
        <div class="container mt-4">
          <h2 class="mb-4">AppLovin Revenue Data</h2>
          ${tableHTML}
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
