import { FormEvent, useEffect, useRef, useState } from "react"


type Props = {
    title: string,
    items: { name: string, product: string }[],
    onSubmit: () => void,
    closeModal: () => void,
}

const AreYouSureRevokeForm = ({ title, items, onSubmit, closeModal }: Props) => {

    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleSave = (e: FormEvent) => {
        e.preventDefault()
        onSubmit()
        closeModal()
    }

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <>
            <h2 className="text-xl font-semibold text-center">{title}</h2>

            <p className="mt-2 text-center font-semibold">Are you sure you want to remove access:</p>
            {items.map((item, i) => (
                <p key={i} className="text-center italic text-gray-800">{item.name} -&gt; {item.product}</p>
            ))}

            <form onSubmit={handleSave}>
                <div className="mt-4 flex items-center justify-center gap-4">
                    <button
                        type="submit"
                        className="bg-tsgreen text-white px-4 py-2 rounded-lg"
                    >
                        Remove
                    </button>
                    <button
                        type="button"
                        className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg"
                        onClick={() => closeModal()}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    )
}

export default AreYouSureRevokeForm