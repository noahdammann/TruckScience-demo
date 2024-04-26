import { Switch } from '@headlessui/react'
import React, { useState } from 'react'
import { IoInformationCircle } from 'react-icons/io5'

type Props = {
    value: boolean,
    setValue: any,
    title: string,
    register: any,
    infoText: any,
}

const ToggleInput = ({ title, register, infoText, value, setValue }: Props) => {

    const [openDialog, setOpenDialog] = useState(false)

    return (
        <div>
            <div className='flex items-center relative'>
                <label
                    htmlFor={title}
                    className='text-xl font-semibold text-gray-800 mb-2'
                >
                    {title}
                </label>
                {infoText ?
                    <IoInformationCircle size={27} className='text-gray-500 ml-2 mb-2 z-50 hover:cursor-pointer hover:text-gray-600' onMouseEnter={() => setOpenDialog(true)} onMouseLeave={() => setOpenDialog(false)} />
                    :
                    <></>
                }
                {openDialog ?
                    <div className='flex justify-center items-center w-[350px] text-base absolute top-[-130px] bg-tsgreen text-white p-3 rounded-lg'>
                        <div className='absolute whitespace-pre bottom-[-22px] left-[64px] w-0 h-0 border-t-tsgreen border-x-[25px] border-t-[25px] border-x-transparent'></div>
                        {infoText}
                    </div>
                    :
                    <></>
                }
            </div>

            <Switch
                checked={value}
                onChange={() => setValue((prev: boolean) => !prev)}
                className={`${value ? 'bg-tsgreen' : 'bg-gray-400'} relative inline-flex h-9 w-16 items-center rounded-full`}
            >
                <span className="sr-only">Enable notifications</span>
                <span
                    className={`${value ? 'translate-x-8' : 'translate-x-1'
                        } inline-block h-7 w-7 transform rounded-full bg-white transition`}
                />
            </Switch>
        </div>
    )
}

export default ToggleInput