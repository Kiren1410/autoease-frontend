// console.log(process.env.NODE_ENV);
export const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "http://10.1.104.4:5000";
// export const url = "http://10.1.104.4:5000/"
