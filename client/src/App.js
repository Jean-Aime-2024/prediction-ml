import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [squareFootage, setSquareFootage] = useState("");
  const [numRooms, setNumRooms] = useState("");
  const [location, setLocation] = useState("0");  // Default to City A
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", {
        square_footage: parseFloat(squareFootage),
        num_rooms: parseInt(numRooms),
        location: parseInt(location),
      });
      const newPrediction = response.data.predicted_price;
      setPredictedPrice(newPrediction);
      setPredictionHistory((prevHistory) => [...prevHistory, newPrediction]);
    } catch (error) {
      console.error("Error making prediction:", error);
    }
  };

  const chartData = {
    labels: predictionHistory.map((_, index) => `Prediction ${index + 1}`),
    datasets: [
      {
        label: "Predicted Price Over Time",
        data: predictionHistory,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>House Price Prediction Dashboard</h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Square Footage:</label>
            <input
              type="number"
              value={squareFootage}
              onChange={(e) => setSquareFootage(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Number of Rooms:</label>
            <input
              type="number"
              value={numRooms}
              onChange={(e) => setNumRooms(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Location:</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="0">City A</option>
              <option value="1">City B</option>
            </select>
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white' }}>
            Predict Price
          </button>
        </form>
      </div>

      {predictedPrice !== null && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>Predicted Price: ${predictedPrice.toFixed(2)}</h2>
        </div>
      )}

      <div style={{ marginTop: '40px', width: '80%', margin: 'auto' }}>
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default App;
