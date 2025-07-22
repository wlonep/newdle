import React, {useEffect, useState} from 'react';
import {API_URL} from '../../constants/config';
import {Loading} from "../alerts/Loading";

export const AdminToday = () => {
    const [today, setToday] = useState<{
        short: Entry,
        normal: Entry,
        long: Entry
    } | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/admin/today`, {credentials: 'include'})
            .then(res => res.json())
            .then(data => setToday(data));
    }, []);

    if (!today) return <Loading/>;

    const cardStyle = "rounded-2xl border p-6 shadow-sm bg-white flex flex-col gap-2 hover:shadow-md transition";

    const renderCard = (label: string, entry: Entry) => (
        <div className={cardStyle} key={label}>
            <div className="text-xs text-gray-400 tracking-wide uppercase">{label}</div>
            <div className="text-2xl font-bold text-gray-800">{entry.word}</div>
            <div className="text-sm text-gray-600">{entry.definition}</div>
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">오늘의 단어 <span className="text-sm text-gray-400 ml-2">#{today.normal.id}</span></h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderCard('뉴들', today.normal)}
                {renderCard('뉴우우우우들', today.long)}
                {renderCard('뉻', today.short)}
            </div>
        </div>
    );
};

type Entry = {
    word: string;
    definition: string;
    jamo_key: string;
    id: number;
};
