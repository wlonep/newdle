import {GuessInfo} from "../constants/types";

export const shareStatus = (title: string, guesses: GuessInfo[], lost: boolean, rank: number) => {
    let titleText = `${title}#${guesses[0].id} [${lost ? 'X' : guesses.length} / 6]`
    if (rank > 0) {
        titleText += ` (${rank}위)`
    }

    navigator.clipboard.writeText(
        `${titleText}\n\n` +
        generateEmojiGrid(guesses) + '\n\n' +
        window.location.href.replace(`${window.location.protocol}//`, '')
    ).then()
}

export const generateEmojiGrid = (guesses: GuessInfo[]) => {
    return guesses
        .map((guess) => {
            return guess.statuses.map((letter, _) => {
                switch (letter) {
                    case 'correct':
                        return '🟩'
                    case 'present':
                        return '🟨'
                    default:
                        return '⬜'
                }
            })
                .join('')
        })
        .join('\n')
}
