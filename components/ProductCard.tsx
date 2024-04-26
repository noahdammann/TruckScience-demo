import { Company, Product, SharedWith } from '@/constants';
import { Disclosure } from '@headlessui/react';
import React from 'react'
import { RxDropdownMenu } from 'react-icons/rx';

type Props = {
    product: Product,
    companies: Company[],
    selectedProducts: Product[],
    handleProductSelect: (product: string) => void,
    handleCompanyCloseDropdown: (companyName: string) => void,
    getSharedWith: (product: Product) => SharedWith[],
    selectedSharedWith: SharedWith[],
    handleSelectSharedWith: (sw: SharedWith) => void,
}

const ProductCard = ({ product, companies, selectedProducts, handleProductSelect, handleCompanyCloseDropdown, getSharedWith, selectedSharedWith, handleSelectSharedWith }: Props) => {
    return (
        <li>
            <Disclosure>
                {({ open }) => (
                    <>
                        <label className={`flex items-center space-x-2 px-2 py-[2px] ${selectedProducts.includes(product) ? "bg-[#1e90ff] text-white" : ""}`}>
                            <input
                                type="checkbox"
                                onChange={() => handleProductSelect(product)}
                                checked={selectedProducts.includes(product)}
                                className="text-blue-500"
                            />
                            <span className="flex-grow">{product}</span>
                            {(() => {
                                let infoDisplayed = false;
                                for (let i = 0; i < companies.length; i++) {
                                    const company = companies[i];
                                    if (company.products.includes(product)) {
                                        infoDisplayed = true;
                                        return (
                                            <Disclosure.Button>
                                                <RxDropdownMenu
                                                    className={`hover:cursor-pointer text-gray-800 hover:stroke-[0.2] hover:text-black ${open ? "rotate-180" : ""}`}
                                                    size={20}
                                                    onClick={() => { open && handleCompanyCloseDropdown(company.name) }}
                                                />
                                            </Disclosure.Button>
                                        )
                                    } else if (company.users) {

                                        for (let j = 0; j < company.users.length; j++) {
                                            const user = company.users[j];
                                            if (user.products.includes(product)) {
                                                infoDisplayed = true;
                                                return (
                                                    <Disclosure.Button>
                                                        <RxDropdownMenu
                                                            className={`hover:cursor-pointer text-gray-800 hover:stroke-[0.2] hover:text-black ${open ? "rotate-180" : ""}`}
                                                            size={20}
                                                            onClick={() => { open && handleCompanyCloseDropdown(company.name) }}
                                                        />
                                                    </Disclosure.Button>
                                                )
                                            }
                                        }
                                    }
                                }
                                if (!infoDisplayed) {
                                    return null;
                                }
                            })()}
                        </label>
                        <Disclosure.Panel>
                            {open && (
                                <>
                                    {getSharedWith(product) && (
                                        <ul className="ml-6">
                                            <li>
                                                <label className="ml-[-24px] flex items-center space-x-2 px-2 py-[2px] text-gray-700">
                                                    <span className="flex-grow italic">Shared with:</span>
                                                </label>
                                            </li>
                                            {getSharedWith(product).map((sw, index) => (
                                                <li key={index}>
                                                    <label className={`flex items-center space-x-2 px-2 py-[2px] ${(selectedSharedWith.some((s) => s.name === sw.name && s.product === sw.product)) ? "bg-[#1e90ff] text-white" : "text-gray-700"}`}>
                                                        <input
                                                            type="checkbox"
                                                            onChange={() => handleSelectSharedWith(sw)}
                                                            checked={selectedSharedWith.some((s) => s.name === sw.name && s.product === sw.product)}
                                                            className="text-blue-500"
                                                        />
                                                        <span className="flex-grow italic">{sw.name}</span>
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </li>
    )
}

export default ProductCard