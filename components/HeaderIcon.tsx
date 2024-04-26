"use client"

type Props = {
    icon: any;
    dropdownOpen: boolean;
    notificationDot?: any;
}

const HeaderIcon = ({ icon, dropdownOpen, notificationDot }: Props) => {
    return (
        <div className={dropdownOpen ? "bg-[#eaedf4]" : ""}>
            {icon}
            {notificationDot ? notificationDot : <></>}
        </div>
    )
}

export default HeaderIcon