import React, { FormEvent, useEffect, useState } from 'react';
import { Approvals, Companies, Company, CompanyCollection, CompanyCollectionNode, SessionInterface, UserCollection, UserCollectionNode } from '@/types';
import { useRouter } from 'next/navigation';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { shareCompanyWithCompany, shareCompanyWithUser, shareUserWithCompany, shareUserWithUser } from '@/lib/actions';

type Props = {
    allUsers: UserCollection,
    allCompanies: CompanyCollection,
    submitRef: any,
    session: SessionInterface,
    company: Company | undefined,
    closeModalRef: any,
    type: string
};

const AddSharingForm = ({
    submitRef,
    session,
    closeModalRef,
    allUsers,
    allCompanies,
    company,
    type,
}: Props) => {

    const [selectedUsers, setSelectedUsers] = useState<Array<string> | []>([]) // User emails
    const [selectedCompanies, setSelectedCompanies] = useState<Array<string> | []>([]) // Company names
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter();

    var users
    if (type === "user") {
        users = allUsers.userCollection.edges.filter((user) => user.node.email !== session.user.email) as Array<UserCollectionNode>

    } else {
        // @ts-ignore
        users = allUsers.userCollection.edges.filter((user) => !company.members.includes(user.node.email)) as Array<UserCollectionNode>
    }
    const companies = allCompanies.companyCollection.edges.filter((company) => company.node.name !== session.user.company) as Array<CompanyCollectionNode>

    if (!session?.user) {
        router.push('/');
    }

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (type === "organisation") {
            if (company && !company.admins.includes(session.user.email)) {
                return
            }
            if (selectedUsers.length === 0 && selectedCompanies.length === 0) {
                toast.error("No user or company selected")
                return
            }

            setIsSubmitting(true)
            try {
                if (selectedUsers.length > 0 && company) {
                    for (const userEmail of selectedUsers) {
                        await shareCompanyWithUser(userEmail, session.user.email, company.name)
                    }
                }
                if (selectedCompanies.length > 0 && company) {
                    for (const companyName of selectedCompanies) {
                        await shareCompanyWithCompany(companyName, session.user.email, company.name)
                    }
                }
                toast.success("Updated company sharing")
                closeModalRef.current.click()
                router.refresh()
            } catch (error) {
                console.log(error)
                closeModalRef.current.click()
            } finally {
                setIsSubmitting(false)
            }
        }

        else {
            if (!session.user.email) {
                return
            }
            if (selectedUsers.length === 0 && selectedCompanies.length === 0) {
                toast.error("No user or company selected")
                return
            }

            setIsSubmitting(true)
            try {
                if (selectedUsers.length > 0) {
                    for (const userEmail of selectedUsers) {
                        await shareUserWithUser(userEmail, session.user.email)
                    }
                }
                if (selectedCompanies.length > 0 && company) {
                    for (const companyName of selectedCompanies) {
                        await shareUserWithCompany(companyName, session.user.email)
                    }
                }
                toast.success("Updated sharing")
                closeModalRef.current.click()
                router.refresh()
            } catch (error) {
                console.log(error)
                closeModalRef.current.click()
            } finally {
                setIsSubmitting(false)
            }
        }

    };

    const toggleUserSelection = (id: string) => {
        setSelectedUsers((prevSelectedUsers: Array<string>) => {
            if (prevSelectedUsers.includes(id)) {
                return prevSelectedUsers.filter((item: string) => item !== id);
            } else {
                return [...prevSelectedUsers, id];
            }
        });
    }

    const toggleCompanySelection = (name: string) => {
        setSelectedCompanies((prevSelectedCompanies: Array<string>) => {
            if (prevSelectedCompanies.includes(name)) {
                return prevSelectedCompanies.filter((item: string) => item !== name);
            } else {
                return [...prevSelectedCompanies, name];
            }
        })
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
                className="h-4/5 w-full"
                onSubmit={onSubmit}
                onKeyDown={e => e.stopPropagation()}
            >
                <div className='w-full h-full flex gap-5'>

                    <div className='w-7/12 h-full'>

                        <h2 className='text-xl font-semibold mb-2 text-center tracking-wide text-gray-700'>Add User:</h2>

                        <div className='w-full h-full flex flex-col bg-white border-[1px] border-gray-400 rounded-md overflow-y-auto'>
                            {users?.map((user) => (
                                <div
                                    className='w-full bg-white p-3 pr-4 flex items-center gap-3 border-b-[1px] border-gray-200 hover:cursor-pointer hover:bg-tsblue'
                                    key={user.node.id}
                                    onClick={() => toggleUserSelection(user.node.email as string)}
                                >
                                    <input
                                        type="checkbox"
                                        className="w-[17px] h-[17px] text-blue-600 bg-white border-gray-400 rounded hover:cursor-pointer focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600"
                                        // @ts-ignore
                                        checked={selectedUsers.includes(user.node.email)}
                                        readOnly
                                    />
                                    <Image
                                        src={user.node.image || "/default-profile-picture.png"}
                                        width={30}
                                        height={30}
                                        alt="User Profile"
                                        className='rounded-full'
                                    />
                                    <h3 className='text-gray-800 tracking-wide'>{user.node.name}</h3>
                                    <h4 className='text-gray-600 italic text-sm ml-auto'>{user.node.email}</h4>
                                </div>
                            ))}

                        </div>
                    </div>
                    <div className='w-5/12 h-full'>

                        <h2 className='font-semibold text-lg mb-2 text-center tracking-wide text-gray-700'>Add Company:</h2>

                        <div className='h-full border-[1px] border-gray-400 bg-white rounded-md overflow-y-auto'>
                            {companies?.map((company) => (
                                <div
                                    className='w-full bg-white p-3 pr-4 flex items-center gap-2 border-b-[1px] border-gray-200 hover:cursor-pointer hover:bg-tsblue'
                                    key={company.node.name}
                                    onClick={() => toggleCompanySelection(company.node.name as string)}
                                >
                                    <input
                                        type="checkbox"
                                        className="w-[17px] h-[17px] text-blue-600 mr-1 bg-white border-gray-400 rounded hover:cursor-pointer focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600"
                                        //@ts-ignore
                                        checked={selectedCompanies.includes(company.node.name)}
                                        readOnly
                                    />
                                    <Image
                                        src={company.node?.logo || "/default-profile-picture.png"}
                                        width={35}
                                        height={35}
                                        alt="User Profile"
                                        className='rounded-full'
                                    />
                                    <h3 className='text-gray-800 tracking-wide'>{company.node.name}</h3>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>
                <button type="submit" ref={submitRef} className='w-[0.1px] h-[0.1px] absolute bottom-[-2000px]' />
            </form>
        </>
    );
};

export default AddSharingForm;