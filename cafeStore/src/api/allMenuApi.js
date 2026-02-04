import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const BASE_URL = `${apiUrl}/api`;

export const getallMenu = async () => {
    const res = await axios.get(
        `${BASE_URL}/menu/available` );
    return res.data;
};

export const getmenubyCategory = async (category) => {
    const res = await axios.get(
        `${BASE_URL}/menu/category?category=${category}` );
    return res.data;
};