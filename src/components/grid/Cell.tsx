import {CharStatus} from "../../constants/types";
import classnames from 'classnames'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

type Props = {
    value?: string
    status?: CharStatus
    isInvalid?: boolean
    extra?: boolean
    wordLength: number
}

export const Cell = ({value, status, isInvalid, extra, wordLength}: Props) => {
    let baseClass = 'border-solid border-2 flex items-center justify-center mx-0.5 font-bold rounded transition-all duration-200 ';
    if (wordLength === 15) {
        baseClass += "text-base w-5 h-7 sm:text-2xl sm:w-14 sm:h-14";
    } else if (wordLength >= 12) {
        baseClass += "text-lg w-7 h-11 sm:text-2xl sm:w-14 sm:h-14";
    } else if (wordLength >= 8) {
        baseClass += "sm:text-2xl sm:w-14 sm:h-14 h-14 w-11 text-xl";
    } else {
        baseClass += "text-2xl w-14 h-14";
    }

    const classes = classnames(baseClass,
        {
            'bg-white border-slate-200': !status,
            'border-black': value && !status,
            'bg-slate-400 text-white border-slate-400': status === 'absent',
            'bg-green-500 text-white border-green-500': status === 'correct' && !extra,
            'bg-yellow-500 text-white border-yellow-500': status === 'present',
            'cell-animation': !!value,
            "text-red-500": !status && isInvalid,
            "bg-gray-300": extra
        },
    )

    return <div className={classes}>
        {value}
        {extra && (
            <FontAwesomeIcon icon={faPlus} className="opacity-75"/>
        )}
    </div>
}
