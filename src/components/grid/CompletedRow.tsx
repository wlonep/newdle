import {Cell} from './Cell'
import {GuessInfo} from "../../constants/types";

type Props = {
    guess: GuessInfo
    wordLength: number
}

export const CompletedRow = ({guess, wordLength}: Props) => {
    return (
        <div className="flex justify-center mb-1 px-2">
            {guess.statuses.map((letter, i) => (
                <Cell key={i} value={guess.jamo_key[i]} status={letter} wordLength={wordLength}/>
            ))}
        </div>
    )
}
