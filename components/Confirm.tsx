import { FormEvent, useEffect, useRef, useState } from "react"


type Props = {
    title: string,
    type: string,
    items: string[],
    getSharedWith?: (product: string) => { name: string; product: string; }[],
    handleDeleteAccess?: (sw: { name: string; product: string; }[]) => void,
    onSubmit: () => void,
    closeModal: () => void,
}

const AreYouSureForm = ({ title, type, items, onSubmit, closeModal, getSharedWith, handleDeleteAccess }: Props) => {

    const [deleteAccess, setDeleteAccess] = useState(false)

    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleSave = (e: FormEvent) => {
        e.preventDefault()

        if (deleteAccess && handleDeleteAccess) {
            handleDeleteAccess(sharedWith)
        }

        onSubmit()
        closeModal()
    }

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    let sharedWith = [] as { name: string; product: string; }[]
    if (getSharedWith) {
        for (const i of items) {
            sharedWith.push(...getSharedWith(i))
        }
    }

    return (
        <>
            <h2 className="text-xl font-semibold text-center">{title}</h2>

            <p className="mt-2 text-center font-semibold">Are you sure you want to delete {type}:</p>
            {items.map((item, i) => (
                <p key={i} className="text-center italic text-gray-800">{item}</p>
            ))}

            {sharedWith.length > 0 && (
                <>
                    <p className="mt-2 mb-1 text-center font-semibold">These {type} are currently being shared with:</p>
                    <div className="max-h-[140px] overflow-y-auto">
                        {sharedWith.map((sw, i) => (
                            <p key={i} className="text-center italic text-gray-800">{sw.name} ({sw.product})</p>
                        ))}
                    </div>
                </>
            )}


            <form onSubmit={handleSave}>

                {sharedWith.length > 0 && (
                    <label className="space-x-2 flex items-center justify-center font-bold mb-4 mt-4">
                        <input type="checkbox" id="remove" defaultChecked onChange={() => setDeleteAccess(prev => !prev)} />
                        <span>Let them keep their access?</span>
                    </label>
                )}

                <div className="mt-4 flex items-center justify-center gap-4">
                    <button
                        type="submit"
                        className='px-4 py-2 rounded-lg bg-tsgreen text-white'
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                        onClick={() => closeModal()}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    )
}

export default AreYouSureForm