import axios from "axios";

import { url } from "./data";

export const getUsers = async () => {
  const res = await axios.get(`${url}/users`);
  return res.data;
};

export const loginUser = async (data) => {
  const response = await axios.post(
    `${url}/users/login`, // url of the POST API
    JSON.stringify(data), // data you want to pass through the API in JSON format
    {
      headers: {
        "Content-Type": "application/json", // telling the API you are sending JSON data
      },
    }
  );
  return response.data;
};

export const signUpUser = async (data) => {
  const response = await axios.post(
    `${url}/users/signup`, // url of the POST API
    JSON.stringify(data), // data you want to pass through the API in JSON format
    {
      headers: {
        "Content-Type": "application/json", // telling the API you are sending JSON data
      },
    }
  );
  return response.data;
};
