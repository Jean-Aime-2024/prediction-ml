from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.linear_model import LinearRegression
import numpy as np
import logging

logging.basicConfig(level=logging.INFO)

# Sample dataset with extra features
X = np.array([
    [1000, 3, 0, 10, 5.0, 1, 0], 
    [1500, 4, 0, 8, 3.0, 1, 1],
    [2000, 4, 1, 15, 2.0, 0, 1],
    [2500, 5, 1, 12, 4.5, 1, 1],
    [3000, 6, 1, 5, 1.0, 1, 1],
])  
y = np.array([300000, 450000, 500000, 600000, 650000])  

# Train model
model = LinearRegression()
model.fit(X, y)

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class HouseData(BaseModel):
    square_footage: float
    num_rooms: int
    location: int  
    house_age: int
    distance_to_city: float
    garage: int
    garden: int

@app.post("/predict")
def predict(data: HouseData):
    input_data = np.array([[data.square_footage, data.num_rooms, data.location, data.house_age, data.distance_to_city, data.garage, data.garden]])
    prediction = model.predict(input_data)[0]
    return {"predicted_price": float(prediction)}
