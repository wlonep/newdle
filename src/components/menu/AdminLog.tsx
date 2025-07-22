import React, {useEffect, useState} from 'react';
import {API_URL} from '../../constants/config';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUnlock} from "@fortawesome/free-solid-svg-icons";

type AuditLog = {
    id: number;
    classify: string;
    action: 'deleted' | 'blocked' | 'unblocked' | 'ip-banned' | 'ip-unbanned';
    reason: string;
    by: string;
    created_at: string;
};

type ConfirmState = null | {
    log: AuditLog;
    isIp: boolean;
};

export const AdminLog: React.FC<{ reloadFlag: number }> = ({reloadFlag}) => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [confirm, setConfirm] = useState<ConfirmState>(null);
    const [reason, setReason] = useState("");

    const fetchLogs = async () => {
        await fetch(`${API_URL}/admin/audit-log`, {credentials: 'include'})
            .then(res => res.json())
            .then(setLogs);
    }

    useEffect(() => {
        fetchLogs().catch(console.error)
    }, [reloadFlag]);

    const handleUnblock = async (classify: string, isIp: boolean, reason: string) => {
        if (isIp) {
            await fetch(`${API_URL}/admin/unblock/ip`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({ip: classify, reason}),
            });
        } else {
            await fetch(`${API_URL}/admin/unblock/user/${classify}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({reason}),
            });
        }
        await fetchLogs();
    };

    const isCurrentBlocked = (log: AuditLog) => {
        if (!(log.action === 'blocked' || log.action === 'ip-banned')) return false;
        const relatedLogs = logs.filter(l => l.classify === log.classify);
        if (relatedLogs.length === 0) return false;
        const latest = relatedLogs.reduce((a, b) => (a.id > b.id ? a : b));
        return latest.id === log.id;
    };

    const actionLabel = (action: AuditLog['action']) => {
        let label;
        let color;
        switch (action) {
            case 'deleted':
                label = '삭제';
                color = 'bg-red-500 text-white';
                break;
            case 'blocked':
                label = '차단';
                color = 'bg-blue-500 text-white';
                break;
            case 'unblocked':
                label = '차단 해제';
                color = 'bg-yellow-500 text-white';
                break;
            case 'ip-banned':
                label = 'IP 차단';
                color = 'bg-green-500 text-white';
                break;
            case 'ip-unbanned':
                label = 'IP 차단 해제';
                color = 'bg-gray-400 text-white';
                break;
            default:
                label = action;
                color = 'bg-gray-300 text-black';
        }
        return (
            <span className={`inline-block px-3 py-0.5 rounded-full text-sm font-semibold ${color}`}>
            {label}
        </span>
        );
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">감사 로그</h2>

            {confirm && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-xs w-full">
                        <div className="mb-4 font-bold text-center">
                            {confirm.isIp
                                ? '정말로 이 IP 차단을 해제하시겠습니까?'
                                : '정말로 이 유저 차단을 해제하시겠습니까?'}
                        </div>
                        <input
                            type="text"
                            className="w-full border p-2 rounded mb-4"
                            placeholder="차단 해제 사유를 입력하세요"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            autoFocus
                        />
                        <div className="flex justify-center gap-3">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => {
                                    setConfirm(null);
                                    setReason("");
                                }}
                            >아니오
                            </button>
                            <button
                                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                                disabled={!reason.trim()}
                                onClick={async () => {
                                    await handleUnblock(confirm.log.classify, confirm.isIp, reason);
                                    setConfirm(null);
                                    setReason('');
                                }}
                            >예
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="border border-gray-300 rounded-xl overflow-hidden">
                <div className="max-h-[600px] overflow-y-auto">
                    <table className="w-full table-fixed">
                        <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-2 border w-28 text-center"></th>
                            <th className="p-2 border w-40 text-center">대상</th>
                            <th className="p-2 border w-96">사유</th>
                            <th className="p-2 border w-28 text-center">처리자</th>
                            <th className="p-2 border w-28 text-center">일시</th>
                            <th className="p-2 border w-24 text-center"></th>
                        </tr>
                        </thead>
                    </table>
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full table-fixed">
                            <tbody>
                            {logs.map((log, idx) => (
                                <tr key={log.id} className={idx % 2 === 1 ? 'bg-gray-50' : ''}>
                                    <td className="p-2 border w-28 text-center">{actionLabel(log.action)}</td>
                                    <td className="p-2 border text-center w-40 truncate overflow-hidden whitespace-nowrap"
                                        title={log.classify}>
                                        {log.classify}
                                    </td>
                                    <td className="p-2 border">{log.reason}</td>
                                    <td className="p-2 border w-28 text-center">{log.by}</td>
                                    <td className="p-2 border w-28 text-center">
                                        {new Date(log.created_at).toLocaleDateString('ko-KR', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit'
                                        })}
                                    </td>
                                    <td className="p-2 border w-24 text-center">
                                        {isCurrentBlocked(log) && (
                                            <button
                                                className="inline-flex items-center px-3 py-1 rounded text-xs
                                                bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border
                                                border-emerald-200"
                                                title={log.action === 'blocked' ? "유저 차단 해제" : "IP 차단 해제"}
                                                onClick={() => setConfirm({log, isIp: log.action === 'ip-banned'})}
                                            >
                                                <FontAwesomeIcon icon={faUnlock} className="mr-1"/>
                                                해제
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
