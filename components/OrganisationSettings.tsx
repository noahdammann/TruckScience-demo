"use client"

import { Approvals, Companies, Company, CompanyCollection, SessionInterface, UserCollection, Users } from '@/types'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import CustomInput from './CustomInput'
import FileInput from './FileInput'
import MemberSettings from './MemberSettings'
import Button from './Button'
import CreateOrganisationForm from './CreateOrganisationForm'
import Modal from './Modal'
import ShareLinkInput from './ShareLinkInput'
import { updateCompanyDetails } from '@/lib/actions'
import ReactLoading from "react-loading"
import { useRouter } from 'next/navigation'
import SharedWithUs from './SharedWithUs'
import { toast } from 'react-toastify'
import AddSharingForm from "./AddSharingForm";
import SharingSettings from './SharingSettings'
import ManageAdminsForm from './ManageAdminsForm'

type Props = {
    submitRef: any,
    session: SessionInterface,
    company: Company | undefined,
    members: Users | undefined,
    companyApprovals: Approvals | undefined,
    closeModalRef?: any,
    allUsers: UserCollection,
    allCompanies: CompanyCollection,
    companySharedCompanies: Companies | undefined,
    companySharedUsers: Users | undefined,
}

const menu = [
    { name: "General Settings" },
    { name: "Members" },
    { name: "Sharing" },
    { name: "Shared with us" },
]

const OrganisationSettings = ({
    submitRef,
    session,
    company,
    members,
    closeModalRef,
    companyApprovals,
    allCompanies,
    allUsers,
    companySharedCompanies,
    companySharedUsers,
}: Props) => {

    const [active, setActive] = useState("General Settings")
    const [logoUrl, setLogoUrl] = useState("")
    const [createOrganisation, setCreateOrganisation] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const [openShare, setOpenShare] = useState(false)
    const [openManageAdmins, setOpenManageAdmins] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (data: any) => {
        if (company && company.admins.includes(session.user.email)) {
            setIsSubmitting(true)
            try {
                if (company) {
                    await updateCompanyDetails(data, company.name, logoUrl)
                }
                router.refresh()
                toast.success("Organisation updated")
            } catch (error) {
                console.log(error)
            } finally {
                setIsSubmitting(false)
                closeModalRef.current.click()
            }
        } else {
            toast.error("You do not have permission to edit these settings")
            return
        }

    }

    useEffect(() => {
        if (company) {
            setLogoUrl(company?.logo)
        }
    }, [])

    if (createOrganisation) {
        return (
            <Modal title='Create Organisation' openModal={createOrganisation} setOpenModal={() => setCreateOrganisation(false)} submitRef={submitRef}>
                <CreateOrganisationForm submitRef={submitRef} session={session} closeModalRef={closeModalRef} />
            </Modal>
        )
    }

    return (
        <div className='flex w-full h-full divide-x-4 divide-tsblue'>
            {isSubmitting ?
                <div className='absolute top-0 bottom-0 left-0 right-0 bg-black/60 z-10'>
                    <ReactLoading type="spin" color='white' height={200} width={120} className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-30%]' />
                </div>
                : <></>
            }
            {!company ?
                <div className='ml-auto rounded-2xl mr-auto self-center flex flex-col justify-center items-center gap-1'>
                    <Button
                        title="Create Organisation"
                        handleClick={() => setCreateOrganisation(true)}
                        styles='bg-tsgreen text-white text-[24px] mb-1 tracking-wide border-x-8 border-tsgreen hover:bg-darktsgreen hover:border-darktsgreen'
                    />
                    <p className='text-xl text-gray-600'>or</p>
                    <p className='text-[24px] tracking-normal mt-[-7px]'>Ask an administrator to add you</p>
                </div>
                :
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
                                        <CustomInput title="Name" register={register} initialValue={company.name} />
                                        <ShareLinkInput title="InviteUrl" register={register} initialValue={company.inviteUrl} />
                                        <FileInput title="Logo" value={logoUrl} setValue={setLogoUrl} />
                                    </div>
                                    : active === "Members" ?
                                        <MemberSettings
                                            session={session}
                                            company={company}
                                            members={members}
                                            setOpenManageAdmins={setOpenManageAdmins}
                                        />
                                        : active === "Sharing" ?
                                            <SharingSettings
                                                setOpenShare={() => setOpenShare(true)}
                                                approvals={companyApprovals}
                                                company={company}
                                                session={session}
                                                type="organisation"
                                            />
                                            : active === "Shared with us" ?
                                                <SharedWithUs
                                                    companySharedCompanies={companySharedCompanies}
                                                    companySharedUsers={companySharedUsers}
                                                    type="organisation"
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
                                type="organisation"
                            />
                        </Modal>
                        <Modal title='Manage Admins' openModal={openManageAdmins} setOpenModal={() => setOpenManageAdmins(false)} submitRef={submitRef}>
                            <ManageAdminsForm
                                company={company}
                                session={session}
                                members={members}
                                submitRef={submitRef}
                                closeModalRef={closeModalRef}
                            />
                        </Modal>
                    </div>
                </>
            }
        </div >
    )
}

export default OrganisationSettings