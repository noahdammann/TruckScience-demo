import { Approval, CompanyResponse, Product, SessionInterface } from '@/types'
import React, { useState } from 'react'
import CustomInput from './CustomInput'
import ToggleInput from './ToggleInput'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import ReactLoading from "react-loading"
import { updateProduct } from '@/lib/actions'
import { DxfViewer } from 'dxf-viewer'
import Image from 'next/image'
import InfoCard from './InfoCard'
import { formatDate } from '@/lib/support'
import { toast } from 'react-toastify'

type Props = {
    submitRef: any,
    closeModalRef: any,
    session: SessionInterface,
    product: Product,
    setSelectedProducts: ([]) => void,
    active: string,
    company: CompanyResponse | undefined,
}

const InfoProductPopup = ({ submitRef, closeModalRef, session, product, setSelectedProducts, active, company }: Props) => {

    const [isPrivate, setIsPrivate] = useState(product.private)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        try {
            if (session?.user?.email !== product.createdByEmail) {
                toast.error("You do not have permission to edit this product")
                return
            }
            await updateProduct(data, isPrivate, product.id, session.user.email)
            router.refresh()
            toast.success("Product updated!")
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
            closeModalRef.current.click()
            setTimeout(() => {
                setSelectedProducts([])
            }, 500);
        }
    }

    if (session?.user?.email === product.createdByEmail || (active === "Company Products" && company?.company.admins && company.company.admins.includes(session?.user?.email))) {
        return (
            <>
                <form
                    className="h-min grid grid-cols-2 grid-rows-[auto_100px_100px] gap-x-10"
                    onSubmit={handleSubmit(onSubmit)}
                    onKeyDown={e => e.stopPropagation()}
                >
                    <div className='col-span-2 bg-white rounded-2xl p-8 flex items-center justify-center mb-8 border-[1px] border-gray-300'>
                        <Image
                            src="/example-dxf.webp"
                            width={380}
                            height={200}
                            alt="example truck drawing"
                        />
                    </div>
                    <CustomInput title="Make" register={register} placeholder="Heil" initialValue={product.make} />
                    <CustomInput title="Range" register={register} placeholder="ABC" initialValue={product.range} />
                    <CustomInput title="Description" register={register} placeholder="Heil 18YD DP5000" initialValue={product.description} />
                    <ToggleInput title="Private" value={isPrivate} setValue={setIsPrivate} register={register} infoText={<p>Private means that only you and the people you choose to share with, will have access.<br />If turned "off", all members of your organisation will have access by default.</p>} />

                    <button type='submit' ref={submitRef} className='absolute w-[1px] h-[1px] bottom-[-2000px]' />
                </form >

                {isSubmitting ?
                    <div className='absolute top-0 bottom-0 left-0 right-0 bg-black/60 z-10'>
                        <ReactLoading type="spin" color='white' height={200} width={120} className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-30%]' />
                    </div>
                    : <></>
                }
            </>
        )
    }
    return (
        <div className='h-min grid grid-cols-3 grid-rows-[auto_90px_90px] gap-x-10 px-5'>
            <div className='col-span-3 bg-white rounded-2xl p-8 flex items-center justify-center mb-8 border-[1px] border-gray-300'>
                <Image
                    src="/example-dxf.webp"
                    width={470}
                    height={200}
                    alt="example truck drawing"
                />
            </div>
            <InfoCard title='Make:' value={product.make} />
            <InfoCard title='Range:' value={product.range} />
            <InfoCard title='Description:' value={product.description} />
            <InfoCard title='Updated:' value={formatDate(product.updatedAt)} />
            <InfoCard title='Created by:' value={product.createdByName} />
        </div>
    )
}

export default InfoProductPopup