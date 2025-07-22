import React, {useState, useEffect, useRef} from 'react'
import {Alert} from '../components/alerts/Alert'
import {Grid} from '../components/grid/Grid'
import {Keyboard} from '../components/keyboard/Keyboard'
import {AboutModal} from '../components/modals/AboutModal'
import {InfoModal} from '../components/modals/InfoModal'
import {StatsModal} from '../components/modals/StatsModal'
import {loadStats} from '../lib/stats'
import {
    loadGameStateFromLocalStorage,
    saveGameStateToLocalStorage,
} from '../lib/localStorage'

import {useLocation} from "react-router-dom";
import {GamePath, GuessInfo, PageProps} from "../constants/types";
import {Definition} from "../components/alerts/Definition";
import {createKeyboardMap} from "../lib/keyboard";
import {gameClear, setFailAlert} from "../lib/game";
import {ensureUUID, useTutorialModal} from "../lib/hooks";
import {ALERT_TIME_MS, API_URL} from "../constants/config";

export const gameConfig: Record<GamePath, { title: string; tries: number; wordLength: number }> = {
    'normal': {title: '뉴들', tries: 6, wordLength: 6},
    'long': {title: '뉴우우우우들', tries: 6, wordLength: 12},
    'short': {title: '뉻', tries: 6, wordLength: 4}
}

const Main = (
    {
        isInfoModalOpen, isStatsModalOpen, failMessage,
        setIsInfoModalOpen, setIsStatsModalOpen, setFailMessage,
        setTitle
    }: PageProps) => {
    const location = useLocation()
    const tempPath = location.pathname.replace('/', '')
    const path = tempPath === '' ? 'normal' : tempPath as GamePath
    const statsTimerRef = useRef<NodeJS.Timeout | null>(null)
    const [currentGuess, setCurrentGuess] = useState<Array<string>>([])
    const [isGameWon, setIsGameWon] = useState(false)
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
    const [isGameLost, setIsGameLost] = useState(false)
    const [successAlert, setSuccessAlert] = useState('')
    const [guesses, setGuesses] = useState<GuessInfo[]>([])
    const [stats, setStats] = useState(() => loadStats(path))
    const [date, setDate] = useState<string>("")
    const [wordList, setWordList] = useState<string[]>([])
    const [solution, setSolution] = useState<string | null>(localStorage.getItem(`solution-${path}`))
    const [rank, setRank] = useState<number>(0);
    const [isGameFinished, setIsGameFinished] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false)

    useTutorialModal(setIsInfoModalOpen)

    useEffect(() => {
        setCurrentGuess([])
        setSuccessAlert('')
        setIsGameLost(false)
        setStats(loadStats(path))
        setSolution(localStorage.getItem(`solution-${path}`))
        setTitle(getGameConfig(path).title)

        const fetchDate = async () => {
            const res = await fetch(`${API_URL}/time`);
            if (!res.ok)
                return setFailMessage('서버 동기화에 실패했습니다.\n잠시 후 다시 시도해 주세요.')
            setDate(await res.text());
        }
        fetchDate().catch(console.error)
    }, [path, setTitle])

    useEffect(() => {
        if (!date) return

        const fetchData = async () => {
            const res = await fetch(`${API_URL}/list/${path}`);
            if (!res.ok)
                return setFailMessage('단어 목록을 받아오는 데 실패했습니다.\n잠시 후 다시 시도해 주세요.')
            setWordList(await res.json())
        }
        fetchData().catch(console.error)
    }, [path, date])

    useEffect(() => {
        if (!date) return

        const loaded = loadGameStateFromLocalStorage(path)

        if (loaded?.time !== date) {
            setGuesses([])
            setIsGameWon(false)
            setIsGameLost(false)
            setIsGameFinished(false)
            setRank(0)
        } else {
            setGuesses(loaded.guesses)
            setRank(loaded.rank)
            const gameWasWon = loaded.guesses.some(guess => guess.correct)
            setIsGameWon(gameWasWon)
            if (loaded.guesses.length === getGameConfig(path).tries && !gameWasWon)
                setIsGameLost(true)
        }
    }, [path, date])

    function getGameConfig(pathname: string) {
        return gameConfig[pathname as keyof typeof gameConfig]
    }

    useEffect(() => {
        if (guesses.length === 0) return
        saveGameStateToLocalStorage(path, {guesses, time: date, rank})
    }, [guesses, date, path, rank])

    useEffect(() => {
        if (!isGameWon && !isGameLost) return

        gameClear(isGameWon, setSuccessAlert, isGameLost, setIsGameLost, setIsStatsModalOpen, statsTimerRef, rank)

        setIsGameFinished(true)

        return () => {
            if (statsTimerRef.current) {
                clearTimeout(statsTimerRef.current)
                statsTimerRef.current = null
            }
        }
    }, [isGameWon, isGameLost, rank, setIsStatsModalOpen])

    const keyboardMap = createKeyboardMap(
        'normal',
        guesses, setGuesses, currentGuess, setCurrentGuess,
        isGameWon, isGameLost, setIsGameWon, setIsGameLost,
        wordList, getGameConfig(path).wordLength, getGameConfig(path).tries,
        setIsInvalid, setFailMessage,
        async () => {
            const uuid = await ensureUUID(setFailMessage)
            const body = JSON.stringify({
                answer: currentGuess.join(''),
                uuid,
                last: guesses.length === getGameConfig(path).tries - 1
            })
            const res = await fetch(`${API_URL}/answer/${path}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: body,
            })
            if (!res.ok)
                return setFailAlert(setFailMessage, '정답 확인에 실패했습니다.\n잠시 후 다시 시도해 주세요.')
            const data = await res.json()
            setRank(data.rank)
            return data
        },
        setSolution, stats, setStats, path
    )

    return (
        <>
            <Grid guesses={guesses}
                  currentGuess={
                      currentGuess.length > getGameConfig(path).wordLength
                          ? currentGuess.slice(0, getGameConfig(path).wordLength)
                          : currentGuess
                  }
                  tries={getGameConfig(path).tries}
                  wordLength={getGameConfig(path).wordLength}
                  isInvalid={isInvalid}/>

            <Keyboard {...keyboardMap} guesses={guesses}/>
            <Definition guess={guesses[guesses.length - 1]} isOpen={isGameFinished}/>
            <InfoModal
                isOpen={isInfoModalOpen}
                handleClose={() => setIsInfoModalOpen(false)}
            />
            <StatsModal
                isOpen={isStatsModalOpen}
                handleClose={() => setIsStatsModalOpen(false)}
                guesses={guesses}
                rank={rank}
                gameStats={stats}
                isGameLost={isGameLost}
                isGameWon={isGameWon}
                handleShare={() => {
                    setSuccessAlert('게임 결과가 클립보드에 복사되었습니다.')
                    return setTimeout(() => setSuccessAlert(''), ALERT_TIME_MS)
                }}
                today={date}
                title={getGameConfig(path).title}
            />
            <AboutModal
                isOpen={isAboutModalOpen}
                handleClose={() => setIsAboutModalOpen(false)}
            />

            <button
                type="button"
                className="mx-auto mt-8 flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium
                rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2
                focus:ring-offset-2 focus:ring-indigo-500 select-none"
                onClick={() => setIsAboutModalOpen(true)}
            >이 게임은 뭔가요?
            </button>

            <Alert message={failMessage ?? ''} isOpen={!!failMessage}/>
            <Alert message={`정답은 ${solution}입니다!`} isOpen={isGameLost}/>
            <Alert message={successAlert} isOpen={successAlert !== ''} variant="success"/>
        </>
    )
}

export default Main;
