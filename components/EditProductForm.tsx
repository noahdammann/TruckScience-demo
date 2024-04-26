import { Product } from "@/constants";
import { Listbox } from "@headlessui/react";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";

type Props = {
    closeModal: () => void,
    product: Product,
    setPersonalLibrary: (prev: any) => void,
    setTeamLibrary: (prev: any) => void,
    setSelectedProducts: (prev: any) => void,
    selectedLibrary: string,
}

const EditProductForm = ({ closeModal, setSelectedProducts, product, setPersonalLibrary, setTeamLibrary, selectedLibrary }: Props) => {

    const emptyForm = {
        description: product?.description || "",
        make: product?.make || "",
        range: product?.range || "",
        current: product?.current || "Current",
        library: selectedLibrary
    }

    const libraries = ["Personal Library", "Team Library"]

    const [form, setForm] = useState(emptyForm)

    const handleSave = (e: FormEvent) => {
        e.preventDefault()
        if (form.description && form.make && form.range && form.current && form.library) {
            if (form.library === selectedLibrary) {
                if (selectedLibrary === "Personal Library") {
                    setPersonalLibrary((prev: Product[]) => [...prev.filter(p => p !== product), excludeLibraryProperty(form)])
                } else {
                    setTeamLibrary((prev: Product[]) => [...prev.filter(p => p !== product), excludeLibraryProperty(form)])
                }
            } else {
                if (selectedLibrary === "Personal Library") {
                    setTeamLibrary((prev: Product[]) => [...prev, excludeLibraryProperty(form)])
                    setPersonalLibrary((prev: Product[]) => prev.filter(p => p !== product))
                } else {
                    setPersonalLibrary((prev: Product[]) => [...prev, excludeLibraryProperty(form)])
                    setTeamLibrary((prev: Product[]) => prev.filter(p => p !== product))
                }
            }
            setSelectedProducts([])
            setForm(emptyForm)
            closeModal()
        }
    };

    const handleClose = () => {
        closeModal()
    }

    const handleStateChange = (fieldName: string, value: string) => {
        setForm((prevForm) => ({ ...prevForm, [fieldName]: value }));
    };

    const excludeLibraryProperty = (object: any) => {
        if (object && object.hasOwnProperty('library')) {
            delete object.library
            return object
        }
    }

    useEffect(() => {
        setForm(emptyForm)
    }, [product, selectedLibrary])

    return (
        <>
            <form onSubmit={handleSave} className="flex flex-col gap-2">

                <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                        <label className="text-gray-700 text-[15px] font-bold w-28">
                            Description
                        </label>
                        <input
                            type="text"
                            value={form.description}
                            onChange={(e) => handleStateChange("description", e.target.value)}
                            placeholder="Heil 18YD DP5000"
                            className="w-80 flex-grow px-2 py-[6px] border rounded-md border-gray-500/80 focus:outline-none focus:border-none focus:ring-[1.8px] focus:ring-tsgreen"
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="text-gray-700 text-[15px] font-bold w-28">
                            Make
                        </label>
                        <input
                            type="text"
                            value={form.make}
                            onChange={(e) => handleStateChange("make", e.target.value)}
                            placeholder="Heil"
                            className="flex-grow px-2 py-[6px] border rounded-md border-gray-500/80 focus:outline-none focus:border-none focus:ring-[1.8px] focus:ring-tsgreen"
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="text-gray-700 text-[15px] font-bold w-28">
                            Range
                        </label>
                        <input
                            type="text"
                            value={form.range}
                            onChange={(e) => handleStateChange("range", e.target.value)}
                            placeholder="18YD"
                            className="flex-grow px-2 py-[6px] border rounded-md border-gray-500/80 focus:outline-none focus:border-none focus:ring-[1.8px] focus:ring-tsgreen"
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="text-gray-700 text-[15px] font-bold w-28">
                            Library
                        </label>
                        <Listbox value={form.library} onChange={(value: string) => handleStateChange("library", value)}>
                            <div className="relative flex-grow">
                                <Listbox.Button
                                    className="flex items-center py-[6px] w-full px-2 border rounded-md border-gray-500/80 focus:outline-none focus:border-none focus:ring-[1.8px] focus:ring-tsgreen"

                                >
                                    {form.library}
                                    <FaChevronDown
                                        size={10}
                                        className="ml-auto text-gray-600"
                                    />
                                </Listbox.Button>
                                <Listbox.Options
                                    className="absolute w-full max-h-[350px] overflow-y-auto border border-gray-300 bg-white text-gray-600"
                                >
                                    {libraries.map((l, i) => (
                                        <Listbox.Option
                                            value={l}
                                            key={i}
                                            className="relative cursor-default pl-2 py-[6px] hover:bg-lime-200/70 hover:text-lime-900 text-gray-900"
                                        >
                                            {l}
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

export default EditProductForm