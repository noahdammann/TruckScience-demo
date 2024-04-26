import React, { useEffect, useState } from 'react'
import { Approval, Company, Product, User, dummyCompanies, dummySharedProducts, dummyUsers } from "@/constants"
import Modal from './Modal'
import NewProductForm from './NewProductForm'
import EditProductForm from './EditProductForm'
import DeleteProductForm from './DeleteProductForm'
import MakeListbox from './MakeListbox'
import RangeListbox from './RangeListbox'
import CurrentListbox from './CurrentListbox'
import { RiCloseFill } from 'react-icons/ri'
import { HiPlus } from 'react-icons/hi2'
import { FaChevronDown, FaEdit } from 'react-icons/fa'
import { BiSolidTrashAlt } from 'react-icons/bi'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'
import { Listbox } from '@headlessui/react'
import LibraryListbox from './LibraryListbox'
import DistributorListbox from './DistributorListbox'
import NewCompanyForm from './NewCompanyForm'
import NewUserForm from './NewUserForm'
import CompanyListbox from './CompanyListbox'
import EditCompanyForm from './EditCompanyForm'
import EditUserForm from './EditUserForm'
import DeleteUserForm from './DeleteUserForm'
import DeleteCompanyForm from './DeleteCompanyForm'

type Props = {
    personalLibrary: Product[],
    setPersonalLibrary: (prev: any) => void,
    teamLibrary: Product[],
    setTeamLibrary: (prev: any) => void,
    preData: boolean,
}

const DistributionManager = ({ personalLibrary, teamLibrary, setPersonalLibrary, setTeamLibrary, preData }: Props) => {

    // Database state
    const [products, setProducts] = useState<Product[]>(personalLibrary)
    const [sharedProducts, setSharedProducts] = useState<Product[]>([])
    const [companies, setCompanies] = useState<Company[]>([])
    const [users, setUsers] = useState<User[]>([])

    const [storageCompanies, setStorageCompanies] = useState<Company[]>([])
    const [storageUsers, setStorageUsers] = useState<User[]>([])

    // Selected state
    const [selectedDistributor, setSelectedDistributor] = useState<string>("Companies")
    const [selectedLibrary, setSelectedLibrary] = useState<string[]>(["Personal Library"])
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
    const [selectedSharedProducts, setSelectedSharedProducts] = useState<Product[]>([])

    const [searchQuery, setSearchQuery] = useState("");
    const [searchDistributorQuery, setSearchDistributorQuery] = useState("")

    const [make, setMake] = useState<string[]>([])
    const [range, setRange] = useState<string[]>([])
    const [current, setCurrent] = useState<string[]>(["Current"])

    const [sharedSearchQuery, setSharedSearchQuery] = useState("");
    const [sharedMake, setSharedMake] = useState<string[]>([])
    const [sharedRange, setSharedRange] = useState<string[]>([])
    const [sharedCurrent, setSharedCurrent] = useState<string[]>(["Current"])

    const [filterCompanies, setFilterCompanies] = useState<string[]>([])

    const [isOpen, setIsOpen] = useState(false)
    const [modalType, setModalType] = useState("")

    const openModal = (type: string) => {
        setModalType(type)
        setIsOpen(true)
    }

    const clearQueries = () => {
        setMake([])
        setRange([])
        setCurrent(["Current"])
        setSearchQuery("")
        setSelectedLibrary(["Personal Library"])
        setProducts(personalLibrary)
        setSelectedProducts([])
    }

    const clearSharedQueries = () => {
        setSharedMake([])
        setSharedRange([])
        setSharedCurrent(["Current"])
        setSharedSearchQuery("")
        setSelectedSharedProducts([])
    }

    const handleSelectProduct = (product: Product) => {
        setSelectedSharedProducts([])
        setSelectedProducts((prev: Product[]) => {
            if (prev.includes(product)) {
                return prev.filter(item => item !== product)
            } else {
                return [...prev, product]
            }
        })
    }

    const handleSelectSharedProduct = (product: Product) => {
        setSelectedProducts([])
        setSelectedSharedProducts((prev: Product[]) => {
            if (prev.includes(product)) {
                return prev.filter(item => item !== product)
            } else {
                return [...prev, product]
            }
        })
    }

    const handleMoveProduct = () => {
        setSharedProducts((prev: Product[]) => {
            const newSharedProducts = selectedProducts.filter(item => !sharedProducts.includes(item))
            return [...prev, ...newSharedProducts]
        })
        setSelectedProducts([])
    }

    const handleMoveSharedProduct = () => {
        setSharedProducts((prev: Product[]) => prev.filter(item => !selectedSharedProducts.includes(item)))
        setSelectedSharedProducts([])
    }

    const handleCompanySelect = (companyName: string) => {
        if (selectedCompanies.includes(companyName)) {
            setSelectedCompanies((prev: string[]) => prev.filter(item => item !== companyName))
        } else {
            setSelectedCompanies((prev: string[]) => [...prev, companyName])
        }
    }

    const handleUserSelect = (user: User) => {
        setSelectedUsers((prev: User[]) => {
            if (prev.includes(user)) {
                return prev.filter(item => item !== user)
            } else {
                return [...prev, user]
            }
        })
    }

    useEffect(() => {
        if (selectedLibrary.length === 1 && selectedLibrary[0] === "Personal Library") {
            setProducts(personalLibrary)
        } else if (selectedLibrary.length === 1) {
            setProducts(teamLibrary)
        } else {
            setProducts([...personalLibrary, ...teamLibrary])
        }
    }, [personalLibrary, teamLibrary])

    useEffect(() => {
        if (preData) {
            setCompanies(dummyCompanies)
            setUsers(dummyUsers)

            setSharedProducts(dummySharedProducts)

            setStorageCompanies(companies)
            setStorageUsers(users)
        } else {
            setCompanies(storageCompanies)
            setUsers(storageUsers)

            setSharedProducts([])
        }
    }, [preData])

    useEffect(() => {
        setSelectedCompanies([])
        setSelectedUsers([])
    }, [selectedDistributor, companies, users])

    products.sort((a, b) => a.description.localeCompare(b.description, undefined, { sensitivity: 'base' }));

    sharedProducts.sort((a, b) => a.description.localeCompare(b.description, undefined, { sensitivity: 'base' }))

    users.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))

    companies.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))

    return (
        <div className="h-full flex justify-start gap-4">

            {/* Products column */}
            <div className="w-1/3 max-w-[500px] h-full flex flex-col">

                <h2 className="h-auto text-lg font-semibold pl-2 pb-[5px] text-center">Products</h2>

                <div className="w-full grow border border-gray-300 pt-2 flex flex-col overflow-y-hidden">

                    <div className='flex w-full px-2 z-50 gap-1'>

                        <LibraryListbox
                            selectedLibrary={selectedLibrary}
                            setSelectedLibrary={setSelectedLibrary}
                            products={products}
                            setProducts={setProducts}
                            personalLibrary={personalLibrary}
                            teamLibrary={teamLibrary}
                        />

                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-grow w-auto text-[15px] py-[2px] border border-gray-300 rounded-sm mb-1 focus:ring-[1.2px] focus:ring-tsgreen focus:outline-none focus:border-gray-300"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                    </div>

                    <div className="flex px-2 gap-1 mb-1">

                        <MakeListbox
                            makes={Array.from(new Set(products.filter(item => current.includes(item.current)).map(item => item.make)))}
                            make={make}
                            setMake={setMake}
                        />

                        <RangeListbox
                            ranges={make.length > 0 ? Array.from(new Set(products.filter(item => make.includes(item.make)).map(item => item.range))) : Array.from(new Set(products.map(item => item.range)))}
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

                    <div className="flex-grow overflow-y-auto mt-[1px]">
                        <ul>
                            {products
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
                                        return true // If no make is selected, show all products
                                    }
                                    return current.includes(product.current)
                                })
                                .map(product => (
                                    <li key={product.description}>
                                        <label className={`flex items-center space-x-2 pl-2 py-[2px] ${selectedProducts.includes(product) ? "bg-[#1e90ff] text-white" : ""}`}>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleSelectProduct(product)}
                                                checked={selectedProducts.includes(product)}
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
                    <button
                        onClick={() => openModal("add")}
                    >
                        <HiPlus
                            size={26}
                            className="translate-y-[1px] stroke-[1.2] hover:text-gray-800 hover:cursor-pointer"
                        />
                    </button>
                    <button
                        onClick={() => openModal("edit")}
                        disabled={selectedProducts.length !== 1}
                    >
                        <FaEdit
                            size={25}
                            className={`${selectedProducts.length === 1 ? "hover:text-gray-800 hover:cursor-pointer" : "text-gray-400"}`}
                        />
                    </button>
                    <button
                        onClick={() => openModal("delete")}
                        disabled={selectedProducts.length < 1}
                    >
                        <BiSolidTrashAlt
                            size={25}
                            className={`${selectedProducts.length > 0 ? "hover:text-gray-800 hover:cursor-pointer" : "text-gray-400"}`}
                        />
                    </button>
                </div>

            </div>

            {/* Transfer buttons */}
            <div className="w-[62px] mt-32 flex flex-col gap-[6px]">
                <button
                    onClick={() => handleMoveProduct()}
                    className={`rounded-sm py-1 flex items-center justify-center ${selectedProducts.length > 0 ? "text-gray-700 bg-[#d5d7dd] hover:bg-gray-300" : "text-gray-400 bg-[#e4e5e9] hover:cursor-default"}`}
                    disabled={!(selectedProducts.length > 0)}
                >
                    <BsArrowRight size={28} />
                </button>
                <button
                    onClick={() => handleMoveSharedProduct()}
                    className={`rounded-sm py-1 flex items-center justify-center ${selectedSharedProducts.length > 0 ? "text-gray-700 bg-[#d5d7dd] hover:bg-gray-300" : "text-gray-400 bg-[#e4e5e9] hover:cursor-default"}`}
                    disabled={!(selectedSharedProducts.length > 0)}
                >
                    <BsArrowLeft size={28} />
                </button>
            </div>

            {/* Shared products column */}
            <div className="w-1/3 max-w-[500px] h-full flex flex-col">

                <h2 className="h-[33px] text-lg font-semibold pl-2 pb-[5px] text-center">Shared Products</h2>

                <div className="w-full grow border border-gray-300 pt-2 flex flex-col overflow-y-hidden">

                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-auto text-[15px] px-2 py-[2px] border border-gray-300 rounded-sm mx-2 mb-1 focus:ring-[1.2px] focus:ring-tsgreen focus:outline-none focus:border-gray-300"
                        value={sharedSearchQuery}
                        onChange={(e) => setSharedSearchQuery(e.target.value)}
                    />

                    <div className="flex px-2 gap-1 mb-1">

                        <MakeListbox
                            makes={Array.from(new Set(sharedProducts.map(item => item.make)))}
                            make={sharedMake}
                            setMake={setSharedMake}
                        />

                        <RangeListbox
                            ranges={sharedMake.length > 0 ? Array.from(new Set(sharedProducts.filter(item => sharedMake.includes(item.make)).map(item => item.range))) : Array.from(new Set(sharedProducts.map(item => item.range)))}
                            range={sharedRange}
                            setRange={setSharedRange}
                        />

                        <CurrentListbox
                            current={sharedCurrent}
                            setCurrent={setSharedCurrent}
                        />

                        <button
                            className="flex items-center ml-auto text-gray-700/90 hover:text-black"
                            onClick={clearSharedQueries}
                        >
                            <RiCloseFill size={25} />
                        </button>

                    </div>

                    <div className="flex-grow overflow-y-auto mt-[1px]">
                        <ul>
                            {sharedProducts
                                .filter(product => {
                                    const regex = new RegExp(sharedSearchQuery, 'i') // 'i' flag for case-insensitive matching
                                    return regex.test(product.description)
                                })
                                .filter(product => {
                                    if (sharedMake.length === 0) {
                                        return true // If no make is selected, show all products
                                    }
                                    return sharedMake.includes(product.make)
                                })
                                .filter(product => {
                                    if (sharedRange.length === 0) {
                                        return true // If no range is selected, show all products
                                    }
                                    return sharedRange.includes(product.range)
                                })
                                .filter(product => {
                                    if (sharedCurrent.length === 0) {
                                        return true // If no make is selected, show all products
                                    }
                                    return sharedCurrent.includes(product.current)
                                })
                                .map(product => (
                                    <li key={product.description}>
                                        <label className={`flex items-center space-x-2 pl-2 py-[2px] ${selectedSharedProducts.includes(product) ? "bg-[#1e90ff] text-white" : ""}`}>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleSelectSharedProduct(product)}
                                                checked={selectedSharedProducts.includes(product)}
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
                    <button
                        onClick={() => handleMoveSharedProduct()}
                        disabled={selectedSharedProducts.length < 1}
                    >
                        <BiSolidTrashAlt
                            size={25}
                            className={`${selectedSharedProducts.length > 0 ? "hover:text-gray-800 hover:cursor-pointer" : "text-gray-400"}`}
                        />
                    </button>
                </div>

            </div>

            {/* Companies column */}
            <div className="w-1/4 max-w-[500px] h-full flex flex-col">

                <h2 className="h-auto text-lg font-semibold pl-2 pb-[5px] text-center">Distributor {selectedDistributor}</h2>

                <div className="w-full grow border border-gray-300 pt-2 flex flex-col overflow-y-hidden">

                    <div className='flex flex-col w-full px-2 mb-[2px]'>

                        <div className='flex gap-1'>

                            <DistributorListbox
                                selectedDistributor={selectedDistributor}
                                setSelectedDistributor={setSelectedDistributor}
                            />

                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full text-[15px] py-[2px] border border-gray-300 rounded-sm mb-1 focus:ring-[1.2px] focus:ring-tsgreen focus:outline-none focus:border-gray-300"
                                value={searchDistributorQuery}
                                onChange={(e) => setSearchDistributorQuery(e.target.value)}
                            />

                        </div>

                        {selectedDistributor === "Users" && (
                            <div className='flex justify-between gap-1'>
                                <CompanyListbox
                                    companies={Array.from(new Set(users.map(item => item.company)))}
                                    filterCompanies={filterCompanies}
                                    setFilterCompanies={setFilterCompanies}
                                />

                                <button
                                    className="flex items-center ml-auto text-gray-700/90 hover:text-black"
                                    onClick={() => setFilterCompanies([])}
                                >
                                    <RiCloseFill size={25} />
                                </button>
                            </div>
                        )}

                    </div>

                    <div className="flex-grow overflow-y-auto mt-[1px]">
                        <ul>
                            {selectedDistributor === "Companies" ? companies
                                .filter(company => {
                                    const regex = new RegExp(searchDistributorQuery, 'i') // 'i' flag for case-insensitive matching
                                    return regex.test(company.name)
                                })
                                .map(company => (
                                    <li key={company.name}>
                                        <label className={`flex items-center space-x-2 pl-2 py-[2px] ${selectedCompanies.includes(company.name) ? "bg-[#1e90ff] text-white" : ""}`}>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleCompanySelect(company.name)}
                                                checked={selectedCompanies.includes(company.name)}
                                                className="w-[13px] h-[13px] bg-white text-blue-500 rounded-sm border focus:ring-0 focus:ring-offset-0 focus:outline-0"
                                            />
                                            <span className="flex-grow text-[15px]">{company.name}</span>
                                        </label>
                                    </li>
                                )) : users
                                    .filter(user => {
                                        const regex = new RegExp(searchDistributorQuery, 'i') // 'i' flag for case-insensitive matching
                                        return regex.test(user.name)
                                    })
                                    .filter(user => {
                                        if (filterCompanies.length === 0) {
                                            return true
                                        }
                                        return filterCompanies.includes(user.company)
                                    })
                                    .map(user => (
                                        <li key={user.name}>
                                            <label className={`flex items-center space-x-2 pl-2 py-[2px] ${selectedUsers.includes(user) ? "bg-[#1e90ff] text-white" : ""}`}>
                                                <input
                                                    type="checkbox"
                                                    onChange={() => handleUserSelect(user)}
                                                    checked={selectedUsers.includes(user)}
                                                    className="w-[13px] h-[13px] bg-white text-blue-500 rounded-sm border focus:ring-0 focus:ring-offset-0 focus:outline-0"
                                                />
                                                <span className="flex-grow text-[15px]">{user.name}</span>
                                            </label>
                                        </li>
                                    ))
                            }
                        </ul>
                    </div>
                </div>

                <div className="h-[35px] flex gap-3 justify-end items-center pt-[6px] pr-1 text-gray-800/90">
                    <button
                        onClick={selectedDistributor === "Companies" ? () => openModal("add company") : () => openModal("add user")}
                    >
                        <HiPlus
                            size={26}
                            className="translate-y-[1px] stroke-[1.2] hover:text-gray-800 hover:cursor-pointer"
                        />
                    </button>
                    <button
                        onClick={selectedDistributor === "Companies" ? () => openModal("edit company") : () => openModal("edit user")}
                        disabled={selectedCompanies.length !== 1 && selectedUsers.length !== 1}
                    >
                        <FaEdit
                            size={25}
                            className={`${selectedCompanies.length === 1 || selectedUsers.length === 1 ? "hover:text-gray-800 hover:cursor-pointer" : "text-gray-400"}`}
                        />
                    </button>
                    <button
                        onClick={selectedDistributor === "Companies" ? () => openModal("delete companies") : () => openModal("delete users")}
                        disabled={selectedCompanies.length < 1 && selectedUsers.length < 1}
                    >
                        <BiSolidTrashAlt
                            size={25}
                            className={`${selectedCompanies.length > 0 || selectedUsers.length > 0 ? "hover:text-gray-800 hover:cursor-pointer" : "text-gray-400"}`}
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
                            setSelectedPersonalProducts={setSelectedProducts}
                            setTeamLibrary={setTeamLibrary}
                            setSelectedTeamProducts={setSelectedProducts}
                            selectedLibrary={selectedLibrary.length === 1 && selectedLibrary[0] === "Team Library" ? "Team Library" : "Personal Library"}
                        />
                        : modalType === "edit" ?
                            <EditProductForm
                                closeModal={() => setIsOpen(false)}
                                product={selectedProducts[0]}
                                setPersonalLibrary={setPersonalLibrary}
                                setTeamLibrary={setTeamLibrary}
                                setSelectedProducts={setSelectedProducts}
                                selectedLibrary={personalLibrary.includes(selectedProducts[0]) ? "Personal Library" : "Team Library"}
                            />
                            : modalType === "delete" ?
                                <DeleteProductForm
                                    closeModal={() => setIsOpen(false)}
                                    selectedProducts={selectedProducts.length > 0 ? selectedProducts : selectedSharedProducts}
                                    setSelectedProducts={selectedProducts.length > 0 ? setSelectedProducts : setSelectedSharedProducts}
                                    setPersonalLibrary={setPersonalLibrary}
                                    setTeamLibrary={setTeamLibrary}
                                />
                                : modalType === "add company" ?
                                    <NewCompanyForm
                                        closeModal={() => setIsOpen(false)}
                                        setCompanies={setCompanies}
                                    />
                                    : modalType === "edit company" ?
                                        <EditCompanyForm
                                            closeModal={() => setIsOpen(false)}
                                            company={selectedCompanies[0]}
                                            setCompanies={setCompanies}
                                        />
                                        : modalType === "delete companies" ?
                                            <DeleteCompanyForm
                                                closeModal={() => setIsOpen(false)}
                                                companies={companies}
                                                selectedCompanies={selectedCompanies}
                                                setCompanies={setCompanies}
                                            />
                                            : modalType === "add user" ?
                                                <NewUserForm
                                                    closeModal={() => setIsOpen(false)}
                                                    setUsers={setUsers}
                                                    companies={companies}
                                                />
                                                : modalType === "edit user" ?
                                                    <EditUserForm
                                                        closeModal={() => setIsOpen(false)}
                                                        user={selectedUsers[0]}
                                                        setUsers={setUsers}
                                                        companies={companies}
                                                    />
                                                    : modalType === "delete users" ?
                                                        <DeleteUserForm
                                                            closeModal={() => setIsOpen(false)}
                                                            users={selectedUsers}
                                                            setUsers={setUsers}
                                                        />
                                                        : <></>
                }
            </Modal>

        </div>
    )
}

export default DistributionManager