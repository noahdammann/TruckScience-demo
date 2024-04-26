import { config, auth, g } from "@grafbase/sdk"

// @ts-ignore
const User = g.model("User", {
    name: g.string(),
    email: g.string().unique(),
    image: g.string(),
    company: g.string().optional(),
    products: g.string().list().optional(),
    sharedProducts: g.string().list().optional(),
    sharedCompanies: g.string().list().optional(),
    sharedUsers: g.string().list().optional(),
    approvals: g.string().list().optional(),
    mail: g.string().list().optional(),
}).auth((rules) => {
    rules.public().read()
})

// @ts-ignore
const Mail = g.model("Mail", {
    userEmail: g.string(),
    message: g.string(),
    read: g.boolean().default(false),
})

// @ts-ignore
const Company = g.model("Company", {
    name: g.string().unique(),
    logo: g.string().optional(),
    admins: g.string().list(),
    members: g.string().list(),
    sharedCompanies: g.string().list().optional(),
    sharedUsers: g.string().list().optional(),
    inviteUrl: g.string().unique(),
    companyInviteUrl: g.string().unique(),
    products: g.string().list().optional(),
    sharedProducts: g.string().list().optional(),
    approvals: g.string().list().optional(),
}).auth((rules) => {
    rules.public().read()
    rules.private().create().delete().update()
})

// @ts-ignore
const Product = g.model("Product", {
    make: g.string(),
    range: g.string(),
    description: g.string(),
    private: g.boolean(),
    dxf: g.string(),
    createdByEmail: g.string(),
    createdByName: g.string(),
}).auth((rules) => {
    rules.public().read()
    rules.private().create().delete().update()
})

//@ts-ignore
const Approval = g.model("Approval", {
    approvalType: g.string(), // Either product, company, user
    approvalBetween: g.string().optional(), // Either user to user, user to company, company to user, company to company
    approverName: g.string(),
    approverEmail: g.string(),
    approverImage: g.string(),
    approverCompany: g.string().optional(),
    approverCompanyLogo: g.string().optional(),
    product: g.string().optional(),
    productMake: g.string().optional(),
    productRange: g.string().optional(),
    productDescription: g.string().optional(),
    approvedUserName: g.string().optional(),
    approvedUserEmail: g.string().optional(),
    approvedUserImage: g.string().optional(),
    approvedCompany: g.string().optional(),
    approvedCompanyLogo: g.string().optional(),
    communicationMedium: g.string(), // Through website
    accessUntil: g.string().optional(),
    revoked: g.boolean().default(false),
    revokerName: g.string().optional(),
    revokerEmail: g.string().optional(),
    revokationDate: g.string().optional(),
}).auth((rules) => {
    rules.public().read()
    rules.private().create().delete().update()
})

const jwt = auth.JWT({
    issuer: 'grafbase',
    secret: g.env('NEXTAUTH_SECRET'),
});

export default config({
    schema: g,
    auth: {
        providers: [jwt],
        rules: (rules) => rules.private(),
    },
});
