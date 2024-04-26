import Image from "next/image";
import Mail from "./Mail";
import Profile from "./Profile";
import AuthProviders from "./AuthProviders";
import { getCurrentUser } from "@/lib/session";
import { getAllCompanies, getAllUsers, getCompany, getCompanyApprovals, getCompanySharedCompanies, getCompanySharedUsers, getMembers, getUserApprovals, getUserMail, getUserSharedCompanies, getUserSharedUsers } from "@/lib/actions";
import { Approvals, Companies, Company, CompanyCollection, CompanyResponse, UserCollection, Users } from "@/types";

const dummyCompany = {
    "name": "Noah's organisation",
    "logo": "http://res.cloudinary.com/dxaqfg7ex/image/upload/v1692883490/mhm1ktnahq3cuid9hr9i.png",
    "admins": [
        "noahdammann1@gmail.com"
    ],
    "members": [
        "noahdammann1@gmail.com"
    ],
    "sharedCompanies": null,
    "sharedUsers": null,
    "id": "company_01H8KVG62TR66KXDX9WY0A6FPD",
    "inviteUrl": "http://localhost:3000/invite/Z1ycFJiuzZ1lPp9rPerQ",
    "products": null,
    "sharedProducts": null
}

const dummyMembers = {
    "name": "Noah's organisation",
    "logo": "http://res.cloudinary.com/dxaqfg7ex/image/upload/v1692883490/mhm1ktnahq3cuid9hr9i.png",
    "admins": [
        "noahdammann1@gmail.com"
    ],
    "members": [
        "noahdammann1@gmail.com"
    ],
    "sharedCompanies": null,
    "sharedUsers": null,
    "id": "company_01H8KVG62TR66KXDX9WY0A6FPD",
    "inviteUrl": "http://localhost:3000/invite/Z1ycFJiuzZ1lPp9rPerQ",
    "products": null,
    "sharedProducts": null
}

const Navbar = async () => {

    const session = await getCurrentUser();

    var userMail
    var approvals
    var sharedUsers
    var sharedCompanies
    if (session?.user?.mail) {
        userMail = await getUserMail(session.user.mail)
        approvals = await getUserApprovals(session.user.email)
        sharedUsers = await getUserSharedUsers(session.user.email)
        sharedCompanies = await getUserSharedCompanies(session.user.email)
    }

    var company
    var members
    var companySharedCompanies
    var companySharedUsers
    var companyApprovals
    if (session?.user?.company) {
        const companyResponse = await getCompany(session.user.company) as CompanyResponse
        company = companyResponse.company
        members = await getMembers(company.name) as Users
        companySharedCompanies = await getCompanySharedCompanies(company.sharedCompanies) as Companies
        companySharedUsers = await getCompanySharedUsers(company.sharedUsers)
    }
    if (company?.approvals) {
        companyApprovals = await getCompanyApprovals(company.approvals) as Approvals
    }

    const allUsers = await getAllUsers() as UserCollection
    const allCompanies = await getAllCompanies() as CompanyCollection

    return (
        <nav className="h-[60px] bg-tsblue flex flex-row ml-[-2px]">

            {/* Truck Science logo */}
            <Image src="/truckscience-logo.png" priority height={46} width={168} alt="Truck Science" className="object-contain" />

            {/* Nav items container */}
            <div className="ml-auto flex items-center">

                {session ? (
                    <>
                        <Mail
                            userMail={userMail}
                        />

                        <Profile
                            session={session}
                            company={company}
                            members={members}
                            companyApprovals={companyApprovals}
                            companySharedCompanies={companySharedCompanies}
                            companySharedUsers={companySharedUsers}
                            allUsers={allUsers}
                            allCompanies={allCompanies}
                            approvals={approvals}
                            sharedUsers={sharedUsers}
                            sharedCompanies={sharedCompanies}
                        />
                    </>
                ) : (
                    <AuthProviders />
                )
                }
            </div>

        </nav>
    )
}

export default Navbar