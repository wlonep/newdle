import React from "react";

export const Loading: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[300px]">
            <div className="w-16 h-16 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="mt-6 text-gray-700 text-lg font-medium">불러오는 중...</div>
        </div>
    );
}