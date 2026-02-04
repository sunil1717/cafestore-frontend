import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: `${apiUrl}/api`,
});


// MENU
export const getMenus = () => API.get("/menu/all");
export const addMenu = (formData) => API.post("/menu/add", formData, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});
export const deleteMenu = (id) => API.delete(`/menu/${id}`);
export const updateMenuAvailability = (id) => API.put(`/menu/${id}/availability`);
export const updateMenuImage=(id,image)=>API.put(`/menu/${id}/image`,image,{
  headers: {
    "Content-Type": "multipart/form-data"
  }
});


// TABLE
export const getTables = () => API.get("/table/all");

export const addTable = (tableNo) => API.post(`/table/generate/${tableNo}`);
export const deleteTable = (id) => API.delete(`/table/delete/${id}`);



// WAITER
export const getWaiters = () => API.get("/waiter/all-waiters");
export const addWaiter = (formData) => API.post("/waiter/add", formData, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});
export const updateWaiterProfilePic =  (id,image) =>  API.put(`/waiter/${id}/profile-pic`, image, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

export const deleteWaiter = (id) => API.delete(`/waiter/${id}`);
