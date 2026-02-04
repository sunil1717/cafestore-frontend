import { Client } from "@stomp/stompjs";

let client = null; // 🔐 singleton

export const connectWaiterSocket = (waiterId, onMessage) => {

    if (client && client.active) {
        return client; // prevent duplicate connection
    }

    client = new Client({
        brokerURL:`${import.meta.env.VITE_WS_URL}`,
        reconnectDelay: 5000,
        debug: (str) => console.log(str),

        onConnect: () => {
            console.log("✅ WebSocket connected");

            client.subscribe(
                `/topic/waiter/${waiterId}`,
                (message) => {
                    onMessage(JSON.parse(message.body));
                }
            );
        },

        onStompError: (frame) => {
            console.error("❌ STOMP error", frame.headers["message"]);
        }
    });

    client.activate();
    return client;
};

export const disconnectWaiterSocket = () => {
    if (client) {
        client.deactivate();
        client = null;
        console.log("🔌 WebSocket disconnected");
    }
};
