import React, { useState } from 'react'
import { FaRegCopy } from 'react-icons/fa'
import { IoInformationCircle } from 'react-icons/io5'

type Props = {
    secret?: string,
    register: any,
    title: string,
    initialValue?: string,
}

const isProduction = process.env.NODE_ENV === "production"
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : "http://localhost:3000"

const ShareLinkInput = ({ secret, register, title, initialValue }: Props) => {

    const [copied, setCopied] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(initialValue || `${serverUrl}/invite/${secret}`)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 4000);
    }

    return (
        <div className="flex flex-col gap-1">
            <label
                className='text-[19px] font-semibold text-gray-800 flex gap-1'
            >
                Invitation Link:
                <IoInformationCircle
                    size={27} className='text-gray-500 mb-2 z-50 hover:cursor-pointer hover:text-gray-600' onMouseEnter={() => setOpenDialog(true)} onMouseLeave={() => setOpenDialog(false)} />
                {openDialog ?
                    <div className='flex justify-center items-center w-[320px] text-base absolute top-[105px] bg-tsgreen p-3 rounded-lg'>
                        <div className='absolute top-[70px] whitespace-pre w-0 h-0 border-t-tsgreen border-x-[25px] border-t-[25px] border-x-transparent'></div>
                        <p className='font-medium text-white '>Send this link to colleagues to add them to your organisation.</p>
                    </div>
                    :
                    <></>
                }
            </label>
            <div className="flex relative">
                <input
                    type="text"
                    readOnly
                    {...register(title)}
                    className="w-full rounded-xl tracking-wide text-lg focus:border-tsgreen focus:ring-tsgreen"
                    value={initialValue ? `${initialValue}` : `${serverUrl}/invite/${secret}`}
                />
                {copied ?
                    <p className="h-full absolute right-2 top-0 flex items-center text-green-500">Copied!</p>
                    :
                    <FaRegCopy
                        size={27}
                        className="absolute right-2 top-2 hover:cursor-pointer"
                        onClick={handleCopy}
                    />
                }
            </div>
        </div>
    )
}

export default ShareLinkInput