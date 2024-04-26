import Main from "@/components/Main";
import { getAllCompanies, getAllUsers, getCompany, getCompanyApprovals, getCompanyProducts, getCompanySharedProducts, getUser, getUserApprovals, getUserProducts, getUserSharedProducts } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session";
import { removeDuplicates } from "@/lib/support";
import { Approvals, CompanyCollection, CompanyResponse, Products, UserCollection, UserResponse } from "@/types";

const Home = async () => {

    const session = await getCurrentUser()

    var user
    var company
    var sharedProducts
    var products
    var approvals
    var companyProducts
    var sharedCompanyProducts
    var companyApprovals

    if (session?.user?.email) {
        user = await getUser(session.user.email) as UserResponse
        sharedProducts = await getUserSharedProducts(session.user.email) as Products
        products = await getUserProducts(user.user.email) as Products
        approvals = await getUserApprovals(user.user.email) as Approvals
    }
    if (session?.user?.company) {
        company = await getCompany(session.user.company) as CompanyResponse
    }

    if (company?.company) {
        companyProducts = await getCompanyProducts(company.company.name) as Products
        sharedCompanyProducts = await getCompanySharedProducts(company.company.name) as Products
        if (company.company.approvals) {
            companyApprovals = await getCompanyApprovals(company.company.approvals) as Approvals
        }
    }

    const allUsers = await getAllUsers() as UserCollection
    const allCompanies = await getAllCompanies() as CompanyCollection

    return (
        <main className="flex h-full overflow-y-hidden mt-[5px] w-full shadow-[0px_0px_2px_2px_rgba(204,204,204,0.6)] rounded-sm">
            <Main
                session={session}
                company={company}
                products={products}
                sharedProducts={sharedProducts}
                companyProducts={companyProducts}
                sharedCompanyProducts={sharedCompanyProducts}
                allUsers={allUsers}
                allCompanies={allCompanies}
                approvals={approvals}
                companyApprovals={companyApprovals}
            />
        </main>
    )
}

export default Home