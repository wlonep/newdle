import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faClock, faFont, faSearch, faSort, faSortDown, faSortUp, faTrophy}
    from "@fortawesome/free-solid-svg-icons";
import {Link, useNavigate} from "react-router-dom";
import {Keyboard} from "../components/keyboard/Keyboard";
import {COMPOUND} from "../constants/orthography";
import {Loading} from "../components/alerts/Loading";
import {CustomData, PageProps} from "../constants/types";
import {API_URL} from "../constants/config";
import {Alert} from "../components/alerts/Alert";

export const List = ({setTitle, setFailMessage, failMessage}: PageProps) => {
    const navigate = useNavigate()
    const [data, setData] = useState<CustomData[] | null>(null)
    const [filtered, setFiltered] = useState<CustomData[]>([])
    const [sortBy, setSortBy] = useState<"time" | "solved">("time")
    const [sortAsc, setSortAsc] = useState<boolean>(false)
    const [authorSearch, setAuthorSearch] = useState("")
    const [lengthFilter, setLengthFilter] = useState(3)
    const [keyboardOpen, setKeyboardOpen] = useState(false)

    useEffect(() => {
        setTitle("모두의 뉴들")
        const fetchData = async () => {
            const res = await fetch(`${API_URL}/custom/list`)
            if (!res.ok)
                return setFailMessage("문제 목록을 불러오는 데 실패했습니다.\n잠시 후 다시 시도해주세요.")

            setData(await res.json())
        }
        fetchData().catch(console.error)
    }, [setTitle])

    useEffect(() => {
        if (!data) return

        let result = [...data]
        if (authorSearch.trim()) {
            result = result.filter(item =>
                item.author.includes(authorSearch.trim())
            )
        }

        if (lengthFilter !== 3)
            result = result.filter(item => item.length === lengthFilter)

        if (sortBy === "time") {
            result.sort((a, b) =>
                sortAsc
                    ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )
        } else if (sortBy === "solved") {
            result.sort((a, b) =>
                sortAsc ? a.solved - b.solved : b.solved - a.solved
            )
        }

        setFiltered(result);
    }, [data, sortBy, sortAsc, authorSearch, lengthFilter])

    useEffect(() => {
        if (!keyboardOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            const element = e.target as HTMLElement
            if (element.id === "author-search") return

            const keyboardEl = document.getElementById("keyboard-area")
            if (keyboardEl && !keyboardEl.contains(element)) {
                setKeyboardOpen(false)
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [keyboardOpen]);

    const formatDate = (date: Date | string) => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('ko-KR', {
            timeZone: 'Asia/Seoul',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
    }

    const handleSortClick = (type: "time" | "solved") => {
        if (sortBy === type) setSortAsc(!sortAsc)
        else {
            setSortBy(type);
            setSortAsc(false);
        }
    }

    if (!data) return (
        <>
            <Loading/>
            <Alert message={failMessage ?? ''} isOpen={!!failMessage}/>
        </>)
    return (
        <div className="px-6 lg:py-6 py-0">
            <h2 className="text-2xl font-bold mb-4">
                <FontAwesomeIcon icon={faTrophy} className="text-amber-400 mr-2"/> 문제 선택
            </h2>
            <div className="flex flex-wrap gap-2 mb-5 justify-center lg:justify-start">
                <button
                    onClick={() => handleSortClick("time")}
                    className={`w-28 h-8 flex items-center px-3 rounded-full text-sm font-medium transition-all 
                        ${sortBy === "time" ? sortAsc ? "bg-indigo-700 text-white"
                            : "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-indigo-400 hover:text-white"}`}>
                    <div className="w-4 flex justify-center">
                        <FontAwesomeIcon
                            icon={sortBy === "time" ? (sortAsc ? faSortDown : faSortUp) : faSort}
                            className={`${sortBy === "time" ? "text-white" : "text-gray-400"} text-base`}
                        />
                    </div>
                    <div className="flex-1 text-center">
                        {sortBy === "time" ? (sortAsc ? "오래된순" : "최신순") : "최신순"}
                    </div>
                </button>

                <button
                    onClick={() => handleSortClick("solved")}
                    className={`w-28 h-8 flex items-center px-3 rounded-full text-sm font-medium transition-all
                        ${sortBy === "solved" ? sortAsc ? "bg-green-700 text-white"
                            : "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-green-400 hover:text-white"}`}>
                    <div className="w-4 flex justify-center">
                        <FontAwesomeIcon
                            icon={sortBy === "solved" ? (sortAsc ? faSortDown : faSortUp) : faSort}
                            className={`${sortBy === "solved" ? "text-white" : "text-gray-400"} text-base`}
                        />
                    </div>
                    <div className="flex-1 text-center">
                        {sortBy === "solved" ? (sortAsc ? "풀이 적은순" : "풀이 많은순") : "풀이순"}
                    </div>
                </button>

                <div className="flex items-center ml-5 gap-1 sm:gap-2 text-sm text-gray-700">
                    <label htmlFor="lengthSlider" className="whitespace-nowrap font-bold">글자 수</label>
                    <input
                        type="range"
                        min={3}
                        max={15}
                        step={1}
                        value={lengthFilter}
                        className="accent-rose-500 w-48 cursor-pointer"
                        onChange={(e) => setLengthFilter(Number(e.target.value))}
                    />
                    <span className="text-amber-600 font-bold">{lengthFilter === 3 ? "전체" : `${lengthFilter}자`}</span>
                </div>

                <div className="lg:ml-auto flex items-center gap-2">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-500"/>
                    <input
                        id="author-search"
                        type="text"
                        placeholder="제작자 검색"
                        className="w-52 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        onClick={() => setKeyboardOpen(!keyboardOpen)}
                        readOnly
                        value={authorSearch}
                    />
                </div>
            </div>
            {filtered.length === 0 && (
                <div className="w-full flex flex-col items-center justify-center text-center py-16 text-gray-600">
                    <p className="text-lg mb-4">
                        문제를 찾을 수 없습니다. <br/>
                        <span className="text-black font-semibold">첫 문제를 직접 만들어보는 건 어떠세요?</span>
                    </p>
                    <button
                        className="mt-2 px-5 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                        onClick={() => navigate("/custom/new")}
                    >
                        문제 만들러 가기
                    </button>
                </div>
            )}
            <div className="grid gap-2 xs:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {filtered.map(({id, author, created_at, length, solved}) => (
                    <Link to={`/custom/id/${id}`} key={id}>
                        <div key={id}
                             className="bg-white rounded-2xl shadow-md p-4 hover:scale-105 hover:shadow-xl transition-all cursor-pointer border border-gray-200"
                        >
                            <div className="text-sm text-gray-500 flex items-center gap-0.5">
                                <div className="mr-1">제작자:</div>
                                {author.split("").map((a, i) => {
                                    return <div key={`${id}-${i}`}
                                                className="p-0.5 h-5 sm:p-1 bg-green-500 text-white flex items-center justify-center
                                        text-xs font-bold rounded">{a}
                                    </div>
                                })}
                            </div>
                            <div className="mt-2 font-semibold text-lg">
                                문제 #{id}
                            </div>
                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-700 font-bold">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-500"/>
                                {solved}회
                            </div>
                            <div className="mt-1 text-gray-700 text-sm">
                                <FontAwesomeIcon icon={faFont} className="text-rose-500 mr-2"/>
                                {length}자
                            </div>
                            <div className="mt-1 text-gray-700 text-sm">
                                <FontAwesomeIcon icon={faClock} className="text-sky-500 mr-2"/>
                                {formatDate(created_at)}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <div id="keyboard-area"
                 className="fixed left-0 w-full z-50 ease-in-out transition-all duration-300 bg-white backdrop-blur-sm
                shadow-[0_-4px_20px_rgba(0,0,0,0.1)] h-52 sm:h-56 md:h-60 lg:h-64 scale-100 sm:scale-105 md:scale-110 lg:scale-125 "
                 style={{
                     bottom: keyboardOpen ? '0' : '-320px'
                 }}
            >
                <div className="h-4 w-full"/>
                <div className="bg-transparent">
                    <Keyboard
                        onEnter={() => setKeyboardOpen(false)}
                        onChar={(char) => {
                            if (!keyboardOpen || authorSearch.length >= 15) return
                            const toInsert = COMPOUND[char] ?? [char];
                            setAuthorSearch((prev) => {
                                return [...Array.from(prev), ...toInsert].join("");
                            });
                        }}
                        onDelete={() => setAuthorSearch(prev => prev.slice(0, -1))}
                    />
                </div>
            </div>

        </div>
    );
}