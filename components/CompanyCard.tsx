import { Company } from '@/constants'
import { Disclosure } from '@headlessui/react'
import React from 'react'
import { RxDropdownMenu } from 'react-icons/rx'

type Props = {
    company: Company,
    selectedCompany: string,
    handleCompanySelect: (companyName: string) => void,
    handleCompanyCloseDropdown: (companyName: string) => void,
    companySelectedProducts: { company: string, product: string }[],
    handleCompanyProductSelect: (companyName: string, product: string) => void,
}

const CompanyCard = ({ company, selectedCompany, handleCompanySelect, handleCompanyCloseDropdown, companySelectedProducts, handleCompanyProductSelect }: Props) => {
    return (
        <li>
            <Disclosure>
                {({ open }) => (
                    <>
                        <label className={`flex items-center space-x-2 px-2 py-[2px] ${selectedCompany === company.name ? "bg-[#1e90ff] text-white" : ""}`}>
                            <input
                                type="checkbox"
                                onChange={() => handleCompanySelect(company.name)}
                                checked={selectedCompany.includes(company.name)}
                                className="text-blue-500"
                            />
                            <span className="flex-grow">{company.name}</span>
                            {
                                company.products.length > 0 && (
                                    <Disclosure.Button>
                                        <RxDropdownMenu
                                            className={`hover:cursor-pointer text-gray-800 hover:stroke-[0.2] hover:text-black ${open ? "rotate-180" : ""}`}
                                            size={20}
                                            onClick={() => { open && handleCompanyCloseDropdown(company.name) }}
                                        />
                                    </Disclosure.Button>
                                )
                            }
                        </label>
                        <Disclosure.Panel>
                            {open && (
                                <ul className="ml-6">
                                    {company.products.map((product, index) => (
                                        <li key={index}>
                                            <label className={`flex items-center space-x-2 px-2 py-[2px] ${companySelectedProducts.some((c) => c.company === company.name && c.product === product) ? "bg-[#1e90ff] text-white" : "text-gray-700"}`}>
                                                <input
                                                    type="checkbox"
                                                    onChange={() => handleCompanyProductSelect(company.name, product)}
                                                    checked={companySelectedProducts.some((c) => c.company === company.name && c.product === product)}
                                                    className="text-blue-500"
                                                />
                                                <span className="flex-grow italic">{product}</span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </li>
    )
}

export default CompanyCard