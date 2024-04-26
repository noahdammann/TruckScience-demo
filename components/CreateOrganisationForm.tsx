import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomInput from './CustomInput';
import FileInput from './FileInput';
import { SessionInterface } from '@/types';
import { useRouter } from 'next/navigation';
import { FaRegCopy } from 'react-icons/fa';
import { createCompany, updateUserCompany } from '@/lib/actions';
import ShareLinkInput from './ShareLinkInput';
import ReactLoading from 'react-loading';
import { generateRandomSecret } from '@/lib/support';
import { toast } from 'react-toastify';

type Props = {
    submitRef: any;
    session: SessionInterface;
    closeModalRef: any;
};

const isProduction = process.env.NODE_ENV === "production"
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : "http://localhost:3000"

const CreateOrganisationForm = ({ submitRef, session, closeModalRef }: Props) => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [secret, setSecret] = useState(() => generateRandomSecret())
    const [companyShareSecret, setCompanyShareSecret] = useState(() => generateRandomSecret())
    const [logoUrl, setLogoUrl] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const router = useRouter();

    if (!session?.user) {
        router.push('/');
    }

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        try {
            await createCompany(data, session?.user?.email, logoUrl)
            await updateUserCompany(session?.user?.email, data.Name)
            router.refresh()
            toast.success("Organisation created")
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
            closeModalRef.current.click()
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='h-full bg-white px-5 py-3 rounded-xl flex flex-col gap-3' onKeyDown={e => e.stopPropagation()}>
            {isSubmitting ?
                <div className='absolute top-0 bottom-0 left-0 right-0 bg-black/60 z-10'>
                    <ReactLoading type="spin" color='white' height={200} width={120} className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-30%]' />
                </div>
                : <></>
            }
            <CustomInput register={register} title='Name' />
            <FileInput title='Logo' value={logoUrl} setValue={setLogoUrl} />
            <ShareLinkInput secret={secret} register={register} title="InviteUrl" />
            <input
                {...register("companyInviteUrl")}
                type='hidden'
                defaultValue={`${serverUrl}/invite/company/${companyShareSecret}`}
                readOnly
            />
            <button type='submit' ref={submitRef} className='w-[0.1px] h-[0.1px] absolute bottom-[-2000px]' />
        </form>
    );
};

export default CreateOrganisationForm;
