import CustomInput from './CustomInput'
import { useForm } from 'react-hook-form'
import FileInputDXF from './FileInputDXF'
import { useState } from 'react'
import ToggleInput from './ToggleInput'
import { IDxf } from 'dxf-parser'
import { createProduct } from '@/lib/actions'
import { SessionInterface } from '@/types'
import ReactLoading from 'react-loading'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

type Props = {
    submitRef: any,
    closeModalRef: any,
    session: SessionInterface,
    setSelectedProducts: ([]) => void,
}

const CreateProductForm = ({ submitRef, session, closeModalRef, setSelectedProducts }: Props) => {

    const [dxfFile, setDxfFile] = useState<IDxf | null>(null)
    const [isPrivate, setIsPrivate] = useState(false)
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm()

    // if (!session) {
    //     router.push("/login")
    // }

    const onSubmit = async (data: any) => {

        if (!session) {
            toast.error("Sign in before creating a product")
            return
        }

        setIsSubmitting(true)
        try {
            await createProduct(data, isPrivate, JSON.stringify(dxfFile), session?.user?.email, session?.user?.name)
            toast.success("Product created!")
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
            setSelectedProducts([])
            router.refresh()
            closeModalRef.current.click()
        }
    }

    return (
        <>
            {isSubmitting ?
                <div className='absolute top-0 bottom-0 left-0 right-0 bg-black/60 z-10'>
                    <ReactLoading type="spin" color='white' height={200} width={120} className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-30%]' />
                </div>
                : <></>
            }
            <form
                className="h-min grid grid-cols-2 grid-rows-[100px_100px_150px] gap-x-10"
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={e => e.stopPropagation()}
            >
                <CustomInput title="Make" register={register} placeholder="Heil" />
                <CustomInput title="Range" register={register} placeholder="ABC" />
                <CustomInput title="Description" register={register} placeholder="Heil 18YD DP5000" />
                <ToggleInput title="Private" value={isPrivate} setValue={setIsPrivate} register={register} infoText={<p>Private means that only you and the people you choose to share with will have access.<br />If turned "off", all members of your organisation will have access by default.</p>} />
                <FileInputDXF title="File" value={dxfFile} setValue={setDxfFile} />

                <button type='submit' ref={submitRef} className='absolute w-[1px] h-[1px] bottom-[-2000px]' />
            </form >
        </>
    )
}

export default CreateProductForm