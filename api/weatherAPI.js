import axios from "axios";

export const fetchWeatherData = async (latitude, longitude) => {
  try {
    const apiKey = "4532f45d15024426ae1162936243105"; // Replace with your API key
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json`,
      {
        params: {
          key: apiKey,
          q: `Lagos`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching weather data:", error);
  }
};
