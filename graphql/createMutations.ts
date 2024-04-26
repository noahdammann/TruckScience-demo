export const createUserMutation = `
    mutation CreateUser($input: UserCreateInput!) {
        userCreate(input: $input) {
            user {
                name
                email
                image
            }
        }
    }
`

export const createMailMutation = `
    mutation MailCreate($input: MailCreateInput!) {
        mailCreate(input: $input) {
            mail {
                userEmail
                message
                read
                id
            }
        }
    }
`

export const createCompanyMutation = `
mutation CompanyCreate($input: CompanyCreateInput!) {
        companyCreate(input: $input)  {
            company {
                name
                logo
                admins
                members
                sharedCompanies
                sharedUsers
                inviteUrl
                companyInviteUrl
                id
            }
        }
    }
`

export const createProductMutation = `
    mutation ProductCreate($input:ProductCreateInput!) {
        productCreate(input: $input) {
            product {
                make
                range
                description
                private
                dxf
                createdByEmail
                createdByName
                id
            }
        }
    }
`

export const createApprovalMutation = `
    mutation ApprovalCreate($input:ApprovalCreateInput!) {
        approvalCreate(input: $input) {
            approval {
                id
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
                approverName
                approvalType
                approvalBetween
            }
        }
    }
`