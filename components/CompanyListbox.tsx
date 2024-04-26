import { Listbox } from '@headlessui/react'
import React, { useEffect, useRef, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa';
import { RiCloseFill } from 'react-icons/ri';

type Props = {
    companies: string[],
    filterCompanies: string[],
    setFilterCompanies: (prev: any) => void,
}

const CompanyListbox = ({ companies, filterCompanies, setFilterCompanies }: Props) => {

    const listboxRef = useRef<any>(null);

    const handleSelect = (company: string) => {
        setFilterCompanies((prev: string[]) => {
            if (prev.includes(company)) {
                return prev.filter((item) => item !== company);
            } else {
                return [...prev, company];
            }
        });
    };

    const handleClear = () => {
        setFilterCompanies([])
        setIsOpen(false)
    }

    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (listboxRef.current && !listboxRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside as any);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside as any);
        };
    }, []);

    companies.sort()

    return (
        <Listbox multiple>
            <div ref={listboxRef} className="w-full relative">
                <Listbox.Button
                    className={`w-full text-[15px] flex space-between items-center border border-gray-300 rounded-sm pl-2 pr-1 py-[2.5px] focus:ring-[1.2px] focus:ring-tsgreen focus:outline-none ${filterCompanies ? "text-gray-600" : "text-gray-400"}`}
                    onClick={() => setIsOpen(prev => !prev)}
                >
                    {filterCompanies.length > 0 ? (
                        `${filterCompanies[0]} ${filterCompanies.length > 1 ? `(+${filterCompanies.length - 1})` : ""}`
                    ) : "Company"}
                    <FaChevronDown
                        size={10}
                        className="ml-auto text-gray-600"
                    />
                </Listbox.Button>
                {isOpen && (
                    <Listbox.Options
                        static
                        className="absolute w-full max-h-[350px] overflow-y-auto border border-gray-300 bg-white text-gray-600"
                    >
                        {filterCompanies && (
                            <div
                                className="relative cursor-pointer pl-7 py-[2px] text-gray-900 hover:font-medium"
                                onClick={() => handleClear()}
                            >
                                <span>Clear</span>
                                <span className="absolute inset-y-0 pl-1 left-0 top-0 flex items-center text-black">
                                    <RiCloseFill size={22} />
                                </span>
                            </div>
                        )}
                        {companies.map((c, i) => (
                            <Listbox.Option
                                key={i}
                                className={`relative cursor-default pl-2 py-[2px] hover:bg-lime-200/70 hover:text-lime-900 text-gray-900}`}
                                value={c}
                            >
                                <label
                                    className={`flex items-center space-x-2 py-[2px]`}
                                >
                                    <input
                                        type="checkbox"
                                        className="w-3 h-3 bg-white text-lime-600 rounded-sm border focus:ring-0 focus:ring-offset-0 focus:outline-0"
                                        onClick={() => handleSelect(c)}
                                        checked={filterCompanies.includes(c)}
                                    />
                                    <span className="flex-grow text-[15px] pr-2">{c}</span>
                                </label>
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                )}
            </div>
        </Listbox>
    )
}

export default CompanyListbox