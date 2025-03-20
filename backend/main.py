from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.linear_model import LinearRegression
import numpy as np

# Enhanced example dataset: [Square Footage, Number of Rooms, Location (encoded)]
# Example: Location encoded as 0 for City A, 1 for City B
X = np.array([
    [1000, 3, 0], [1500, 4, 0], [2000, 4, 1], [2500, 5, 1], [3000, 6, 1],  # City A and B
    [1200, 3, 1], [1800, 4, 0], [2200, 5, 0], [2800, 6, 1], [3200, 7, 1]
])  # Features: [square footage, num_rooms, location]
y = np.array([300000, 450000, 500000, 600000, 650000, 350000, 470000, 520000, 610000, 670000])  # House prices

# Train the model
model = LinearRegression()
model.fit(X, y)

# FastAPI app
app = FastAPI()

# Allow CORS from React app running on localhost:3000
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input data structure for prediction
class HouseData(BaseModel):
    square_footage: float
    num_rooms: int
    location: int  # 0: City A, 1: City B

@app.post("/predict")
def predict(data: HouseData):
    input_data = np.array([[data.square_footage, data.num_rooms, data.location]])
    prediction = model.predict(input_data)
    return {"predicted_price": prediction[0]}
