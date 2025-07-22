import React, {useEffect, useRef, useState} from "react";
import {API_URL} from "../../constants/config";
import {setFailAlert} from "../../lib/game";
import {useNavigate} from "react-router-dom";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    setFailMessage: (message: string | null) => void;
    onSucess: () => void
};

export const AdminLoginModal = ({isOpen, onClose, setFailMessage, onSucess}: Props) => {
    const navigate = useNavigate()
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const [checkingAuth, setCheckingAuth] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        setCheckingAuth(true);
        setShowForm(false);

        const check = async () => {
            try {
                const res = await fetch(`${API_URL}/admin/me`, {
                    credentials: 'include',
                })
                if (!res.ok) {
                    return setShowForm(true)
                }
                await res.json()

                onClose()
                onSucess()
                navigate('/panel')
            } catch {
                setShowForm(true)
            } finally {
                setCheckingAuth(false)
            }
        };

        check().catch(console.error)
    }, [isOpen, onClose, navigate, onSucess])

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 ${
                isOpen ? "" : "hidden"
            }`}
            onClick={handleBackdropClick}
        >
            <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6 relative">
                <button
                    className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-4">관리자 로그인</h2>

                {checkingAuth ? (
                    <p className="text-center">로그인 상태 확인 중...</p>
                ) : null}

                {showForm && (
                    <>
                        <input
                            type="text"
                            name="username"
                            autoComplete="username"
                            ref={usernameRef}
                            defaultValue=""
                            placeholder="아이디"
                            className="w-full mb-3 p-2 border rounded"
                        />
                        <input
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            ref={passwordRef}
                            defaultValue=""
                            placeholder="비밀번호"
                            className="w-full mb-4 p-2 border rounded"
                        />
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                                onClick={async () => {
                                    const result = await fetch(`${API_URL}/admin/login`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        credentials: 'include',
                                        body: JSON.stringify({
                                            username: usernameRef.current?.value,
                                            password: passwordRef.current?.value
                                        }),
                                    });

                                    if (!result.ok)
                                        return setFailAlert(setFailMessage, '로그인에 실패했습니다.');

                                    const authRes = await fetch(`${API_URL}/admin/me`, {
                                        credentials: 'include',
                                    });
                                    if (!authRes.ok)
                                        return setFailAlert(setFailMessage, '로그인 확인 실패');

                                    onClose()
                                    onSucess()
                                    navigate('/panel')
                                }}
                            >
                                로그인
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
