import { FormEvent, useEffect, useRef, useState } from "react"


type Props = {
    title: string,
    password: string,
    onSubmit: () => void,
    closeModal: () => void,
}

const ConfirmForm = ({ title, password, onSubmit, closeModal }: Props) => {

    const [confirmationText, setConfirmationText] = useState("")

    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleSave = (e: FormEvent) => {
        e.preventDefault()

        if (confirmationText !== password) {
            return
        }

        onSubmit()
        setConfirmationText("")
        closeModal()
    }

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <>
            <h2 className="text-xl font-semibold text-center">{title}</h2>
            <p className="mb-4 text-center">Type "{password}" to confirm.</p>
            <form onSubmit={handleSave}>
                <input
                    autoFocus
                    ref={(inp) => { inp?.focus() }}
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-[1.8px] focus:ring-tsgreen"
                />
                <div className="mt-4 flex items-center justify-center gap-4">
                    <button
                        type="submit"
                        className={`px-4 py-2 rounded-lg ${password === confirmationText ? "bg-tsgreen text-white" : "bg-[#e4e5e9] text-gray-400 hover:cursor-default"}`}
                        disabled={password !== confirmationText}
                    >
                        Delete
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

export default ConfirmForm