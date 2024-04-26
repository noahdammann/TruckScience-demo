"use client"

import { Menu, Transition } from "@headlessui/react"
import React, { Fragment, ReactNode, useRef } from "react"
import { IoMdClose } from "react-icons/io"
import Button from "./Button"
import { Company, SessionInterface } from "@/types"
import { toast } from "react-toastify"

type Props = {
    children: ReactNode,
    openModal: boolean,
    setOpenModal: (value: boolean) => void,
    title: string,
    submitRef?: any,
    closeModalRef?: any,
    session?: SessionInterface,
    company?: Company,
}

const Modal = ({ children, openModal, setOpenModal, title, submitRef, closeModalRef, session, company }: Props) => {

    const overlay = useRef<HTMLDivElement>(null)
    const wrapper = useRef<HTMLDivElement>(null)

    const handleClick = (e: React.MouseEvent) => {
        if (e.target === overlay.current) {
            setOpenModal(false)
        }
    }

    const handleSave = () => {
        if (submitRef.current === null) {
            toast.error("Saving failed. Please close the settings and try again.", {
                autoClose: 4000,
                hideProgressBar: false,
            })
        } else if (submitRef.current === undefined) {
            toast.error("No organisation found. Please create an organisation first.", {
                autoClose: 4000,
                hideProgressBar: false,
            })
        }
        else {
            submitRef.current.click()
        }
    }

    return (
        <Transition
            show={openModal}
            as={Fragment}
            enter="transition ease-in-out duration-200"
            enterFrom="transform opacity-0"
            enterTo="transform opacity-100"
            leave="transition ease-out duration-200"
            leaveFrom="transform opacity-100"
            leaveTo="transform opacity-0"
        >
            <Menu as="div" className="fixed top-0 left-0 bottom-0 right-0 bg-black/[0.75] z-30" ref={overlay} onMouseDown={handleClick}>
                <Transition
                    show={openModal}
                    as={Fragment}
                    leave="transition ease-out duration-200"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-90 opacity-0"
                >
                    <Menu.Items
                        static
                        ref={wrapper}
                        className="h-[610px] w-[900px] relative flex flex-col z-20 p-7 pb-[95px] bg-tsblue left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]"
                        as="div"
                    >
                        <h1 className="text-2xl mb-5 font-bold tracking-wider">{title}</h1>

                        {children}

                        <div className="bottom-8 right-8 absolute flex gap-3">
                            <Button
                                title="Cancel"
                                styles="bg-white text-gray-500 border-2 border-gray-600 text-lg uppercase tracking-wide hover:bg-tsblue"
                                closeModalRef={closeModalRef}
                                handleClick={() => setOpenModal(false)}
                            />
                            <Button
                                title="Save"
                                styles="bg-tsgreen text-white border-2 border-tsgreen text-lg uppercase tracking-wide hover:bg-darktsgreen hover:border-darktsgreen"
                                handleClick={handleSave}
                            />
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </Transition>
    )
}

export default Modal