import React from "react";
import {Transition} from "@headlessui/react";
import {GuessInfo} from "../../constants/types";

type Props = {
    guess: GuessInfo
    isOpen: boolean
}

export const Definition = ({guess, isOpen}: Props) => {
    if (!guess || !isOpen) return null;
    return (
        <Transition
            show={isOpen}
            as={React.Fragment}
            enter="ease-out duration-300 transition"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div
                className="text-center absolute w-80 right-20 top-32 bg-yellow-200 shadow-lg rounded-lg ring-1
                ring-black ring-opacity-5 p-4">
                <h2 className="text-xl font-bold mb-2">{guess?.word}</h2>
                <p className="text-sm">
                    {guess?.definition}
                </p>
            </div>
        </Transition>
    )
}