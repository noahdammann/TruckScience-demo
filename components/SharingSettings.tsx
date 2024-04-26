import { removeCompanySharedCompany, removeCompanySharedUser, removeSharedCompany, removeSharedUser } from '@/lib/actions'
import { Approval, Approvals, Company, SessionInterface } from '@/types'
import Image from 'next/image'
import React, { useState } from 'react'
import { BsFillPersonPlusFill } from 'react-icons/bs'
import { FcCancel } from 'react-icons/fc'
import { IoInformationCircle } from 'react-icons/io5'
import { toast } from 'react-toastify'
import ReactLoading from "react-loading"
import { useRouter } from 'next/navigation'

type Props = {
    setOpenShare: () => void,
    approvals: Approvals | undefined,
    company: Company | undefined,
    session: SessionInterface,
    type: string,
}

const SharingSettings = ({ setOpenShare, approvals, company, session, type }: Props) => {

    const [openDialog, setOpenDialog] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const approvedCompanies = approvals?.filter(app => app.approval.approvalType === "company")
    const approvedUsers = approvals?.filter(app => app.approval.approvalType === "user")

    const handleRemoveUser = async (userEmail: string | null, approval: Approval) => {
        if (type === "user") {

            if (!session.user.email) {
                toast.error("You must sign in first")
                return
            }

            if (!userEmail) {
                return
            }

            setIsSubmitting(true)

            try {
                await removeSharedUser(userEmail, session.user.email, approval)
                toast.success("Removed user")
                router.refresh()
            } catch (error) {
                console.log(error)
            } finally {
                setIsSubmitting(false)
            }

        }
        else {

            if (!company?.admins.includes(session.user.email)) {
                toast.error("You do not have permission to remove a user")
                return
            }

            if (!userEmail) {
                return
            }

            setIsSubmitting(true)

            try {
                await removeCompanySharedUser(userEmail, company.name, approval)
                toast.success("Removed user")
                router.refresh()
            } catch (error) {
                console.log(error)
            } finally {
                setIsSubmitting(false)
            }

        }
    }

    const handleRemoveCompany = async (companyName: string | null, approval: Approval) => {

        if (type === "user") {

            if (!session.user.email) {
                toast.error("You must sign in first")
                return
            }

            if (!companyName) {
                return
            }

            setIsSubmitting(true)

            try {
                await removeSharedCompany(companyName, session.user.email, approval)
                toast.success("Removed company")
                router.refresh()
            } catch (error) {
                console.log(error)
            } finally {
                setIsSubmitting(false)
            }

        } else {

            if (!company?.admins.includes(session.user.email) || !company) {
                toast.error("You do not have permission to remove a company")
                return
            }

            if (!companyName) {
                return
            }

            setIsSubmitting(true)

            try {
                await removeCompanySharedCompany(companyName, company.name, approval)
                toast.success("Removed company")
                router.refresh()
            } catch (error) {
                console.log(error)
            } finally {
                setIsSubmitting(false)
            }

        }
    }

    return (
        <div className="flex flex-col gap-5">

            {isSubmitting ?
                <div className='absolute top-0 bottom-0 left-0 right-0 bg-black/60 z-10'>
                    <ReactLoading type="spin" color='white' height={200} width={120} className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-30%]' />
                </div>
                : <></>
            }

            <div>
                <div className="flex gap-1 mb-2">
                    <label
                        className='text-xl font-semibold text-gray-800'
                    >
                        Pre-approved companies:
                    </label>
                    <IoInformationCircle size={27} className='text-gray-500 z-10 hover:cursor-pointer hover:text-gray-600' onMouseEnter={() => setOpenDialog(true)} onMouseLeave={() => setOpenDialog(false)} />
                </div>
                {openDialog ?
                    <div className='flex z-20 justify-center items-center w-[350px] text-base absolute left-[351px] top-[12px] bg-tsgreen text-white p-3 rounded-lg'>
                        <div className='absolute top-[70px] whitespace-pre w-0 h-0 border-t-tsgreen border-x-[25px] border-t-[25px] border-x-transparent'></div>
                        <p className="tracking-wide">Pre-approved automatically shares all your products with a user or company.</p>
                    </div>
                    :
                    <></>
                }
                <div className="flex flex-col gap-1">
                    {approvedCompanies?.map((approval) => (
                        <div
                            className='w-full bg-gray-200 rounded-md p-2 px-3 flex items-center gap-3'
                            key={approval.approval.id}
                        >
                            <Image
                                src={approval.approval.approvedCompanyLogo || "/default-profile-picture.png"}
                                width={35}
                                height={35}
                                alt="User Profile"
                                className='rounded-full'
                            />
                            <h3 className='text-gray-800 tracking-wide text-lg'>{approval.approval.approvedCompany}</h3>
                            {(company?.admins.includes(session.user.email) || type === "user") && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveCompany(approval.approval.approvedCompany, approval.approval)}
                                    className='ml-auto text-red-500 flex gap-1 items-center'
                                >
                                    <FcCancel size={24} />
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    {(!approvedCompanies || approvedCompanies.length === 0) && (
                        <p className='ml-1 text-gray-800'>No companies found</p>
                    )}
                </div>
            </div>

            <div>
                <div className="flex gap-1">
                    <label
                        className='text-xl font-semibold text-gray-800 mb-2'
                    >
                        Pre-approved users:
                    </label>
                </div>
                <div className="flex flex-col gap-1">
                    {approvedUsers?.map((approval) => (
                        <div
                            className='w-full bg-gray-200 rounded-md p-2 px-3 flex items-center gap-3'
                            key={approval.approval.id}
                        >
                            <Image
                                src={approval.approval.approvedUserImage || "/default-profile-picture.png"}
                                width={35}
                                height={35}
                                alt="User Profile"
                                className='rounded-full'
                            />
                            <h3 className='text-gray-800 tracking-wide text-lg'>{approval.approval.approvedUserName}</h3>
                            {(company?.admins.includes(session.user.email) || type === "user") && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveUser(approval.approval.approvedUserEmail, approval.approval)}
                                    className='ml-auto text-red-500 flex gap-1 items-center'
                                >
                                    <FcCancel size={24} />
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    {(!approvedUsers || approvedUsers.length === 0) && (
                        <p className='ml-1 mt-1 text-gray-800'>No users found</p>
                    )}
                </div>
            </div>

            {((company && company.admins.includes(session.user.email)) || type === "user") && (
                <button
                    className="flex mt-1 gap-2 w-fit pl-5 pr-6 py-2 bg-tsgreen text-white rounded-sm justify-center items-center hover:bg-darktsgreen"
                    type="button"
                    onClick={setOpenShare}
                >
                    <BsFillPersonPlusFill size={27} />
                    <p className="text-lg">Add user or company</p>
                </button>
            )}

        </div>
    )
}

export default SharingSettings