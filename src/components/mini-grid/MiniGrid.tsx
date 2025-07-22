import {MiniCompletedRow} from './MiniCompletedRow'
import {GuessInfo} from "../../constants/types";

type Props = {
    guesses: GuessInfo[]
}

export const MiniGrid = ({guesses}: Props) => {
    return (
        <div className="pb-6">
            {guesses.map((guess, i) => (
                <MiniCompletedRow key={i} guess={guess}/>
            ))}
        </div>
    )
}
