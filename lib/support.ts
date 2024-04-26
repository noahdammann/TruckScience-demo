import { Products } from "@/types";

const isProduction = process.env.NODE_ENV === "production"
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : "http://localhost:3000"

export const generateRandomSecret = (length = 20) => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        key += characters[randomIndex];
    }
    return key;
}

export const uploadImage = async (imagePath: string) => {
    try {
        const response = await fetch(`${serverUrl}/api/upload`, {
            method: "POST",
            body: JSON.stringify({ path: imagePath })
        })

        return response.json()
    } catch (error) {
        throw error
    }
}

export const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toISOString().split('T')[0].replaceAll("-", "/")
}

export const formatDateAndTime = (date: string) => {
    var currentdate = new Date(date);
    var hours = currentdate.getHours();
    var minutes = currentdate.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    //@ts-ignore
    minutes = minutes < 10 ? '0' + minutes : minutes;
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var strTime = hours + ':' + minutes + '' + ampm;
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear()
    return strTime + " on " + datetime
}

export const removeDuplicates = (arr: Products) => {
    return arr.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t.product.id === value.product.id
        ))
    )
}