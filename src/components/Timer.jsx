import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

const Timer = () => {
    const [timeLeft, setTimeLeft] = useState(5); // Default to 25 minutes
    const [inputHours, setInputHours] = useState(''); // Input for hours
    const [inputMinutes, setInputMinutes] = useState(''); // Input for minutes
    const [timerName, setTimerName] = useState('Pomodoro Timer'); // Default timer name
    const [isEditingName, setIsEditingName] = useState(false); // Track if the name is being edited

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
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        // If there are hours, show in HH:MM:SS format
        if (hours > 0) {
            return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        }

        // If no hours, show in MM:SS format
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleSetTimer = () => {
        const hours = parseInt(inputHours, 10) || 0; // Default to 0 if not set
        const minutes = parseInt(inputMinutes, 10) || 0;

        if (minutes >= 0 && minutes < 60) {
            const totalTimeInSeconds = (hours * 3600) + (minutes * 60);
            setTimeLeft(totalTimeInSeconds);
            setInputHours('');
            setInputMinutes('');
        } else {
            alert("Minutes must be between 0 and 59.");
        }
    };

    // Handle the timer name change
    const handleNameChange = (e) => {
        const newName = e.target.value;
        if (newName.length <= 30) { // Limit the name length to 30 characters
            setTimerName(newName);
        }
    };

    // Handle when editing is complete
    const handleBlur = () => {
        // Revert to default name if empty
        if (timerName.trim() === '') {
            setTimerName('Pomodoro Timer');
        }
        setIsEditingName(false);
    };

    // Ensure only numbers are entered in the input fields
    const handleHoursChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters
        setInputHours(value);
    };

    const handleMinutesChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters
        setInputMinutes(Math.min(59, Math.max(0, parseInt(value) || 0)).toString()); // Ensure minutes are within 0-59
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-screen bg-[#000000] bg-opacity-90 text-white overflow-hidden">
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                {/* Editable Timer Name */}
                {isEditingName ? (
                    <input
                        type="text"
                        value={timerName}
                        onChange={handleNameChange}
                        onBlur={handleBlur} // Save on blur
                        autoFocus
                        maxLength={30} // Limit to 30 characters
                        className="bg-transparent text-4xl font-bold mb-6 border-b-2 border-gray-300 text-center outline-none focus:outline-none"
                    />
                ) : (
                    <h1
                        className="text-4xl font-bold mb-6 border-b-2 border-transparent hover:border-gray-300"
                        onClick={() => setIsEditingName(true)} // Edit on click
                    >
                        {timerName}
                    </h1>
                )}

                <div className="text-6xl font-mono mb-8 transition-transform transform ease-in-out duration-200">
                    {formatTime(timeLeft)}
                </div>

                <div className="mb-4 flex items-center space-x-2">
                    {/* Hours Input */}
                    <input
                        type="text"
                        value={inputHours}
                        onChange={handleHoursChange}
                        className="px-2 py-2 w-20 text-black rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-150"
                        placeholder="Hours"
                        inputMode="numeric" // Ensure numeric keyboard on mobile
                    />

                    {/* Minutes Input */}
                    <input
                        type="text"
                        value={inputMinutes}
                        onChange={handleMinutesChange}
                        className="px-2 py-2 w-20 text-black rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-150"
                        placeholder="Minutes"
                        inputMode="numeric" // Ensure numeric keyboard on mobile
                    />

                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-300"
                        onClick={handleSetTimer}
                    >
                        Set Timer
                    </button>
                </div>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={() => setTimeLeft(1500)} // Reset the timer
                >
                    Reset Timer
                </button>
            </div>
        </div>
    );
};

export default Timer;
