import {CharValue, COMPOUND} from "../constants/orthography";
import {GuessInfo} from "../constants/types";
import React from "react";
import {setFailAlert} from "./game";
import {addStatsForCompletedGame} from "./stats";

export type KeyValue = CharValue | 'ENTER' | 'BACKSPACE'

export const createKeyboardMap = (
    mode: 'custom' | 'normal',
    guesses: GuessInfo[], setGuesses: React.Dispatch<React.SetStateAction<GuessInfo[]>>,
    currentGuess: string[], setCurrentGuess: React.Dispatch<React.SetStateAction<string[]>>,
    isGameWon: boolean, isGameLost: boolean, setIsGameWon: (b: boolean) => void, setIsGameLost: (b: boolean) => void,
    wordList: string[], wordLength: number, tries: number,
    setIsInvalid: (b: boolean) => void, setFailMessage: (s: string | null) => void,
    getData: () => Promise<GuessInfo>,
    setSolution?: (s: string | null) => void, stats?: any, setStats?: (s: any) => void, path?: string,
) => {
    return ({
        onChar: (value: string) => {
            if (guesses.length >= tries || isGameWon) return;

            const toInsert = COMPOUND[value] ?? [value];

            setCurrentGuess(prev => {
                const next = [...prev, ...toInsert].slice(0, wordLength);

                if (next.length === wordLength) {
                    const word = next.join('');
                    setIsInvalid(!wordList.includes(word));
                } else setIsInvalid(false);

                return next;
            });
        },
        onDelete: () => {
            const newGuess = currentGuess.slice(0, -1);
            setCurrentGuess(newGuess);

            if (newGuess.length < wordLength) setIsInvalid(false);
        },
        onEnter: async () => {
            if (isGameWon || isGameLost || guesses.length >= tries) return;
            if (currentGuess.length !== wordLength)
                return setFailAlert(setFailMessage, '글자 수가 부족합니다.')
            if (!wordList.includes(currentGuess.join('')))
                return setFailAlert(setFailMessage, '단어를 찾을 수 없습니다.')

            const data = await getData();
            const correct = data.correct;
            const updated = [...guesses, data];

            setGuesses(updated)
            setCurrentGuess([])

            const isLastTry = correct || guesses.length === tries - 1;
            if (mode === 'normal') {
                if (correct) {
                    setStats?.(addStatsForCompletedGame(stats, guesses.length, path!, tries));
                    setIsGameWon(true);
                } else if (isLastTry) {
                    setStats?.(addStatsForCompletedGame(stats, guesses.length + 1, path!, tries));
                    setIsGameLost(true);
                    if (data.word) {
                        setSolution?.(data.word);
                        localStorage.setItem(`solution-${path}`, data.word);
                    }
                }
            } else if (mode === 'custom') {
                if (correct) setIsGameWon(true);
                else if (isLastTry) setIsGameLost(true);
            }
        }
    })
}

export const createInputMap = (
    current: string[],
    setCurrent: React.Dispatch<React.SetStateAction<string[]>>,
    maxLength: number = 15,
    length: number,
    setLength: React.Dispatch<React.SetStateAction<number>>,
    isCompleted: boolean,
    setCompleted: React.Dispatch<React.SetStateAction<boolean>>,
    setFailMessage: (s: string | null) => void
) => {
    return {
        onChar: (value: string) => {
            if (current.length >= maxLength)
                return setFailAlert(setFailMessage, "글자 수는 15자를 초과할 수 없습니다.");

            if (isCompleted) return;

            const toInsert = COMPOUND[value] ?? [value];

            setCurrent((prev) => {
                const nextLength = prev.length + toInsert.length;
                const shouldExpand = nextLength >= length && length < 15;
                const expandBy = Math.min(toInsert.length, 15 - length);

                if (shouldExpand) {
                    setLength(length + expandBy);
                }

                return [...prev, ...toInsert].slice(0, length + expandBy);
            });
        },
        onDelete: () => {
            if (isCompleted) return;
            setCurrent((prev) => prev.slice(0, -1));
        },
        onEnter: () => {
            if (isCompleted) return;
            if (current.length < 4) return setFailAlert(setFailMessage, "글자 수가 부족합니다.");
            setCompleted(true)
        },
    };
};
