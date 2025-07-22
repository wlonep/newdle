import {Cell} from './Cell'

type Props = {
  guess: string[]
  wordLength: number
  isInvalid: boolean
}

export const CurrentRow = ({guess, wordLength, isInvalid}: Props) => {
  const splitGuess = guess
  const emptyCells = Array.from(Array(wordLength - splitGuess.length))

  return (
      <div className="flex justify-center mb-1 px-2">
        {splitGuess.map((letter, i) => (
            <Cell key={i} value={letter} isInvalid={isInvalid} wordLength={wordLength}/>
        ))}
        {emptyCells.map((_, i) => (
            <Cell key={i} wordLength={wordLength}/>
        ))}
      </div>
  )
}
