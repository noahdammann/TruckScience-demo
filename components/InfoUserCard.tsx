import Image from "next/image"

type Props = {
    title: string,
    value: string,
    image: string,
}

const InfoUserCard = ({ title, value, image }: Props) => {
    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={value}
                className='text-xl font-semibold text-gray-800'
            >
                {title}
            </label>
            <div className="flex gap-2 py-1 items-center">
                <Image
                    src={image}
                    width={35}
                    height={35}
                    alt="user or company image"
                    className="rounded-full"
                />
                <p className="rounded-lg text-lg">{value}</p>
            </div>
        </div>
    )
}

export default InfoUserCard