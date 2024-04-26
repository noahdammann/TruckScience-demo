import { Companies, Users } from "@/types"
import Image from "next/image";
import { useState } from "react";
import { IoInformationCircle } from "react-icons/io5";
import { GoKebabHorizontal } from "react-icons/go";

type Props = {
    companySharedCompanies: Companies | undefined,
    companySharedUsers: Users | undefined,
    type: string,
}

const SharedWithUs = ({
    companySharedCompanies,
    companySharedUsers,
    type,
}: Props) => {

    const [openDialog, setOpenDialog] = useState(false)

    return (
        <div className="flex flex-col gap-3">

            <div>
                <div className="flex gap-1">
                    <label
                        className='text-xl font-semibold text-gray-800'
                    >
                        Companies sharing with {type === "organisation" ? "us:" : "me:"}
                    </label>
                    <IoInformationCircle size={27} className='text-gray-500 mb-2 z-10 hover:cursor-pointer hover:text-gray-600' onMouseEnter={() => setOpenDialog(true)} onMouseLeave={() => setOpenDialog(false)} />
                </div>
                {openDialog ?
                    <div className='flex z-20 justify-center items-center w-[350px] text-base absolute left-[373px] top-[15px] bg-tsgreen text-white p-3 rounded-lg'>
                        <div className='absolute top-[67px] whitespace-pre w-0 h-0 border-t-tsgreen border-x-[25px] border-t-[25px] border-x-transparent'></div>
                        <p className="tracking-wide">You will automatically be given access to all of these users or companies products.</p>
                    </div>
                    :
                    <></>
                }
                <div className="flex flex-col gap-1">
                    {companySharedCompanies?.map((company) => (
                        <div
                            className='w-full bg-gray-200 rounded-md p-2 px-3 flex items-center gap-3'
                            key={company.company.id}
                        >
                            <Image
                                src={company.company.logo || "/default-profile-picture.png"}
                                width={35}
                                height={35}
                                alt="User Profile"
                                className='rounded-full'
                            />
                            <h3 className='text-gray-800 tracking-wide text-lg'>{company.company.name}</h3>
                        </div>
                    ))}
                    {(!companySharedCompanies || companySharedCompanies.length === 0) && (
                        <p className='ml-1 text-gray-800'>No companies found</p>
                    )}
                </div>
            </div>

            <div>
                <div className="flex gap-1">
                    <label
                        className='text-xl font-semibold text-gray-800'
                    >
                        Users sharing with {type === "organisation" ? "us:" : "me:"}
                    </label>
                </div>
                <div className="flex flex-col gap-1">
                    {companySharedUsers?.map((user) => (
                        <div
                            className='w-full bg-gray-200 rounded-md p-2 px-3 flex items-center gap-3'
                            key={user.user.id}
                        >
                            <Image
                                src={user.user.image || "/default-profile-picture.png"}
                                width={35}
                                height={35}
                                alt="User Profile"
                                className='rounded-full'
                            />
                            <h3 className='text-gray-800 tracking-wide text-lg'>{user.user.name}</h3>
                        </div>
                    ))}
                    {(!companySharedUsers || companySharedUsers.length === 0) && (
                        <p className='ml-1 mt-1 text-gray-800'>No companies found</p>
                    )}
                </div>
            </div>

        </div>
    )
}

export default SharedWithUs