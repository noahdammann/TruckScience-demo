import { Company } from '@/constants'
import React from 'react'

type Props = {
    closeModal: () => void,
    companies: Company[],
    selectedCompanies: string[],
    setCompanies: (prev: any) => void,
}

const DeleteCompanyForm = ({ closeModal, companies, selectedCompanies, setCompanies }: Props) => {

    const handleDelete = () => {
        setCompanies((prev: Company[]) => prev.filter(item => !selectedCompanies.includes(item.name)))
        closeModal()
    }

    return (
        <>
            <p className="mb-1 text-center text-lg font-semibold">Delete {selectedCompanies.length === 1 ? "Company" : "Companies"}:</p>
            {selectedCompanies.map((item, i) => (
                <p key={i} className="text-center italic text-gray-800">{item}</p>
            ))}
            <div className="flex justify-center gap-2 mt-3 mb-2">
                <button
                    onClick={handleDelete}
                    className="bg-tsgreen hover:bg-darkgreen/80 text-white px-4 py-2 rounded-md border-gray-500/80"
                >
                    Delete
                </button>
                <button
                    onClick={() => closeModal()}
                    className="bg-gray-300 hover:bg-gray-400/60 text-gray-600 px-4 py-2 rounded-md border-gray-500/80"
                >
                    Cancel
                </button>
            </div>
        </>
    )
}

export default DeleteCompanyForm