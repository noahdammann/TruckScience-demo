import { Approvals, Company, CompanyCollection, CompanyResponse, Products, SessionInterface, UserCollection } from "@/types";
import ImportsPage from "./ImportsPage";

type Props = {
    active: number,
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

const Content = ({
    company,
    active,
    session,
    products,
    companyProducts,
    sharedProducts,
    sharedCompanyProducts,
    allUsers,
    allCompanies,
    approvals,
    companyApprovals,
}: Props) => {

    return (
        <div className="bg-white h-full grow p-[20px]">
            {
                active == 1 ? <></> :
                    active == 2 ? <></> :
                        active == 3 ? <></> :
                            <ImportsPage
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
            }
        </div>
    )
}

export default Content