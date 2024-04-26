import LoadingComponent from "@/components/LoadingComponent"
import { getCurrentUser } from "@/lib/session"
import { toast } from "react-toastify"

const InviteUrlPage = async ({ params }: any) => {

    const session = await getCurrentUser()

    return (
        <div>
            <LoadingComponent session={session} secret={params.secret} />
        </div>
    )
}

export default InviteUrlPage