import {KeyValue} from '../../lib/keyboard'
import {Key} from './Key'
import {useEffect} from 'react'
import {ORTHOGRAPHY} from '../../constants/orthography'
import {CharStatus, GuessInfo} from "../../constants/types";

type Props = {
    onChar: (value: string) => void
    onDelete: () => void
    onEnter: () => void
    guesses?: GuessInfo[]
}

const letters = {
    'Q': 'ㅂ',
    'W': 'ㅈ',
    'E': 'ㄷ',
    'R': 'ㄱ',
    'T': 'ㅅ',
    'Y': 'ㅛ',
    'U': 'ㅕ',
    'I': 'ㅑ',
    'A': 'ㅁ',
    'S': 'ㄴ',
    'D': 'ㅇ',
    'F': 'ㄹ',
    'G': 'ㅎ',
    'H': 'ㅗ',
    'J': 'ㅓ',
    'K': 'ㅏ',
    'L': 'ㅣ',
    'Z': 'ㅋ',
    'X': 'ㅌ',
    'C': 'ㅊ',
    'V': 'ㅍ',
    'B': 'ㅠ',
    'N': 'ㅜ',
    'M': 'ㅡ',
}

export const Keyboard = ({onChar, onDelete, onEnter, guesses}: Props) => {
    let charStatuses: { [key: string]: CharStatus } = {}
    if (guesses) {
        guesses.forEach((guess) => {
            guess.jamo_key.split('').forEach((jamo, i) => {
                charStatuses[jamo] = guess.statuses[i]
            })
        })
    }

    const onClick = (value: KeyValue) => {
        if (value === 'ENTER') {
            onEnter()
        } else if (value === 'DELETE') {
            onDelete()
        } else {
            onChar(value)
        }
    }

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement
            if (target.tagName === 'INPUT' || target.isContentEditable) return

            if (e.code === 'Enter') {
                onEnter()
                return
            }
            if (e.code === 'Backspace' || e.code === 'Delete') {
                e.preventDefault()
                onDelete()
                return
            }

            const key = e.key.toUpperCase()
            if (e.shiftKey) {
                switch (key) {
                    case 'Q':
                        return onChar('ㅃ')
                    case 'W':
                        return onChar('ㅉ')
                    case 'E':
                        return onChar('ㄸ')
                    case 'R':
                        return onChar('ㄲ')
                    case 'T':
                        return onChar('ㅆ')
                    case 'O':
                        return onChar('ㅒ')
                    case 'P':
                        return onChar('ㅖ')
                }
            }

            if (key === 'O') return onChar('ㅐ')
            if (key === 'P') return onChar('ㅔ')

            if (
                key in letters &&
                key.length === 1 &&
                key >= 'A' &&
                key <= 'Z'
            ) {
                onChar(letters[key as keyof typeof letters])
            }
        }
        window.addEventListener('keydown', listener)
        return () => {
            window.removeEventListener('keydown', listener)
        }
    }, [onEnter, onDelete, onChar])

    return (
        <div>
            <div className="flex justify-center mb-1 px-1">
                {ORTHOGRAPHY.slice(0, 8).map((char) => (
                    <Key
                        key={char}
                        value={char}
                        onClick={onClick}
                        status={charStatuses[char]}
                    />
                ))}
            </div>
            <div className="flex justify-center mb-1 px-1">
                {ORTHOGRAPHY.slice(8, 17).map((char) => (
                    <Key
                        key={char}
                        value={char}
                        onClick={onClick}
                        status={charStatuses[char]}
                    />
                ))}
            </div>
            <div className="flex justify-center px-1">
                <Key key="enterKey" width={65.4} value="ENTER" onClick={onClick}>입력</Key>
                {ORTHOGRAPHY.slice(17, 24).map((char) => (
                    <Key
                        key={char}
                        value={char}
                        onClick={onClick}
                        status={charStatuses[char]}
                    />
                ))}
                <Key key="deleteKey" width={65.4} value="DELETE" onClick={onClick}>삭제
                </Key>
            </div>
        </div>
    )
}
