import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center gap-6">
            <h1 className="text-7xl font-extrabold text-rose-500 drop-shadow-lg">404</h1>
            <p className="text-2xl font-semibold text-gray-800">
                페이지를 찾을 수 없습니다
            </p>
            <p className="text-base text-gray-500 max-w-md">
                요청하신 주소가 잘못되었거나, 더 이상 존재하지 않는 페이지입니다.
            </p>
            <Link
                to="/"
                className="mt-4 px-6 py-3 text-white text-lg bg-rose-500 hover:bg-rose-600 transition rounded-md shadow-md"
            >
                홈으로 돌아가기
            </Link>
        </div>
    );
};

