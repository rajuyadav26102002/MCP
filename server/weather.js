import axios from 'axios';
import { config } from "dotenv";
config();

export const name = "get_weather";
export const description = "Get current weather for a specific city";

export const inputSchema = {
    type: "object",
    properties: {
        city: {
            type: "string",
            description: "Name of the city (e.g., Pune, Delhi)"
        }
    },
    required: ["city"]
};

export async function run({ city }) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        const weatherInfo = `The weather in ${data.name} is ${data.weather[0].description} with a temperature of ${data.main.temp}°C.`;
        return { content: [{ text: weatherInfo }] };
    } catch (error) {
        console.error(error);
        return { content: [{ text: "Unable to fetch weather data. Please check the city name." }] };
    }
}
