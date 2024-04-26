"use client"

import { Fragment, useRef, useState } from "react";
import HeaderIcon from "./HeaderIcon";
import { FaUserCircle } from "react-icons/fa"
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Button from "./Button";
import { HiMiniArrowUpTray } from 'react-icons/hi2'
import { useRouter } from "next/navigation";
import { CgOrganisation } from "react-icons/cg"
import { updateUserCompany } from "@/lib/actions";
import Modal from "./Modal";
import OrganisationSettings from "./OrganisationSettings";
import { Approvals, Companies, Company, CompanyCollection, SessionInterface, UserCollection, Users } from "@/types";
import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import UserSettings from "./UserSettings";

type Props = {
    session: SessionInterface,
    company: Company | undefined,
    members: Users | undefined,
    companyApprovals: Approvals | undefined,
    allUsers: UserCollection,
    allCompanies: CompanyCollection,
    companySharedCompanies: Companies | undefined,
    companySharedUsers: Users | undefined,
    approvals: Approvals | undefined,
    sharedUsers: Users | undefined,
    sharedCompanies: Companies | undefined,
}

const Profile = ({
    session,
    company,
    members,
    companyApprovals,
    allUsers,
    allCompanies,
    companySharedCompanies,
    companySharedUsers,
    approvals,
    sharedUsers,
    sharedCompanies
}: Props) => {

    const [openProfile, setOpenProfile] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [openUserSettings, setOpenUserSettings] = useState(false)

    const submitRef = useRef()
    const closeModalRef = useRef()

    return (
        <>

            <Modal
                openModal={openModal} setOpenModal={setOpenModal} title="Organisation Settings" submitRef={submitRef} closeModalRef={closeModalRef} session={session} company={company}
            >
                <OrganisationSettings
                    submitRef={submitRef}
                    session={session}
                    company={company}
                    members={members}
                    closeModalRef={closeModalRef}
                    companyApprovals={companyApprovals}
                    allUsers={allUsers}
                    allCompanies={allCompanies}
                    companySharedCompanies={companySharedCompanies}
                    companySharedUsers={companySharedUsers}
                />
            </Modal>

            <Modal
                openModal={openUserSettings} setOpenModal={setOpenUserSettings} title="Settings" submitRef={submitRef} closeModalRef={closeModalRef} session={session} company={company}
            >
                <UserSettings
                    submitRef={submitRef}
                    session={session}
                    company={company}
                    closeModalRef={closeModalRef}
                    allUsers={allUsers}
                    allCompanies={allCompanies}
                    approvals={approvals}
                    sharedUsers={sharedUsers}
                    sharedCompanies={sharedCompanies}
                />
            </Modal>

            <Menu as="div" onMouseLeave={() => setOpenProfile(false)}>

                <Menu.Button className="flex justify-center items-center" onMouseEnter={() => setOpenProfile(true)} >
                    <HeaderIcon
                        icon={<FaUserCircle size={72} className={`p-[20px] hover:bg-[#eaedf4] hover:cursor-pointer`} color="#333333" />}
                        dropdownOpen={openProfile}
                    />
                </Menu.Button>

                <Transition
                    show={openProfile}
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
                        <div className={`w-[285px] h-[300px] pb-5 flex flex-col items-center justify-center shadow-dropdown gap-0 bg-[#eaedf4] absolute top-[-1px] right-0`}>
                            <div className="grow flex flex-col justify-around items-center">
                                {session?.user?.image && (
                                    <Image
                                        src={session.user.image}
                                        className="rounded-full mt-5"
                                        alt="user image"
                                        width={90}
                                        height={90}
                                    />
                                )}
                                <h1 className="text-xl font-medium text-gray-700 mt-1">{session?.user.name}</h1>
                                <h2 className="text-lg font-medium mt-[-3px] text-gray-600">{session?.user?.company || "No organization"}</h2>
                            </div>
                            <div className="grow flex flex-col pt-2 gap-2 justify-center items-center">
                                <Button
                                    title="Settings"
                                    styles="bg-tsgreen text-white text-medium hover:bg-darktsgreen"
                                    handleClick={() => setOpenUserSettings(true)}
                                    icon={<IoMdSettings size={22} className="inline rotate-90 ml-1" />}
                                />
                                <Button
                                    title="Manage Organisation"
                                    styles="bg-blue-500/90 text-white text-medium hover:bg-blue-700/80"
                                    handleClick={() => setOpenModal(true)}
                                    icon={<CgOrganisation size={22} className="inline ml-1" />}
                                />
                            </div>
                        </div>
                    </Menu.Items>
                </Transition>

            </Menu>
        </>
    )
}

export default Profile