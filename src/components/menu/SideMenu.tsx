import React from "react";
import {Link, useLocation} from "react-router-dom";

type SideMenuProps = {
    isOpen: boolean;
    onClose: () => void;
    setLoginModal: (isOpen: boolean) => void;
};

export const SideMenu = ({isOpen, onClose, setLoginModal}: SideMenuProps) => {
    const location = useLocation();
    const currentPath = location.pathname;

    const menuItems = [
        {to: '/', label: '뉴들'},
        {to: '/long', label: '뉴우우우우들'},
        {to: '/short', label: '뉻'},
        {to: '/custom/list', label: '모두의 뉴들'},
        {to: '/custom/new', label: '나만의 뉴들'},
    ];

    return (
        <div
            id="side-menu"
            className={`fixed top-16 left-0 h-[calc(100%-4rem)] w-full lg:w-80 bg-white shadow-md z-0 transition-all 
             duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="h-full flex flex-col justify-between p-7">
                <ul className="mt-4 text-lg flex flex-col gap-2">
                    {menuItems.map(({to, label}) => {
                        const isActive = currentPath === to;

                        return (
                            <Link to={to} key={to} onClick={onClose}>
                                <li
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-150
                                    ${isActive ? 'bg-rose-50 text-rose-600 font-semibold' :
                                        'text-stone-800 hover:bg-rose-100 hover:text-rose-500'}`}
                                >
                                    {label}
                                </li>
                            </Link>
                        );
                    })}
                </ul>
                <div className="mt-8 text-center">
                    <button
                        onClick={() => setLoginModal(true)}
                        className="w-1/3 py-2 text-white bg-gray-800 rounded hover:bg-gray-700 text-xs"
                    >
                        관리자 로그인
                    </button>
                </div>
            </div>
        </div>
    );
};
