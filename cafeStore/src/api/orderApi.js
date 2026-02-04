import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const BASE_URL = `${apiUrl}/api`;

export const placeOrder = async (order, latitude, longitude) => {

    try {
        const res = await axios.post(
        `${BASE_URL}/order/place?latitude=${latitude}&longitude=${longitude}`,
       JSON.stringify(order), {
            headers: {
                "Content-Type": "application/json"
            }
    }
    );
    
    return res.data.msg;

    } catch (error) {
        return error.response.data.error;
    }
    
};

export const readyOrder = async (orderId) => {
    const res = await axios.post(
        `${BASE_URL}/order/ready/${orderId}`);
    return res.data;
};

export const servedOrder = async (orderId) => {
    const res = await axios.post(
        `${BASE_URL}/order/served/${orderId}`);
    return res.data;
};



export const getOrderByWaiterId = async (waiterId) => {
    const res = await axios.get(
        `${BASE_URL}/order/waiter-id/${waiterId}`);
    return res.data;
};
export const getTodayOrderByWaiterIdAndStatusServed = async (waiterId) => {
    const res = await axios.get(
        `${BASE_URL}/order/waiter-served/${waiterId}`);
    return res.data;
};



export const getOrderByReady = async (type) => {
    const res = await axios.get(
        `${BASE_URL}/order/by-ready`, type);
    return res.data;
};



export const getTodayOrderByContactInfo = async (phoneNo) => {
    const res = await axios.get(
        `${BASE_URL}/order/today/contact/${phoneNo}`);
    return res.data;
};

export const getTodayOrderByOrderId = async (orderId) => {
    const res = await axios.get(
        `${BASE_URL}/order/today/${orderId}`);
    return res.data;
};


export const getTodayOrderByWaiterIdAndReady = async (waiterId,readyType) => {
    const res = await axios.get(
        `${BASE_URL}/order/today/by-waiter/${waiterId}?readyType=${readyType}`);
    return res.data;
};

export const getTodayOrderByWaiterIdAndReadyAndStatusCreated = async (waiterId,type) => {
    const res = await axios.get(
        `${BASE_URL}/order/today/by-waiter-status/${waiterId}?type=${type}`);
    return res.data;
};
export const getTodayOrderByReady = async (readyType) => {
    const res = await axios.get(
        `${BASE_URL}/order/today/by-ready?readyType=${readyType}`);
    return res.data;
};











export const rateWaiter = async (orderId, rating) => {
    const res = await axios.post(
        `${BASE_URL}/order/rate/waiter/${orderId}?rating=${rating}`);
    return res.data;
};
export const rateMenu = async (orderId, rating) => {
    const res = await axios.post(
        `${BASE_URL}/order/rate/menu/${orderId}?rating=${rating}`);
    return res.data;
};

export const getOrdersByCustomDateRange = async (from, to) => {
    const res = await axios.get(
        `${BASE_URL}/order/by-date?from=${from}&to=${to}`);
    return res.data;
};
export const getOrdersByCustomDateRangeAndWaiterId = async (from, to,id) => {
    const res = await axios.get(
        `${BASE_URL}/order/by-date-waiter?from=${from}&to=${to}&waiterId=${id}`);
    return res.data;
};

export const getAllOrders = async () => {
    const res = await axios.get(
        `${BASE_URL}/order/all`);
    return res.data;
};








