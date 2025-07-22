import {CompletedRow} from './CompletedRow'
import {CurrentRow} from './CurrentRow'
import {EmptyRow} from './EmptyRow'
import {GuessInfo} from "../../constants/types";

type Props = {
    guesses: GuessInfo[]
    currentGuess: string[]
    tries: number
    wordLength: number
    isInvalid: boolean
}

export const Grid = ({guesses, currentGuess, tries, wordLength, isInvalid}: Props) => {
    const empties =
        guesses.length < tries - 1
            ? Array.from(Array(tries - 1 - guesses.length))
            : []

    return (
        <div className="lg:pb-6 pb-3">
            {guesses.map((guess, i) => (
                <CompletedRow key={i} guess={guess} wordLength={wordLength}/>
            ))}
            {guesses.length < tries && <CurrentRow guess={currentGuess} wordLength={wordLength} isInvalid={isInvalid}/>}
            {empties.map((_, i) => (
                <EmptyRow key={i} wordLength={wordLength}/>
            ))}
        </div>
    )
}
