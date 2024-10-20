import React, { useState, useEffect } from 'react';
import { invoke } from "@tauri-apps/api/core";

const Timer = () => {
    const [timeLeft, setTimeLeft] = useState(5); // 25 minutes in seconds

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer); // Cleanup on unmount
        } else {
            invoke('play_bell_sound'); // Play bell sound on completion
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-6">Pomodoro Timer</h1>
            <div className="text-6xl font-mono mb-8">{formatTime(timeLeft)}</div>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setTimeLeft(1500)} // Reset the timer
            >
                Reset Timer
            </button>
        </div>
    );
};

export default Timer;
