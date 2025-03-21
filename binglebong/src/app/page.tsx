
"use client";
import { useEffect, useState } from "react";

export default function Home() {
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const eventSource = new EventSource("/api/livedata");

        eventSource.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
        };

        eventSource.onerror = () => {
            console.error("SSE connection lost.");
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div>
            <h2>SSE Stream</h2>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
}
