import React, { FormEvent, useEffect, useRef, useState } from "react";

interface Props {
    title: string,
    label: string,
    closeModal: () => void,
    addObject: (input: string) => void,
}

const AddForm = ({ closeModal, addObject, title, label }: Props) => {

    const [input, setInput] = useState("");

    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleSave = (e: FormEvent) => {
        e.preventDefault()

        if (input.trim() === "") {
            return
        } else {
            addObject(input)
            setInput("");
            closeModal()
        }
    };

    // Ensures that input is focussed each time the modal is opened
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <>
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <form onSubmit={handleSave}>
                <label className="block text-gray-700 text-[15px] font-bold mb-2">
                    {label}
                </label>
                <input
                    autoFocus
                    ref={(inp) => { inp?.focus() }}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-[1.8px] focus:ring-tsgreen"
                />
                <button type="submit"></button>
            </form>

            <div className="flex justify-end gap-2 mt-6">
                <button
                    onClick={handleSave}
                    className="bg-tsgreen text-white px-4 py-2 rounded-lg"
                >
                    Save
                </button>
                <button
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg"
                >
                    Cancel
                </button>
            </div>
        </>
    );
};

export default AddForm;
