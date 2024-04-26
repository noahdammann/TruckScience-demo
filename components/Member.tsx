import Image from 'next/image'
import React from 'react'
import { GoKebabHorizontal } from 'react-icons/go'

type Props = {
    imageSrc: string,
    name: string,
    admin: boolean,
    hasAdministratorPrivilages: boolean
}

const Member = ({ imageSrc, name, admin, hasAdministratorPrivilages }: Props) => {
    return (
        <div className="flex items-center bg-gray-200 p-[9px] rounded-lg">
            <Image
                src={imageSrc}
                width={33}
                height={33}
                alt="profile"
                className="rounded-full"
            />
            <h4 className="ml-[11px] text-lg">{name}</h4>
            <div className="flex items-center gap-4 ml-auto mr-2 hover:cursor-pointer">
                <p className="text-gray-700">{admin ? "Admin" : "Member"}</p>
            </div>
        </div>
    )
}

export default Member