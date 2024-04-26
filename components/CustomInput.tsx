"use client"

import { useEffect, useState } from "react"

type Props = {
    title: string,
    register: any,
    initialValue?: any,
    placeholder?: string
}

const CustomInput = ({ title, register, initialValue, placeholder }: Props) => {

    return (
        <div className="flex flex-col gap-1">
            <label
                htmlFor={title}
                className='text-[19px] font-semibold text-gray-800'
            >
                {title}
            </label>
            <input
                {...register(title)}
                id={title}
                defaultValue={initialValue || ""}
                className="rounded-lg py-2 text-lg placeholder:text-gray-500/90 focus:border-tsgreen focus:ring-tsgreen"
                placeholder={placeholder ? placeholder : "Example"}
            />
        </div>
    )
}

export default CustomInput