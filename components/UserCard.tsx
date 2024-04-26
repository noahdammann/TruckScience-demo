import { Product, User } from "@/constants"
import { Disclosure } from "@headlessui/react"
import { RxDropdownMenu } from "react-icons/rx"

type Props = {
    user: User,
    selectedUsers: string[],
    handleUserSelect: (user: User) => void,
    handleUserCloseDropdown: (userEmail: string) => void,
    userSelectedProducts: { user: string, product: string }[],
    handleUserProductSelect: (userEmail: string, product: string) => void,
}

const UserCard = ({ user, selectedUsers, handleUserSelect, handleUserCloseDropdown, userSelectedProducts, handleUserProductSelect }: Props) => {
    return (
        <li>
            <Disclosure>
                {({ open }) => (
                    <>
                        <label className={`flex items-center space-x-2 px-2 py-[2px] ${selectedUsers.includes(user.email) ? "bg-[#1e90ff] text-white" : ""}`}>
                            <input
                                type="checkbox"
                                onChange={() => handleUserSelect(user)}
                                checked={selectedUsers.includes(user.email)}
                                className="text-blue-500"
                            />
                            <span className="flex-grow">{user.email}</span>
                            {
                                user.products.length > 0 && (
                                    <Disclosure.Button>
                                        <RxDropdownMenu
                                            className={`hover:cursor-pointer text-gray-800 hover:stroke-[0.2] hover:text-black ${open ? "rotate-180" : ""}`}
                                            size={20}
                                            onClick={() => { open && handleUserCloseDropdown(user.email) }}
                                        />
                                    </Disclosure.Button>
                                )
                            }
                        </label>
                        <Disclosure.Panel>
                            {open && (
                                <ul className="ml-6">
                                    {user.products.map((product, index) => (
                                        <li key={index}>
                                            <label className={`flex items-center space-x-2 px-2 py-[2px] ${userSelectedProducts.some((p) => p.user === user.email && p.product === product) ? "bg-[#1e90ff] text-white" : "text-gray-700"}`}>
                                                <input
                                                    type="checkbox"
                                                    onChange={() => handleUserProductSelect(user.email, product)}
                                                    checked={userSelectedProducts.some((p) => p.user === user.email && p.product === product)}
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

export default UserCard