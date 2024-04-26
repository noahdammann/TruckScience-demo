import { MdDashboardCustomize } from "react-icons/md"

export type Product = string;
export type User = { email: string, products: string[], approved: boolean };
export type Company = {
    name: string,
    users: User[],
    products: string[],
    approved: boolean,
};
export type SharedWith = { name: string, product: string }

export const menu = [
    {
        name: "",
        id: 1,
        icon: <></>,
    },
    {
        name: "",
        id: 2,
        icon: <></>,
    },
    {
        name: "",
        id: 3,
        icon: <></>,
    },
    {
        name: "Library Manager",
        id: 4,
        icon: <MdDashboardCustomize size={45} className="mx-auto" />,
    }
]

export const dummyProducts = [

];

export const dummyCompanies = [

];
