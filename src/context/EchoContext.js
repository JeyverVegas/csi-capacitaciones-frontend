import { createContext, useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import env from "../util/env";
import { useAuth } from "./AuthContext";

const EchoContext = createContext(null);

window.Pusher = Pusher;

export const EchoProvider = ({ children }) => {
    const { token } = useAuth();

    const [echo, setEcho] = useState(null);

    useEffect(() => {
        if (token) {
            setEcho(new Echo({
                broadcaster: 'pusher',
                key: env('PUSHER_APP_KEY'),
                cluster: env('PUSHER_CLUSTER'),
                forceTLS: true,
                channelAuthorization: {
                    endpoint: `${env('API_URL')}broadcasting/auth`,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    }
                },
            }))
        }
    }, [token]);

    return <EchoContext.Provider value={echo}>
        {children}
    </EchoContext.Provider>
}

export const useEcho = () => useContext(EchoContext);