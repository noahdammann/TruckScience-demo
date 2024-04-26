import { MdDashboardCustomize } from "react-icons/md"
import { FaChalkboardTeacher, FaFileAlt, FaSave, FaShareAltSquare, FaShareSquare, FaUsers } from "react-icons/fa"
import { RiOrganizationChart, RiShareForwardFill } from "react-icons/ri"
import { BsFillArrowRightSquareFill } from 'react-icons/bs'

export interface Product {
    make: string,
    range: string,
    description: string,
    current: string,
}

export interface User {
    name: string,
    email: string,
    company: string,
}

export interface Company {
    name: string,
}

export interface Approval {
    to: string,
    product: Product,
}

export interface PersonalLibrary {
    products: Product[],
}

export interface TeamLibrary {
    products: Product[],
}

export const menu = [
    {
        name: "New Calculation",
        id: 1,
        icon: <FaFileAlt size={35} className="" />,
    },
    {
        name: "My Saved Calculations",
        id: 2,
        icon: <FaSave size={39} className="" />,
    },
    {
        name: "Calculations Shared With Me",
        id: 3,
        icon: <FaShareAltSquare size={37} className="" />,
    },
    {
        name: "Team Library Manager",
        id: 4,
        icon: <FaUsers size={40} />,
    },
    {
        name: "Distribution Manager",
        id: 5,
        icon: <FaShareSquare size={35} className="" />,
    },
    {
        name: "Resources",
        id: 6,
        icon: <FaChalkboardTeacher size={40} className="" />,
    },
]

export const dummyPersonalLibrary = [
    {
        make: "Ford",
        range: "F-650",
        description: "Ford F-650 Crew Diesel Kick-Up (Proloader) Air",
        current: "Current",
    },
    {
        make: "Ford",
        range: "E-350",
        description: 'Ford E-Series E-350 DRW Cutaway WB="158"',
        current: "Current",
    },
    {
        make: "Ford",
        range: "E-Transit",
        description: "Ford E-Transit Cargo Van EL HR 250 SRW",
        current: "Current",
    },
    {
        make: "Ford",
        range: "F-150",
        description: "Ford F-150 2.7L EcoBoost Super Cab 6.5in Box",
        current: "Current",
    },
    {
        make: "Ford",
        range: "Ranger",
        description: 'Ford Ranger Super Cab (Box Removal)',
        current: "Current",
    },
    {
        make: "Hino",
        range: "L6",
        description: 'Hino L6 Crew Cab (Air Suspension 19000lbs)',
        current: "Current",
    },
    {
        make: "Hino",
        range: "M5",
        description: "Hino M5 Day Cab Hybrid",
        current: "Current",
    },
    {
        make: "Hino",
        range: "XL8",
        description: "Hino XL8 Extended Cab (Rubber Suspension)",
        current: "Current",
    },
    {
        make: "Isuzu",
        range: "F-Series",
        description: "Isuzu F-Series FTR Diesel MT1",
        current: "Current",
    },
    {
        make: "Isuzu",
        range: "NPR-HD",
        description: "Isuzu NPR-HD Gas 70.9in 4x2",
        current: "Current",
    },
    {
        make: "Greenkraft",
        range: "G1",
        description: "Greenkraft G1 (GVWR=14500lbs)",
        current: "Discontinued",
    },
    {
        make: "MACK",
        range: "Titan",
        description: "MACK Titan TD713 SFA 128in BBC 6x4",
        current: "Special",
    },
]

export const dummyTeamLibrary = [
    {
        make: "Ford",
        range: "F-750",
        description: "Ford F-750 Crew Diesel Straight Frame/Air",
        current: "Current",
    },
    {
        make: "Ford",
        range: "F-250",
        description: "Ford SD F-250 Crew 6.2L Gas",
        current: "Current",
    },
    {
        make: "Ford",
        range: "F-350",
        description: "Ford SD F-350 Crew 7.3L Gas SRW",
        current: "Current",
    },
]

export const dummyCompanies = [
    {
        name: "Kenworth"
    },
    {
        name: "Volvo"
    },
    {
        name: "Chevrolet"
    },
]

export const dummyUsers = [
    {
        name: "John Doe",
        email: "johndoe@gmail.com",
        company: "Kenworth",
    },
    {
        name: "Jane Smith",
        email: "janesmith@gmail.com",
        company: "Volvo",
    },
    {
        name: "David Johnson",
        email: "davidjohnson@gmail.com",
        company: "Chevrolet",
    },
]

export const dummySharedProducts = [
    {
        make: "Isuzu",
        range: "F-Series",
        description: "Isuzu F-Series FTR Diesel MT1",
        current: "Current",
    },
    {
        make: "Ford",
        range: "Ranger",
        description: 'Ford Ranger Super Cab (Box Removal)',
        current: "Current",
    },
    {
        make: "Hino",
        range: "L6",
        description: 'Hino L6 Crew Cab (Air Suspension 19000lbs)',
        current: "Current",
    },
    {
        make: "Ford",
        range: "F-750",
        description: "Ford F-750 Crew Diesel Straight Frame/Air",
        current: "Current",
    },
]