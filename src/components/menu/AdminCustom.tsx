import React, {useEffect, useState} from 'react';
import {ALERT_TIME_MS, API_URL} from '../../constants/config';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faTrash, faUserSlash} from "@fortawesome/free-solid-svg-icons";

type Entry = {
    id: number;
    uuid: string;
    author: string;
    answer: string;
    length: number;
    created_at: string;
    solved: number;
    ip: string;
};

type Props = {
    setSuccessMessage: (message: string) => void;
    onAction: () => void;
}

export const AdminCustom = ({setSuccessMessage, onAction}: Props) => {
    const [customs, setCustoms] = useState<Entry[]>([]);
    const [confirm, setConfirm] = useState<null | {
        type: 'delete' | 'blockUser' | 'blockIp',
        entry: Entry
    }>(null);
    const [reason, setReason] = useState("");

    const fetchCustoms = () => {
        fetch(`${API_URL}/admin/custom`, {credentials: 'include'})
            .then(res => res.json())
            .then(data => setCustoms(data));
    };

    useEffect(() => {
        fetchCustoms();
    }, []);

    const handleDelete = async (id: number, skipConfirm?: boolean, reason?: string) => {
        if (!skipConfirm) return;
        await fetch(`${API_URL}/admin/custom/${id}/delete`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason }),
        });
        fetchCustoms();
        onAction();
        setSuccessMessage(`문제 #${id}이(가) 삭제되었습니다.`);
        setTimeout(() => setSuccessMessage(''), ALERT_TIME_MS);
    };

    const handleBlockUser = async (uuid: string, skipConfirm?: boolean, reason?: string) => {
        if (!skipConfirm) return;
        await fetch(`${API_URL}/admin/block/user/${uuid}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason }),
        });
        onAction();
        setSuccessMessage(`유저 ${uuid}이(가) 차단되었습니다.`);
        setTimeout(() => setSuccessMessage(''), ALERT_TIME_MS);
    };

    const handleBlockIp = async (ip: string, skipConfirm?: boolean, reason?: string) => {
        if (!skipConfirm) return;
        await fetch(`${API_URL}/admin/block/ip`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ ip, reason }),
        });
        onAction();
        setSuccessMessage(`IP ${ip}이(가) 차단되었습니다.`);
        setTimeout(() => setSuccessMessage(''), ALERT_TIME_MS);
    };

    const buttonStyle = "inline-flex items-center justify-center w-8 h-8 border rounded hover:bg-gray-100 transition";

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">모두의 뉴들</h2>
            {confirm && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-xs w-full">
                        <div className="mb-4 font-bold text-center">
                            {confirm.type === 'delete' && '정말로 이 문제를 삭제하시겠습니까?'}
                            {confirm.type === 'blockUser' && '정말로 이 유저를 차단하시겠습니까?'}
                            {confirm.type === 'blockIp' && '정말로 이 IP를 차단하시겠습니까?'}
                        </div>
                        {(confirm.type !== 'delete' || true) && (
                            <input
                                type="text"
                                className="w-full border p-2 rounded mb-4"
                                placeholder="사유를 입력하세요"
                                value={reason}
                                onChange={e => setReason(e.target.value)}
                                autoFocus
                            />
                        )}
                        <div className="flex justify-center gap-3">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => { setConfirm(null); setReason(""); }}
                            >아니오</button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                disabled={(confirm.type !== 'delete') && !reason.trim()}
                                onClick={async () => {
                                    if (confirm.type === 'delete')
                                        await handleDelete(confirm.entry.id, true, reason);
                                    if (confirm.type === 'blockUser')
                                        await handleBlockUser(confirm.entry.uuid, true, reason);
                                    if (confirm.type === 'blockIp')
                                        await handleBlockIp(confirm.entry.ip, true, reason);
                                    setConfirm(null);
                                    setReason('');
                                }}
                            >예</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="border border-gray-300 rounded-xl overflow-hidden">
                <table className="w-full table-fixed">
                    <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2 border w-12 text-center">ID</th>
                        <th className="p-2 border w-72">제작자</th>
                        <th className="p-2 border w-72">정답</th>
                        <th className="p-2 border w-12 text-center">길이</th>
                        <th className="p-2 border w-12 text-center">풀이</th>
                        <th className="p-2 border w-28 text-center">생성일</th>
                        <th className="p-2 border w-40 text-center"></th>
                    </tr>
                    </thead>
                </table>

                <div className="max-h-96 overflow-y-auto">
                    <table className="w-full table-fixed">
                        <tbody>
                        {customs.map((entry, idx) => (
                            <tr key={entry.id} className={`border-t ${idx % 2 === 1 ? 'bg-gray-50' : ''}`}>
                                <td className="p-2 border w-12 text-center">{entry.id}</td>
                                <td className="p-2 border w-72">{entry.author}</td>
                                <td className="p-2 border w-72">{entry.answer}</td>
                                <td className="p-2 border w-12 text-center">{entry.length}</td>
                                <td className="p-2 border w-12 text-center">{entry.solved}</td>
                                <td className="p-2 border w-28 text-center">
                                    {new Date(entry.created_at).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })}
                                </td>
                                <td className="p-2 border w-40 text-center space-x-2">
                                    <button
                                        className={`${buttonStyle} text-red-600 border-red-300`}
                                        onClick={() => setConfirm({type: 'delete', entry})}
                                        title="삭제"
                                    >
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                    <button
                                        className={`${buttonStyle} border-gray-300`}
                                        onClick={() => setConfirm({type: 'blockUser', entry})}
                                        title="유저 차단"
                                    >
                                        <FontAwesomeIcon icon={faUserSlash}/>
                                    </button>
                                    <button
                                        className={`${buttonStyle} border-gray-300`}
                                        onClick={() => setConfirm({type: 'blockIp', entry})}
                                        title="IP 차단"
                                    >
                                        <FontAwesomeIcon icon={faBan}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};