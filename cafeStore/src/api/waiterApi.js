import axios from "axios";


const apiUrl = import.meta.env.VITE_API_URL;
const BASE_URL = `${apiUrl}/api`;

export const loginWaiter = async (phoneNumber,password) => {
    const res = await axios.post(
        `${BASE_URL}/waiter/login`,{phoneNumber,password} );
    return res;
};

export const logoutWaiter = async (id) => {
    const res = await axios.post(
        `${BASE_URL}/waiter/logout/${id}` );
    return res.data;
};

export const updateWaiterPassword = async (id,oldPassword,newPassword) => {
    try {
        await axios.put(
        `${BASE_URL}/waiter/update-password/${id}`,{oldPassword,newPassword} );
    
    } catch (error) {
       
        alert(error.response.data.error);
        
    }
    
};




