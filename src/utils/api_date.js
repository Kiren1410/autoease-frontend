import axios from "axios";

import { url } from "./data";

export const getDates = async (vehicleId) => {
  try {
    const response = await axios.get(`${url}/dates`, {
      params: { vehicleId },
    });
    return response.data; // Return data received from the API
  } catch (error) {
    console.error("Error fetching dates:", error);
    throw new Error("Failed to fetch dates"); // Throw an error to indicate failure
  }
};

export const addNewDates = async (data) => {
  const response = await axios.post(
    `${url}/dates`, // url of the POST API
    JSON.stringify(data), // data you want to pass through the API in JSON format
    {
      headers: {
        "Content-Type": "application/json", // telling the API you are sending JSON data
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  return response.data;
};
