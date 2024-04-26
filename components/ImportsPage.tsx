"use client"

import { useRef, useState } from "react"
import ImportsMenuItem from "./ImportsMenuItem"
import { IoInformationCircle, IoShareSocial } from "react-icons/io5"
import { IoMdPerson, IoMdTrash } from "react-icons/io"
import { IoIosArrowDropdownCircle } from 'react-icons/io'
import { Approval, Approvals, Company, CompanyCollection, CompanyResponse, Product, Products, SessionInterface, UserCollection } from "@/types"
import { CgOrganisation } from "react-icons/cg"
import Modal from "./Modal"
import CreateProductForm from "./CreateProductForm"
import { BsPlusCircleFill } from "react-icons/bs"
import { deleteCompanyProduct, deleteProduct, revokeApproval, revokeCompanyApproval } from "@/lib/actions"
import { useRouter } from "next/navigation"
import ReactLoading from "react-loading"
import ProductCard from "./ProductCard"
import { FaShareSquare } from "react-icons/fa"
import SharePopup from "./SharePopup"
import InfoProductPopup from "./InfoProductPopup"
import { AiOutlineHistory } from "react-icons/ai"
import { CgRedo } from "react-icons/cg"
import ApprovalsList from "./ApprovalsList"
import InfoApprovalPopup from "./InfoApprovalPopup"
import { ToastContainer, toast } from "react-toastify"

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

const NoProductsFound = () => {
    return (
        <h2 className="ml-3 text-xl text-gray-600 text-center">No Products Found</h2>
    )
}

const NoApprovals = () => {
    return (
        <h2 className="ml-3 text-xl text-gray-600 text-center">No History</h2>
    )
}

const ImportsPage = ({
    session,
    company,
    products,
    companyProducts,
    sharedProducts,
    sharedCompanyProducts,
    allUsers,
    allCompanies,
    approvals,
    companyApprovals,
}: Props) => {

    const [active, setActive] = useState("My Products")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [openModal, setOpenModal] = useState(false)
    const [openShare, setOpenShare] = useState(false)
    const [openInfo, setOpenInfo] = useState(false)
    const [openInfoApproval, setOpenInfoApproval] = useState(false)

    const [selectedProducts, setSelectedProducts] = useState<Array<Product> | []>([]);
    const [selectedApprovals, setSelectedApprovals] = useState<Array<Approval> | []>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [approvalSelectAll, setApprovalSelectAll] = useState(false);

    const router = useRouter()

    const submitRef = useRef()
    const closeModalRef = useRef()

    const sortedProducts = products?.sort(function (a, b) {
        // @ts-ignore
        return new Date(b.product.updatedAt) - new Date(a.product.updatedAt)
    })

    const handleClick = (value: string) => {
        setActive(value)
        setSelectedProducts([])
        setSelectedApprovals([])
        if (selectAll) {
            setSelectAll(prev => !prev)
        }
        if (approvalSelectAll) {
            setApprovalSelectAll(prev => !prev)
        }
    }

    const toggleRowSelection = (product: Product) => {
        setSelectedProducts((prevSelectedRows: any) => {
            if (prevSelectedRows.includes(product)) {
                return prevSelectedRows.filter((item: Product) => item !== product);
            } else {
                return [...prevSelectedRows, product];
            }
        });
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedProducts([]);
        } else {
            if (active === "My Products") {
                if (products) {
                    const allProducts = products.map(item => item.product);
                    setSelectedProducts(allProducts);
                }
            } else if (active === "Company Products") {
                if (companyProducts) {
                    const allProducts = companyProducts.map(item => item.product);
                    setSelectedProducts(allProducts);
                }
            } else if (active === "Shared With Me") {
                if (sharedProducts) {
                    const allProducts = sharedProducts.map(item => item.product);
                    setSelectedProducts(allProducts);
                }
            } else if (active === "Shared With Company") {
                if (sharedCompanyProducts) {
                    const allProducts = sharedCompanyProducts.map(item => item.product);
                    setSelectedProducts(allProducts);
                }
            }
        };
        setSelectAll(prevSelectAll => !prevSelectAll);
    }

    const handleInfo = () => {
        if (selectedProducts.length !== 1) {
            return;
        }
        setOpenInfo(true)
    }

    const handleShare = () => {
        if (selectedProducts.length < 1) {
            return;
        }
        if (active === "My Products") {
            for (const prod of selectedProducts) {
                if (prod.createdByEmail !== session.user.email) {
                    toast.error('You do not have permission to share this product!');
                    setSelectedProducts([])
                    return
                }
            }
            setOpenShare(true)
        } else if (active === "Company Products") {
            if (company && company.company.admins.includes(session.user.email)) {
                setOpenShare(true)
            } else {
                toast.error('You do not have permission to share this product!');
                setSelectedProducts([])
                return
            }
        } else {
            toast.error('You do not have permission to share this product!');
            setSelectedProducts([])
            return
        }
    }

    const handleDelete = async () => {
        if (selectedProducts.length < 1) {
            return;
        }

        if (active === "Company Products") {

            if (company && company.company.admins.includes(session.user.email)) {
                try {
                    setIsSubmitting(true)
                    for (const product of selectedProducts) {
                        await deleteCompanyProduct(product.id, company.company.name)
                    }
                    toast.success("Company product deleted")
                } catch (error) {
                    console.log(error)
                } finally {
                    setIsSubmitting(false)
                    setSelectedProducts([]);
                    setSelectAll(false)
                    router.refresh()
                    return
                }
            } else {
                toast.error("You do not have permission to delete products")
                return
            }

        }

        try {
            setIsSubmitting(true)

            for (const product of selectedProducts) {

                const productToDelete = products?.find((item) => item.product === product)
                    || companyProducts?.find((item) => item.product === product)
                    || sharedProducts?.find((item) => item.product === product)
                    || sharedCompanyProducts?.find((item) => item.product === product)


                if (productToDelete?.product?.createdByEmail !== session.user.email) {
                    toast.error("You cannot delete someone else's product")
                    return
                }

                await deleteProduct(productToDelete.product.id, session?.user?.email);
            }

            toast.success("Product deleted")

        } catch (error) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
            setSelectedProducts([]);
            setSelectAll(false)
            router.refresh()
        }
    }

    const toggleApprovalSelection = (approval: Approval) => {
        setSelectedApprovals((prevSelectedRows: any) => {
            if (prevSelectedRows.includes(approval)) {
                return prevSelectedRows.filter((item: Approval) => item !== approval);
            } else {
                return [...prevSelectedRows, approval];
            }
        });
    };

    const toggleApprovalSelectAll = () => {
        if (approvalSelectAll) {
            setSelectedApprovals([]);
        } else {
            var allApprovals
            if (active === "History") {
                allApprovals = approvals?.map(item => item.approval) || []
            } else if (active === "Company History") {
                allApprovals = companyApprovals?.map(item => item.approval) || []
            }
            if (allApprovals) {
                setSelectedApprovals(allApprovals);
            }
        };
        setApprovalSelectAll(prevSelectAll => !prevSelectAll);
    }

    const handleApprovalInfo = () => {
        if (selectedApprovals.length !== 1) {
            return;
        }
        setOpenInfoApproval(true)
    }

    const handleRevoke = async () => {
        if (selectedApprovals.length < 1) {
            return;
        }
        if (active === "History") {
            setIsSubmitting(true)
            try {
                for (const approval of selectedApprovals) {

                    const approvalToRevoke = approvals?.find((item) => item.approval === approval)

                    if (approvalToRevoke?.approval?.approverEmail !== session?.user?.email) {
                        toast.error("You do not have persmission to revoke this")
                        return
                    }

                    await revokeApproval(approvalToRevoke.approval.id, session?.user?.email);
                }
                router.refresh()
                toast.success("Revoke successful!")
            } catch (error) {
                console.log(error)
            } finally {
                setIsSubmitting(false)
                setSelectedApprovals([]);
            }
        } else if (active === "Company History") {
            if (company && !company.company.admins.includes(session.user.email)) {
                toast.error("You do not have permission to revoke")
                return
            }
            setIsSubmitting(true)
            try {
                for (const approval of selectedApprovals) {

                    const approvalToRevoke = companyApprovals?.find((item) => item.approval === approval)

                    if (approvalToRevoke && company) {
                        await revokeCompanyApproval(approvalToRevoke.approval.id, company.company.name, session.user.email);
                    }
                }
                router.refresh()
                toast.success("Revoke successful!")
            } catch (error) {
                console.log(error)
            } finally {
                setIsSubmitting(false)
                setSelectedApprovals([]);
            }
        }
    }

    return (
        <div className="h-full flex flex-col bg-white">

            {isSubmitting ?
                <div className='absolute top-0 bottom-0 left-0 right-0 bg-black/60 z-10'>
                    <ReactLoading type="spin" color='white' height={200} width={120} className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-30%]' />
                </div>
                : <></>
            }

            <Modal openModal={openModal} setOpenModal={setOpenModal} title="Create Product" submitRef={submitRef} closeModalRef={closeModalRef}>
                <CreateProductForm
                    submitRef={submitRef}
                    session={session}
                    closeModalRef={closeModalRef}
                    setSelectedProducts={setSelectedProducts}
                />
            </Modal>

            <Modal openModal={openShare} setOpenModal={setOpenShare} title="Share Products" submitRef={submitRef} closeModalRef={closeModalRef}>
                <SharePopup
                    active={active}
                    submitRef={submitRef}
                    session={session}
                    company={company}
                    closeModalRef={closeModalRef}
                    allUsers={allUsers}
                    allCompanies={allCompanies}
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                />
            </Modal>

            <Modal openModal={openInfo} setOpenModal={setOpenInfo} title="Product Info" submitRef={submitRef} closeModalRef={closeModalRef}>
                <InfoProductPopup
                    submitRef={submitRef}
                    session={session}
                    closeModalRef={closeModalRef}
                    product={selectedProducts[0]}
                    setSelectedProducts={setSelectedProducts}
                    active={active}
                    company={company}
                />
            </Modal>

            <Modal openModal={openInfoApproval} setOpenModal={setOpenInfoApproval} title="Approval Info" submitRef={submitRef} closeModalRef={closeModalRef}>
                <InfoApprovalPopup
                    submitRef={submitRef}
                    session={session}
                    closeModalRef={closeModalRef}
                    approval={selectedApprovals[0]}
                />
            </Modal>

            <div className="w-full h-[100px] mb-5 flex items-center gap-2 flex-row shadow-modern bg-white px-[6px] py-[6px] rounded-lg">

                <ImportsMenuItem title="My Products" active={active} handleClick={handleClick} icon={<IoMdPerson size={34} />} />
                <ImportsMenuItem title="Shared With Me" active={active} handleClick={handleClick} icon={<IoShareSocial size={36} />} />
                <ImportsMenuItem title="History" active={active} handleClick={handleClick} icon={<AiOutlineHistory size={36} />} />
                {session?.user?.company && (
                    <>
                        <ImportsMenuItem title="Company Products" active={active} handleClick={handleClick} icon={<CgOrganisation size={35} />} />
                        <ImportsMenuItem title="Shared With Company" active={active} handleClick={handleClick} wide={true} icon={<IoShareSocial size={36} />} />
                        <ImportsMenuItem title="Company History" active={active} handleClick={handleClick} icon={<AiOutlineHistory size={36} />} />
                    </>
                )}

            </div>

            <div className='w-full h-[90px] flex items-start flex-row bg-white text-[#546d79] rounded-lg border-[1.5px] border-gray-300'>
                {active === "History" || active === "Company History" ? (
                    <div className='w-full flex items-center mt-4 mb-4 px-3 h-[30px] gap-4'>
                        <div
                            className={`px-3 py-2 rounded-sm flex items-center gap-1 ${selectedApprovals.length > 0 && selectedApprovals.length < 2 ? "hover:bg-gray-200/60 hover:text-gray-700 hover:cursor-pointer" : "text-gray-400 cursor-default"}`}
                            onClick={handleApprovalInfo}
                        >
                            <IoInformationCircle size={27} />
                            <h6>Info</h6>
                        </div>
                        <div
                            className={`px-3 py-2 rounded-sm flex items-center gap-1 ${selectedApprovals.length > 0 ? "hover:bg-gray-200/60 hover:text-gray-700 hover:cursor-pointer" : "text-gray-400 cursor-default"}`}
                            onClick={handleRevoke}
                        >
                            <CgRedo size={26} />
                            <h6>Revoke Access</h6>
                        </div>
                    </div>
                ) : (
                    <div className='w-full h-[30px] flex items-center mt-4 mb-4 px-3 gap-4'>
                        <div
                            className='px-3 py-2 rounded-sm flex items-center gap-2 hover:bg-gray-200/60 hover:text-gray-700 hover:cursor-pointer'
                            onClick={() => setOpenModal(true)}
                        >
                            <BsPlusCircleFill size={22} />
                            <h6>New Product</h6>
                        </div>
                        <div
                            className={`px-3 py-2 rounded-sm flex items-center gap-1 ${selectedProducts.length > 0 && selectedProducts.length < 2 ? "hover:bg-gray-200/60 hover:text-gray-700 hover:cursor-pointer" : "text-gray-400 cursor-default"}`}
                            onClick={handleInfo}
                        >
                            <IoInformationCircle size={27} />
                            <h6>Info</h6>
                        </div>
                        <div
                            className={`px-3 py-2 rounded-sm flex items-center gap-2 ${selectedProducts.length > 0 ? "hover:bg-gray-200/60 hover:text-gray-700 hover:cursor-pointer" : "text-gray-400 cursor-default"}`}
                            onClick={handleShare}
                        >
                            <FaShareSquare size={24} />
                            <h6>Share</h6>
                        </div>
                        <div
                            className={`px-3 py-2 rounded-sm flex items-center gap-1 ${selectedProducts.length > 0 ? "hover:bg-gray-200/60 hover:text-gray-700 hover:cursor-pointer" : "text-gray-400 cursor-default"}`}
                            onClick={handleDelete}
                        >
                            <IoMdTrash size={26} />
                            <h6>Delete</h6>
                        </div>
                    </div>
                )
                }
            </div>

            <div className='h-full overflow-y-auto flex items-start p-6 flex-row gap-10 mt-2 bg-white rounded-lg border-[1.5px] border-gray-300'>

                <div className='w-full flex flex-col justify-center gap-[2.5px]'>

                    {active === "History" || active === "Company History" ? (
                        <></>
                    ) : (
                        <div className='grid grid-cols-[30px_auto_210px_100px] items-center text-[15px] font-semibold text-gray-500 px-3 mb-2 uppercase tracking-wide'>

                            <input
                                type="checkbox"
                                className="w-[17px] h-[17px] text-blue-600 bg-white border-gray-400 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600"
                                checked={selectAll}
                                onChange={toggleSelectAll}
                            />
                            <p className='flex items-center'><IoIosArrowDropdownCircle className="inline mr-1" size={21} />Description</p>
                            <p className='flex items-center'><IoIosArrowDropdownCircle className="inline mr-1" size={21} />Created By</p>
                            <p className='flex items-center'><IoIosArrowDropdownCircle className="inline mr-1" size={21} />Updated</p>

                        </div>
                    )
                    }

                    {/* Products table content depending on menu */}
                    {active === "My Products" && products && products.length > 0 ?
                        sortedProducts?.map((product, i) => (
                            <ProductCard product={product.product} toggleRowSelection={toggleRowSelection} selectedRows={selectedProducts} key={i} />
                        ))
                        : active === "My Products" ?
                            <NoProductsFound />

                            : active === "Company Products" && companyProducts && companyProducts.length > 0 ?
                                companyProducts?.map((product, i) => (
                                    <ProductCard product={product.product} toggleRowSelection={toggleRowSelection} selectedRows={selectedProducts} key={i} />
                                ))
                                : active === "Company Products" ?
                                    <NoProductsFound />

                                    : active === "Shared With Me" && sharedProducts && sharedProducts.length > 0 ?
                                        sharedProducts?.map((product, i) => (
                                            <ProductCard product={product.product} toggleRowSelection={toggleRowSelection} selectedRows={selectedProducts} key={i} />
                                        ))
                                        : active === "Shared With Me" ?
                                            <NoProductsFound />

                                            : active === "Shared With Company" && sharedCompanyProducts && sharedCompanyProducts.length > 0 ?
                                                sharedCompanyProducts?.map((product, i) => (
                                                    <ProductCard product={product.product} toggleRowSelection={toggleRowSelection} selectedRows={selectedProducts} key={i} />
                                                ))
                                                : active === "Shared With Company" ?
                                                    <NoProductsFound />
                                                    : active === "History" && approvals && approvals.length > 0 ?
                                                        <ApprovalsList
                                                            approvals={approvals}
                                                            toggleApprovalSelectAll={toggleApprovalSelectAll}
                                                            approvalSelectAll={approvalSelectAll}
                                                            toggleApprovalSelection={toggleApprovalSelection}
                                                            selectedApprovals={selectedApprovals}
                                                        />
                                                        : active === "History" ?
                                                            <NoApprovals />
                                                            : active === "Company History" && companyApprovals && companyApprovals.length > 0 ?
                                                                <ApprovalsList
                                                                    approvals={companyApprovals}
                                                                    toggleApprovalSelectAll={toggleApprovalSelectAll}
                                                                    approvalSelectAll={approvalSelectAll}
                                                                    toggleApprovalSelection={toggleApprovalSelection}
                                                                    selectedApprovals={selectedApprovals}
                                                                />
                                                                : active === "Company History" ?
                                                                    <NoApprovals />
                                                                    :
                                                                    <></>
                    }

                </div>
            </div>

        </div>
    )
}

export default ImportsPage

