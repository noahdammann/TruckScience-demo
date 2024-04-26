import { Company } from "@/constants"
import { FormEvent, useEffect, useState } from "react"

type Props = {
    closeModal: () => void,
    company: string,
    setCompanies: (prev: any) => void,
}

const EditCompanyForm = ({ closeModal, company, setCompanies }: Props) => {

    const [name, setName] = useState(company)

    const handleSave = (e: FormEvent) => {
        e.preventDefault()

        if (name) {
            setCompanies((prev: Company[]) => {
                const removePreviousCompany = prev.filter(item => item.name !== company)
                return [...removePreviousCompany, { name: name }]
            })
            handleClose()
        }

    }

    const handleClose = () => {
        setName(company)
        closeModal()
    }

    useEffect(() => {
        setName(company)
    }, [company])

    return (
        <>
            <form onSubmit={handleSave} className="flex flex-col gap-2">

                <div className="flex flex-col gap-3">
                    <div className="flex items-center">
                        <label className="text-gray-700 text-[15px] font-bold w-32">
                            Company Name
                        </label>
                        <input
                            autoFocus
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Ford"
                            className="w-80 flex-grow px-2 py-[6px] border rounded-md border-gray-500/80 focus:outline-none focus:border-none focus:ring-[1.8px] focus:ring-tsgreen"
                        />
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

export default EditCompanyForm