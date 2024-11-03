import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { toast } from 'sonner';

const Timer = () => {
    const [timeLeft, setTimeLeft] = useState(5); // Testing == 5seconds
    const [inputHours, setInputHours] = useState('');
    const [inputMinutes, setInputMinutes] = useState('');
    const [timerName, setTimerName] = useState('Pomodoro Timer');
    const [isEditingName, setIsEditingName] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            if (timerName !== 'Pomodoro Timer') {
                toast.success(`${timerName} is done!`, {
                    duration: 3000
                });
            } else {
                toast.success('Time to take a break!', {
                    duration: 3000
                });
            }
            invoke('bring_window_to_front');
            invoke('play_bell_sound');
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        }

        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleSetTimer = () => {
        const hours = parseInt(inputHours, 10) || 0;
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

    const handleNameChange = (e) => {
        const newName = e.target.value;
        if (newName.length <= 30) {
            setTimerName(newName);
        }
    };

    const handleBlur = () => {
        if (timerName.trim() === '') {
            setTimerName('Pomodoro Timer');
        }
        setIsEditingName(false);
    };

    const handleHoursChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setInputHours(value);
    };

    const handleMinutesChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setInputMinutes(Math.min(59, Math.max(0, parseInt(value) || 0)).toString());
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-[18rem] text-white overflow-hidden bg-[#202225] opacity-[0.95] rounded-2xl mt-1">
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                {/* Editable Timer Name */}
                {isEditingName ? (
                    <input
                        type="text"
                        value={timerName}
                        onChange={handleNameChange}
                        onBlur={handleBlur}
                        autoFocus
                        maxLength={30}
                        className="bg-transparent text-4xl font-bold mb-6 border-b-2 border-gray-300 text-center outline-none focus:outline-none"
                    />
                ) : (
                    <h1
                        className="text-4xl font-bold mb-6 border-b-2 border-transparent hover:border-gray-300"
                        onClick={() => setIsEditingName(true)}
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
                        inputMode="numeric"
                    />

                    {/* Minutes Input */}
                    <input
                        type="text"
                        value={inputMinutes}
                        onChange={handleMinutesChange}
                        className="px-2 py-2 w-20 text-black rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-150"
                        placeholder="Minutes"
                        inputMode="numeric"
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
                    onClick={() => setTimeLeft(1500)}
                >
                    Reset Timer
                </button>
            </div>
        </div>
    );
};

export default Timer;
