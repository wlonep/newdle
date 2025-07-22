import React, {useEffect, useState} from "react";
import {GuessInfo, PageProps, CustomData} from "../constants/types";
import {loadGameStateFromLocalStorage, saveGameStateToLocalStorage} from "../lib/localStorage";
import {createKeyboardMap} from "../lib/keyboard";
import {Grid} from "../components/grid/Grid";
import {Keyboard} from "../components/keyboard/Keyboard";
import {InfoModal} from "../components/modals/InfoModal";
import {Alert} from "../components/alerts/Alert";
import {useParams} from "react-router-dom";
import {decompressFromEncodedURIComponent} from "lz-string";
import {gameClear, mapGuess, setFailAlert} from "../lib/game";
import {Loading} from "../components/alerts/Loading";
import {ensureUUID, useTutorialModal} from "../lib/hooks";
import {ALERT_TIME_MS, API_URL} from "../constants/config";


export const Id = ({setTitle, isInfoModalOpen, setIsInfoModalOpen, failMessage, setFailMessage}: PageProps) => {
    const {id} = useParams<{ id: string }>()
    const [currentGuess, setCurrentGuess] = useState<Array<string>>([])
    const [guesses, setGuesses] = useState<GuessInfo[]>([])
    const [wordList, setWordList] = useState<string[]>([])
    const [data, setData] = useState<CustomData | null>(null)
    const [solution, setSolution] = useState<string | null>(null)
    const [isGameWon, setIsGameWon] = useState(false)
    const [isGameLost, setIsGameLost] = useState(false)
    const [successAlert, setSuccessAlert] = useState('')
    const [isInvalid, setIsInvalid] = useState(false)
    const [isFirstTime, setIsFirstTime] = useState(false)
    const [rank, setRank] = useState<number>(0);

    useTutorialModal(setIsInfoModalOpen)

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${API_URL}/custom/${id}`)
            if (!res.ok)
                return setFailMessage('문제 정보를 받아오는 데 실패했습니다.\n잠시 후 다시 시도해 주세요.')
            setData(await res.json())
        }
        fetchData().catch(console.error)

        const loaded = loadGameStateFromLocalStorage(`custom-${id}`)
        if (!loaded) {
            setIsFirstTime(true)
            return
        }

        setGuesses(loaded.guesses)
        const gameWasWon = loaded.guesses.some(guess => guess.correct)
        setIsGameWon(gameWasWon)
        if (loaded.guesses.length === 6 && !gameWasWon)
            setIsGameLost(true)
    }, [id])

    useEffect(() => {
        if (guesses.length === 0) return
        saveGameStateToLocalStorage(`custom-${id}`, {guesses, time: '', rank})
    }, [guesses, id, rank])

    useEffect(() => {
        if (!data?.problem) return
        setTitle(`뉴들 - ${data.author}`)

        const decompressed = decompressFromEncodedURIComponent(data.problem)
        setSolution(decompressed)

        const fetchData = async () => {
            const res = await fetch(`${API_URL}/list/${data.length}`);
            if (!res.ok)
                return setFailMessage('단어 목록을 받아오는 데 실패했습니다.\n잠시 후 다시 시도해 주세요.')
            const list = await res.json()
            list.push(decompressed)
            setWordList(list)
        }
        fetchData().catch(console.error)
    }, [data, setTitle])

    useEffect(() => {
        if (!isGameWon) return

        const register = async () => {
            if (isFirstTime) {
                const uuid = await ensureUUID(setFailMessage)
                if (!uuid) return

                const postRes = await fetch(`${API_URL}/custom/solved`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id, uuid, guesses: guesses.map((g) => g.jamo_key)})
                })

                if (postRes.status === 403)
                    return setFailAlert(setFailMessage, '문제 풀이 횟수 반영이 제한된 사용자입니다.')
                else if (postRes.status === 422)
                    return setFailAlert(setFailMessage, '정답이 일치하지 않습니다.')
                else if (postRes.status === 208)
                    return setFailAlert(setFailMessage, '이미 동일한 IP로 풀었던 기록이 존재합니다.')
                else if (!postRes.ok)
                    return setFailAlert(setFailMessage, '문제 풀이 횟수 반영에 실패했습니다.\n잠시 후 다시 시도해 주세요.')

                const resData = await postRes.json()
                setIsFirstTime(false)
                setRank(resData.rank)
                setSuccessAlert(`이 문제를 ${resData.rank}번째로 맞혔습니다!`)
                return setTimeout(() => setSuccessAlert(''), ALERT_TIME_MS)
            }
            gameClear(isGameWon, setSuccessAlert, isGameLost, setIsGameLost)
        }
        register().catch(console.error)
    }, [isGameWon, isGameLost, guesses, id, isFirstTime, setFailMessage])

    if (!data || !solution) return (
        <>
            <Loading/>
            <Alert message={failMessage ?? ''} isOpen={!!failMessage}/>
        </>)
    const keyboardMap = createKeyboardMap(
        'custom',
        guesses, setGuesses, currentGuess, setCurrentGuess,
        isGameWon, isGameLost, setIsGameWon, setIsGameLost,
        wordList, data.length, 6,
        setIsInvalid, setFailMessage,
        async () => mapGuess(currentGuess, solution)
    )

    return (
        <>
            <Grid guesses={guesses} currentGuess={currentGuess} tries={6}
                  wordLength={data.length} isInvalid={isInvalid}/>

            <Keyboard {...keyboardMap} guesses={guesses}/>

            <InfoModal
                isOpen={isInfoModalOpen}
                handleClose={() => setIsInfoModalOpen(false)}
            />

            <Alert message={`정답은 "${solution}" 입니다!`} isOpen={isGameLost}/>
            <Alert message={successAlert} isOpen={successAlert !== ''} variant="success"/>
            <Alert message={failMessage ?? ''} isOpen={!!failMessage}/>
        </>
    )
}