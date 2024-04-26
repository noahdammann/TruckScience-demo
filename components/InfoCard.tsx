import React from 'react'

type Props = {
    title: string,
    value: string,
}

const InfoCard = ({ title, value }: Props) => {
    return (
        <div>
            <label
                htmlFor={value}
                className='text-xl font-semibold text-gray-800'
            >
                {title}
            </label>
            <p className="rounded-lg py-2 text-lg"
            >
                {value}
            </p>
        </div>
    )
}

export default InfoCard