import {GameStats, GuessInfo} from "../constants/types";

type StoredGameState = {
  guesses: GuessInfo[];
  time: string;
  rank: number;
}

export const saveGameStateToLocalStorage = (path: string, gameState: StoredGameState) => {
  localStorage.setItem(`gameState-${path}`, JSON.stringify(gameState))
}

export const loadGameStateFromLocalStorage = (path: string): StoredGameState | null => {

  const state = localStorage.getItem(`gameState-${path}`)
  return state ? (JSON.parse(state) as StoredGameState) : null
}


export const saveStatsToLocalStorage = (path: string, gameStats: GameStats) => {
  localStorage.setItem(`gameStats-${path}`, JSON.stringify(gameStats))
}

export const loadStatsFromLocalStorage = (path: string) => {
  const stats = localStorage.getItem(`gameStats-${path}`)
  return stats ? (JSON.parse(stats) as GameStats) : null
}
