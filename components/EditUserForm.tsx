import { Company, User } from '@/constants'
import { Listbox } from '@headlessui/react'
import React, { FormEvent, useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

type Props = {
    closeModal: () => void,
    user?: User,
    setUsers: (prev: any) => void,
    companies: Company[],
}

const EditUserForm = ({ closeModal, user, setUsers, companies }: Props) => {

    const emptyForm = {
        name: user?.name,
        email: user?.email,
        company: user?.company,
    }

    const [form, setForm] = useState(emptyForm)

    const handleSave = (e: FormEvent) => {
        e.preventDefault()
        if (form.name && form.email && form.company) {
            setUsers((prev: User[]) => {
                const removedPreviousUsers = prev.filter(item => item !== user)
                return [...removedPreviousUsers, form]
            })
            handleClose()
        }
    };

    const handleClose = () => {
        setForm(emptyForm)
        closeModal()
    }

    const handleStateChange = (fieldName: string, value: string) => {
        setForm((prevForm) => ({ ...prevForm, [fieldName]: value }));
    };

    useEffect(() => {
        if (user) {
            setForm(user)
        }
    }, [user])

    return (
        <>
            <form onSubmit={handleSave} className="flex flex-col gap-2">

                <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                        <label className="text-gray-700 text-[15px] font-bold w-28">
                            Name
                        </label>
                        <input
                            autoFocus
                            type="text"
                            value={form.name}
                            onChange={(e) => handleStateChange("name", e.target.value)}
                            placeholder="John Smith"
                            className="w-80 flex-grow px-2 py-[6px] border rounded-md border-gray-500/80 focus:outline-none focus:border-none focus:ring-[1.8px] focus:ring-tsgreen"
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="text-gray-700 text-[15px] font-bold w-28">
                            Email
                        </label>
                        <input
                            type="text"
                            value={form.email}
                            onChange={(e) => handleStateChange("email", e.target.value)}
                            placeholder="johnsmith@gmail.com"
                            className="flex-grow px-2 py-[6px] border rounded-md border-gray-500/80 focus:outline-none focus:border-none focus:ring-[1.8px] focus:ring-tsgreen"
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="text-gray-700 text-[15px] font-bold w-28">
                            Company
                        </label>
                        <Listbox value={form.company} onChange={(value: string) => handleStateChange("company", value)}>
                            <div className="relative flex-grow">
                                <Listbox.Button
                                    className={`flex items-center py-[6px] w-full px-2 border rounded-md border-gray-500/80 focus:outline-none focus:border-none focus:ring-[1.8px] focus:ring-tsgreen ${form.company ? "text-black" : "text-gray-500"}`}
                                >
                                    {form.company || "Select a company"}
                                    <FaChevronDown
                                        size={10}
                                        className="ml-auto text-gray-600"
                                    />
                                </Listbox.Button>
                                <Listbox.Options
                                    className="absolute w-full max-h-[350px] overflow-y-auto border border-gray-300 bg-white text-gray-600"
                                >
                                    {companies.map((c, i) => (
                                        <Listbox.Option
                                            value={c.name}
                                            key={i}
                                            className="relative cursor-default pl-2 py-[6px] hover:bg-lime-200/70 hover:text-lime-900 text-gray-900"
                                        >
                                            {c.name}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Listbox>
                    </div>

                </div>

                <button type="submit"></button>

            </form>

            <div className="flex justify-end gap-2 mt-1">
                <button
                    onClick={handleSave}
                    className="bg-tsgreen hover:bg-darkgreen/80 text-white px-4 py-2 rounded-md border-gray-500/80"
                >
                    Save
                </button>
                <button
                    onClick={handleClose}
                    className="bg-gray-300 hover:bg-gray-400/60 text-gray-600 px-4 py-2 rounded-md border-gray-500/80"
                >
                    Cancel
                </button>
            </div>
        </>
    )
}

export default EditUserForm