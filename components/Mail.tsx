"use client"

import { Fragment, useEffect, useState } from "react";
import HeaderIcon from "./HeaderIcon";
import { IoIosMail } from "react-icons/io"
import { Menu, Transition } from "@headlessui/react";
import { MailResponse } from "@/types";
import { BsDot } from "react-icons/bs";
import { updateReadMail } from "@/lib/actions";
import { formatDate, formatDateAndTime } from "@/lib/support";

type Props = {
    userMail: Array<MailResponse> | undefined,
}

const Mail = ({ userMail }: Props) => {

    const [allMail, setAllMail] = useState<Array<MailResponse> | []>([])
    const [unread, setUnread] = useState<Array<MailResponse> | []>([])
    const [showDot, setShowDot] = useState(true)
    const [openMail, setOpenMail] = useState(false)

    // Fetch mail
    useEffect(() => {
        if (userMail) {
            const sortedMail = userMail.sort(function (a, b) {
                //@ts-ignore
                return new Date(b.mail.createdAt) - new Date(a.mail.createdAt);
            });
            setAllMail(sortedMail)
            setUnread(userMail.filter(item => !item.mail.read))
        }
    }, [])

    const handleOpenMail = async () => {
        setOpenMail(true)
        for (const readMail of unread) {
            await updateReadMail(readMail.mail.id)
        }
        setShowDot(false)
    }

    return (
        <Menu as="div" onMouseLeave={() => setOpenMail(false)}>

            <Menu.Button className="flex justify-center items-center" onMouseEnter={handleOpenMail} >
                <HeaderIcon
                    icon={<IoIosMail size={80} className={`px-[20px] hover:bg-[#eaedf4] hover:cursor-pointer`} color="#333333" />}
                    dropdownOpen={openMail}
                    notificationDot={showDot && unread.length > 0 ? <div className="absolute w-[20px] h-[20px] right-[94px] top-3 bg-[#af0000] rounded-full flex items-center justify-center text-white hover:cursor-pointer select-none">{unread.length}</div> : <></>}
                />
            </Menu.Button>

            <Transition
                show={openMail}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    static
                    className="flexStart profile_menu-items"
                >
                    <div className={`w-[340px] max-h-[340px] bg-[#eaedf4] absolute shadow-dropdown top-[-5px] right-0 overflow-y-auto`}>
                        {allMail?.map((mail) => (
                            <div
                                className={`w-full relative h-min py-[15px] px-[20px] border-b-[1px] border-b-gray-300 flex flex-col justify-center ${mail.mail.read ? "" : "bg-white"}`}
                                key={mail.mail.id}
                            >
                                <p className="text-[17px] text-gray-800">{mail.mail.message}<span className="text-[14px] text-gray-700 block">{formatDateAndTime(mail.mail.updatedAt)}</span></p>
                            </div>))}
                    </div>
                </Menu.Items>
            </Transition>

        </Menu>
    )
}

export default Mail