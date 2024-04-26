import React, { ReactNode, MouseEvent } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

function Modal({ isOpen, onClose, children }: Props) {

    const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 ${isOpen ? "" : "hidden"}`}
            onMouseDown={handleOverlayClick}
        >
            <div className="bg-white py-6 px-10 rounded-lg shadow-md">
                {children}
            </div>
        </div>
    );
}

export default Modal;
