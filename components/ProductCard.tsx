import { formatDate } from "@/lib/support"
import { Product } from "@/types"

type Props = {
    product: Product,
    toggleRowSelection: (product: Product) => void,
    selectedRows: any,
}

const ProductCard = ({ product, toggleRowSelection, selectedRows }: Props) => {
    return (
        <div
            className='grid grid-cols-[30px_auto_210px_100px] items-center bg-gray-100 w-full h-[52px] px-3 border-[2px] border-gray-100 rounded-sm hover:bg-white hover:border-gray-300 hover:cursor-pointer'
            onClick={() => toggleRowSelection(product)}
        >
            <input
                type="checkbox"
                className="w-[17px] h-[17px] text-blue-600 bg-white border-gray-400 rounded hover:cursor-pointer focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600"
                checked={selectedRows.includes(product)}
                readOnly
            />
            <p className='text-gray-600'>{product.description}</p>
            <p className='text-gray-600 w-[126px]'>{product.createdByName}</p>
            <p className='text-gray-600 w-[100px] text-right'>{formatDate(product.updatedAt)}</p>
        </div>
    )
}

export default ProductCard