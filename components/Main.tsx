"use client"

import { Approvals, Company, CompanyCollection, CompanyResponse, Products, SessionInterface, UserCollection } from '@/types'
import SideMenu from './SideMenu'
import Content from './Content'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
    session: SessionInterface,
    company: CompanyResponse | undefined,
    products: Products | undefined,
    companyProducts: Products | undefined,
    sharedProducts: Products | undefined,
    sharedCompanyProducts: Products | undefined,
    allUsers: UserCollection,
    allCompanies: CompanyCollection,
    approvals: Approvals | undefined,
    companyApprovals: Approvals | undefined,
}

const Main = ({ session,
    products,
    companyProducts,
    sharedProducts,
    sharedCompanyProducts,
    allUsers,
    allCompanies,
    approvals,
    companyApprovals,
    company,
}: Props) => {

    const [active, setActive] = useState(4)
    const router = useRouter()

    return (
        <>
            <SideMenu active={active} setActive={setActive} />
            <Content
                active={active}
                session={session}
                company={company}
                products={products}
                companyProducts={companyProducts}
                sharedProducts={sharedProducts}
                sharedCompanyProducts={sharedCompanyProducts}
                allUsers={allUsers}
                allCompanies={allCompanies}
                approvals={approvals}
                companyApprovals={companyApprovals}
            />
        </>
    )
}

export default Main