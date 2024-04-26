import { formatDate } from '@/lib/support'
import { Approval, Approvals, SessionInterface } from '@/types'
import Image from 'next/image'
import { IoIosArrowDropdownCircle } from 'react-icons/io'

type Props = {
    approvals: Approvals | undefined,
    approvalSelectAll: boolean,
    toggleApprovalSelectAll: () => void,
    toggleApprovalSelection: (approval: Approval) => void,
    selectedApprovals: Array<Approval>,
}

const ApprovalsList = ({ approvals, approvalSelectAll, toggleApprovalSelectAll, toggleApprovalSelection, selectedApprovals }: Props) => {

    const filteredApprovals = approvals?.filter((app) => app.approval.approvalType === "product")

    const activeApprovals = filteredApprovals?.filter((app) => app.approval.revoked === false)
    const revokedApprovals = filteredApprovals?.filter((app) => app.approval.revoked === true)

    return (
        <div className='flex flex-col gap-[2.5px]'>

            {activeApprovals && activeApprovals.length > 0 && (
                <div className='flex flex-col gap-[2.5px] mb-5'>
                    <div className='w-full px-3 grid grid-cols-[30px_230px_auto_120px_140px] items-center text-[15px] font-semibold text-gray-500 mb-2 uppercase tracking-wide'>

                        <input
                            type="checkbox"
                            className="w-[17px] h-[17px] text-blue-600 bg-white border-gray-400 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600"
                            checked={approvalSelectAll}
                            onChange={toggleApprovalSelectAll}
                        />
                        <p className='flex items-center'><IoIosArrowDropdownCircle className="inline mr-1" size={21} />Approved</p>
                        <p className='flex items-center'><IoIosArrowDropdownCircle className="inline mr-1" size={21} />Product Description</p>
                        <p className='flex items-center'><IoIosArrowDropdownCircle className="inline mr-1" size={21} />Status</p>
                        <p className='flex items-center'><IoIosArrowDropdownCircle className="inline mr-1" size={21} />Created</p>

                    </div>

                    {activeApprovals?.map((approval) => (
                        <div
                            className='grid grid-cols-[30px_230px_auto_120px_140px] items-center bg-gray-100 w-full h-[52px] px-3 border-[2px] border-gray-100 rounded-sm hover:bg-white hover:border-gray-300 hover:cursor-pointer'
                            key={approval.approval.id}
                            onClick={() => toggleApprovalSelection(approval.approval)}
                        >
                            <input
                                type="checkbox"
                                className="w-[17px] h-[17px] text-blue-600 bg-white border-gray-400 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600"
                                //@ts-ignore
                                checked={selectedApprovals.includes(approval.approval)}
                                readOnly
                            />
                            <div className='flex gap-2 items-center'>
                                <Image
                                    src={approval.approval.approvedUserImage || approval.approval.approvedCompanyLogo || "/default-profile-picture.png"}
                                    width={27}
                                    height={27}
                                    alt="Approved User Profile"
                                    className='inline rounded-full'
                                />
                                <p className='text-gray-600 inline'>{approval.approval.approvedUserName || approval.approval.approvedCompany}</p>
                            </div>
                            <p className='text-gray-600'>{approval.approval.productDescription}</p>
                            <p className='text-green-600'>Active</p>
                            <p className='text-gray-600 w-[100px] text-right'>{formatDate(approval.approval.createdAt)}</p>
                        </div>
                    ))}
                </div>
            )}

            {revokedApprovals && revokedApprovals.length > 0 && (
                <div className='w-full px-3 grid grid-cols-[260px_auto_120px_140px] items-center text-[15px] font-semibold text-gray-500 mb-2 uppercase tracking-wide'>
                    <p className='flex items-center'><IoIosArrowDropdownCircle className="inline mr-1" size={21} />Approved</p>
                    <p className='flex items-center'><IoIosArrowDropdownCircle className="inline mr-1" size={21} />Product Description</p>
                    <p className='flex items-center'><IoIosArrowDropdownCircle className="inline mr-1" size={21} />Status</p>
                    <p className='flex items-center'><IoIosArrowDropdownCircle className="inline mr-1" size={21} />Revoke Date</p>

                </div>
            )}

            {revokedApprovals?.map((approval) => (
                <div
                    className='grid grid-cols-[260px_auto_120px_140px] items-center bg-gray-100 w-full h-[52px] px-3 border-[2px] border-gray-100 rounded-sm'
                    key={approval.approval.id}
                >
                    <div className='flex gap-2 items-center'>
                        <Image
                            src={approval.approval.approvedUserImage || approval.approval.approvedCompanyLogo || "/default-profile-picture.png"}
                            width={27}
                            height={27}
                            alt="Approved User Profile"
                            className='inline rounded-full'
                        />
                        <p className='text-gray-600 inline'>{approval.approval.approvedUserName || approval.approval.approvedCompany}</p>
                    </div>
                    <p className='text-gray-600'>{approval.approval.productDescription}</p>
                    <p className='text-red-500'>Revoked</p>
                    <p className='text-gray-600 w-[100px] ml-auto'>{formatDate(approval.approval.createdAt)}</p>
                </div>))}
        </div>
    )
}

export default ApprovalsList