import { formatDate, formatDateAndTime } from '@/lib/support'
import { Approval, SessionInterface } from '@/types'
import Image from 'next/image'
import React from 'react'
import { IoIosArrowDropdownCircle } from 'react-icons/io'
import InfoCard from './InfoCard'
import InfoUserCard from './InfoUserCard'

type Props = {
    submitRef: any,
    closeModalRef: any,
    session: SessionInterface,
    approval: Approval,
}

const InfoApprovalPopup = ({ submitRef, closeModalRef, session, approval }: Props) => {

    if (approval.approvalBetween === "user to user" || approval.approvalBetween === "user to company") {

        return (
            <div className='h-full w-full flex flex-col gap-4'>

                <div className='h-min grid grid-cols-3 grid-rows-[auto_90px_90px] gap-x-10 px-5'>

                    <div className='col-span-2 bg-white rounded-2xl p-8 flex items-center justify-center mb-8 border-[1px] border-gray-300'>
                        <Image
                            src="/example-dxf.webp"
                            width={470}
                            height={200}
                            alt="example truck drawing"
                        />
                    </div>

                    <div className='flex gap-4 flex-col'>
                        <InfoUserCard title='Approver:' value={approval.approverName} image={approval.approverImage} />
                        <InfoUserCard title='Approved:' value={approval.approvedUserName || approval.approvedCompany || "None"} image={approval.approvedUserImage || approval.approvedCompanyLogo || "/default-profile-picture.png"} />
                    </div>

                    <InfoCard title='Approval type:' value={approval.approvalType.charAt(0).toUpperCase() + approval.approvalType.slice(1)} />
                    <InfoCard title='Product:' value={approval.productDescription || "None"} />
                    <InfoCard title='Status:' value="Active" />
                    <InfoCard title='Access granted:' value={formatDateAndTime(approval.createdAt)} />

                    <InfoCard title='Communication medium:' value={approval.communicationMedium} />

                </div>
            </div>
        )
    }

    else if (approval.approvalBetween === "company to user" || approval.approvalBetween === "company to company") {
        return (
            <div className='h-full w-full flex flex-col gap-4'>

                <div className='h-min grid grid-cols-3 grid-rows-[auto_90px_90px] gap-x-10 px-5'>

                    <div className='col-span-2 bg-white rounded-2xl p-8 flex items-center justify-center mb-8 border-[1px] border-gray-300'>
                        <Image
                            src="/example-dxf.webp"
                            width={470}
                            height={200}
                            alt="example truck drawing"
                        />
                    </div>

                    <div className='flex gap-4 flex-col'>
                        <InfoUserCard title='Company:' value={approval.approverCompany || "None"} image={approval.approverCompanyLogo || "/default-profile-picture.png"} />
                        <InfoUserCard title='Approved:' value={approval.approvedUserName || approval.approvedCompany || "None"} image={approval.approvedUserImage || approval.approvedCompanyLogo || "/default-profile-picture.png"} />
                    </div>

                    <InfoCard title='Product:' value={approval.productDescription || "None"} />
                    <InfoCard title='Issuer:' value={approval.approverName} />
                    <InfoCard title='Status:' value="Active" />

                    <InfoCard title='Access granted:' value={formatDateAndTime(approval.createdAt)} />
                    <InfoCard title='Communication medium:' value={approval.communicationMedium} />

                </div>
            </div>
        )
    }

    return (
        <h2>Approval not found</h2>
    )

}

export default InfoApprovalPopup