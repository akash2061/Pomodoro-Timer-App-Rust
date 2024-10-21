import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

const Timer = () => {
    const [timeLeft, setTimeLeft] = useState(1500); // Default to 25 minutes
    const [inputMinutes, setInputMinutes] = useState('');

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

    const handleSetTimer = () => {
        const minutes = parseInt(inputMinutes, 10);
        if (!isNaN(minutes) && minutes > 0) {
            setTimeLeft(minutes * 60);
            setInputMinutes('');
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-screen bg-[#000000c0] backdrop-blur-sm bg-opacity-50 text-white overflow-hidden">
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <h1 className="text-4xl font-bold mb-6">Pomodoro Timer</h1>
                <div className="text-6xl font-mono mb-8">{formatTime(timeLeft)}</div>
                <div className="mb-4">
                    <input
                        type="number"
                        value={inputMinutes}
                        onChange={(e) => setInputMinutes(e.target.value)}
                        className="px-4 py-2 text-black rounded"
                        placeholder="Set timer (minutes)"
                    />
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
                        onClick={handleSetTimer}
                    >
                        Set Timer
                    </button>
                </div>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => setTimeLeft(1500)} // Reset the timer
                >
                    Reset Timer
                </button>
            </div>
        </div>
    );
};

export default Timer;
