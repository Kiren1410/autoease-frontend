import axios from "axios";

import { url } from "./data";

export const getVehicles = async (category, perPage, page) => {
  let params = {
    perPage: perPage,
    page: page,
  };
  if (category !== "all") params.category = category;
  const query = new URLSearchParams(params);
  const res = await axios.get(`${url}/vehicles?${query.toString()}`);
  return res.data;
};

export const getVehicle = async (id) => {
  // to retrieve product from the API /products/:id
  const res = await axios.get(`${url}/vehicles/${id}`);
  return res.data;
};
export const addVehicle = async (data) => {
  const res = await axios.post(
    `${url}/vehicles`, // url of the POST API
    JSON.stringify(data), // data you want to pass through the API in JSON format\
    {
      headers: {
        "Content-Type": "application/json", // telling the API you are sending JSON data
        Authorization: "Bearer " + data.token, // include token in api
      },
    }
  );
  return res.data;
};
export const updateVehicle = async (data) => {
  const response = await axios.put(
    `${url}/vehicles/${data.id}`, // url of the PUT API
    JSON.stringify(data), // data you want to pass through the API in JSON format
    {
      headers: {
        "Content-Type": "application/json", // telling the API you are sending JSON data
        Authorization: "Bearer " + data.token, // include token in api
      },
    }
  );
  return response.data;
};

export const deleteVehicle = async (data) => {
  const response = await axios.delete(`${url}/vehicles/${data._id}`, {
    headers: {
      Authorization: "Bearer " + data.token, // include token in the API
    },
  });
  return response.data;
};
