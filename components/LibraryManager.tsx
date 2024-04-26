import React, { useState } from "react";
import Modal from "./Modal";
import { BsPersonDashFill, BsPersonPlusFill } from "react-icons/bs"
import { PiArrowsLeftRightLight, PiTruck } from "react-icons/pi"
import { GiOrganigram } from "react-icons/gi"
import { HiMinus, HiPlus } from "react-icons/hi"
import { Company, Product, SharedWith, User, dummyCompanies, dummyProducts } from "@/constants";
import ConfirmWithText from "./ConfirmWithText";
import Confirm from "./Confirm";
import { RxDropdownMenu } from "react-icons/rx"
import { Disclosure } from "@headlessui/react";
import { AiOutlineDeleteRow } from 'react-icons/ai'
import ConfirmRevoke from "./ConfirmRevoke";
import PreApprovedCompanies from "./PreApprovedCompanies";
import PreApprovedUsers from "./PreApprovedUsers";
import AddForm from "./AddForm";
import UserCard from "./UserCard";
import CompanyCard from "./CompanyCard";
import ProductCard from "./ProductCard";

type Props = {
    buttonLayout: number,
}

export default function LibraryManager({ buttonLayout }: Props) {
    // Dummy data for products, users, and companies
    const [products, setProducts] = useState<Product[]>(dummyProducts);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [companySelectedProducts, setCompanySelectedProducts] = useState<{ company: string, product: string }[]>([])
    const [userSelectedProducts, setUserSelectedProducts] = useState<{ user: string, product: string }[]>([])

    const [companies, setCompanies] = useState<Company[]>(dummyCompanies);
    const [selectedCompany, setSelectedCompany] = useState<string>("");

    // Get all users
    const getAllUsers = () => {
        const allUsers = [] as User[];
        companies.forEach(company => {
            company.users.forEach(user => {
                allUsers.push({ email: user.email, products: user.products, approved: user.approved });
            });
        });
        return allUsers
    }

    const initialUsers = getAllUsers()
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedSharedWith, setSelectedSharedWith] = useState<SharedWith[]>([])

    // Handle checkbox selection for products
    const handleProductSelect = (product: Product) => {
        setUserSelectedProducts([])
        setCompanySelectedProducts([])

        if (selectedProducts.includes(product)) {
            setSelectedProducts(selectedProducts.filter((p) => p !== product));
        } else {
            setSelectedProducts([...selectedProducts, product]);
        }
    };

    // Handle checkbox selection for products in user column 
    const handleUserProductSelect = (user: string, product: string) => {
        setSelectedUsers([])
        setSelectedCompany("")
        setSelectedProducts([])
        setCompanySelectedProducts([])

        if (userSelectedProducts.some((p) => p.user === user && p.product === product)) {
            setUserSelectedProducts(userSelectedProducts.filter((p) => p.user !== user || p.product !== product));
        } else {
            setUserSelectedProducts([...userSelectedProducts, { user: user, product: product }]);
        }
    };

    // Handle checkbox selection for products in company column 
    const handleCompanyProductSelect = (company: string, product: string) => {
        setSelectedCompany("")
        setSelectedUsers([])
        setSelectedProducts([])
        setUserSelectedProducts([])

        if (companySelectedProducts.some((c) => c.company === company && c.product === product)) {
            setCompanySelectedProducts(companySelectedProducts.filter((c) => c.company !== company || c.product !== product));
        } else {
            setCompanySelectedProducts([...companySelectedProducts, { company: company, product: product }]);
        }
    };

    // Handle checkbox selection for shared with
    const handleSelectSharedWith = (sw: SharedWith) => {
        setSelectedProducts([])
        if (selectedSharedWith.some((s) => s.name === sw.name && s.product === sw.product)) {
            setSelectedSharedWith(selectedSharedWith.filter((s) => s.name !== sw.name || s.product !== sw.product))
        } else {
            setSelectedSharedWith([...selectedSharedWith, { name: sw.name, product: sw.product }])
        }
    }

    // Handle checkbox selection for users
    const handleUserSelect = (user: User) => {
        setSelectedCompany("")
        setUserSelectedProducts([])
        setCompanySelectedProducts([])

        const userEmail = user.email;
        if (selectedUsers.includes(userEmail)) {
            setSelectedUsers(selectedUsers.filter(email => email !== userEmail));
        } else {
            setSelectedUsers([...selectedUsers, userEmail]);
        }
    };


    // Handle checkbox selection for companies
    const handleCompanySelect = (company: string) => {
        setSelectedUsers([])
        setUserSelectedProducts([])
        setCompanySelectedProducts([])

        if (selectedCompany === company) {
            setSelectedCompany("");
            const allUsers = getAllUsers()
            setUsers(allUsers)
        } else {
            setSelectedCompany(company);
            const comp = companies.find(c => c.name === company) as Company
            setUsers(comp.users)
        }
    };

    // Handle user products unselect when dropdown closed
    const handleUserCloseDropdown = (user: string) => {
        const newUserSelectedProducts = userSelectedProducts.filter(
            (p) => p.user !== user
        );
        setUserSelectedProducts(newUserSelectedProducts);
    }

    // Handle company products unselect when dropdown closed
    const handleCompanyCloseDropdown = (company: string) => {
        const newCompanySelectedProducts = companySelectedProducts.filter(
            (c) => c.company !== company
        );
        setCompanySelectedProducts(newCompanySelectedProducts);
    }

    // State to control the modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");

    // Function to open the modal
    const openModal = (type: string) => {
        setModalType(type)
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Function to add a user
    const addUser = (email: string) => {
        const updatedCompanies = companies.map(company => {
            if (company.name === selectedCompany) {
                const newUsers = [...company.users, { email: email, products: [], approved: false }];
                return { ...company, users: newUsers };
            }
            return company;
        });

        setCompanies(updatedCompanies);
        setUsers(prev => [...prev, { email: email, products: [], approved: false }]);
    }

    // Function to remove a user or users
    const removeUsers = () => {
        const updatedCompanies = companies.map(company => {
            const isMatchingCompany = company.users.every(user => users.some(u => u.email === user.email));
            if (isMatchingCompany) {
                const newUsers = company.users.filter(user => !selectedUsers.includes(user.email));
                return { ...company, users: newUsers };
            }
            return company;
        });

        const updatedUsers = users.filter(user => !selectedUsers.includes(user.email));

        setCompanies(updatedCompanies);
        setUsers(updatedUsers);
        setSelectedUsers([]);
    };

    // Function to add a company
    const addCompany = (name: string) => {
        setCompanies(prev => [...prev, { name: name, users: [], products: [], approved: false }])
        setSelectedCompany(name)
        setUsers([])
        setSelectedUsers([])
    }

    // Function to remove a company
    const removeCompany = () => {
        const companyToRemove = companies.find(c => c.name === selectedCompany);

        if (companyToRemove) {
            const updatedUsers = getAllUsers().filter(user => !companyToRemove.users.some(companyUser => companyUser.email === user.email));
            setUsers(updatedUsers);
        }

        setCompanies(prev => prev.filter(c => c.name !== selectedCompany));
        setSelectedCompany("");
    };

    // Function to add a product
    const addProduct = (description: string) => {
        setProducts(prev => [...prev, description])
        setUserSelectedProducts([])
        setCompanySelectedProducts([])
        setSelectedProducts([description])
    }

    // Function to remove products
    const removeProducts = () => {
        for (const prod of selectedProducts) {
            setProducts(prev => [...prev.filter(p => p !== prod)])
        }
        setSelectedProducts([])
    }

    // Function to determine with whom a product is shared
    const getSharedWith = (product: string) => {
        let sharedWithArray = [] as { name: string, product: string }[]

        companies.forEach(company => {
            if (company.products.includes(product)) {
                sharedWithArray.push({ name: company.name, product: product })
            }
        })

        companies.forEach(company => {
            company.users.forEach(user => {
                if (user.products.includes(product)) {
                    sharedWithArray.push({ name: user.email, product: product })
                }
            })
        })

        return sharedWithArray
    }

    // Function to share product
    const handleShareProduct = () => {
        // Share products
        if (selectedProducts.length > 0) {
            // To company
            if (selectedCompany) {
                const updatedCompanies = companies.map(company => {
                    if (company.name === selectedCompany) {
                        const uniqueProductsSet = new Set([...company.products, ...selectedProducts]);
                        const updatedProducts = [...uniqueProductsSet];
                        return { ...company, products: updatedProducts };
                    }
                    return company;
                });
                setCompanies(updatedCompanies);
            }
            // To user
            else {
                const updatedCompanies = companies.map(company => {
                    // Check if any user in the company is present in selectedUsers
                    const companyHasSelectedUser = company.users.some(user => selectedUsers.includes(user.email));

                    if (companyHasSelectedUser) {
                        const updatedUsers = company.users.map(user => {
                            if (selectedUsers.includes(user.email)) {
                                const uniqueProductsSet = new Set([...user.products, ...selectedProducts]);
                                const updatedProducts = [...uniqueProductsSet];
                                return { ...user, products: updatedProducts };
                            } else {
                                return user;
                            }
                        });

                        // Combine non-updated users from previous state with updated users
                        setUsers(prevUsers => {
                            const updatedUsersEmails = updatedUsers.map(user => user.email);
                            const nonUpdatedUsers = prevUsers.filter(user => !updatedUsersEmails.includes(user.email));
                            return [...nonUpdatedUsers, ...updatedUsers];
                        });

                        return { ...company, users: updatedUsers };
                    } else {
                        return company;
                    }
                });

                // Update the state with updated companies
                setCompanies(updatedCompanies);
            }

        }
        // Remove product from users in the company
        else if (userSelectedProducts.length > 0) {
            const updatedCompanies = companies.map(company => {
                // Check if any user in the company is present in the userSelectedProducts
                const companyHasSelectedUser = company.users.some(user => {
                    const userProductsToRemove = userSelectedProducts.some(item => item.user === user.email);
                    return userProductsToRemove;
                });

                if (companyHasSelectedUser) {
                    const updatedUsers = company.users.map(user => {
                        const productsToRemove = userSelectedProducts.filter(item => item.user === user.email);
                        if (productsToRemove.length > 0) {
                            // Remove products for the specific user
                            const updatedProducts = user.products.filter(product => !productsToRemove.some(removedProduct => removedProduct.product === product));
                            return { ...user, products: updatedProducts };
                        }
                        return user;
                    });

                    // Combine non-updated users from previous state with updated users
                    setUsers(prevUsers => {
                        const updatedUserEmails = updatedUsers.map(user => user.email);
                        const nonUpdatedUsers = prevUsers.filter(user => !updatedUserEmails.includes(user.email));
                        return [...nonUpdatedUsers, ...updatedUsers];
                    });

                    return { ...company, users: updatedUsers };
                } else {
                    return company;
                }
            });

            setCompanies(updatedCompanies);
            setUserSelectedProducts([]);
        }

        // Remove product from the company
        else if (companySelectedProducts.length > 0) {
            const updatedCompanies = companies.map(company => {
                const productsToRevoke = companySelectedProducts.filter(item => item.company === company.name);
                if (productsToRevoke.length > 0) {
                    const updatedProducts = company.products.filter(product => !productsToRevoke.some(revokedProduct => revokedProduct.product === product));
                    return { ...company, products: updatedProducts };
                }
                return company;
            });
            setCompanies(updatedCompanies);

            setCompanySelectedProducts([]);
        }
    };

    // Function to delete products from companies and users when product is deleted
    const handleDeleteAccess = (sharedWith: { name: string, product: string }[]) => {
        // Update companies and users
        const updatedCompanies = companies.map(company => {
            // Filter out products from company's products array
            const updatedCompanyProducts = company.products.filter(product => !sharedWith.some(sw => sw.name === company.name && sw.product === product));

            // Filter out products from users' products array
            const updatedUsers = company.users.map(user => {
                const updatedUserProducts = user.products.filter(product => !sharedWith.some(sw => sw.name === user.email && sw.product === product));
                return { ...user, products: updatedUserProducts };
            });

            return { ...company, products: updatedCompanyProducts, users: updatedUsers };
        });

        // Update state
        setCompanies(updatedCompanies);

        // Get all users from updated companies and remove duplicates based on email
        const allUsers = updatedCompanies.reduce((acc, company) => {
            acc.push(...company.users);
            return acc;
        }, [] as User[]);

        // Remove duplicates based on user email addresses
        const uniqueUsers = allUsers.reduce((acc, user) => {
            if (!acc.some(existingUser => existingUser.email === user.email)) {
                acc.push(user);
            }
            return acc;
        }, [] as User[]);

        setUsers(uniqueUsers);
        setSelectedSharedWith([])
    };

    const updateApprovedCompanies = (approved: string[]) => {
        const updatedCompanies = companies.map(company => {
            if (approved.includes(company.name)) {
                return { ...company, approved: true }
            } else {
                return { ...company, approved: false }
            }
        })
        setCompanies(updatedCompanies)
    }

    const isEqual = (obj1: any, obj2: any): boolean => {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (const key of keys1) {
            const val1 = obj1[key];
            const val2 = obj2[key];

            if (val1 !== val2) {
                return false;
            }
        }

        return true;
    };

    const updateApprovedUsers = (approved: string[]) => {
        const currentUsers = users;
        const allUsers = getAllUsers();

        const areUsersEqual = currentUsers.length === allUsers.length &&
            currentUsers.every(user => allUsers.some(otherUser =>
                isEqual(user, otherUser)
            ));

        if (areUsersEqual) {
            const updatedCompanies = companies.map(company => {
                const updatedUsers = company.users.map(user => {
                    if (approved.includes(user.email)) {
                        return { ...user, approved: true };
                    } else {
                        return { ...user, approved: false };
                    }
                });
                return { ...company, users: updatedUsers };
            });
            setCompanies(updatedCompanies);

            // Get all users from updated companies and remove duplicates based on email
            const allUsers = updatedCompanies.reduce((acc, company) => {
                acc.push(...company.users);
                return acc;
            }, [] as User[]);

            // Remove duplicates based on user email addresses
            const uniqueUsers = allUsers.reduce((acc, user) => {
                if (!acc.some(existingUser => existingUser.email === user.email)) {
                    acc.push(user);
                }
                return acc;
            }, [] as User[]);

            setUsers(uniqueUsers);

            return;
        }

        const companyToUpdate = companies.find(company => {
            return currentUsers.every(user =>
                company.users.some(companyUser => isEqual(user, companyUser))
            );
        });

        if (companyToUpdate) {
            const filteredCompanies = companies.filter(c => c.name !== companyToUpdate.name);
            companyToUpdate.users = companyToUpdate.users.map(user => {
                if (approved.includes(user.email)) {
                    return { ...user, approved: true };
                } else {
                    return { ...user, approved: false };
                }
            });
            setUsers(companyToUpdate.users)
            setCompanies([...filteredCompanies, companyToUpdate]);
        }
    };



    products.sort()

    companies.sort(function (a, b) {
        if (a.name < b.name) {
            return -1
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    })

    companies.forEach(company => {
        company.products.sort()
    });

    users.sort(function (a, b) {
        if (a.email < b.email) {
            return -1
        }
        if (a.email > b.email) {
            return 1;
        }
        return 0;
    })

    users.forEach(user => {
        user.products.sort()
    })

    return (
        <div className="h-full flex gap-5">

            {/* Products column */}
            <div className="w-1/3 flex flex-col p-1 bg-cyan-700 rounded-sm">
                <h2 className="ml-1 text-[17px] mb-[3px] text-white">Products</h2>
                <div className="h-full bg-white flex flex-col overflow-hidden">
                    <ul className="flex-grow overflow-y-auto">
                        {products.map((product, index) => (
                            <ProductCard
                                key={index}
                                product={product}
                                companies={companies}
                                selectedProducts={selectedProducts}
                                handleProductSelect={handleProductSelect}
                                handleCompanyCloseDropdown={handleCompanyCloseDropdown}
                                getSharedWith={getSharedWith}
                                selectedSharedWith={selectedSharedWith}
                                handleSelectSharedWith={handleSelectSharedWith}
                            />
                        ))}
                    </ul>
                    {/* Product buttons */}
                    <div className="flex py-1 px-1 gap-1 ">
                        {buttonLayout === 2 && (
                            <>
                                <button
                                    onClick={() => openModal("product")}
                                    className={`rounded-[3px] px-3 py-1 bg-tsgreen text-white hover:bg-darkgreen`}
                                >
                                    Add product
                                </button>
                                <button
                                    onClick={() => openModal("delete products")}
                                    className={`rounded-[3px] px-3 py-1 ${selectedProducts.length > 0 ? "bg-tsgreen text-white hover:bg-darkgreen" : "bg-lightgreen text-white/80"}`}
                                    disabled={selectedProducts.length < 1}
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => openModal("revoke access")}
                                    className={`ml-auto rounded-[3px] px-3 py-1 ${selectedSharedWith.length > 0 ? "bg-tsgreen text-white hover:bg-darkgreen" : "bg-lightgreen text-white/80"}`}
                                    disabled={selectedSharedWith.length < 1}
                                >
                                    Remove
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>

            {/* Buttons */}
            <div className="w-[62px] mt-14 flex flex-col gap-4">

                {/* Transfer product */}
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => handleShareProduct()}
                        className={`rounded-md font-medium px-[6px] py-1 flex items-center justify-center ${((selectedProducts.length > 0 && (selectedUsers.length > 0 || selectedCompany)) || userSelectedProducts.length > 0 || companySelectedProducts.length > 0) ? "text-gray-700 bg-[#d5d7dd] hover:bg-gray-300" : "text-gray-400 bg-[#e4e5e9] hover:cursor-default"}`}
                        disabled={!((selectedProducts.length > 0 && (selectedUsers.length > 0 || selectedCompany)) || userSelectedProducts.length > 0 || companySelectedProducts.length > 0)}
                    >
                        <PiArrowsLeftRightLight size={30} />
                    </button>
                </div>

                {buttonLayout === 1 && (
                    <>
                        {/* Product buttons */}
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => openModal("product")}
                                className='relative rounded-md font-medium px-[6px] py-1 flex items-center justify-center text-gray-700 bg-[#d5d7dd] hover:bg-gray-300'
                            >
                                <PiTruck size={30} className="relative right-[3.5px]" />
                                <HiPlus size={13} className="absolute right-[6px] top-[4px] stroke-[0.9]" />
                            </button>
                            <button
                                onClick={() => openModal("delete products")}
                                className={`relative rounded-md font-medium px-[6px] py-1 flex items-center justify-center ${selectedProducts.length > 0 ? "text-gray-700 bg-[#d5d7dd] hover:bg-gray-300" : "text-gray-400 bg-[#e4e5e9] hover:cursor-default"}`}
                                disabled={selectedProducts.length < 1}
                            >
                                <PiTruck size={30} className="relative right-[3.5px]" />
                                <HiMinus size={13} className="absolute right-[6px] top-[4px] stroke-[1.1]" />
                            </button>
                        </div>

                        {/* Company buttons */}
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => openModal("company")}
                                className='relative rounded-md font-medium px-[6px] py-1 flex items-center justify-center text-gray-700 bg-[#d5d7dd] hover:bg-gray-300'
                            >
                                <GiOrganigram size={30} className="relative right-[2px]" />
                                <HiPlus size={13} className="absolute right-[8px] top-[6px] stroke-[0.9]" />
                            </button>
                            <button
                                onClick={() => openModal("delete company")}
                                className={`relative rounded-md font-medium px-[6px] py-1 flex items-center justify-center ${selectedCompany ? "text-gray-700 bg-[#d5d7dd] hover:bg-gray-300" : "text-gray-400 bg-[#e4e5e9] hover:cursor-default"}`}
                                disabled={!selectedCompany}
                            >
                                <GiOrganigram size={30} className="relative right-[2px]" />
                                <HiMinus size={13} className="absolute right-[8px] top-[6px] stroke-[1.1]" />
                            </button>
                        </div>

                        {/* User buttons */}
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => openModal("user")}
                                className={`rounded-md font-medium px-[6px] py-1 flex flex-col items-center justify-center ${selectedCompany ? "text-gray-700 bg-[#d5d7dd] hover:bg-gray-300" : "text-gray-400 bg-[#e4e5e9] hover:cursor-default"}`}
                                disabled={selectedCompany.length === 0}
                            >
                                <BsPersonPlusFill size={30} />
                            </button>
                            <button
                                onClick={() => openModal("delete users")}
                                className={`rounded-md font-medium px-[6px] py-1 flex flex-col items-center justify-center ${selectedUsers.length > 0 ? "text-gray-700 bg-[#d5d7dd] hover:bg-gray-300" : "text-gray-400 bg-[#e4e5e9] hover:cursor-default"}`}
                                disabled={selectedUsers.length < 1}
                            >
                                <BsPersonDashFill size={30} />
                            </button>
                        </div>

                        {/* Revoke access button */}
                        {selectedSharedWith.length > 0 && (
                            <button
                                onClick={() => openModal("revoke access")}
                                className={`rounded-md font-medium px-[6px] py-1 flex flex-col items-center justify-center text-gray-700 bg-[#d5d7dd] hover:bg-gray-300}`}
                                disabled={selectedSharedWith.length < 1}
                            >
                                <AiOutlineDeleteRow size={30} />
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Companies column */}
            <div className="w-1/3 flex flex-col p-1 bg-cyan-700 rounded-sm">
                <h2 className="ml-1 text-[17px] mb-[3px] text-white">Companies</h2>
                <div className="h-full bg-white flex flex-col overflow-y-hidden">
                    <ul className="flex-grow overflow-y-auto">
                        {companies.map((company, index) => (
                            <CompanyCard
                                key={index}
                                company={company}
                                selectedCompany={selectedCompany}
                                handleCompanySelect={handleCompanySelect}
                                handleCompanyCloseDropdown={handleCompanyCloseDropdown}
                                companySelectedProducts={companySelectedProducts}
                                handleCompanyProductSelect={handleCompanyProductSelect}
                            />
                        ))}
                    </ul>
                    {/* Company buttons */}
                    <div className="flex py-1 px-1 gap-1 ">
                        {buttonLayout === 2 && (
                            <>
                                <button
                                    onClick={() => openModal("company")}
                                    className={`rounded-[3px] text-[15px] px-3 py-1 bg-tsgreen text-white hover:bg-darkgreen`}
                                >
                                    Add company
                                </button>
                                <button
                                    onClick={() => openModal("delete company")}
                                    className={`rounded-[3px] text-[15px] px-3 py-1 ${selectedCompany ? "bg-tsgreen text-white hover:bg-darkgreen" : "bg-lightgreen text-white/80"}`}
                                    disabled={!selectedCompany}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => openModal("manage companies")}
                            className={`ml-auto rounded-[3px] text-[15px] px-3 py-1 ${companies.length > 1 ? "bg-tsgreen text-white hover:bg-darkgreen" : "bg-lightgreen text-white/80"}`}
                            disabled={companies.length < 1}
                        >
                            Manage pre-approved
                        </button>
                    </div>
                </div>
            </div>

            {/* Users column */}
            <div className="w-1/3 flex flex-col p-1 bg-cyan-700 rounded-sm">
                <h2 className="ml-1 text-[17px] mb-[3px] text-white">Users</h2>
                <div className="h-full bg-white flex flex-col overflow-y-hidden">
                    <ul className="flex-grow overflow-y-auto">
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <UserCard
                                    key={index}
                                    user={user}
                                    selectedUsers={selectedUsers}
                                    handleUserSelect={handleUserSelect}
                                    handleUserCloseDropdown={handleUserCloseDropdown}
                                    userSelectedProducts={userSelectedProducts}
                                    handleUserProductSelect={handleUserProductSelect}
                                />
                            ))
                        ) : (
                            <p className="text-center mt-2 text-gray-700">

                            </p>
                        )}
                    </ul>
                    {/* User buttons */}
                    <div className="flex py-1 px-1 gap-1 ">
                        {buttonLayout === 2 && (
                            <>
                                <button
                                    onClick={() => openModal("user")}
                                    className={`rounded-[3px] text-[15px] px-3 py-1 ${selectedCompany ? "bg-tsgreen text-white hover:bg-darkgreen" : "bg-lightgreen text-white/80"}`}
                                    disabled={!selectedCompany}
                                >
                                    Add user
                                </button>
                                <button
                                    onClick={() => openModal("delete users")}
                                    className={`rounded-[3px] text-[15px] px-3 py-1 ${selectedUsers.length > 0 ? "bg-tsgreen text-white hover:bg-darkgreen" : "bg-lightgreen text-white/80"}`}
                                    disabled={selectedUsers.length < 1}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => openModal("manage users")}
                            className={`ml-auto rounded-[3px] text-[15px] px-3 py-1 ${users.length > 0 ? "bg-tsgreen text-white hover:bg-darkgreen" : "bg-lightgreen text-white/80"}`}
                            disabled={users.length < 1}
                        >
                            Manage pre-approved
                        </button>
                    </div>
                </div>
            </div>

            {/* Render the Modal components */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {
                    modalType === "product" ?
                        <AddForm
                            title="Add Product"
                            label="Product name"
                            closeModal={() => setIsModalOpen(false)}
                            addObject={addProduct}
                        />
                        : modalType === "company" ?
                            <AddForm
                                title="Add Company"
                                label="Company name"
                                closeModal={() => setIsModalOpen(false)}
                                addObject={addCompany}
                            />
                            : modalType === "user" ?
                                <AddForm
                                    title="Add User"
                                    label="User email"
                                    closeModal={() => setIsModalOpen(false)}
                                    addObject={addUser}
                                />
                                : modalType === "delete company" ?
                                    <ConfirmWithText
                                        title={`Delete company`}
                                        password={selectedCompany}
                                        onSubmit={() => removeCompany()}
                                        closeModal={() => setIsModalOpen(false)}
                                    />
                                    : modalType === "delete users" ?
                                        <Confirm
                                            title="Delete Users"
                                            type="users"
                                            items={selectedUsers}
                                            onSubmit={() => removeUsers()}
                                            closeModal={() => setIsModalOpen(false)}
                                        />
                                        : modalType === "delete products" ?
                                            <Confirm
                                                title="Delete Products"
                                                type="products"
                                                items={selectedProducts}
                                                getSharedWith={getSharedWith}
                                                handleDeleteAccess={handleDeleteAccess}
                                                onSubmit={() => removeProducts()}
                                                closeModal={() => setIsModalOpen(false)}
                                            />
                                            : modalType === "revoke access" ?
                                                <ConfirmRevoke
                                                    title="Remove Access"
                                                    items={selectedSharedWith}
                                                    onSubmit={() => handleDeleteAccess(selectedSharedWith)}
                                                    closeModal={() => setIsModalOpen(false)}
                                                />
                                                : modalType === "manage companies" ?
                                                    <PreApprovedCompanies
                                                        title="Pre-Approved Companies"
                                                        preApproved={companies.filter(c => c.approved)}
                                                        nonApproved={companies.filter(c => !c.approved)}
                                                        updateApproved={updateApprovedCompanies}
                                                        closeModal={() => setIsModalOpen(false)}
                                                    />
                                                    : modalType === "manage users" ?
                                                        <PreApprovedUsers
                                                            title="Pre-Approved Users"
                                                            preApproved={users.filter(u => u.approved)}
                                                            nonApproved={users.filter(u => !u.approved)}
                                                            updateApproved={updateApprovedUsers}
                                                            closeModal={() => setIsModalOpen(false)}
                                                        />
                                                        :
                                                        <></>
                }
            </Modal>

        </div>
    );
}
