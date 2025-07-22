import {Cell} from "./Cell";

type Props = {
    wordLength: number
    value: string[]
    statuses: boolean
}

export const SingleRowInput = ({wordLength, value, statuses}: Props) => {
    const padded = [...value, ...Array(Math.max(0, wordLength - value.length)).fill('')].slice(0, wordLength)

    return (
        <div className="flex justify-center mb-1">
            {padded.map((char, i) => (
                <Cell
                    wordLength={wordLength}
                    key={i}
                    value={i === wordLength - 1 && wordLength < 15 ? '' : char}
                    extra={i === wordLength - 1 && wordLength < 15}
                    status={statuses ? 'correct' : undefined}
                />
            ))}
        </div>
    )
}