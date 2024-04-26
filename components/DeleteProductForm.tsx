import { Product } from '@/constants'
import React, { useEffect } from 'react'

type Props = {
    closeModal: () => void,
    selectedProducts: Product[],
    setSelectedProducts: (prev: any) => void,
    setPersonalLibrary: (prev: any) => void,
    setTeamLibrary: (prev: any) => void,
}

const DeleteProductForm = ({ closeModal, selectedProducts, setSelectedProducts, setPersonalLibrary, setTeamLibrary }: Props) => {

    const handleDelete = () => {
        setTeamLibrary((prev: Product[]) => prev.filter(p => !selectedProducts.includes(p)))
        setPersonalLibrary((prev: Product[]) => prev.filter(p => !selectedProducts.includes(p)))
        setSelectedProducts([])
        closeModal()
    }

    return (
        <>
            <p className="mb-2 text-center text-lg font-semibold">Are you sure you want to delete:</p>
            {selectedProducts.map((item, i) => (
                <p key={i} className="text-center italic text-gray-800">{item.description}</p>
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

export default DeleteProductForm