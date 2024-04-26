export const updateUserMutation = `
    mutation UserUpdate($email: String!, $input: UserUpdateInput!) {
        userUpdate(by: {email: $email}, input: $input) {
            user {
                name
                mail
                id
                image
                company
                products
                sharedProducts
            }
        }
    }
`

export const updateMailMutation = `
    mutation MailUpdate($id: ID!, $input: MailUpdateInput!) {
        mailUpdate(by: {id: $id}, input: $input) {
            mail {
                userEmail
                read
                id
                updatedAt
                message
            }
        }
    }
`

export const updateCompanyMutation = `
    mutation CompanyUpdate($name:String!, $input: CompanyUpdateInput!) {
        companyUpdate(by: {name: $name}, input: $input) {
            company {
                name
                logo
                admins
                members
                sharedCompanies
                sharedUsers
                id
                inviteUrl
                products
                sharedProducts
            }
        }
    }
`

export const updateProductMutation = `
    mutation ProductUpdate($id:ID!, $input: ProductUpdateInput!) {
        productUpdate(by: {id: $id}, input: $input) {
            product {
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
    }
`

export const updateApprovalMutation = `
    mutation ApprovalUpdate($id:ID!, $input: ApprovalUpdateInput!) {
        approvalUpdate(by: {id: $id}, input: $input) {
            approval {
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
    }
`