import { Approval, Company, Product, User } from "@/constants";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaChevronDown, FaEdit, FaLongArrowAltLeft, FaLongArrowAltRight, FaTrash } from "react-icons/fa";
import { HiChevronUpDown, HiPlus } from "react-icons/hi2"
import { RxChevronDown } from "react-icons/rx"
import { FaArrowLeftLong, FaArrowRightLong, FaRegTrashCan, FaSquarePlus } from "react-icons/fa6"
import { RiArrowDropDownLine, RiCheckFill, RiCloseFill } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io"
import { MdAddCircle, MdOutlineCheck } from "react-icons/md";
import MakeListbox from "./MakeListbox";
import RangeListbox from "./RangeListbox";
import CurrentListbox from "./CurrentListbox";
import { BsArrowLeft, BsArrowRight, BsFillPlusSquareFill, BsPlusSquareFill } from "react-icons/bs";
import { BiSolidTrashAlt } from "react-icons/bi"
import { PiPlusBold, PiPlusSquareFill } from "react-icons/pi"
import Modal from "./Modal";
import NewProductForm from "./NewProductForm";
import EditProductForm from "./EditProductForm";
import DeleteProductForm from "./DeleteProductForm";

type Props = {
    personalLibrary: Product[],
    teamLibrary: Product[],
    setPersonalLibrary: (prev: any) => void,
    setTeamLibrary: (prev: any) => void,
};

const makes = ["Hino", "Bollinger", "Isuzu", "Heil", "Battle Motors"]

const TeamLibraryManager = ({ personalLibrary, teamLibrary, setPersonalLibrary, setTeamLibrary }: Props) => {

    const [selectedPersonalProducts, setSelectedPersonalProducts] = useState<Product[]>([])
    const [selectedTeamProducts, setSelectedTeamProducts] = useState<Product[]>([])

    const [make, setMake] = useState<string[]>([]);
    const [range, setRange] = useState<string[]>([]);
    const [current, setCurrent] = useState<string[]>(["Current"]);
    const [teamMake, setTeamMake] = useState<string[]>([]);
    const [teamRange, setTeamRange] = useState<string[]>([]);
    const [teamCurrent, setTeamCurrent] = useState<string[]>(["Current"]);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchTeamQuery, setSearchTeamQuery] = useState("");

    const [isOpen, setIsOpen] = useState(false)
    const [modalType, setModalType] = useState("")

    const handlePersonalProductSelect = (product: Product) => {
        setSelectedTeamProducts([])
        if (selectedPersonalProducts.includes(product)) {
            setSelectedPersonalProducts(prev => prev.filter(p => p !== product))
        } else {
            setSelectedPersonalProducts(prev => [...prev, product])
        }
    }

    const handleTeamProductSelect = (product: Product) => {
        setSelectedPersonalProducts([])
        if (selectedTeamProducts.includes(product)) {
            setSelectedTeamProducts(prev => prev.filter(p => p !== product))
        } else {
            setSelectedTeamProducts(prev => [...prev, product])
        }
    }

    const clearQueries = () => {
        setMake([])
        setRange([])
        setCurrent(["Current"])
        setSelectedPersonalProducts([])
    }

    const clearTeamQueries = () => {
        setTeamMake([])
        setTeamRange([])
        setTeamCurrent(["Current"])
        setSelectedTeamProducts([])
    }

    const handleMoveProduct = () => {
        setPersonalLibrary((prev: Product[]) => prev.filter(p => !selectedPersonalProducts.includes(p)))
        setTeamLibrary((prev: Product[]) => [...prev, ...selectedPersonalProducts])
        setSelectedPersonalProducts([])
    }

    const handleMoveTeamProduct = () => {
        setTeamLibrary((prev: Product[]) => prev.filter(p => !selectedTeamProducts.includes(p)))
        setPersonalLibrary((prev: Product[]) => [...prev, ...selectedTeamProducts])
        setSelectedTeamProducts([])
    }

    const openModal = (type: string) => {
        setModalType(type)
        setIsOpen(true)
    }

    personalLibrary.sort((a, b) => a.description.localeCompare(b.description, undefined, { sensitivity: 'base' }))

    teamLibrary.sort((a, b) => a.description.localeCompare(b.description, undefined, { sensitivity: 'base' }))

    return (
        <div className="h-full flex justify-start gap-4">

            {/* Personal library column */}
            <div className="w-1/2 max-w-[500px] h-full flex flex-col">

                <h2 className="h-auto text-lg font-semibold pl-2 pb-[5px] text-center">Personal library</h2>

                <div className="w-full grow border border-gray-300 pt-2 flex flex-col overflow-y-hidden">

                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-auto text-[15px] px-2 py-[2px] border border-gray-300 rounded-sm mx-2 mb-1 focus:ring-[1.2px] focus:ring-tsgreen focus:outline-none focus:border-gray-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <div className="flex px-2 gap-1 mb-1">

                        <MakeListbox
                            makes={Array.from(new Set(personalLibrary.filter(item => current.includes(item.current)).map(item => item.make)))}
                            make={make}
                            setMake={setMake}
                        />

                        <RangeListbox
                            ranges={make.length > 0 ? Array.from(new Set(personalLibrary.filter(item => make.includes(item.make)).map(item => item.range))) : Array.from(new Set(personalLibrary.map(item => item.range)))}
                            range={range}
                            setRange={setRange}
                        />

                        <CurrentListbox
                            current={current}
                            setCurrent={setCurrent}
                        />

                        <button
                            className="flex items-center ml-auto text-gray-700/90 hover:text-black"
                            onClick={clearQueries}
                        >
                            <RiCloseFill size={25} />
                        </button>

                    </div>

                    <div className="flex-grow pl-[2px] overflow-y-auto mt-[1px]">
                        <ul>
                            {personalLibrary
                                .filter(product => {
                                    const regex = new RegExp(searchQuery, 'i') // 'i' flag for case-insensitive matching
                                    return regex.test(product.description)
                                })
                                .filter(product => {
                                    if (make.length === 0) {
                                        return true // If no make is selected, show all products
                                    }
                                    return make.includes(product.make)
                                })
                                .filter(product => {
                                    if (range.length === 0) {
                                        return true // If no range is selected, show all products
                                    }
                                    return range.includes(product.range)
                                })
                                .filter(product => {
                                    if (current.length === 0) {
                                        return true // If no current is selected, show all products
                                    }
                                    return current.includes(product.current)
                                })
                                .map(product => (
                                    <li key={product.description}>
                                        <label className={`flex items-center space-x-2 pl-2 py-[2px] ${selectedPersonalProducts.includes(product) ? "bg-[#1e90ff] text-white" : ""}`}>
                                            <input
                                                type="checkbox"
                                                onChange={() => handlePersonalProductSelect(product)}
                                                checked={selectedPersonalProducts.includes(product)}
                                                className="w-[13px] h-[13px] bg-white text-blue-500 rounded-sm border focus:ring-0 focus:ring-offset-0 focus:outline-0"
                                            />
                                            <span className="flex-grow text-[15px]">{product.description}</span>
                                        </label>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>

                <div className="h-[35px] flex gap-3 justify-end items-center pt-[6px] pr-1 text-gray-800/90">
                    <HiPlus
                        size={26}
                        className="translate-y-[1px] hover:text-gray-800 hover:cursor-pointer stroke-[1.2]"
                        onClick={() => openModal("add")}
                    />
                    <button
                        onClick={() => openModal("edit")}
                        disabled={selectedPersonalProducts.length !== 1}
                    >
                        <FaEdit
                            size={25}
                            className={`${selectedPersonalProducts.length === 1 ? "hover:text-gray-800 hover:cursor-pointer" : "text-gray-400"}`}
                        />
                    </button>
                    <button
                        onClick={() => openModal("delete")}
                        disabled={selectedPersonalProducts.length < 1}
                    >
                        <BiSolidTrashAlt
                            size={25}
                            className={`${selectedPersonalProducts.length > 0 ? "hover:text-gray-800 hover:cursor-pointer" : "text-gray-400"}`}
                        />
                    </button>
                </div>

            </div>

            {/* Transfer buttons */}
            <div className="w-[62px] mt-32 flex flex-col gap-[6px]">
                <button
                    onClick={() => handleMoveProduct()}
                    className={`rounded-sm py-1 flex items-center justify-center ${selectedPersonalProducts.length > 0 ? "text-gray-700 bg-[#d5d7dd] hover:bg-gray-300" : "text-gray-400 bg-[#e4e5e9] hover:cursor-default"}`}
                    disabled={!(selectedPersonalProducts.length > 0)}
                >
                    <BsArrowRight size={28} />
                </button>
                <button
                    onClick={() => handleMoveTeamProduct()}
                    className={`rounded-sm py-1 flex items-center justify-center ${selectedTeamProducts.length > 0 ? "text-gray-700 bg-[#d5d7dd] hover:bg-gray-300" : "text-gray-400 bg-[#e4e5e9] hover:cursor-default"}`}
                    disabled={!(selectedTeamProducts.length > 0)}
                >
                    <BsArrowLeft size={28} />
                </button>
            </div>

            {/* Team library column */}
            <div className="w-1/2 max-w-[500px] h-full flex flex-col">

                <h2 className="h-[33px] text-lg font-semibold pl-2 pb-[5px] text-center">Team library</h2>

                <div className="w-full grow border border-gray-300 pt-2 flex flex-col overflow-y-hidden">

                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-auto text-[15px] px-2 py-[2px] border border-gray-300 rounded-sm mx-2 mb-1 focus:ring-[1.2px] focus:ring-tsgreen focus:outline-none focus:border-gray-300"
                        value={searchTeamQuery}
                        onChange={(e) => setSearchTeamQuery(e.target.value)}
                    />

                    <div className="flex px-2 gap-1 mb-1">

                        <MakeListbox
                            makes={Array.from(new Set(teamLibrary.filter(item => teamCurrent.includes(item.current)).map(item => item.make)))}
                            make={teamMake}
                            setMake={setTeamMake}
                        />

                        <RangeListbox
                            ranges={teamMake.length > 0 ? Array.from(new Set(teamLibrary.filter(item => teamMake.includes(item.make)).map(item => item.range))) : Array.from(new Set(teamLibrary.map(item => item.range)))}
                            range={teamRange}
                            setRange={setTeamRange}
                        />

                        <CurrentListbox
                            current={teamCurrent}
                            setCurrent={setTeamCurrent}
                        />

                        <button
                            className="flex items-center ml-auto text-gray-700/90 hover:text-black"
                            onClick={clearTeamQueries}
                        >
                            <RiCloseFill size={25} />
                        </button>

                    </div>

                    <div className="flex-grow pl-[2px] overflow-y-auto mt-[1px]">
                        <ul>
                            {teamLibrary
                                .filter(product => {
                                    const regex = new RegExp(searchTeamQuery, 'i') // 'i' flag for case-insensitive matching
                                    return regex.test(product.description)
                                })
                                .filter(product => {
                                    if (make.length === 0) {
                                        return true // If no make is selected, show all products
                                    }
                                    return teamMake.includes(product.make)
                                })
                                .filter(product => {
                                    if (teamRange.length === 0) {
                                        return true // If no range is selected, show all products
                                    }
                                    return teamRange.includes(product.range)
                                })
                                .filter(product => {
                                    if (teamCurrent.length === 0) {
                                        return true // If no make is selected, show all products
                                    }
                                    return teamCurrent.includes(product.current)
                                })
                                .map(product => (
                                    <li key={product.description}>
                                        <label className={`flex items-center space-x-2 pl-2 py-[2px] ${selectedTeamProducts.includes(product) ? "bg-[#1e90ff] text-white" : ""}`}>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleTeamProductSelect(product)}
                                                checked={selectedTeamProducts.includes(product)}
                                                className="w-[13px] h-[13px] bg-white text-blue-500 rounded-sm border focus:ring-0 focus:ring-offset-0 focus:outline-0"
                                            />
                                            <span className="flex-grow text-[15px]">{product.description}</span>
                                        </label>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>

                <div className="h-[35px] flex gap-3 justify-end items-center pt-[6px] pr-1 text-gray-800/90">
                    <HiPlus
                        size={26}
                        className="translate-y-[1px] hover:text-gray-800 hover:cursor-pointer stroke-[1.2]"
                        onClick={() => openModal("team add")}
                    />
                    <button
                        onClick={() => openModal("team edit")}
                        disabled={selectedTeamProducts.length !== 1}
                    >
                        <FaEdit
                            size={25}
                            className={`${selectedTeamProducts.length === 1 ? "hover:text-gray-800 hover:cursor-pointer" : "text-gray-400"}`}
                        />
                    </button>
                    <button
                        onClick={() => openModal("team delete")}
                        disabled={selectedTeamProducts.length < 1}
                    >
                        <BiSolidTrashAlt
                            size={25}
                            className={`${selectedTeamProducts.length > 0 ? "hover:text-gray-800 hover:cursor-pointer" : "text-gray-400"}`}
                        />
                    </button>
                </div>

            </div>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} >
                {
                    modalType === "add" ?
                        <NewProductForm
                            closeModal={() => setIsOpen(false)}
                            setPersonalLibrary={setPersonalLibrary}
                            setSelectedPersonalProducts={setSelectedPersonalProducts}
                            setTeamLibrary={setTeamLibrary}
                            setSelectedTeamProducts={setSelectedTeamProducts}
                            selectedLibrary="Personal Library"
                        />
                        : modalType === "edit" ?
                            <EditProductForm
                                closeModal={() => setIsOpen(false)}
                                product={selectedPersonalProducts[0]}
                                setPersonalLibrary={setPersonalLibrary}
                                setTeamLibrary={setTeamLibrary}
                                setSelectedProducts={setSelectedPersonalProducts}
                                selectedLibrary="Personal Library"
                            />
                            : modalType === "delete" ?
                                <DeleteProductForm
                                    closeModal={() => setIsOpen(false)}
                                    selectedProducts={selectedPersonalProducts}
                                    setSelectedProducts={setSelectedPersonalProducts}
                                    setPersonalLibrary={setPersonalLibrary}
                                    setTeamLibrary={setTeamLibrary}
                                />
                                : modalType === "team add" ?
                                    <NewProductForm
                                        closeModal={() => setIsOpen(false)}
                                        setPersonalLibrary={setPersonalLibrary}
                                        setSelectedPersonalProducts={setSelectedPersonalProducts}
                                        setTeamLibrary={setTeamLibrary}
                                        setSelectedTeamProducts={setSelectedTeamProducts}
                                        selectedLibrary="Team Library"
                                    />
                                    : modalType === "team edit" ?
                                        <EditProductForm
                                            closeModal={() => setIsOpen(false)}
                                            product={selectedTeamProducts[0]}
                                            setPersonalLibrary={setPersonalLibrary}
                                            setTeamLibrary={setTeamLibrary}
                                            setSelectedProducts={setSelectedTeamProducts}
                                            selectedLibrary="Team Library"
                                        />
                                        : modalType === "team delete" ?
                                            <DeleteProductForm
                                                closeModal={() => setIsOpen(false)}
                                                selectedProducts={selectedTeamProducts}
                                                setSelectedProducts={setSelectedTeamProducts}
                                                setPersonalLibrary={setPersonalLibrary}
                                                setTeamLibrary={setTeamLibrary}
                                            />
                                            : <></>
                }
            </Modal>

        </div>
    );
};

export default TeamLibraryManager;
