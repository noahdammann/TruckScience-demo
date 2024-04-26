export const getUserQuery = `
    query User($email: String!) {
        user(by: {email: $email}) {
            name
            email
            id
            image
            company
            products
            sharedProducts
            sharedUsers
            sharedCompanies
            approvals
            mail
        }
    }
`

export const getMailQuery = `
    query Mail($id: ID!) {
        mail(by: {id: $id}) {
            userEmail
            message
            id
            updatedAt
            createdAt
            read
        }
    }
`

export const getCompanyQuery = `
    query Company($name: String!) {
        company(by: {name: $name}) {
            name
            logo
            admins
            members
            sharedProducts
            sharedUsers
            sharedCompanies
            id
            inviteUrl
            companyInviteUrl
            products
            approvals
        }
    }
`

export const getProductQuery = `
    query Product($id: ID!) {
        product(by: {id: $id}) {
            make
            range
            description
            private
            dxf
            createdByEmail
            createdByName
            id
            updatedAt
        }
    }
`

export const getApprovalQuery = `
    query Approval($id: ID!) {
        approval(by: {id: $id}) {
            id
            revoked
            revokationDate
            revokerEmail
            revokerName
            accessUntil
            productMake
            productRange
            productDescription
            createdAt
            updatedAt
            approvedUserEmail
            approvedUserImage
            approvedCompany
            approvedCompanyLogo
            communicationMedium
            approvedUserName
            product
            approverEmail
            approverCompany
            approverCompanyLogo
            approverName
            approverImage
            approvalType
            approvalBetween
        }
    }
`

export const getAllUsersQuery = `
    query UserCollection {
        userCollection(first: 100) {
            edges {
                node {
                    name
                    email
                    id
                    products
                    sharedProducts
                    image
                    company
                    updatedAt
                    createdAt
                    sharedCompanies
                    sharedUsers
                    approvals
                    mail
                }
            }
        }
    }
`

export const getAllCompaniesQuery = `
    query CompanyCollection {
        companyCollection(first: 100) {
            edges {
                node {
                    name
                    logo
                    admins
                    members
                    sharedCompanies
                    sharedUsers
                    inviteUrl
                    products
                    sharedProducts
                    id
                    updatedAt
                    createdAt
                    companyInviteUrl
                    approvals
                }
            }
        }
    }
`

export const getCompanyByInviteUrlQuery = `
    query Company($inviteUrl: String!) {
        company(by: {inviteUrl: $inviteUrl}) {
            name
            logo
            admins
            members
            sharedCompanies
            sharedUsers
            id
            inviteUrl
            companyInviteUrl
            products
            sharedProducts
            approvals
        }
    }
`

export const getCompanyByCompanyInviteUrlQuery = `
    query Company($companyInviteUrl: String!) {
        company(by: {companyInviteUrl: $companyInviteUrl}) {
            name
            logo
            admins
            members
            sharedCompanies
            sharedUsers
            id
            inviteUrl
            companyInviteUrl
            products
            sharedProducts
            approvals
        }
    }
`