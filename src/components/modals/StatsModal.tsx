import Countdown from 'react-countdown'
import {StatBar} from '../stats/StatBar'
import {Histogram} from '../stats/Histogram'
import {GameStats} from "../../constants/types";
import {shareStatus} from '../../lib/share'
import {BaseModal} from './BaseModal'
import {GuessInfo} from "../../constants/types";

type Props = {
    isOpen: boolean
    handleClose: () => void
    guesses: GuessInfo[]
    gameStats: GameStats
    isGameLost: boolean
    isGameWon: boolean
    handleShare: () => void
    today: string
    title: string
    rank: number
}

export const StatsModal = (
    {
        isOpen,
        handleClose,
        guesses,
        gameStats,
        isGameLost,
        isGameWon,
        handleShare,
        today,
        title,
        rank
    }: Props) => {

    const td = new Date(today)
    const tomorrow = new Date(td.setDate(td.getDate() + 1))
    tomorrow.setHours(0, 0, 0, 0);

    if (gameStats.totalGames <= 0) {
        return (
            <BaseModal
                title="통계"
                isOpen={isOpen}
                handleClose={handleClose}
            >
                <StatBar gameStats={gameStats}/>
            </BaseModal>
        )
    }
    return (
        <BaseModal
            title={rank > 0 ? `통계 - ${rank}위` : "통계"}
            isOpen={isOpen}
            handleClose={handleClose}
        >
            <StatBar gameStats={gameStats}/>
            <h4 className="text-lg leading-6 font-medium text-gray-900">
                횟수 분포
            </h4>
            <Histogram gameStats={gameStats}/>
            {(isGameLost || isGameWon) && (
                <div className="mt-5 sm:mt-6 columns-2">
                    <div>
                        <h5>단어 갱신까지: </h5>
                        <Countdown
                            className="text-lg font-medium text-gray-900"
                            date={tomorrow}
                            daysInHours={true}
                        />
                    </div>
                    <button
                        type="button"
                        className="mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600
                        text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2
                        focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                        onClick={() => {
                            shareStatus(title, guesses, isGameLost, rank)
                            handleShare()
                        }}
                    >
                        공유하기
                    </button>
                </div>
            )}
        </BaseModal>
    )
}
