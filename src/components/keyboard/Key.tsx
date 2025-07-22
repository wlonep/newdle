import React, {ReactNode} from 'react'
import classnames from 'classnames'
import {KeyValue} from '../../lib/keyboard'
import {CharStatus} from "../../constants/types";

type Props = {
    children?: ReactNode
    value: KeyValue
    width?: number
    status?: CharStatus
    onClick: (value: KeyValue) => void
}

export const Key = (
    {
        children,
        status,
        width = 0,
        value,
        onClick,
    }: Props) => {
    const classes = classnames(
        'flex items-center justify-center rounded mx-0.5 font-bold cursor-pointer select-none ' +
        'lg:text-lg lg:w-[45px] lg:h-[63px] text-base w-[42px] h-[58px]',
        {
            'bg-slate-200 hover:bg-slate-300 active:bg-slate-400': !status,
            'bg-slate-400 text-white': status === 'absent',
            'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white':
                status === 'correct',
            'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white':
                status === 'present',
        }
    )

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        onClick(value)
        event.currentTarget.blur()
    }

    return (
        <button
            style={width !== 0 ? {width: `${width}px`} : {}}
            className={classes}
            onClick={handleClick}
        >
            {children || value}
        </button>
    )
}
