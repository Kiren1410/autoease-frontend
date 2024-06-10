import axios from "axios";

import { url } from "./data";

export const getBooking = async (token) => {
  try {
    const response = await axios.get(`${url}/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("error", error);
  }
};

export const addNewBooking = async (data) => {
  const response = await axios.post(
    `${url}/bookings`, // url of the POST API
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

export const updateBooking = async (data) => {
  const response = await axios.put(
    `${url}/bookings/${data._id}`,
    JSON.stringify(data), // data you want to pass through the API in JSON format
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
    }
  );
  return response.data;
};

export const deleteBooking = async (data) => {
  const response = await axios.delete(`${url}/bookings/${data._id}`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });
  return response.data;
};
