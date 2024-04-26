"use client"

import Image from "next/image"
import { ChangeEvent, useEffect, useState } from "react"
import { CgSoftwareUpload } from "react-icons/cg"

type Props = {
    title: string,
    value: string,
    setValue: (value: string) => void,
}

const FileInput = ({ title, value, setValue }: Props) => {

    const [file, setFile] = useState<any>(null)
    const [preview, setPreview] = useState<any>("")

    useEffect(() => {
        if (!file) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [file])

    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setFile(e.target.files?.[0])

        const image = e.target.files?.[0];

        if (!image) return;

        if (!image.type.includes('image')) {
            alert('Please upload an image!');

            return;
        }

        const reader = new FileReader();

        reader.readAsDataURL(image);

        reader.onload = () => {
            const result = reader.result as string;

            setValue(result)
        };
    };

    return (
        <div className="flex flex-col relative">

            <label
                htmlFor={title}
                className='text-[19px] font-semibold text-gray-800 mb-2'
            >
                {title}
            </label>

            <input
                id={title}
                type="file"
                accept='image/*'
                required={false}
                className="w-[1px] h-[1px] absolute opacity-0"
                onChange={(e) => handleChangeImage(e)}
            />

            <label
                htmlFor={title}
                className="w-fit"
            >
                {(value && !preview) && (
                    <div className="h-[100px] w-[100px] flex items-center border-[1px] border-gray-300 overflow-hidden rounded-full mb-3">
                        <Image src={value} alt="preview upload" width={100} height={100} className="rounded-full object-contain w-auto h-auto" />
                    </div>
                )}
                {preview && (
                    <div className="h-[100px] w-[100px] flex items-center border-[1px] border-gray-300 overflow-hidden rounded-full mb-1">
                        <Image src={preview} alt="preview upload" width={100} height={100} className="rounded-full object-contain w-auto h-auto" />
                    </div>
                )}
                <div className="flex items-center mt-4">
                    <div className="flex hover:cursor-pointer gap-1 w-fit pl-3 pr-4 py-1 text-blue-500 border-[1px] rounded-sm border-blue-500 justify-center items-center">
                        <CgSoftwareUpload size={27} />
                        <p className="text-lg">{preview ? "New File" : "Upload File"}</p>
                    </div>
                    {file && (
                        <p className="text-md mb-2 text-gray-700 ml-3 mt-[6px]">{file?.name}</p>
                    )}
                </div>
            </label>

        </div>
    )
}

export default FileInput