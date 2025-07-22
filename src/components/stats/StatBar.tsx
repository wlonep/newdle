import {GameStats} from "../../constants/types";

type Props = {
    gameStats: GameStats
}

const StatItem = ({label, value}: {
    label: string
    value: string | number
}) => {
    return (
        <div className="items-center justify-center m-1 w-1/4">
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-xs">{label}</div>
        </div>
    )
}

export const StatBar = ({gameStats}: Props) => {
    return (
        <div className="flex justify-center my-2">
            <StatItem label="도전 횟수" value={gameStats.totalGames}/>
            <StatItem label="정답률" value={`${gameStats.successRate}%`}/>
            <StatItem label="연속 정답 횟수" value={gameStats.currentStreak}/>
            <StatItem label="최다 연속 정답" value={gameStats.bestStreak}/>
        </div>
    )
}
