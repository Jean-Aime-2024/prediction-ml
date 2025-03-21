import React, { useState } from "react";
import axios from "axios";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [formData, setFormData] = useState({
    squareFootage: "",
    numRooms: "",
    location: "0",
    houseAge: "",
    distanceToCity: "",
    garage: "0",
    garden: "0",
  });

  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<number[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", {
        square_footage: parseFloat(formData.squareFootage),
        num_rooms: parseInt(formData.numRooms),
        location: parseInt(formData.location),
        house_age: parseInt(formData.houseAge),
        distance_to_city: parseFloat(formData.distanceToCity),
        garage: parseInt(formData.garage),
        garden: parseInt(formData.garden),
      });

      if (response.data && response.data.predicted_price) {
        const newPrediction = response.data.predicted_price;
        setPredictedPrice(newPrediction);
        setPredictionHistory((prev) => [...prev, newPrediction]);
      }
    } catch (error) {
      console.error("Error making prediction:", error);
    }
  };

  const chartData = {
    labels: predictionHistory.map((_: any, index: number) => `Prediction ${index + 1}`),
    datasets: [
      {
        label: "Predicted Price Over Time",
        data: predictionHistory,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="container mx-auto py-10 text-white">
      <h1 className="text-4xl font-bold text-center underline">House Price Prediction Dashboard</h1>
      <div className="flex justify-center my-6">
        <Card className="max-w-lg w-full">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label>Square Footage:</label>
                <input type="number" name="squareFootage" value={formData.squareFootage} onChange={handleChange} className="input w-full" required />
              </div>
              <div>
                <label>Number of Rooms:</label>
                <input type="number" name="numRooms" value={formData.numRooms} onChange={handleChange} className="input w-full" required />
              </div>
              <div>
                <label>Location:</label>
                <select name="location" value={formData.location} onChange={handleChange} className="input w-full text-gray-400">
                  <option value="0">City A</option>
                  <option value="1">City B</option>
                </select>
              </div>
              <div>
                <label>House Age (years):</label>
                <input type="number" name="houseAge" value={formData.houseAge} onChange={handleChange} className="input w-full" required />
              </div>
              <div>
                <label>Distance to City (km):</label>
                <input type="number" name="distanceToCity" value={formData.distanceToCity} onChange={handleChange} className="input w-full" required />
              </div>
              <div>
                <label>Garage:</label>
                <select name="garage" value={formData.garage} onChange={handleChange} className="input w-full">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
              <div>
                <label>Garden:</label>
                <select name="garden" value={formData.garden} onChange={handleChange} className="input w-full">
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
              <Button type="submit" className="w-full bg-blue-950 hover:bg-blue-800 py-6">Predict Price</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {predictedPrice !== null && (
        <div className="text-center my-6">
          <h2 className="text-2xl font-semibold">Predicted Price: ${predictedPrice.toFixed(2)}</h2>
        </div>
      )}

      <div className="w-4/5 mx-auto py-10">
        <h2 className="text-3xl font-bold text-center underline">Prediction Charts</h2>
        <Tabs defaultValue="line" className="mt-6">
          <TabsList className="flex justify-center space-x-4">
            <TabsTrigger value="line">Line Chart</TabsTrigger>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          </TabsList>
          <TabsContent value="line"><Line data={chartData} /></TabsContent>
          <TabsContent value="bar"><Bar data={chartData} /></TabsContent>
          <TabsContent value="pie"><Pie data={chartData} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
