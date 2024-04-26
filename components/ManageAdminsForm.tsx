import { demoteToMember, promoteToAdmin } from '@/lib/actions'
import { Company, SessionInterface, Users } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useState } from 'react'
import ReactLoading from "react-loading"
import { toast } from 'react-toastify'

type Props = {
    company: Company | undefined,
    session: SessionInterface,
    submitRef: any,
    members: Users | undefined,
    closeModalRef: any,
}

const ManageAdminsForm = ({ company, session, submitRef, members, closeModalRef }: Props) => {

    const [selectedMembers, setSelectedMembers] = useState<Array<string> | []>([]) // emails
    const [selectedAdmins, setSelectedAdmins] = useState<Array<string> | []>([]) // email

    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const admins = members?.filter(member => company?.admins.includes(member.user.email)) || []
    const filteredMembers = members?.filter(member => !company?.admins.includes(member.user.email)) || []

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const remainingAdmins = admins.length + (selectedMembers.length - selectedAdmins.length)

        if (remainingAdmins < 1 || !company) {
            toast.error("There must be at least one admin in the company")
            return
        }

        if (!company.admins.includes(session.user.email)) {
            toast.error("You do not have permission to do this")
            return
        }

        if (selectedAdmins.length === 0 && selectedMembers.length === 0) {
            return
        }

        setIsSubmitting(true)

        try {
            for (const member of selectedMembers) {
                await promoteToAdmin(member, company.name)
            }

            for (const admin of selectedAdmins) {
                await demoteToMember(admin, company.name)
            }
            closeModalRef.current.click()
            toast.success("Company admins updated")
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
            router.refresh()
        }
    }

    const toggleAdminSelection = (email: string) => {
        setSelectedAdmins((prevSelectedAdmins: Array<string>) => {
            if (prevSelectedAdmins.includes(email)) {
                return prevSelectedAdmins.filter((item: string) => item !== email);
            } else {
                return [...prevSelectedAdmins, email];
            }
        });
    }

    const toggleMemberSelection = (email: string) => {
        setSelectedMembers((prevSelectedMembers: Array<string>) => {
            if (prevSelectedMembers.includes(email)) {
                return prevSelectedMembers.filter((item: string) => item !== email);
            } else {
                return [...prevSelectedMembers, email];
            }
        });
    }

    return (
        <>
            {isSubmitting ?
                <div className='absolute top-0 bottom-0 left-0 right-0 bg-black/60 z-10'>
                    <ReactLoading type="spin" color='white' height={200} width={120} className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-30%]' />
                </div>
                : <></>
            }
            <form
                className="h-5/6 w-full"
                onSubmit={onSubmit}
                onKeyDown={e => e.stopPropagation()}
            >
                <div className='flex w-full h-full gap-5'>

                    <div className='w-1/2 h-full flex flex-col'>

                        <h2 className='text-xl font-semibold mb-2 text-center tracking-wide text-gray-700'>Demote:</h2>

                        <div className='w-full h-full bg-white border-[1px] border-gray-400 rounded-md overflow-y-auto'>
                            {admins?.map((user) => (
                                <div
                                    className='w-full bg-white p-3 pr-4 flex items-center gap-3 border-b-[1px] border-gray-200 hover:cursor-pointer hover:bg-tsblue'
                                    key={user.user.id}
                                    onClick={() => toggleAdminSelection(user.user.email as string)}
                                >
                                    <input
                                        type="checkbox"
                                        className="w-[17px] h-[17px] text-blue-600 bg-white border-gray-400 rounded hover:cursor-pointer focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600"
                                        // @ts-ignore
                                        checked={selectedAdmins.includes(user.user.email)}
                                        readOnly
                                    />
                                    <Image
                                        src={user.user.image || "/default-profile-picture.png"}
                                        width={30}
                                        height={30}
                                        alt="User Profile"
                                        className='rounded-full'
                                    />
                                    <h3 className='text-gray-800 tracking-wide'>{user.user.name}</h3>
                                    <h4 className='text-gray-600 text-md ml-auto'>Admin</h4>
                                </div>
                            ))}
                        </div>

                    </div>

                    <div className='w-1/2 h-full flex flex-col'>

                        <h2 className='text-xl font-semibold mb-2 text-center tracking-wide text-gray-700'>Promote:</h2>

                        <div className='w-full h-full bg-white border-[1px] border-gray-400 rounded-md overflow-y-auto'>
                            {filteredMembers?.map((user) => (
                                <div
                                    className='w-full bg-white p-3 pr-4 flex items-center gap-3 border-b-[1px] border-gray-200 hover:cursor-pointer hover:bg-tsblue'
                                    key={user.user.id}
                                    onClick={() => toggleMemberSelection(user.user.email as string)}
                                >
                                    <input
                                        type="checkbox"
                                        className="w-[17px] h-[17px] text-blue-600 bg-white border-gray-400 rounded hover:cursor-pointer focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600"
                                        // @ts-ignore
                                        checked={selectedMembers.includes(user.user.email)}
                                        readOnly
                                    />
                                    <Image
                                        src={user.user.image || "/default-profile-picture.png"}
                                        width={30}
                                        height={30}
                                        alt="User Profile"
                                        className='rounded-full'
                                    />
                                    <h3 className='text-gray-800 tracking-wide'>{user.user.name}</h3>
                                    <h4 className='text-gray-600 text-md ml-auto'>Member</h4>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>
                <button type="submit" ref={submitRef} className='w-[0.1px] h-[0.1px] absolute bottom-[-2000px]' />
            </form>
        </>
    )
}

export default ManageAdminsForm