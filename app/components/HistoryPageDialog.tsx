import { Fragment } from 'react';
import { Description, Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const HistoryPageDialog = ({ isOpen, title, message, type, onClose, onConfirm}) => {
    return (
        <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>

            <Transition
            show={isOpen}
            as={Fragment}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition>

            <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition
                show={isOpen}
                as={Fragment}
                enter="transition-transform duration-300"
                enterFrom="scale-95 opacity-0"
                enterTo="scale-100 opacity-100"
                leave="transition-transform duration-200"
                leaveFrom="scale-100 opacity-100"
                leaveTo="scale-95 opacity-0"
            >
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                <div className="grid grid-flow-col grid-rows-1 place-content-center gap-2 bg-teal drop-shadow-gray drop-shadow-lg rounded-lg p-4">
                    <h2 className="text-xl text-white font-semibold">{title}</h2>
                    {(type === 'warning' || type === 'notice') && (
                        <ExclamationTriangleIcon className="w-6 h-6 text-white mt-1/2"/>
                    )}
                    {type === 'success' && (
                        <CheckCircleIcon className="w-6 h-6 text-white mt-1/2"/>
                    )}
                    {type === 'error' && (
                        <XCircleIcon className="w-6 h-6 text-white mt-1/2"/>
                    )}
                </div>
                <div className="flex flex-col gap-4 p-6">
                    <p className="text-lg mt-2">{message}</p>
                    {type === 'warning' ? (
                        <div className="grid grid-flow-col grid-rows-1 gap-4">
                            <button
                                className="bg-teal text-lg text-white mt-4 px-4 py-2 rounded-xl shadow hover:bg-medium-teal"
                                onClick={onClose}
                            >Cancel
                            </button>
                            <button
                                className="bg-orange text-lg text-white mt-4 px-4 py-2 rounded-xl shadow hover:bg-dark-orange"
                                onClick={onConfirm}
                            >Delete
                            </button>
                        </div>
                    ) : (
                        <Transition as={Fragment}>
                            <button
                                className="bg-orange text-lg text-white mt-4 px-4 py-2 rounded-xl shadow hover:bg-dark-orange"
                                onClick={onClose}
                            >Close
                            </button>
                        </Transition>
                    )}
                </div>
                </div>
            </Transition>
            </div>
        </Dialog>
        </Transition>
    );
};

export default HistoryPageDialog;