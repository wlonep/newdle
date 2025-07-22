import {MiniCell} from './MiniCell'
import {GuessInfo} from "../../constants/types";

type Props = {
    guess: GuessInfo
}

export const MiniCompletedRow = ({guess}: Props) => {
    return (
        <div className="flex justify-center mb-1">
            {guess.statuses.map((letter, i) => (
                <MiniCell key={i} letter={guess.jamo_key[i]} status={letter}/>
            ))}
        </div>
    )
}
