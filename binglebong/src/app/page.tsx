
"use client";
import { useEffect, useState } from "react";
import Thermometer from "./components/Thermometer";
import Hydromometer from "./components/Hydrometer";

interface SensorData {
  temperature: number,
  humidity: number
}

export default function Home() {
    const [messages, setMessages] = useState<SensorData[]>([]);

    useEffect(() => {
        const eventSource = new EventSource("/api/livedata");

        eventSource.onmessage = (event) => {
            setMessages((prev) => [...prev, JSON.parse(event.data)]);
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
      <div className="gauges">
        <Thermometer value={messages[messages.length - 1]?.temperature || 0} />
        <Hydromometer value={messages[messages.length - 1]?.humidity || 0} />
      </div>
    );
}
