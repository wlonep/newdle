import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import {decompressFromEncodedURIComponent} from "lz-string";
import {Grid} from "../components/grid/Grid";
import {Keyboard} from "../components/keyboard/Keyboard";
import {InfoModal} from "../components/modals/InfoModal";
import {GuessInfo, PageProps} from "../constants/types";
import {Alert} from "../components/alerts/Alert";
import {loadGameStateFromLocalStorage, saveGameStateToLocalStorage} from "../lib/localStorage";
import {createKeyboardMap} from "../lib/keyboard";
import {gameClear, mapGuess} from "../lib/game";
import {useTutorialModal} from "../lib/hooks";
import {API_URL} from "../constants/config";
import {Loading} from "../components/alerts/Loading";

const Code = ({setTitle, isInfoModalOpen = false, setIsInfoModalOpen = () => {}}: PageProps) => {
    const {encoded} = useParams<{ encoded: string }>()
    const [solution, setSolution] = useState<string>('')
    const [currentGuess, setCurrentGuess] = useState<Array<string>>([])
    const [guesses, setGuesses] = useState<GuessInfo[]>([])
    const [wordList, setWordList] = useState<string[]>([])
    const [failMessage, setFailMessage] = useState<string | null>(null)
    const [isGameLost, setIsGameLost] = useState(false)
    const [isGameWon, setIsGameWon] = useState(false)
    const [successAlert, setSuccessAlert] = useState('')
    const [isInvalid, setIsInvalid] = useState(false)

    useEffect(() => {
        if (!encoded) return

        const decompressed = decompressFromEncodedURIComponent(encoded);

        if (decompressed) {
            try {
                const parsed = JSON.parse(decompressed);
                setSolution(parsed.problem);
                setTitle(`뉴들 - ${parsed.author}`)
            } catch (e) {
                console.error("JSON parsing error:", e);
            }
        }
    }, [encoded, setTitle]);

    useTutorialModal(setIsInfoModalOpen)

    useEffect(() => {
        const loaded = loadGameStateFromLocalStorage(`custom-${encoded}`)
        if (!loaded) return

        setGuesses(loaded.guesses)
        const gameWasWon = loaded.guesses.some(guess => guess.correct)
        setIsGameWon(gameWasWon)
        if (loaded.guesses.length === 6 && !gameWasWon)
            setIsGameLost(true)
    }, [encoded])

    useEffect(() => {
        if (guesses.length === 0) return
        saveGameStateToLocalStorage(`custom-${encoded}`, {guesses, time: '', rank: 0})
    }, [guesses, encoded])

    useEffect(() => {
        if (!solution) return
        const fetchData = async () => {
            const res = await fetch(`${API_URL}/list/${solution.length}`);
            if (!res.ok)
                return setFailMessage('단어 목록을 받아오는 데 실패했습니다.\n잠시 후 다시 시도해 주세요.')
            const list = await res.json()
            list.push(solution)
            setWordList(list)
        }
        fetchData().catch(console.error)
    }, [solution])

    useEffect(() =>
        gameClear(isGameWon, setSuccessAlert, isGameLost, setIsGameLost),
        [isGameWon, isGameLost])

    const keyboardMap = createKeyboardMap(
        'custom',
        guesses, setGuesses, currentGuess, setCurrentGuess,
        isGameWon, isGameLost, setIsGameWon, setIsGameLost,
        wordList, solution.length, 6,
        setIsInvalid, setFailMessage,
        async () => mapGuess(currentGuess, solution)
    )

    if (!solution) return <Loading/>;
    return (
        <>
            <Grid guesses={guesses} currentGuess={currentGuess} tries={6}
                  wordLength={solution.length} isInvalid={isInvalid}/>

            <Keyboard {...keyboardMap} guesses={guesses}/>

            <InfoModal
                isOpen={isInfoModalOpen}
                handleClose={() => setIsInfoModalOpen(false)}
            />

            <Alert message={failMessage ?? ''} isOpen={!!failMessage}/>
            <Alert message={`정답은 "${solution}" 입니다!`} isOpen={isGameLost}/>
            <Alert message={successAlert} isOpen={successAlert !== ''} variant="success"/>
        </>
    )
}
export default Code;