import {GuessInfo} from "../constants/types";
import React from "react";
import {ALERT_TIME_MS} from "../constants/config";

export const gameClear = (
    isGameWon: boolean,
    setSuccessAlert: (s: string) => void,
    isGameLost: boolean,
    setIsGameLost: (s: boolean) => void,
    setIsStatsModalOpen?: (v: boolean) => void,
    statsTimerRef?: React.MutableRefObject<NodeJS.Timeout | null>,
    rank?: number
) => {
    if (!isGameWon && !isGameLost) return;

    if (isGameWon) {
        const WIN_MESSAGES = [
            '정답입니다!',
            '대단한데요?',
            '축하합니다!',
            '잘했어요!',
            '훌륭합니다!',
            '완벽해요!',
        ]
        if (rank) setSuccessAlert(`오늘의 단어를 ${rank}번째로 맞혔습니다!`)
        else setSuccessAlert(WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)])
        setTimeout(() => setSuccessAlert(''), ALERT_TIME_MS)
    }

    if (isGameLost) {
        setIsGameLost(true)
        setTimeout(() => setIsGameLost(false), ALERT_TIME_MS)
    }

    if (setIsStatsModalOpen && statsTimerRef) {
        statsTimerRef.current = setTimeout(() => {
            setIsStatsModalOpen(true)
            statsTimerRef.current = null
        }, ALERT_TIME_MS)
    }
}

export const mapGuess = (currentGuess: Array<string>, solution: string): GuessInfo => {
    const statuses: GuessInfo['statuses'] = new Array(currentGuess.length).fill('absent');
    const solutionArr = solution.split('');
    const used = new Array(solutionArr.length).fill(false);

    for (let i = 0; i < currentGuess.length; i++) {
        if (currentGuess[i] === solutionArr[i]) {
            statuses[i] = 'correct';
            used[i] = true;
        }
    }

    for (let i = 0; i < currentGuess.length; i++) {
        if (statuses[i] === 'correct') continue;

        const idx = solutionArr.findIndex((char, j) =>
            !used[j] && char === currentGuess[i]
        );

        if (idx !== -1) {
            statuses[i] = 'present';
            used[idx] = true;
        }
    }

    const correct = statuses.every(s => s === 'correct');
    return {
        correct, size: 'custom', statuses, jamo_key: currentGuess.join(""), id: 0
    }
}

export const setFailAlert = (setFailMessage: (s: string | null) => void,
                             message: string) => {
    setFailMessage(message)
    setTimeout(() => setFailMessage(null), 2000)
}
