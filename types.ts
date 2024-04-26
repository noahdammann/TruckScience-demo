import { User as UserProfile, Session } from "next-auth";

export interface SessionInterface extends Session {
    user: User & {
        id: string;
        name: string;
        email: string;
        image: string;
        company?: string;
    };
}

export interface User extends UserProfile {
    id: string;
    name: string;
    email: string;
    image: string;
    company?: string;
    products?: Array<string>;
    sharedProducts?: Array<string>;
    sharedCompanies?: Array<string>;
    sharedUsers?: Array<string>;
    approvals?: Array<string>;
    mail: Array<string> | null;
}

export type Mail = {
    updatedAt: string;
    id: string;
    userEmail: string,
    message: string,
    read: boolean,
}

export type Company = {
    id: string,
    name: string,
    logo: string,
    admins: Array<string>,
    members: Array<string>,
    inviteUrl: string,
    companyInviteUrl: string,
    products?: Array<string>,
    sharedProducts?: Array<string>,
    sharedCompanies: Array<string> | null,
    sharedUsers: Array<string> | null,
    approvals?: Array<string>
}

export type Product = {
    make: string,
    range: string,
    description: string,
    private: boolean,
    dxf: string,
    createdByName: string,
    createdByEmail: string,
    id: string,
    updatedAt: string,
}

export type Approval = {
    id: string,
    createdAt: string,
    updatedAt: string,
    approvalType: string,
    approvalBetween: string,
    approverName: string,
    approverEmail: string,
    approverImage: string,
    approverCompany?: string,
    approverCompanyLogo?: string,
    product?: string,
    productMake?: string,
    productRange?: string,
    productDescription?: string,
    approvedUserName?: string,
    approvedUserEmail: string | null,
    approvedUserImage?: string,
    approvedCompany: string | null,
    approvedCompanyLogo?: string,
    communicationMedium: string,
    accessUntil?: string,
    revoked: boolean,
    revokerName?: string,
    revokerEmail?: string,
    revokationDate?: string,
}

export interface UserResponse {
    user: User,
}

export interface MailResponse {
    mail: Mail,
}

export interface CompanyResponse {
    company: Company
}


export interface ProductResponse {
    product: Product
}

export interface ApprovalResponse {
    approval: Approval
}

export type Users = Array<UserResponse>

export type AllMail = Array<MailResponse>

export type Companies = Array<CompanyResponse>

export type Products = Array<ProductResponse>

export type Approvals = Array<ApprovalResponse>

export type UpdateUserResponse = {
    userUpdate: {
        user: User
    }
}

export type UpdateMail = {
    mailUpdate: {
        mail: Mail
    }
}

export type UpdateCompanyResponse = {
    companyUpdate: {
        company: Company
    }
}

export type UpdateProductResponse = {
    productUpdate: {
        product: Product
    }
}

export type CreateUserResponse = {
    userCreate: {
        user: User
    }
}

export type CreateMailResponse = {
    mailCreate: {
        mail: Mail
    }
}

export type CreateProductResponse = {
    productCreate: {
        product: Product
    }
}

export type CreateApprovalResponse = {
    approvalCreate: {
        approval: Approval
    }
}

export type UserCollectionNode = {
    node: UserProfile,
}

export type CompanyCollectionNode = {
    node: Company,
}

export type UserCollection = {
    userCollection: {
        edges: Array<UserCollectionNode>
    }
}

export type CompanyCollection = {
    companyCollection: {
        edges: Array<CompanyCollectionNode>
    }
}

export type ProductFormProps = {
    Make: string,
    Range: string,
    Description: string
}