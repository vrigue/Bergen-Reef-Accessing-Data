import { Fragment } from 'react';
import { Description, Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ArrowDownIcon, ArrowUpIcon, Bars3Icon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';

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
                <div className={(type === 'guide') ? "bg-white rounded-lg shadow-lg max-w-3xl w-full" : "bg-white rounded-lg shadow-lg max-w-md w-full"}>
                <div className="grid grid-flow-col grid-rows-1 place-content-center gap-2 bg-teal drop-shadow-gray drop-shadow-lg rounded-lg p-4">
                    <h2 className="text-xl text-white font-semibold">{title}</h2>
                    {type === 'guide' && (
                        <QuestionMarkCircleIcon className="w-6 h-6 text-white mt-1/2"/>
                    )}
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
                    {type === 'guide' && (
                        <div className="text-lg mt-2">
                            <p className="mb-3">
                                To sort or reorder 
                                (ascending <ArrowUpIcon className="inline w-4 h-4 text-gray-500 ml-1 align-text-bottom"/>, descending <ArrowDownIcon className="inline w-4 h-4 text-gray-500 ml-1 align-text-bottom"/>), 
                                <b> click on the desired column name.</b>
                            </p> 
                            <p className="mb-3">
                                To filter, click on the 3 horizontal lines icon 
                                <Bars3Icon className="inline w-5 h-5 text-gray-500 ml-1 align-text-bottom"/>
                                <b> next to the desired column name.</b>
                            </p>
                            <p className="mb-3">
                                To clear all existing filters, click on the <b>Clear Filters</b> button.
                            </p>
                            <p className="mb-3">
                                To refresh the table and view the latest updates, click on the <b>Refresh</b> button.
                            </p>
                            <p className="font-semibold underline mb-3">
                                For Administrators:
                            </p>
                            <p className="mb-3">
                                Click on the <b>Enter Edit Mode</b> button to create, delete, and edit data.
                            </p>
                            <p className="mb-3">
                                To create data entries, click on the <b>Create</b> button. Click on the dropdown menu to select an element and double click on the cell in the <b>Value</b> column to type in the measurement.
                            </p>
                            <p className="mb-3">
                                To delete data entries, select the desired entries using the <b>checkboxes</b> on the leftmost table column and click on the <b>Delete Selected</b> button.
                            </p>
                            <p>
                                To edit data entries, double click on the cell in the <b>Value</b> column of the desired entry. You may only edit the value or measurement of existing rows.
                            </p>
                        </div>
                    )}
                    {type !== 'guide' && (
                        <p className="text-lg mt-2">{message}</p>
                    )}
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