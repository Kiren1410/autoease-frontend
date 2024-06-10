export function addToDetails(vehicle) {
  let detail = JSON.parse(localStorage.getItem("details"));
  if (!detail) detail = [];
  const detailItemIndex = detail.findIndex((i) => i._id === vehicle._id);
  if (detailItemIndex === -1) {
    detail.push({ ...vehicle, quantity: 1 });
  } else {
    detail[detailItemIndex].quantity++; // plus one
  }
  localStorage.setItem("detail", JSON.stringify(detail));
}

export function getDetail() {
  const detail = JSON.parse(localStorage.getItem("detail"));
  return detail ? detail : [];
}

export function removeVehicleFromDetail(_id) {
  const detail = JSON.parse(localStorage.getItem("detail"));
  const updatedDetail = detail.filter((p) => p._id !== _id);
  localStorage.setItem("detail", JSON.stringify(updatedDetail));
}

export function emptyDetail() {
  localStorage.removeItem("detail");
}
