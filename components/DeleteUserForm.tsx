import { User } from '@/constants'
import React from 'react'

type Props = {
    closeModal: () => void,
    users: User[],
    setUsers: (prev: any) => void,
}

const DeleteUserForm = ({ closeModal, setUsers, users }: Props) => {

    const handleDelete = () => {
        setUsers((prev: User[]) => prev.filter(item => !users.includes(item)))
        closeModal()
    }

    return (
        <>
            <p className="mb-1 text-center text-lg font-semibold">Delete {users.length === 1 ? "User" : "Users"}:</p>
            {users.map((item, i) => (
                <p key={i} className="text-center italic text-gray-800">{item.name}</p>
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

export default DeleteUserForm