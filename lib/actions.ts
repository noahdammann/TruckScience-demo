import { CreateProductResponse, ProductFormProps, ProductResponse, CompanyResponse, UpdateProductResponse, UpdateUserResponse, UserResponse, Companies, CreateApprovalResponse, MailResponse, CreateUserResponse, CreateMailResponse, ApprovalResponse, Products, Users, Approvals, Product, AllMail, Approval } from "@/types";
import { GraphQLClient } from "graphql-request";
import { removeDuplicates, uploadImage } from "./support";
import { getAllCompaniesQuery, getAllUsersQuery, getApprovalQuery, getCompanyByCompanyInviteUrlQuery, getCompanyByInviteUrlQuery, getCompanyQuery, getMailQuery, getProductQuery, getUserQuery } from "@/graphql/getQuerys";
import { updateApprovalMutation, updateCompanyMutation, updateMailMutation, updateProductMutation, updateUserMutation } from "@/graphql/updateMutations";
import { createApprovalMutation, createCompanyMutation, createMailMutation, createProductMutation, createUserMutation } from "@/graphql/createMutations";
import { deleteApprovalMutation, deleteProductMutation } from "@/graphql/deleteMutations";

const isProduction = process.env.NODE_ENV === "production"
const apiUrl = process.env.NEXT_PUBLIC_GRAFBASE_API_URL || ""
const apiKey = process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || ""
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : "http://localhost:3000"

const client = new GraphQLClient(apiUrl)

const makeGraphQLRequest = async (query: string, variables = {}) => {
    try {
        return await client.request(query, variables)
    } catch (error) {
        throw error
    }
}

export const getUser = async (email: string) => {
    client.setHeader("x-api-key", apiKey);
    return await makeGraphQLRequest(getUserQuery, { email })
}

export const getMail = async (id: string) => {
    client.setHeader("x-api-key", apiKey);
    return await makeGraphQLRequest(getMailQuery, { id })
}

export const getCompany = async (name: string) => {
    client.setHeader("x-api-key", apiKey);
    return await makeGraphQLRequest(getCompanyQuery, { name })
}

export const getProduct = async (id: string) => {
    client.setHeader("x-api-key", apiKey);
    return await makeGraphQLRequest(getProductQuery, { id })
}

export const getApproval = async (id: string) => {
    client.setHeader("x-api-key", apiKey);
    return await makeGraphQLRequest(getApprovalQuery, { id })
}

export const getAllUsers = async () => {
    client.setHeader("x-api-key", apiKey);
    return await makeGraphQLRequest(getAllUsersQuery)
}

export const getAllCompanies = async () => {
    client.setHeader("x-api-key", apiKey);
    return await makeGraphQLRequest(getAllCompaniesQuery)
}

export const getUserMail = async (mailList: Array<string>) => {
    client.setHeader("x-api-key", apiKey);

    var allMail = [] as AllMail
    for (const id of mailList) {
        const mail = await getMail(id) as MailResponse
        if (mail.mail) {
            allMail.push(mail)
        }
    }
    return allMail
}

export const getMembers = async (name: string) => {
    client.setHeader("x-api-key", apiKey);

    const company = await getCompany(name) as CompanyResponse;
    const members = company.company.members;

    const memberObjects = await Promise.all(
        members.map(async (email: string) => {
            const user = await getUser(email);
            return user;
        })
    );

    return memberObjects;
}

export const getUserProducts = async (email: string) => {
    client.setHeader("x-api-key", apiKey);

    const user = await getUser(email) as UserResponse

    const productsArr = [];

    if (user.user) {
        if (user.user.products !== null && user.user.products !== undefined) {
            const { products } = user.user

            for (const productId of products) {
                const product = await getProduct(productId);
                productsArr.push(product);
            }
        }
    }

    return productsArr;
}

export const getUserSharedProducts = async (email: string) => {
    client.setHeader("x-api-key", apiKey);

    const user = await getUser(email) as UserResponse

    const productList = [] as Products

    if (user.user) {
        if (user.user.sharedProducts !== null && user.user.sharedProducts !== undefined && user.user.sharedProducts.length > 0) {
            const { sharedProducts } = user.user

            for (const productId of sharedProducts) {
                const product = await getProduct(productId) as ProductResponse
                if (!productList.includes(product)) {
                    productList.push(product)
                }
            }
        }
        if (user.user.sharedCompanies !== null && user.user.sharedCompanies !== undefined && user.user.sharedCompanies.length > 0) {
            const { sharedCompanies } = user.user

            for (const company of sharedCompanies) {
                const products = await getCompanyProducts(company) as Products
                for (const product of products) {
                    if (!productList.includes(product)) {
                        productList.push(product)
                    }
                }
            }
        }
        if (user.user.sharedUsers !== null && user.user.sharedUsers !== undefined && user.user.sharedUsers.length > 0) {
            const { sharedUsers } = user.user

            for (const userEmail of sharedUsers) {
                const products = await getUserProducts(userEmail) as Products
                for (const product of products) {
                    if (!productList.includes(product)) {
                        productList.push(product)
                    }
                }
            }
        }
    }

    return removeDuplicates(productList);
}

export const getUserApprovals = async (email: string) => {
    client.setHeader("x-api-key", apiKey);

    const user = await getUser(email) as UserResponse

    const approvalList = [];

    if (user.user) {
        if (user.user.approvals !== null && user.user.approvals !== undefined && user.user.approvals.length > 0) {
            const { approvals } = user.user

            for (const approvalId of approvals) {
                const approval = await getApproval(approvalId) as ApprovalResponse
                if (approval.approval) {
                    approvalList.push(approval);
                }
            }
        }
    }

    return approvalList;
}

export const getUserSharedUsers = async (email: string) => {
    client.setHeader("x-api-key", apiKey);
    const user = await getUser(email) as UserResponse

    const usersList = [] as Users

    if (user.user.sharedUsers && user.user.sharedUsers.length > 0) {
        for (const userEmail of user.user.sharedUsers) {
            const userRes = await getUser(userEmail) as UserResponse
            if (userRes.user) {
                usersList.push(userRes)
            }
        }
    }

    return usersList
}

export const getUserSharedCompanies = async (email: string) => {
    client.setHeader("x-api-key", apiKey);
    const user = await getUser(email) as UserResponse

    const companyList = [] as Companies

    if (user.user.sharedCompanies && user.user.sharedCompanies.length > 0) {
        for (const comanyName of user.user.sharedCompanies) {
            const company = await getCompany(comanyName) as CompanyResponse
            if (company.company) {
                companyList.push(company)
            }
        }
    }

    return companyList
}

export const getCompanyProducts = async (name: string) => {
    client.setHeader("x-api-key", apiKey);

    const company = await getCompany(name) as CompanyResponse

    const productList = [] as Products

    if (company.company) {
        if (company.company.products !== null && company.company.products !== undefined) {
            const { products } = company.company

            for (const productId of products) {
                const product = await getProduct(productId) as ProductResponse
                if (!productList.includes(product)) {
                    productList.push(product)
                }
            }
        }
    }

    return productList
}

export const getCompanyApprovals = async (approvals: Array<string>) => {
    client.setHeader("x-api-key", apiKey);

    const approvalsList = [] as Approvals

    if (approvals) {
        for (const approvalId of approvals) {
            const approval = await getApproval(approvalId) as ApprovalResponse
            if (!approvalsList.includes(approval)) {
                approvalsList.push(approval)
            }
        }
    }

    return approvalsList
}

export const getCompanySharedProducts = async (name: string) => {
    client.setHeader("x-api-key", apiKey);

    const company = await getCompany(name) as CompanyResponse

    const productList = [] as Products

    if (company.company) {
        if (company.company.sharedProducts !== null && company.company.sharedProducts !== undefined && company.company.sharedProducts.length > 0) {
            const { sharedProducts } = company.company

            for (const productId of sharedProducts) {
                const product = await getProduct(productId) as ProductResponse
                if (!productList.includes(product)) {
                    productList.push(product);
                }
            }
        }
        if (company.company.sharedCompanies !== null && company.company.sharedCompanies !== undefined && company.company.sharedCompanies.length > 0) {
            const { sharedCompanies } = company.company

            for (const companyName of sharedCompanies) {
                const products = await getCompanyProducts(companyName) as Products
                for (const product of products) {
                    if (!productList.includes(product)) {
                        productList.push(product)
                    }
                }
            }
        }
        if (company.company.sharedUsers !== null && company.company.sharedUsers !== undefined && company.company.sharedUsers.length > 0) {
            const { sharedUsers } = company.company

            for (const userEmail of sharedUsers) {
                const products = await getUserProducts(userEmail) as Products
                for (const product of products) {
                    if (!productList.includes(product)) {
                        productList.push(product)
                    }
                }
            }
        }
    }

    return removeDuplicates(productList);
}

export const getCompanySharedUsers = async (userEmails: Array<string> | null) => {
    client.setHeader("x-api-key", apiKey)

    const userList = [] as Users

    if (userEmails) {
        for (const userEmail of userEmails) {
            const user = await getUser(userEmail) as UserResponse
            if (user.user && !userList.includes(user)) {
                userList.push(user)
            }
        }
    }

    return userList
}

export const getCompanySharedCompanies = async (companyNames: Array<string> | null) => {
    client.setHeader("x-api-key", apiKey);

    const companyList = [] as Companies

    if (companyNames) {
        for (const companyName of companyNames) {
            const company = await getCompany(companyName) as CompanyResponse
            if (company.company && !companyList.includes(company)) {
                companyList.push(company)
            }
        }
    }

    return companyList
}

export const getComanyByInviteUrl = async (inviteUrl: string) => {
    client.setHeader("x-api-key", apiKey);
    return await makeGraphQLRequest(getCompanyByInviteUrlQuery, { inviteUrl })
}

export const getComanyByCompanyInviteUrl = async (companyInviteUrl: string) => {
    client.setHeader("x-api-key", apiKey);
    return await makeGraphQLRequest(getCompanyByCompanyInviteUrlQuery, { companyInviteUrl })
}

export const updateReadMail = async (mailId: string) => {
    client.setHeader("x-api-key", apiKey)
    const mailVariables = {
        id: mailId,
        input: {
            read: true,
        }
    }
    await makeGraphQLRequest(updateMailMutation, mailVariables)
}

export const updateUserCompany = async (email: string, companyName: string) => {
    client.setHeader("x-api-key", apiKey);

    const variables = {
        email: email,
        input: {
            company: companyName,
        }
    }
    return await makeGraphQLRequest(updateUserMutation, variables)
}

export const updateCompanyMembers = async (inviteUrl: string, email: string) => {
    client.setHeader("x-api-key", apiKey);

    const company = await getComanyByInviteUrl(inviteUrl) as CompanyResponse

    if (!company.company.members.includes(email)) {
        company.company.members.push(email)
    }

    const variables = {
        name: company.company.name,
        input: {
            members: company.company.members,
        }
    }

    await makeGraphQLRequest(updateCompanyMutation, variables)
    await updateUserCompany(email, company.company.name)

    return
}

export const shareUserWithUser = async (approvedUserEmail: string, approverUserEmail: string) => {
    client.setHeader("x-api-key", apiKey);

    const approverUser = await getUser(approverUserEmail) as UserResponse
    const approvedUser = await getUser(approvedUserEmail) as UserResponse

    // Create mail
    const mailVariables = {
        input: {
            userEmail: approvedUserEmail,
            message: `${approverUser.user.name} has pre-approved you for all products.`
        }
    }
    const res = await makeGraphQLRequest(createMailMutation, mailVariables) as CreateMailResponse

    // Update user
    var newMail
    const { mail } = approvedUser.user
    if (mail && mail.length > 0) {
        newMail = [...mail, res.mailCreate.mail.id]
    } else {
        newMail = [res.mailCreate.mail.id]
    }

    var newSharedUsers
    const { sharedUsers } = approvedUser.user
    if (sharedUsers && sharedUsers.length > 0) {
        if (sharedUsers.includes(approverUserEmail)) {
            return
        } else {
            newSharedUsers = [...sharedUsers, approverUserEmail]
        }
    } else {
        newSharedUsers = [approverUserEmail]
    }

    const approvedUserVariables = {
        email: approvedUserEmail,
        input: {
            sharedUsers: newSharedUsers,
            mail: newMail,
        }
    }

    await makeGraphQLRequest(updateUserMutation, approvedUserVariables)

    // Create approval 
    const approvalVariables = {
        input: {
            approvalType: "user",
            approvalBetween: "user to user",
            approverName: approverUser.user.name,
            approverEmail: approverUserEmail,
            approverImage: approverUser.user.image,
            approvedUserName: approvedUser.user.name,
            approvedUserEmail: approvedUserEmail,
            approvedUserImage: approvedUser.user.image,
            communicationMedium: "Through website",
        }
    }
    const app = await makeGraphQLRequest(createApprovalMutation, approvalVariables) as CreateApprovalResponse

    // Add approval to user
    var newApprovals
    const { approvals } = approverUser.user
    if (approvals && approvals.length > 0) {
        newApprovals = [...approvals, app.approvalCreate.approval.id]
    } else {
        newApprovals = [app.approvalCreate.approval.id]
    }

    const approverUserVariables = {
        email: approverUserEmail,
        input: {
            approvals: newApprovals
        }
    }

    await makeGraphQLRequest(updateUserMutation, approverUserVariables)
}

export const shareUserWithCompany = async (companyName: string, userEmail: string) => {
    client.setHeader("x-api-key", apiKey);

    const company = await getCompany(companyName) as CompanyResponse
    const user = await getUser(userEmail) as UserResponse

    // Update company
    var newSharedUsers
    const { sharedUsers } = company.company
    if (sharedUsers && sharedUsers.length > 0) {
        if (sharedUsers.includes(userEmail)) {
            return
        } else {
            newSharedUsers = [...sharedUsers, userEmail]
        }
    } else {
        newSharedUsers = [userEmail]
    }

    const approvedCompanyVariables = {
        name: companyName,
        input: {
            sharedUsers: newSharedUsers
        }
    }

    makeGraphQLRequest(updateCompanyMutation, approvedCompanyVariables)

    // Create approval
    const approvalVariables = {
        input: {
            approvalType: "company",
            approvalBetween: "user to company",
            approverName: user.user.name,
            approverEmail: userEmail,
            approverImage: user.user.image,
            approvedCompany: companyName,
            approvedCompanyLogo: company.company.logo,
            communicationMedium: "Through website",
        }
    }
    const app = await makeGraphQLRequest(createApprovalMutation, approvalVariables) as CreateApprovalResponse

    // Add approval to user
    var newApprovals
    const { approvals } = user.user
    if (approvals && approvals.length > 0) {
        newApprovals = [...approvals, app.approvalCreate.approval.id]
    } else {
        newApprovals = [app.approvalCreate.approval.id]
    }

    const approverUserVariables = {
        email: userEmail,
        input: {
            approvals: newApprovals
        }
    }

    await makeGraphQLRequest(updateUserMutation, approverUserVariables)

}

export const shareCompanyWithUser = async (approvedUserEmail: string, approverUserEmail: string, companyName: string) => {
    client.setHeader("x-api-key", apiKey);
    const approvedUser = await getUser(approvedUserEmail) as UserResponse
    const approverUser = await getUser(approverUserEmail) as UserResponse
    const company = await getCompany(companyName) as CompanyResponse

    // Create mail
    const mailVariables = {
        input: {
            userEmail: approvedUserEmail,
            message: `${company.company.name} has pre-approved you for all their products.`
        }
    }
    const res = await makeGraphQLRequest(createMailMutation, mailVariables) as CreateMailResponse

    // Update user
    var newMail
    const { mail } = approvedUser.user
    if (mail && mail.length > 0) {
        newMail = [...mail, res.mailCreate.mail.id]
    } else {
        newMail = [res.mailCreate.mail.id]
    }

    var newSharedCompanies
    const { sharedCompanies } = approvedUser.user
    if (sharedCompanies && sharedCompanies.length > 0) {
        if (sharedCompanies.includes(companyName)) {
            return
        } else {
            newSharedCompanies = [...sharedCompanies, companyName]
        }
    } else {
        newSharedCompanies = [companyName]
    }

    const userVariables = {
        email: approvedUserEmail,
        input: {
            sharedCompanies: newSharedCompanies,
            mail: newMail
        }
    }

    await makeGraphQLRequest(updateUserMutation, userVariables)

    // Create approval
    const approvalVariables = {
        input: {
            approvalType: "user",
            approvalBetween: "company to user",
            approverName: approverUser.user.name,
            approverEmail: approverUserEmail,
            approverImage: approverUser.user.image,
            approverCompany: companyName,
            approverCompanyLogo: company.company.logo,
            approvedUserName: approvedUser.user.name,
            approvedUserEmail: approvedUserEmail,
            approvedUserImage: approvedUser.user.image,
            communicationMedium: "Through website",
        }
    }
    const app = await makeGraphQLRequest(createApprovalMutation, approvalVariables) as CreateApprovalResponse

    // Add approval to company
    var newApprovals
    const { approvals } = company.company
    if (approvals && approvals.length > 0) {
        newApprovals = [...approvals, app.approvalCreate.approval.id]
    } else {
        newApprovals = [app.approvalCreate.approval.id]
    }

    const companyVariables = {
        name: companyName,
        input: {
            approvals: newApprovals
        }
    }

    await makeGraphQLRequest(updateCompanyMutation, companyVariables)
}

export const shareCompanyWithCompany = async (approvedCompanyName: string, approverEmail: string, approverCompanyName: string) => {
    client.setHeader("x-api-key", apiKey);
    const approvedCompany = await getCompany(approvedCompanyName) as CompanyResponse
    const approverCompany = await getCompany(approverCompanyName) as CompanyResponse
    const approverUser = await getUser(approverEmail) as UserResponse

    // Update company
    var newSharedCompanies
    const { sharedCompanies } = approvedCompany.company
    if (sharedCompanies && sharedCompanies.length > 0) {
        if (sharedCompanies.includes(approverCompanyName)) {
            return
        } else {
            newSharedCompanies = [...sharedCompanies, approverCompanyName]
        }
    } else {
        newSharedCompanies = [approverCompanyName]
    }

    const approvedCompanyVariables = {
        name: approvedCompanyName,
        input: {
            sharedCompanies: newSharedCompanies
        }
    }

    makeGraphQLRequest(updateCompanyMutation, approvedCompanyVariables)

    // Create approval
    const approvalVariables = {
        input: {
            approvalType: "company",
            approvalBetween: "company to company",
            approverName: approverUser.user.name,
            approverEmail: approverEmail,
            approverImage: approverUser.user.image,
            approverCompany: approverCompanyName,
            approverCompanyLogo: approverCompany.company.logo,
            approvedCompany: approvedCompanyName,
            approvedCompanyLogo: approvedCompany.company.logo,
            communicationMedium: "Through website",
        }
    }
    const app = await makeGraphQLRequest(createApprovalMutation, approvalVariables) as CreateApprovalResponse

    // Add approval to company
    var newApprovals
    const { approvals } = approverCompany.company
    if (approvals && approvals.length > 0) {
        newApprovals = [...approvals, app.approvalCreate.approval.id]
    } else {
        newApprovals = [app.approvalCreate.approval.id]
    }

    const approverCompanyVariables = {
        name: approverCompanyName,
        input: {
            approvals: newApprovals
        }
    }

    await makeGraphQLRequest(updateCompanyMutation, approverCompanyVariables)
}

export const updateUserDetails = async (form: any, email: string, logoUrl: string) => {
    client.setHeader("x-api-key", apiKey);

    const prevUser = await getUser(email) as UserResponse

    const prevLogoUrl = prevUser.user.image
    const prevName = prevUser.user.name

    if (prevName === form.Name && prevLogoUrl === logoUrl) {
        return
    }

    var variables
    if (prevLogoUrl === logoUrl) {
        variables = {
            email: email,
            input: {
                name: form.Name
            }
        }
    } else {

        const newLogoUrl = await uploadImage(logoUrl)

        if (newLogoUrl.url) {
            variables = {
                email: email,
                input: {
                    name: form.Name,
                    image: newLogoUrl.url,
                }
            }
        }
    }

    return makeGraphQLRequest(updateUserMutation, variables)
}

export const updateCompanyDetails = async (form: any, companyName: string, logoUrl: string) => {
    client.setHeader("x-api-key", apiKey);

    const prevCompany = await getCompany(companyName) as CompanyResponse

    const prevLogoUrl = prevCompany.company.logo
    const prevName = prevCompany.company.name
    const prevMembers = prevCompany.company.members

    if (prevName === form.Name && prevLogoUrl === logoUrl) {
        return
    }

    prevMembers.forEach(async (item) => {
        await updateUserCompany(item, form.Name)
    })

    var variables
    if (prevLogoUrl === logoUrl) {
        variables = {
            name: companyName,
            input: {
                name: form.Name
            }
        }
    } else {

        const newLogoUrl = await uploadImage(logoUrl)

        if (newLogoUrl.url) {
            variables = {
                name: companyName,
                input: {
                    name: form.Name,
                    logo: newLogoUrl.url,
                }
            }
        }
    }

    return makeGraphQLRequest(updateCompanyMutation, variables)
}

export const updateProduct = async (form: ProductFormProps, isPrivate: boolean, productId: string, userEmail: string) => {
    client.setHeader("x-api-key", apiKey);

    const variables = {
        id: productId,
        input: {
            make: form?.Make,
            range: form?.Range,
            description: form?.Description,
            private: isPrivate,
        }
    }

    const prevProduct = await getProduct(productId) as ProductResponse
    const newProduct = await makeGraphQLRequest(updateProductMutation, variables) as UpdateProductResponse

    if (prevProduct.product.private !== newProduct.productUpdate.product.private) {
        const user = await getUser(userEmail) as UserResponse
        if (user.user.company) {
            const company = await getCompany(user.user.company) as CompanyResponse
            if (company.company.products) {
                var companyVariables
                if (newProduct.productUpdate.product.private) {
                    const newProducts = company.company.products.filter((id) => id !== productId)
                    companyVariables = {
                        name: company.company.name,
                        input: {
                            products: newProducts
                        }
                    }
                } else {
                    const newProducts = [...company.company.products, productId]
                    companyVariables = {
                        name: company.company.name,
                        input: {
                            products: newProducts
                        }
                    }
                }
                makeGraphQLRequest(updateCompanyMutation, companyVariables)
            }
        }
    }
    return
}


export const shareProductsWithUsers = async (productIds: Array<string>, userEmails: Array<string>, approverName: string, approverEmail: string) => {
    client.setHeader("x-api-key", apiKey);

    // Loop through all products and users to create approvals
    for (const userEmail of userEmails) {

        const approverUser = await getUser(approverEmail) as UserResponse
        const approvalIdList = [] as Array<string>
        const productIdList = [] as Array<string>

        for (const productId of productIds) {

            const approvedUser = await getUser(userEmail) as UserResponse
            const product = await getProduct(productId) as ProductResponse

            if (approvedUser.user.sharedProducts && approvedUser.user.sharedProducts.length > 0 && approvedUser.user.sharedProducts.includes(productId)) {
                continue
            }

            const variables = {
                input: {
                    approvalType: "product",
                    approvalBetween: "user to user",
                    approverName: approverName,
                    approverEmail: approverEmail,
                    approverImage: approverUser.user.image,
                    product: productId,
                    productMake: product.product.make,
                    productRange: product.product.range,
                    productDescription: product.product.description,
                    approvedUserName: approvedUser.user.name,
                    approvedUserEmail: userEmail,
                    approvedUserImage: approvedUser.user.image,
                    communicationMedium: "Through website",
                }
            };
            const mailVariables = {
                input: {
                    userEmail: userEmail,
                    message: `${approverName} has shared '${product.product.description}' with you.`
                }
            }
            try {
                const approval = await makeGraphQLRequest(createApprovalMutation, variables) as CreateApprovalResponse
                const mail = await makeGraphQLRequest(createMailMutation, mailVariables) as CreateMailResponse

                var userVariables
                if (approvedUser.user.mail && approvedUser.user.mail.length > 0) {
                    userVariables = {
                        email: userEmail,
                        input: {
                            mail: [...approvedUser.user.mail, mail.mailCreate.mail.id]
                        }
                    }
                } else {
                    userVariables = {
                        email: userEmail,
                        input: {
                            mail: [mail.mailCreate.mail.id]
                        }
                    }
                }
                await makeGraphQLRequest(updateUserMutation, userVariables)

                productIdList.push(productId)
                approvalIdList.push(approval.approvalCreate.approval.id)
            } catch (error) {
                console.log(error);
            }
        }

        const approvedUser = await getUser(userEmail) as UserResponse

        // Update the approved user
        var newSharedProducts
        if (approvedUser.user.sharedProducts && approvedUser.user.sharedProducts.length > 0 && productIdList.length > 0) {
            newSharedProducts = [...approvedUser.user.sharedProducts, ...productIdList]
        } else if (productIdList.length > 0) {
            newSharedProducts = [...productIdList]
        } else {
            newSharedProducts = approvedUser.user.sharedProducts
        }

        const approvedUserVariables = {
            email: approvedUser.user.email,
            input: {
                sharedProducts: newSharedProducts,
            }
        }

        await makeGraphQLRequest(updateUserMutation, approvedUserVariables)

        // Update the approver
        var newApprovals
        if (approverUser.user.approvals && approverUser.user.approvals.length > 0 && approvalIdList.length > 0) {
            newApprovals = [...approverUser.user.approvals, ...approvalIdList]
        } else if (approvalIdList.length > 0) {
            newApprovals = [...approvalIdList]
        } else {
            newApprovals = approverUser.user.approvals
        }

        const approverUserVariables = {
            email: approverEmail,
            input: {
                approvals: newApprovals,
            }
        }

        await makeGraphQLRequest(updateUserMutation, approverUserVariables)
    }

    return
}

export const shareProductsWithCompanies = async (productIds: Array<string>, companyNames: Array<string>, userEmail: string) => {
    client.setHeader("x-api-key", apiKey);

    // Loop through all products and users to create approvals
    for (const companyName of companyNames) {

        const approvedCompany = await getCompany(companyName) as CompanyResponse
        const approverUser = await getUser(userEmail) as UserResponse
        const approvalIdList = [] as Array<string>
        const productIdList = [] as Array<string>

        for (const productId of productIds) {

            const product = await getProduct(productId) as ProductResponse

            if (approvedCompany.company.sharedProducts && approvedCompany.company.sharedProducts.length > 0 && approvedCompany.company.sharedProducts.includes(productId)) {
                continue
            }

            const variables = {
                input: {
                    approvalType: "product",
                    approvalBetween: "user to company",
                    approverName: approverUser.user.name,
                    approverEmail: userEmail,
                    approverImage: approverUser.user.image,
                    product: productId,
                    productMake: product.product.make,
                    productRange: product.product.range,
                    productDescription: product.product.description,
                    approvedCompany: approvedCompany.company.name,
                    approvedCompanyLogo: approvedCompany.company?.logo,
                    communicationMedium: "Through website",
                }
            };
            try {
                const res = await makeGraphQLRequest(createApprovalMutation, variables) as CreateApprovalResponse
                productIdList.push(productId)
                approvalIdList.push(res.approvalCreate.approval.id)
            } catch (error) {
                console.log(error);
            }
        }

        // Update the approved company
        var newSharedProducts
        if (approvedCompany.company.sharedProducts && approvedCompany.company.sharedProducts.length > 0 && productIdList.length > 0) {
            newSharedProducts = [...approvedCompany.company.sharedProducts, ...productIdList]
        } else if (productIdList.length > 0) {
            newSharedProducts = [...productIdList]
        } else {
            newSharedProducts = approvedCompany.company.sharedProducts
        }

        const approvedCompanyVariables = {
            name: approvedCompany.company.name,
            input: {
                approvals: newApprovals,
                sharedProducts: newSharedProducts,
            }
        }

        await makeGraphQLRequest(updateCompanyMutation, approvedCompanyVariables)

        // Update the approver
        var newApprovals
        if (approverUser.user.approvals && approverUser.user.approvals.length > 0 && approvalIdList.length > 0) {
            newApprovals = [...approverUser.user.approvals, ...approvalIdList]
        } else if (approvalIdList.length > 0) {
            newApprovals = [...approvalIdList]
        } else {
            newApprovals = approverUser.user.approvals
        }

        const approverUserVariables = {
            email: userEmail,
            input: {
                approvals: newApprovals,
            }
        }

        await makeGraphQLRequest(updateUserMutation, approverUserVariables)
    }
    return
}

export const shareCompanyProductWithUser = async (product: Product, approvedUserEmail: string, approverUserEmail: string, companyName: string) => {
    client.setHeader("x-api-key", apiKey);

    // Create approval
    const approverUser = await getUser(approverUserEmail) as UserResponse
    const approvedUser = await getUser(approvedUserEmail) as UserResponse
    const approverCompany = await getCompany(companyName) as CompanyResponse

    const approvalVariables = {
        input: {
            approvalType: "product",
            approvalBetween: "company to user",
            approverName: approverUser.user.name,
            approverEmail: approverUserEmail,
            approverImage: approverUser.user.image,
            approverCompany: companyName,
            approverCompanyLogo: approverCompany.company.logo,
            product: product.id,
            productMake: product.make,
            productRange: product.range,
            productDescription: product.description,
            approvedUserName: approvedUser.user.name,
            approvedUserEmail: approvedUserEmail,
            approvedUserImage: approvedUser.user.image,
            communicationMedium: "Through website",
        }
    }
    const app = await makeGraphQLRequest(createApprovalMutation, approvalVariables) as CreateApprovalResponse

    // Update company with approval
    var newApprovals
    const { approvals } = approverCompany.company
    if (approvals && approvals.length > 0) {
        newApprovals = [...approvals, app.approvalCreate.approval.id]
    } else {
        newApprovals = [app.approvalCreate.approval.id]
    }

    const companyVariables = {
        name: companyName,
        input: {
            approvals: newApprovals,
        }
    }
    await makeGraphQLRequest(updateCompanyMutation, companyVariables)

    // Update approved user with sharedProduct and mail
    const mailVariables = {
        input: {
            userEmail: approvedUserEmail,
            message: `${companyName} has shared '${product.description}' with you.`
        }
    }
    const res = await makeGraphQLRequest(createMailMutation, mailVariables) as CreateMailResponse

    var newMail
    const { mail } = approvedUser.user
    if (mail && mail.length > 0) {
        newMail = [...mail, res.mailCreate.mail.id]
    } else {
        newMail = [res.mailCreate.mail.id]
    }

    var newSharedProducts
    const { sharedProducts } = approvedUser.user
    if (sharedProducts && sharedProducts.length > 0) {
        newSharedProducts = [...sharedProducts, product.id]
    } else {
        newSharedProducts = [product.id]
    }

    const userVariables = {
        email: approvedUserEmail,
        input: {
            sharedProducts: newSharedProducts,
            mail: newMail
        }
    }
    await makeGraphQLRequest(updateUserMutation, userVariables)
    return
}

export const shareCompanyProductWithCompany = async (product: Product, approvedCompanyName: string, approverCompanyName: string, userEmail: string) => {
    client.setHeader("x-api-key", apiKey);

    const approvedCompany = await getCompany(approvedCompanyName) as CompanyResponse
    const approverCompany = await getCompany(approverCompanyName) as CompanyResponse
    const approverUser = await getUser(userEmail) as UserResponse

    // Create approval
    const approvalVariables = {
        input: {
            approvalType: "product",
            approvalBetween: "company to company",
            approverName: approverUser.user.name,
            approverEmail: userEmail,
            approverImage: approverUser.user.image,
            approverCompany: approverCompanyName,
            approverCompanyLogo: approverCompany.company.logo,
            product: product.id,
            productMake: product.make,
            productRange: product.range,
            productDescription: product.description,
            approvedCompany: approvedCompanyName,
            approvedCompanyLogo: approvedCompany.company.logo,
            communicationMedium: "Through website",
        }
    }
    const app = await makeGraphQLRequest(createApprovalMutation, approvalVariables) as CreateApprovalResponse

    // Update approver company
    var newApprovals
    const { approvals } = approverCompany.company
    if (approvals && approvals.length > 0) {
        newApprovals = [...approvals, app.approvalCreate.approval.id]
    } else {
        newApprovals = [app.approvalCreate.approval.id]
    }

    const approverCompanyVariables = {
        name: approverCompanyName,
        input: {
            approvals: newApprovals,
        }
    }
    await makeGraphQLRequest(updateCompanyMutation, approverCompanyVariables)

    // Update approved company
    var newSharedProducts
    const { sharedProducts } = approvedCompany.company
    if (sharedProducts && sharedProducts.length > 0) {
        newSharedProducts = [...sharedProducts, product.id]
    } else {
        newSharedProducts = [product.id]
    }

    const approvedCompanyVariables = {
        name: approvedCompanyName,
        input: {
            sharedProducts: newSharedProducts
        }
    }
    await makeGraphQLRequest(updateCompanyMutation, approvedCompanyVariables)
    return
}

export const promoteToAdmin = async (userEmail: string, companyName: string) => {
    client.setHeader("x-api-key", apiKey);
    const company = await getCompany(companyName) as CompanyResponse

    const newAdmins = [...company.company.admins, userEmail]

    const companyVariables = {
        name: companyName,
        input: {
            admins: newAdmins
        }
    }
    await makeGraphQLRequest(updateCompanyMutation, companyVariables)

    // Send mail to user
    const mailVariables = {
        input: {
            userEmail: userEmail,
            message: `You have been made an admin in your organisation.`
        }
    }
    const res = await makeGraphQLRequest(createMailMutation, mailVariables) as CreateMailResponse

    const approvedUser = await getUser(userEmail) as UserResponse

    var newMail
    const { mail } = approvedUser.user
    if (mail && mail.length > 0) {
        newMail = [...mail, res.mailCreate.mail.id]
    } else {
        newMail = [res.mailCreate.mail.id]
    }

    const userVariables = {
        email: userEmail,
        input: {
            mail: newMail,
        }
    }
    await makeGraphQLRequest(updateUserMutation, userVariables)
    return
}

export const demoteToMember = async (userEmail: string, companyName: string) => {
    client.setHeader("x-api-key", apiKey);
    const company = await getCompany(companyName) as CompanyResponse

    const newAdmins = company.company.admins.filter(admin => admin !== userEmail)

    const companyVariables = {
        name: companyName,
        input: {
            admins: newAdmins
        }
    }
    await makeGraphQLRequest(updateCompanyMutation, companyVariables)

    // Send mail to user
    return
}

export const removeSharedUser = async (approvedUserEmail: string, approverUserEmail: string, approval: Approval) => {
    client.setHeader("x-api-key", apiKey);

    const approverUser = await getUser(approverUserEmail) as UserResponse
    const approvedUser = await getUser(approvedUserEmail) as UserResponse

    // Create mail
    const mailVariables = {
        input: {
            userEmail: approvedUser.user.email,
            message: `${approverUser.user.name} has removed you from their pre-approved list.`
        }
    }
    const mail = await makeGraphQLRequest(createMailMutation, mailVariables) as CreateMailResponse

    const newMail = approvedUser.user.mail?.concat(mail.mailCreate.mail.id) || [mail.mailCreate.mail.id]

    // Remove user from user sharedCompanies

    const newSharedUsers = approvedUser.user.sharedUsers?.filter(user => user !== approverUserEmail) || []

    const approvedUserVariables = {
        email: approvedUserEmail,
        input: {
            sharedUsers: newSharedUsers,
            mail: newMail,
        }
    }

    await makeGraphQLRequest(updateUserMutation, approvedUserVariables)

    // Remove approval from user
    const newApprovals = approverUser.user.approvals?.filter(app => app !== approval.id)

    const approverUserVariables = {
        email: approverUserEmail,
        input: {
            approvals: newApprovals
        }
    }
    await makeGraphQLRequest(updateUserMutation, approverUserVariables)

    // Delete approval
    await makeGraphQLRequest(deleteApprovalMutation, { id: approval.id })
}

export const removeSharedCompany = async (companyName: string, userEmail: string, approval: Approval) => {
    client.setHeader("x-api-key", apiKey);

    // Remove user from company sharedUsers
    const company = await getCompany(companyName) as CompanyResponse

    const newSharedUsers = company.company.sharedUsers?.filter(user => user !== userEmail) || []

    const companyVariables = {
        name: companyName,
        input: {
            sharedUsers: newSharedUsers,
        }
    }

    await makeGraphQLRequest(updateCompanyMutation, companyVariables)

    // Remove approval from user
    const approverUser = await getUser(userEmail) as UserResponse

    const newApprovals = approverUser.user.approvals?.filter(app => app !== approval.id)

    const approverUserVariables = {
        email: userEmail,
        input: {
            approvals: newApprovals
        }
    }
    await makeGraphQLRequest(updateUserMutation, approverUserVariables)

    // Delete approval
    await makeGraphQLRequest(deleteApprovalMutation, { id: approval.id })

}

export const removeCompanySharedUser = async (approvedUserEmail: string, companyName: string, approval: Approval) => {
    client.setHeader("x-api-key", apiKey);

    const approvedUser = await getUser(approvedUserEmail) as UserResponse

    // Create mail
    const mailVariables = {
        input: {
            userEmail: approvedUser.user.email,
            message: `${companyName} has removed you from their pre-approved list.`
        }
    }
    const mail = await makeGraphQLRequest(createMailMutation, mailVariables) as CreateMailResponse

    const newMail = approvedUser.user.mail?.concat(mail.mailCreate.mail.id) || [mail.mailCreate.mail.id]

    // Remove company from user sharedCompanies

    const newSharedCompanies = approvedUser.user.sharedCompanies?.filter(company => company !== companyName) || []

    const userVariables = {
        email: approvedUserEmail,
        input: {
            sharedCompanies: newSharedCompanies,
            mail: newMail
        }
    }

    await makeGraphQLRequest(updateUserMutation, userVariables)

    // Remove approval from company
    const company = await getCompany(companyName) as CompanyResponse

    const newApprovals = company.company.approvals?.filter(app => app !== approval.id)

    const companyVariables = {
        name: companyName,
        input: {
            approvals: newApprovals
        }
    }
    await makeGraphQLRequest(updateCompanyMutation, companyVariables)

    // Delete approval
    await makeGraphQLRequest(deleteApprovalMutation, { id: approval.id })
}

export const removeCompanySharedCompany = async (approvedCompanyName: string, approverCompanyName: string, approval: Approval) => {
    client.setHeader("x-api-key", apiKey);

    // Remove company from company sharedCompanies
    const approvedCompany = await getCompany(approvedCompanyName) as CompanyResponse

    const newSharedCompanies = approvedCompany.company.sharedCompanies?.filter(company => company !== approverCompanyName) || []

    const ApprovedCompanyVariables = {
        name: approvedCompanyName,
        input: {
            sharedCompanies: newSharedCompanies,
        }
    }

    await makeGraphQLRequest(updateCompanyMutation, ApprovedCompanyVariables)

    // Remove approval from company
    const approverCompany = await getCompany(approverCompanyName) as CompanyResponse

    const newApprovals = approverCompany.company.approvals?.filter(app => app !== approval.id)

    const approverCompanyVariables = {
        name: approverCompanyName,
        input: {
            approvals: newApprovals
        }
    }
    await makeGraphQLRequest(updateCompanyMutation, approverCompanyVariables)

    // Delete approval
    await makeGraphQLRequest(deleteApprovalMutation, { id: approval.id })
}

export const createUser = async (name: string, email: string, image: string) => {
    client.setHeader("x-api-key", apiKey);

    const variables = {
        input: {
            name: name,
            email: email,
            image: image,
        }
    }
    const newUser = await makeGraphQLRequest(createUserMutation, variables) as CreateUserResponse

    // Create example mail
    const mailVariables = {
        input: {
            userEmail: email,
            message: "Welcome to the Truck Science demo!"
        }
    }
    const mail = await makeGraphQLRequest(createMailMutation, mailVariables) as CreateMailResponse
    const userVariables = {
        email: email,
        input: {
            mail: [mail.mailCreate.mail.id]
        }
    }
    await makeGraphQLRequest(updateUserMutation, userVariables)

    // Create 2 example products
    await createProduct({ Make: "Truck Science", Description: "Example product 2", Range: "ABC" },
        true,
        "{\"entities\":[{\"type\":\"LINE\",\"vertices\":[{\"x\":45,\"y\":45,\"z\":0},{\"x\":45,\"y\":-45,\"z\":0}],\"layer\":\"0\",\"handle\":0},{\"type\":\"LINE\",\"vertices\":[{\"x\":45,\"y\":-45,\"z\":0},{\"x\":0,\"y\":0,\"z\":0}],\"layer\":\"0\",\"handle\":1},{\"type\":\"LINE\",\"vertices\":[{\"x\":0,\"y\":0,\"z\":0},{\"x\":-45,\"y\":45,\"z\":0}],\"layer\":\"0\",\"handle\":2},{\"type\":\"LINE\",\"vertices\":[{\"x\":-45,\"y\":45,\"z\":0},{\"x\":45,\"y\":45,\"z\":0}],\"layer\":\"0\",\"handle\":3},{\"type\":\"LINE\",\"vertices\":[{\"x\":45,\"y\":45,\"z\":0},{\"x\":0,\"y\":0,\"z\":-78}],\"layer\":\"0\",\"handle\":4},{\"type\":\"LINE\",\"vertices\":[{\"x\":0,\"y\":0,\"z\":-78},{\"x\":0,\"y\":0,\"z\":0}],\"layer\":\"0\",\"handle\":5},{\"type\":\"LINE\",\"vertices\":[{\"x\":0,\"y\":0,\"z\":0},{\"x\":-45,\"y\":-45,\"z\":0}],\"layer\":\"0\",\"handle\":6},{\"type\":\"LINE\",\"vertices\":[{\"x\":-45,\"y\":-45,\"z\":0},{\"x\":45,\"y\":45,\"z\":0}],\"layer\":\"0\",\"handle\":7},{\"type\":\"LINE\",\"vertices\":[{\"x\":45,\"y\":-45,\"z\":0},{\"x\":-45,\"y\":-45,\"z\":0}],\"layer\":\"0\",\"handle\":8},{\"type\":\"LINE\",\"vertices\":[{\"x\":-45,\"y\":-45,\"z\":0},{\"x\":-45,\"y\":45,\"z\":0}],\"layer\":\"0\",\"handle\":9},{\"type\":\"LINE\",\"vertices\":[{\"x\":-45,\"y\":45,\"z\":0},{\"x\":0,\"y\":0,\"z\":-78}],\"layer\":\"0\",\"handle\":10},{\"type\":\"LINE\",\"vertices\":[{\"x\":0,\"y\":0,\"z\":-78},{\"x\":45,\"y\":-45,\"z\":0}],\"layer\":\"0\",\"handle\":11}]}",
        email,
        name
    ) as CreateProductResponse

    await createProduct({ Make: "Truck Science", Description: "Example product", Range: "DEF" },
        true,
        "{\"header\":{},\"tables\":{},\"blocks\":{},\"entities\":[{\"type\":\"LINE\",\"vertices\":[{\"x\":-0.5,\"y\":-0.5,\"z\":1},{\"x\":0.5,\"y\":-0.5,\"z\":1}],\"layer\":\"0\",\"handle\":0},{\"type\":\"LINE\",\"vertices\":[{\"x\":0.5,\"y\":-0.5,\"z\":1},{\"x\":0.5,\"y\":0.5,\"z\":1}],\"layer\":\"0\",\"handle\":1},{\"type\":\"LINE\",\"vertices\":[{\"x\":0.5,\"y\":0.5,\"z\":1},{\"x\":-0.5,\"y\":0.5,\"z\":1}],\"layer\":\"0\",\"handle\":2},{\"type\":\"LINE\",\"vertices\":[{\"x\":-0.5,\"y\":0.5,\"z\":1},{\"x\":-0.5,\"y\":-0.5,\"z\":1}],\"layer\":\"0\",\"handle\":3},{\"type\":\"LINE\",\"vertices\":[{\"x\":0.5,\"y\":-0.5,\"z\":0},{\"x\":-0.5,\"y\":-0.5,\"z\":0}],\"layer\":\"0\",\"handle\":4},{\"type\":\"LINE\",\"vertices\":[{\"x\":-0.5,\"y\":-0.5,\"z\":0},{\"x\":-0.5,\"y\":0.5,\"z\":0}],\"layer\":\"0\",\"handle\":5},{\"type\":\"LINE\",\"vertices\":[{\"x\":-0.5,\"y\":0.5,\"z\":0},{\"x\":0.5,\"y\":0.5,\"z\":0}],\"layer\":\"0\",\"handle\":6},{\"type\":\"LINE\",\"vertices\":[{\"x\":0.5,\"y\":0.5,\"z\":0},{\"x\":0.5,\"y\":-0.5,\"z\":0}],\"layer\":\"0\",\"handle\":7},{\"type\":\"LINE\",\"vertices\":[{\"x\":-0.5,\"y\":-0.5,\"z\":0},{\"x\":-0.5,\"y\":-0.5,\"z\":1}],\"layer\":\"0\",\"handle\":8},{\"type\":\"LINE\",\"vertices\":[{\"x\":-0.5,\"y\":-0.5,\"z\":1},{\"x\":-0.5,\"y\":0.5,\"z\":1}],\"layer\":\"0\",\"handle\":9},{\"type\":\"LINE\",\"vertices\":[{\"x\":-0.5,\"y\":0.5,\"z\":1},{\"x\":-0.5,\"y\":0.5,\"z\":0}],\"layer\":\"0\",\"handle\":10},{\"type\":\"LINE\",\"vertices\":[{\"x\":-0.5,\"y\":0.5,\"z\":0},{\"x\":-0.5,\"y\":-0.5,\"z\":0}],\"layer\":\"0\",\"handle\":11},{\"type\":\"LINE\",\"vertices\":[{\"x\":0.5,\"y\":-0.5,\"z\":1},{\"x\":0.5,\"y\":-0.5,\"z\":0}],\"layer\":\"0\",\"handle\":12},{\"type\":\"LINE\",\"vertices\":[{\"x\":0.5,\"y\":-0.5,\"z\":0},{\"x\":0.5,\"y\":0.5,\"z\":0}],\"layer\":\"0\",\"handle\":13},{\"type\":\"LINE\",\"vertices\":[{\"x\":0.5,\"y\":0.5,\"z\":0},{\"x\":0.5,\"y\":0.5,\"z\":1}],\"layer\":\"0\",\"handle\":14},{\"type\":\"LINE\",\"vertices\":[{\"x\":0.5,\"y\":0.5,\"z\":1},{\"x\":0.5,\"y\":-0.5,\"z\":1}],\"layer\":\"0\",\"handle\":15},{\"type\":\"LINE\",\"vertices\":[{\"x\":-0.5,\"y\":-0.5,\"z\":0},{\"x\":0.5,\"y\":-0.5,\"z\":0}],\"layer\":\"0\",\"handle\":16},{\"type\":\"LINE\",\"vertices\":[{\"x\":0.5,\"y\":-0.5,\"z\":0},{\"x\":0.5,\"y\":-0.5,\"z\":1}],\"layer\":\"0\",\"handle\":17},{\"type\":\"LINE\",\"vertices\":[{\"x\":0.5,\"y\":-0.5,\"z\":1},{\"x\":-0.5,\"y\":-0.5,\"z\":1}],\"layer\":\"0\",\"handle\":18},{\"type\":\"LINE\",\"vertices\":[{\"x\":-0.5,\"y\":-0.5,\"z\":1},{\"x\":-0.5,\"y\":-0.5,\"z\":0}],\"layer\":\"0\",\"handle\":19},{\"type\":\"LINE\",\"vertices\":[{\"x\":-0.5,\"y\":0.5,\"z\":1},{\"x\":0.5,\"y\":0.5,\"z\":1}],\"layer\":\"0\",\"handle\":20},{\"type\":\"LINE\",\"vertices\":[{\"x\":0.5,\"y\":0.5,\"z\":1},{\"x\":0.5,\"y\":0.5,\"z\":0}],\"layer\":\"0\",\"handle\":21},{\"type\":\"LINE\",\"vertices\":[{\"x\":0.5,\"y\":0.5,\"z\":0},{\"x\":-0.5,\"y\":0.5,\"z\":0}],\"layer\":\"0\",\"handle\":22},{\"type\":\"LINE\",\"vertices\":[{\"x\":-0.5,\"y\":0.5,\"z\":0},{\"x\":-0.5,\"y\":0.5,\"z\":1}],\"layer\":\"0\",\"handle\":23}]}",
        email,
        name
    ) as CreateProductResponse

    return
}

export const createCompany = async (data: any, email: string, logoUrl: string) => {
    client.setHeader("x-api-key", apiKey);

    const imageUrl = await uploadImage(logoUrl);

    const user = await getUser(email) as UserResponse

    var productIdList = []
    if (user.user.products && user.user.products.length > 0) {
        for (const productId of user.user.products) {
            const product = await getProduct(productId) as ProductResponse
            if (product.product) {
                if (!product.product.private) {
                    productIdList.push(productId)
                }
            }
        }
    }

    var variables;
    if (imageUrl.url) {
        variables = {
            input: {
                name: data?.Name,
                logo: imageUrl.url,
                admins: [email],
                members: [email],
                products: productIdList,
                inviteUrl: data?.InviteUrl,
                companyInviteUrl: data?.companyInviteUrl,
            }
        }
    } else {
        variables = {
            input: {
                name: data?.Name,
                admins: [email],
                members: [email],
                products: productIdList,
                inviteUrl: data?.InviteUrl,
                companyInviteUrl: data?.companyInviteUrl,
            }
        }
    }

    return await makeGraphQLRequest(createCompanyMutation, variables)
}

export const createProduct = async (form: ProductFormProps, isPrivate: boolean, dxf: string, userEmail: string, userName: string) => {
    client.setHeader("x-api-key", apiKey);

    const variables = {
        input: {
            make: form?.Make,
            range: form?.Range,
            description: form?.Description,
            private: isPrivate,
            dxf: dxf,
            createdByEmail: userEmail,
            createdByName: userName,
        }
    }

    const newProduct = await makeGraphQLRequest(createProductMutation, variables) as CreateProductResponse

    const productId = newProduct.productCreate.product.id

    const user = await getUser(userEmail) as UserResponse

    var newUserProducts
    if (user.user?.products !== null && user.user?.products !== undefined) {
        newUserProducts = [...user.user.products, productId]
    } else {
        newUserProducts = [productId]
    }

    var userVariables = {
        email: userEmail,
        input: {
            products: newUserProducts,
        }
    }

    const newUser = await makeGraphQLRequest(updateUserMutation, userVariables) as UpdateUserResponse

    if (!newProduct.productCreate.product.private && newUser.userUpdate.user.company) {

        const company = await getCompany(newUser.userUpdate.user?.company) as CompanyResponse

        var newCompanyProducts
        if (company.company.products !== null && company.company.products !== undefined) {
            newCompanyProducts = [...company.company.products, productId]
        } else {
            newCompanyProducts = [productId]
        }

        const companyVariables = {
            name: company.company.name,
            input: {
                products: newCompanyProducts
            }
        }

        return await makeGraphQLRequest(updateCompanyMutation, companyVariables)
    }
    return
}

export const deleteProduct = async (id: string, email: string) => {
    client.setHeader("x-api-key", apiKey);

    const userApprovals = await getUserApprovals(email) as Array<ApprovalResponse> | []

    if (userApprovals && userApprovals.length > 0) {
        const approvalsToUpdate = userApprovals.filter((approval) => approval.approval.product === id)

        if (approvalsToUpdate && approvalsToUpdate.length > 0) {
            for (const app of approvalsToUpdate) {
                const user = await getUser(email) as UserResponse

                if (app.approval.approvedUserEmail) {
                    const sharedUser = await getUser(app.approval.approvedUserEmail) as UserResponse

                    // Updated approved user sharedProducts and create mail to notify them
                    if (sharedUser.user.sharedProducts && sharedUser.user.sharedProducts.length > 0) {
                        const mailVariables = {
                            input: {
                                userEmail: sharedUser.user.email,
                                message: `${user.user.name} has deleted '${app.approval.productDescription}'. You will no longer have access to it.`
                            }
                        }
                        const mail = await makeGraphQLRequest(createMailMutation, mailVariables) as CreateMailResponse
                        var newMail
                        if (sharedUser.user.mail && sharedUser.user.mail.length > 0) {
                            newMail = [...sharedUser.user.mail, mail.mailCreate.mail.id]
                        } else {
                            newMail = [mail.mailCreate.mail.id]
                        }

                        const newSharedProducts = sharedUser.user.sharedProducts?.filter(productId => productId !== id)
                        const userVariables = {
                            email: app.approval.approvedUserEmail,
                            input: {
                                sharedProducts: newSharedProducts,
                                mail: newMail,
                            }
                        }
                        await makeGraphQLRequest(updateUserMutation, userVariables)
                    }
                } else if (app.approval.approvedCompany) {
                    const sharedCompany = await getCompany(app.approval.approvedCompany) as CompanyResponse

                    // Updated approved company sharedProducts
                    if (sharedCompany.company.sharedProducts && sharedCompany.company.sharedProducts.length > 0) {
                        const newSharedProducts = sharedCompany.company.sharedProducts?.filter(productId => productId !== id)
                        const companyVariables = {
                            name: sharedCompany.company.name,
                            input: {
                                sharedProducts: newSharedProducts
                            }
                        }
                        await makeGraphQLRequest(updateCompanyMutation, companyVariables)
                    }
                }

                // Delete approval from approverUser approvals
                if (user.user && user.user.approvals && user.user.approvals.length > 0) {
                    const newApprovals = user.user.approvals.filter(approvalId => approvalId !== app.approval.id)
                    const approverUserVariables = {
                        email: email,
                        input: {
                            approvals: newApprovals
                        }
                    }
                    await makeGraphQLRequest(updateUserMutation, approverUserVariables)
                }

                await makeGraphQLRequest(deleteApprovalMutation, { id: app.approval.id })
            }
        }
    }

    const user = await getUser(email) as UserResponse
    const UserProducts = user.user.products?.filter(productId => productId !== id);

    const userVariables = {
        email: email,
        input: {
            products: UserProducts
        }
    }

    await makeGraphQLRequest(updateUserMutation, userVariables)

    // Remove from company products
    if (user.user.company !== null && user.user.company !== undefined) {

        const company = await getCompany(user.user.company) as CompanyResponse

        if (company.company.products !== null && company.company.products !== undefined && company.company.products.includes(id)) {

            const newCompanyProducts = company.company.products.filter(productId => productId !== id)

            const companyVariables = {
                name: company.company.name,
                input: {
                    products: newCompanyProducts,
                }
            }

            await makeGraphQLRequest(updateCompanyMutation, companyVariables)
        }
    }

    // Remove all company approvals and associated shared products
    if (user.user.company) {
        const company = await getCompany(user.user.company) as CompanyResponse

        if (company.company.approvals && company.company.approvals.length > 0) {
            const companyApprovals = await getCompanyApprovals(company.company.approvals) as Approvals

            const filteredApprovals = companyApprovals.filter(app => app.approval.approvalType === "product")

            for (const approval of filteredApprovals) {
                if (approval.approval.approvalBetween === "company to user" && approval.approval.approvedUserEmail) {

                    const approvedUser = await getUser(approval.approval.approvedUserEmail) as UserResponse

                    const { sharedProducts } = approvedUser.user
                    const newSharedProducts = sharedProducts?.filter(prod => prod !== approval.approval.product) || []

                    const userVariables = {
                        email: approval.approval.approvedUserEmail,
                        input: {
                            sharedProducts: newSharedProducts
                        }
                    }
                    await makeGraphQLRequest(updateUserMutation, userVariables)

                } else if (approval.approval.approvalBetween === "company to company" && approval.approval.approvedCompany) {

                    const approvedCompany = await getCompany(approval.approval.approvedCompany) as CompanyResponse

                    const { sharedProducts } = approvedCompany.company
                    const newSharedProducts = sharedProducts?.filter(prod => prod !== approval.approval.product) || []

                    const approvedCompanyVariables = {
                        name: approval.approval.approvedCompany,
                        input: {
                            sharedProducts: newSharedProducts
                        }
                    }

                    await makeGraphQLRequest(updateCompanyMutation, approvedCompanyVariables)
                }
                // Delete approval from approver company approvals
                const approverCompany = await getCompany(user.user.company) as CompanyResponse

                const newApprovals = approverCompany.company.approvals?.filter(app => app !== approval.approval.id) || []

                const approverCompanyVariables = {
                    name: company.company.name,
                    input: {
                        approvals: newApprovals
                    }
                }
                await makeGraphQLRequest(updateCompanyMutation, approverCompanyVariables)
                await makeGraphQLRequest(deleteApprovalMutation, { id: approval.approval.id })
            }
        }
    }
    return await makeGraphQLRequest(deleteProductMutation, { id: id })
}

export const deleteCompanyProduct = async (productId: string, companyName: string) => {
    client.setHeader("x-api-key", apiKey);

    const company = await getCompany(companyName) as CompanyResponse

    const newProducts = company.company.products?.filter(prod => prod !== productId) || []

    const companyVariables = {
        name: companyName,
        input: {
            products: newProducts
        }
    }
    await makeGraphQLRequest(updateCompanyMutation, companyVariables)
}

export const revokeApproval = async (approvalId: string, userEmail: string) => {
    client.setHeader("x-api-key", apiKey);

    const approval = await getApproval(approvalId) as ApprovalResponse
    const revoker = await getUser(userEmail) as UserResponse

    // Remove product from company
    if (approval.approval.approvedCompany) {
        const company = await getCompany(approval.approval.approvedCompany) as CompanyResponse

        const { sharedProducts } = company.company
        const newSharedProducts = sharedProducts?.filter(prod => prod !== approval.approval.product) || []

        const companyVariables = {
            name: company.company.name,
            input: {
                sharedProducts: newSharedProducts
            }
        }
        await makeGraphQLRequest(updateCompanyMutation, companyVariables)
    }
    // Remove product from user
    else if (approval.approval.approvedUserEmail) {
        const user = await getUser(approval.approval.approvedUserEmail) as UserResponse

        const { sharedProducts } = user.user
        const newSharedProducts = sharedProducts?.filter(prod => prod !== approval.approval.product) || []

        // Create mail
        const mailVariables = {
            input: {
                userEmail: user.user.email,
                message: `${revoker.user.name} has revoked your access to '${approval.approval.productDescription}'.`
            }
        }
        const mail = await makeGraphQLRequest(createMailMutation, mailVariables) as CreateMailResponse

        const newMail = user.user.mail?.concat(mail.mailCreate.mail.id as string) || [mail.mailCreate.mail.id as string]

        const userVariables = {
            email: user.user.email,
            input: {
                sharedProducts: newSharedProducts,
                mail: newMail,
            }
        }
        await makeGraphQLRequest(updateUserMutation, userVariables)
    }
    // Update approval to say revoked
    const date = new Date();
    var dd = String(date.getDate()).padStart(2, '0')
    var mm = String(date.getMonth() + 1).padStart(2, '0')
    var yyyy = date.getFullYear()

    const today = mm + '/' + dd + '/' + yyyy as string

    const approvalVariables = {
        id: approvalId,
        input: {
            revoked: true,
            revokerName: revoker.user.name,
            revokerEmail: revoker.user.email,
            revokationDate: today,
        }
    }
    await makeGraphQLRequest(updateApprovalMutation, approvalVariables)
}

export const revokeCompanyApproval = async (approvalId: string, companyName: string, userEmail: string) => {

    const approval = await getApproval(approvalId) as ApprovalResponse
    const revoker = await getUser(userEmail) as UserResponse

    if (approval.approval.approvalType !== "product") {
        return
    }

    // Remove sharedProduct from user or company
    const { approvalBetween } = approval.approval

    if (approvalBetween === "company to user" && approval.approval.approvedUserEmail) {

        const approvedUser = await getUser(approval.approval.approvedUserEmail) as UserResponse
        const { sharedProducts } = approvedUser.user

        const newSharedProducts = sharedProducts?.filter(prod => prod !== approval.approval.product) || []

        // Create mail
        const mailVariables = {
            input: {
                userEmail: approvedUser.user.email,
                message: `${revoker.user.name} has revoked your access to '${approval.approval.productDescription}'.`
            }
        }
        const mail = await makeGraphQLRequest(createMailMutation, mailVariables) as CreateMailResponse

        const newMail = approvedUser.user.mail?.concat(mail.mailCreate.mail.id) || [mail.mailCreate.mail.id]

        const userVariables = {
            email: approvedUser.user.email,
            input: {
                sharedProducts: newSharedProducts,
                mail: newMail
            }
        }

        await makeGraphQLRequest(updateUserMutation, userVariables)

    } else if (approvalBetween === "company to company" && approval.approval.approvedCompany) {

        const approvedCompany = await getCompany(approval.approval.approvedCompany) as CompanyResponse
        const { sharedProducts } = approvedCompany.company

        const newSharedProducts = sharedProducts?.filter(prod => prod !== approval.approval.product) || []

        const companyVariables = {
            name: approvedCompany.company.name,
            input: {
                sharedProducts: newSharedProducts
            }
        }

        await makeGraphQLRequest(updateCompanyMutation, companyVariables)
    }

    // Update the approval to revoked
    const date = new Date();
    var dd = String(date.getDate()).padStart(2, '0')
    var mm = String(date.getMonth() + 1).padStart(2, '0')
    var yyyy = date.getFullYear()

    const today = mm + '/' + dd + '/' + yyyy as string

    const approvalVariables = {
        id: approvalId,
        input: {
            revoked: true,
            revokerName: revoker.user.name,
            revokerEmail: userEmail,
            revokationDate: today
        }
    }
    await makeGraphQLRequest(updateApprovalMutation, approvalVariables)

    return
}