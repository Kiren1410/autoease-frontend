import axios from "axios";

import { url } from "./data";

export const getCategories = async () => {
  try {
    const res = await axios.get(`${url}/categories`);
    return res.data;
  } catch (e) {
    console.log(e);
  }
};

//add
export const addCategory = async (data) => {
  const res = await axios.post(`${url}/categories`, JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};

//update
export const updateCategory = async (data) => {
  const res = await axios.put(
    `${url}/categories/${data.id}`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    }
  );
  return res.data;
};

//delete
export const deleteCategory = async (data) => {
  const res = await axios.delete(`${url}/categories/${data._id}`, {
    headers: {
      Authorization: "Bearer " + data.token,
    },
  });
  return res.data;
};
