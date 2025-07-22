import React, {Fragment} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleXmark} from "@fortawesome/free-solid-svg-icons";

type Props = {
  title: string
  children: React.ReactNode
  isOpen: boolean
  handleClose: () => void
}

export const BaseModal = ({title, children, isOpen, handleClose}: Props) => {
  return (
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
            as="div"
            className="fixed z-10 inset-0 overflow-y-auto"
            onClose={handleClose}
        >
          <div className="flex items-center justify-center min-h-screen py-10 px-4 text-center sm:block sm:p-0">
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
            </Transition.Child>

            <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
            >&#8203;</span>
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                  className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left
                            overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md
                            sm:w-full sm:p-6">
                <div className="absolute right-4 top-4">
                  <button className="focus:outline-none">
                    <FontAwesomeIcon icon={faCircleXmark} className="text-2xl"
                                     onClick={() => handleClose()}/>
                  </button>
                </div>
                <div>
                  <div className="text-center">
                    <Dialog.Title
                        as="h3"
                        className="text-2xl leading-6 font-bold text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">{children}</div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
  )
}
