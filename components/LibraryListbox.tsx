import { Product } from '@/constants'
import { Listbox } from '@headlessui/react'
import React, { MouseEvent, MouseEventHandler, useEffect, useRef, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { MdOutlineCheck } from 'react-icons/md'
import { RiCloseFill } from 'react-icons/ri'


type Props = {
    selectedLibrary: string[],
    setSelectedLibrary: (prev: any) => void,
    products: Product[],
    setProducts: (prev: any) => void,
    teamLibrary: Product[],
    personalLibrary: Product[],
}

const libraries = ["Personal Library", "Team Library"]

const LibraryListbox = ({ selectedLibrary, setSelectedLibrary, products, setProducts, teamLibrary, personalLibrary }: Props) => {

    const listboxRef = useRef<any>(null);

    const handleSelect = (library: string) => {
        setSelectedLibrary((prev: string[]) => {
            if (prev.includes(library)) {
                setProducts((previous: Product[]) => {
                    if (library === "Personal Library") {
                        return previous.filter(p => !personalLibrary.includes(p));
                    } else {
                        return previous.filter(p => !teamLibrary.includes(p));
                    }
                });
                return prev.filter(p => p !== library);
            } else {
                setProducts((previous: Product[]) => {
                    let newProducts: Product[] = [];
                    if (library === "Personal Library") {
                        newProducts = personalLibrary.filter(p => !previous.includes(p));
                    } else {
                        newProducts = teamLibrary.filter(p => !previous.includes(p));
                    }
                    return [...previous, ...newProducts];
                });
                return [...prev, library];
            }
        });
    };


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

    useEffect(() => {
        console.log(selectedLibrary)
    }, [selectedLibrary])

    libraries.sort()

    return (
        <Listbox multiple>
            <div ref={listboxRef} className="relative">
                <Listbox.Button
                    className={`w-48 text-[15px] flex space-between items-center border border-gray-300 rounded-sm pl-2 pr-1 py-[2.5px] focus:ring-[1.2px] focus:ring-tsgreen focus:outline-none ${selectedLibrary ? "text-gray-600" : "text-gray-400"}`}
                    onClick={() => setIsOpen(prev => !prev)}
                >
                    {selectedLibrary.length > 0 ? (
                        `${selectedLibrary[0]} ${selectedLibrary.length > 1 ? `(+${selectedLibrary.length - 1})` : ""}`
                    ) : "Select a library"}
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
                        {libraries.map((l, i) => (
                            <Listbox.Option
                                key={i}
                                className={`relative cursor-default pl-2 py-[2px] hover:bg-lime-200/70 hover:text-lime-900 text-gray-900}`}
                                value={l}
                            >
                                <label
                                    className={`flex items-center space-x-2 py-[2px]`}
                                >
                                    <input
                                        type="checkbox"
                                        className="w-3 h-3 bg-white text-lime-600 rounded-sm border focus:ring-0 focus:ring-offset-0 focus:outline-0"
                                        onChange={() => handleSelect(l)}
                                        checked={selectedLibrary.includes(l)}
                                    />
                                    <span className="flex-grow text-[15px]">{l}</span>
                                </label>
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                )}
            </div>
        </Listbox>
    )
}

export default LibraryListbox