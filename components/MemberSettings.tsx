import { Company, SessionInterface, Users } from "@/types"
import Member from "./Member"
import { MdAdminPanelSettings } from "react-icons/md";

type Props = {
    session: SessionInterface,
    company: Company,
    members: Users | undefined,
    setOpenManageAdmins: (bool: boolean) => void,
}

const MemberSettings = ({ session, company, members, setOpenManageAdmins }: Props) => {

    const adminEmails = company.admins;

    const hasAdministratorPrivilages = adminEmails.includes(session?.user?.email)

    return (
        <div className="flex flex-col gap-2">
            <label
                className='text-xl font-semibold text-gray-800'
            >
                Members:
            </label>
            <div className="gap-1 flex flex-col">
                {members?.map((member) => {
                    const isAdmin = adminEmails.includes(member.user.email);
                    return (
                        <Member name={member.user.name} imageSrc={member.user.image} admin={isAdmin} key={member.user.id} hasAdministratorPrivilages={hasAdministratorPrivilages} />
                    )
                })}
            </div>

            {company && company.admins.includes(session.user.email) && (
                <button
                    className="flex mt-1 gap-2 w-fit px-4 py-2 bg-tsgreen text-white rounded-sm justify-center items-center hover:bg-darktsgreen"
                    type="button"
                    onClick={() => setOpenManageAdmins(true)}
                >
                    <MdAdminPanelSettings size={27} />
                    <p className="text-lg">Manage admins</p>
                </button>
            )}

        </div>
    )
}

export default MemberSettings