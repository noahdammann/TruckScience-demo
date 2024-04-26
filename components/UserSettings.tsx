import { Approvals, Companies, Company, CompanyCollection, SessionInterface, UserCollection, Users } from '@/types'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ReactLoading from "react-loading"
import CustomInput from './CustomInput'
import FileInput from './FileInput'
import Button from './Button'
import { signOut } from 'next-auth/react'
import { HiMiniArrowUpTray } from 'react-icons/hi2'
import SharingSettings from './SharingSettings'
import Modal from './Modal'
import AddSharingForm from './AddSharingForm'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { updateUserDetails } from '@/lib/actions'
import SharedWithUs from './SharedWithUs'

type Props = {
    session: SessionInterface,
    company: Company | undefined,
    allUsers: UserCollection,
    allCompanies: CompanyCollection,
    approvals: Approvals | undefined,
    sharedUsers: Users | undefined,
    sharedCompanies: Companies | undefined,
    submitRef: any,
    closeModalRef: any,
}

const menu = [
    { name: "General Settings" },
    { name: "Sharing" },
    { name: "Shared with me" },
]

const UserSettings = ({ submitRef, approvals, sharedUsers, sharedCompanies, session, company, closeModalRef, allUsers, allCompanies }: Props) => {

    const userApprovals = approvals?.filter(app => app.approval.approvalBetween === "user to user") || []
    const companyApprovals = approvals?.filter(app => app.approval.approvalBetween === "user to company") || []

    const [active, setActive] = useState("General Settings")
    const [logoUrl, setLogoUrl] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [openShare, setOpenShare] = useState(false)

    const router = useRouter()

    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (data: any) => {

        if (!session.user.email) {
            toast.error("Please sign in first")
            return
        }

        setIsSubmitting(true)
        try {
            if (session.user.email) {
                await updateUserDetails(data, session.user.email, logoUrl)
            } else {
                return
            }
            router.refresh()
            toast.success("Profile updated")
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
            closeModalRef.current.click()
        }
    }

    useEffect(() => {
        if (session) {
            setLogoUrl(session.user.image)
        }
    }, [])

    return (
        <div className='flex w-full h-full divide-x-4 divide-tsblue'>
            {isSubmitting ?
                <div className='absolute top-0 bottom-0 left-0 right-0 bg-black/60 z-10'>
                    <ReactLoading type="spin" color='white' height={200} width={120} className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-30%]' />
                </div>
                : <></>
            }
            <>
                {/* Left nav menu */}
                <div className='w-1/4 py-4 bg-white flex flex-col rounded-l-lg'>
                    {menu.map((item) => (
                        <div
                            key={item.name}
                            className={`text-[19px] relative pl-6 h-[50px] flex items-center hover:cursor-pointer ${active === item.name ? "text-tsgreen" : ""}`}
                            onClick={() => setActive(item.name)}
                        >
                            {item.name}
                            {
                                active === item.name
                                    ? <div className='absolute left-0 top-0 h-full w-1 bg-tsgreen'></div>
                                    : <></>
                            }
                        </div>
                    ))}
                </div>

                {/* Contextual settings */}
                <div className='w-3/4 py-1 bg-white overflow-y-auto rounded-r-lg'>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 p-5' onKeyDown={e => e.stopPropagation()}>
                        {
                            active === "General Settings" ?
                                <div className='flex flex-col gap-3'>
                                    <CustomInput title="Name" register={register} initialValue={session.user.name} />
                                    <FileInput title="Profile picture" value={logoUrl} setValue={setLogoUrl} />
                                    <Button
                                        title="Sign Out"
                                        styles="bg-tsgreen text-white text-medium hover:bg-darktsgreen w-fit mt-2"
                                        handleClick={() => signOut()}
                                        icon={<HiMiniArrowUpTray size={22} className="inline rotate-90 ml-1" />}
                                    />
                                </div>
                                : active === "Sharing" ?
                                    <SharingSettings
                                        setOpenShare={() => setOpenShare(true)}
                                        approvals={approvals}
                                        company={company}
                                        session={session}
                                        type="user"
                                    />
                                    : active === "Shared with me" ?
                                        <SharedWithUs
                                            companySharedCompanies={sharedCompanies}
                                            companySharedUsers={sharedUsers}
                                            type="user"
                                        />
                                        :
                                        <p>Settings not found</p>
                        }
                        <button type="submit" ref={submitRef} className='w-[0.1px] h-[0.1px] absolute bottom-[-2000px]' />
                    </form>
                    <Modal title='Share Products' openModal={openShare} setOpenModal={() => setOpenShare(false)} submitRef={submitRef}>
                        <AddSharingForm
                            closeModalRef={closeModalRef}
                            company={company}
                            session={session}
                            submitRef={submitRef}
                            allUsers={allUsers}
                            allCompanies={allCompanies}
                            type="user"
                        />
                    </Modal>
                </div>
            </>
        </div >
    )
}

export default UserSettings