import { Company } from "@/constants";
import { FormEvent, useEffect, useRef, useState } from "react"
import { PiArrowsLeftRightLight } from "react-icons/pi"

type Props = {
    title: string,
    preApproved: Company[],
    nonApproved: Company[],
    updateApproved: (approved: string[]) => void,
    closeModal: () => void,
}

const PreApprovedCompanies = ({ title, preApproved, nonApproved, updateApproved, closeModal }: Props) => {

    const inputRef = useRef<HTMLInputElement | null>(null)

    const [approved, setApproved] = useState<string[]>([])
    const [normal, setNormal] = useState<string[]>([])

    const [selectedApproved, setSelectedApproved] = useState<string[]>([])
    const [selectedNormal, setSelectedNormal] = useState<string[]>([])

    const handleSave = (e: FormEvent) => {
        e.preventDefault()
        updateApproved(approved)
        setApproved([])
        setNormal([])
        setSelectedApproved([])
        setSelectedNormal([])
        closeModal()
    }

    const handleCancel = () => {
        setSelectedApproved([])
        setSelectedNormal([])
        closeModal()
    }

    const toggleApproved = () => {
        if (selectedApproved.length > 0) {
            const newApproved = approved.filter(item => !selectedApproved.includes(item))
            const newNormal = [...normal, ...selectedApproved]
            setApproved(newApproved)
            setNormal(newNormal)
            setSelectedApproved([])
        } else {
            const newNormal = normal.filter(item => !selectedNormal.includes(item))
            const newApproved = [...approved, ...selectedNormal]
            setApproved(newApproved)
            setNormal(newNormal)
            setSelectedNormal([])
        }
    };

    const handleSelectNormal = (name: string) => {
        setSelectedApproved([])

        if (selectedNormal.includes(name)) {
            setSelectedNormal(selectedNormal.filter(s => s !== name))
        } else {
            setSelectedNormal(prev => [...prev, name])
        }
    }

    const handleSelectApproved = (name: string) => {
        setSelectedNormal([])

        if (selectedApproved.includes(name)) {
            setSelectedApproved(selectedApproved.filter(s => s !== name))
        } else {
            setSelectedApproved(prev => [...prev, name])
        }
    }

    useEffect(() => {
        setApproved([...preApproved.map(c => c.name)])
        setNormal([...nonApproved.map(c => c.name)])
        inputRef.current?.focus();
    }, [preApproved, nonApproved]);

    return (
        <>
            <h2 className="text-xl font-bold text-center">{title}</h2>

            <div className="flex gap-3 mt-3">

                <div className="w-[320px]">
                    <h2 className="font-semibold text-[18px] text-center mb-1">Standard:</h2>
                    <ul className="w-full bg-white rounded-sm h-[calc(100%-31px)] border-[1px] border-gray-300 max-h-[300px] overflow-y-auto">
                        {normal.map(item => (
                            <li className="w-full" key={item}>
                                <label className={`w-full flex items-center space-x-2 px-2 py-[2px] ${selectedNormal.includes(item) ? "bg-[#1e90ff] text-white" : ""}`}>
                                    <input
                                        type="checkbox"
                                        onChange={() => handleSelectNormal(item)}
                                        checked={selectedNormal.includes(item)}
                                        className="text-blue-500"
                                    />
                                    <span className="flex-grow">{item}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => toggleApproved()}
                        className={`rounded-md mt-12 font-medium px-[6px] py-1 flex items-center justify-center ${(selectedApproved.length > 0 || selectedNormal.length > 0) ? "text-gray-700 bg-[#d5d7dd] hover:bg-gray-300" : "text-gray-400 bg-[#e4e5e9] hover:cursor-default"}`}
                        disabled={(selectedApproved.length < 1 && selectedNormal.length < 1)}
                    >
                        <PiArrowsLeftRightLight size={30} />
                    </button>
                </div>

                <div className="w-[320px]">
                    <h2 className="font-semibold text-[18px] text-center mb-1">Pre-Approved:</h2>
                    <ul className="w-full bg-white rounded-sm h-[calc(100%-31px)] border-[1px] border-gray-300 max-h-[300px] overflow-y-auto">
                        {approved.map(item => (
                            <li className="w-full" key={item}>
                                <label className={`w-full flex items-center space-x-2 px-2 py-[2px] ${selectedApproved.includes(item) ? "bg-[#1e90ff] text-white" : ""}`}>
                                    <input
                                        type="checkbox"
                                        onChange={() => handleSelectApproved(item)}
                                        checked={selectedApproved.includes(item)}
                                        className="text-blue-500"
                                    />
                                    <span className="flex-grow">{item}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            <form onSubmit={handleSave}>
                <div className="mt-6 flex items-center justify-center gap-4">
                    <button
                        type="submit"
                        className='px-4 py-2 rounded-lg bg-blue-500 text-white'
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                        onClick={() => handleCancel()}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    )
}

export default PreApprovedCompanies