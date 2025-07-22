export type GuessInfo = {
    correct: boolean;
    size: string;
    statuses: Array<'correct' | 'present' | 'absent'>;
    jamo_key: string;
    word?: string;
    definition?: string;
    id: number;
    rank?: number;
}

export type GamePath = 'normal' | 'long' | 'short'

export type CharStatus = 'absent' | 'present' | 'correct'

export type GameStats = {
    winDistribution: number[]
    gamesFailed: number
    currentStreak: number
    bestStreak: number
    totalGames: number
    successRate: number
}

export type PageProps = {
    setTitle: (title: string) => void;
    isInfoModalOpen: boolean;
    setIsInfoModalOpen: (isOpen: boolean) => void;
    isStatsModalOpen: boolean;
    setIsStatsModalOpen: (isOpen: boolean) => void;
    failMessage: string | null;
    setFailMessage: (message: string | null) => void;
}

export type CustomData = {
    id: number;
    author: string;
    created_at: Date;
    length: number;
    solved: number;
    problem?: string;
}

