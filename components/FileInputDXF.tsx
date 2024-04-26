import React, { ChangeEvent } from 'react'
import { CgSoftwareUpload } from 'react-icons/cg'
import DxfParser, { IDxf } from 'dxf-parser'

type Props = {
    title: string,
    value: IDxf | null,
    setValue: (value: IDxf | null) => void,
}

const FileInputDXF = ({ title, value, setValue }: Props) => {

    const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {

        e.preventDefault();

        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();
        const parser = new DxfParser()

        reader.readAsBinaryString(file)

        reader.onload = () => {
            const result = reader.result as string;

            const dxf = parser.parse(result)
            setValue(dxf)
        };
    };

    return (
        <div className="flex flex-col gap-1">

            <label
                htmlFor={title}
                className='text-xl font-semibold text-gray-800'
            >
                {title}
            </label>

            <input
                id={title}
                type="file"
                accept='dxf/*'
                required={false}
                className="w-[1px] h-[1px] absolute opacity-0"
                onChange={(e) => handleChangeFile(e)}
            />

            <label
                htmlFor={title}
            >
                <div className="flex justify-center items-center pr-6 pl-4 py-5 rounded-lg border-2 border-dashed border-gray-500 hover:cursor-pointer hover:border-gray-700">
                    <CgSoftwareUpload size={50} className='ml-[-7px] mr-[10px]' />
                    <div>
                        <p className='text-lg'>Upload a vehicle, trailer or truck</p>
                        <p className='text-md text-gray-600'>DXF file only</p>
                    </div>
                </div >
            </label>
        </div >
    )
}

export default FileInputDXF