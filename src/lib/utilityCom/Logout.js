"use client"
import React, { useState } from "react";

const Logout = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/login", { method: "GET" });
            const data = await res.json();
            if(data.status === "ok"){
                window.location.replace("/")
            }
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center p-4">
            <button 
                onClick={handleClick}
                disabled={isLoading}
                className={`
                    relative flex items-center space-x-3 
                    bg-gradient-to-r from-red-500 to-pink-600 
                    hover:from-red-600 hover:to-pink-700 
                    disabled:from-gray-500 disabled:to-gray-600 
                    text-white px-6 py-3 rounded-xl 
                    font-semibold text-lg 
                    transition-all duration-300 
                    shadow-2xl hover:shadow-2xl 
                    transform hover:-translate-y-1 
                    disabled:transform-none 
                    disabled:cursor-not-allowed 
                    border border-red-400/30 
                    hover:border-red-300/50 
                    disabled:border-gray-400/30 
                    min-w-[140px] justify-center
                    group
                `}
            >
                {isLoading ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Logging out...</span>
                    </>
                ) : (
                    <>
                        <span className="group-hover:scale-110 transition-transform">🚪</span>
                        <span>Log Out</span>
                        <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default Logout;