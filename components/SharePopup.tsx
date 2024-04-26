import { shareCompanyProductWithCompany, shareCompanyProductWithUser, shareProductsWithCompanies, shareProductsWithUsers } from '@/lib/actions'
import { CompanyCollection, CompanyCollectionNode, CompanyResponse, Product, SessionInterface, UserCollection, UserCollectionNode } from '@/types'
import Image from 'next/image'
import React, { useState } from 'react'
import ReactLoading from "react-loading"
import { formatDate } from '@/lib/support'
import { IoIosArrowDropdownCircle } from 'react-icons/io'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

type Props = {
    submitRef: any,
    closeModalRef: any,
    session: SessionInterface,
    company: CompanyResponse | undefined,
    allUsers: UserCollection,
    allCompanies: CompanyCollection,
    selectedProducts: Array<Product>,
    setSelectedProducts: ([]) => void,
    active: string,
}

const SharePopup = ({ submitRef, closeModalRef, session, company, allUsers, allCompanies, selectedProducts, setSelectedProducts, active }: Props) => {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<Array<string> | []>([]) // User emails
    const [selectedCompanies, setSelectedCompanies] = useState<Array<string> | []>([]) // Company names
    const router = useRouter()

    const users = allUsers.userCollection.edges.filter((user) => user.node.email !== session.user.email) as Array<UserCollectionNode>
    const companies = allCompanies.companyCollection.edges.filter((company) => company.node.name !== session.user.company) as Array<CompanyCollectionNode>

    const onSubmit = async () => {
        setIsSubmitting(true)
        try {

            if (active === "My Products") {
                const productsIdList = []
                for (const product of selectedProducts) {
                    productsIdList.push(product.id)
                }
                if (selectedUsers.length > 0) {
                    await shareProductsWithUsers(productsIdList, selectedUsers, session.user.name, session.user.email)
                }
                if (selectedCompanies.length > 0) {
                    await shareProductsWithCompanies(productsIdList, selectedCompanies, session.user.email)
                }
            } else if (active === "Company Products") {
                if (company && company.company.admins.includes(session.user.email)) {
                    for (const product of selectedProducts) {
                        if (selectedUsers.length > 0) {
                            for (const userEmail of selectedUsers) {
                                await shareCompanyProductWithUser(product, userEmail, session.user.email, company.company.name)
                            }
                        }
                        if (selectedCompanies.length > 0) {
                            for (const companyName of selectedCompanies) {
                                await shareCompanyProductWithCompany(product, companyName, company.company.name, session.user.email)
                            }
                        }
                    }
                }
            }

            toast.success("Sharing successful!")
        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
            closeModalRef.current.click()
            router.refresh()
            setTimeout(() => {
                setSelectedProducts([])
            }, 500);
        }
    }

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
        <div className='w-full h-5/6 flex gap-3 flex-col'>
            {isSubmitting ?
                <div className='absolute top-0 bottom-0 left-0 right-0 bg-black/60 z-10'>
                    <ReactLoading type="spin" color='white' height={200} width={120} className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-30%]' />
                </div>
                : <></>
            }
            <div className='grid grid-cols-[auto_210px_100px] items-center text-[15px] font-semibold text-gray-500 px-5 mb-[-5px] uppercase tracking-wide'>

                <p className='flex items-center'><IoIosArrowDropdownCircle className="inline mr-1" size={21} />Description</p>
                <p className='flex items-center'><IoIosArrowDropdownCircle className="inline mr-1" size={21} />Created By</p>
                <p className='flex items-center'><IoIosArrowDropdownCircle className="inline mr-1" size={21} />Updated</p>

            </div>
            <div className='w-full h-[180px] gap-5 border-[1px] border-gray-400 overflow-y-auto bg-white rounded-md'>
                {
                    selectedProducts?.map((product) => (
                        <div
                            className='grid grid-cols-[auto_210px_100px] items-center bg-white w-full h-[52px] px-5 rounded-sm border-b-[1px] border-gray-200'
                            key={product.id}
                        >
                            <p className='text-gray-600'>{product.description}</p>
                            <p className={`text-gray-600 w-[126px] ${selectedProducts.length > 2 ? "ml-5" : ""}`}>{product.createdByName}</p>
                            <p className='text-gray-600 w-[100px] text-right'>{formatDate(product.updatedAt)}</p>
                        </div>))
                }
            </div>
            <div className='w-full h-full flex gap-5'>
                <div className='w-7/12 h-full'>
                    <h2 className='text-xl font-semibold mb-2 text-center tracking-wide text-gray-700'>Share With Users:</h2>
                    <div className='w-full h-full flex flex-col bg-white border-[1px] border-gray-400 rounded-md overflow-y-auto'>
                        {users.map((user) => (
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
                    <h2 className='font-semibold text-lg mb-2 text-center tracking-wide text-gray-700'>Share With Company:</h2>
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
            <button className='absolute w-[1px] h-[1px] bottom-[-2000px]' ref={submitRef} onClick={onSubmit}></button>
        </div>
    )
}

export default SharePopup