export const deleteProductMutation = `
    mutation ProductDelete($id: ID!) {
        productDelete(by: {id: $id}) {
            deletedId
        }
    }
`

export const deleteApprovalMutation = `
    mutation ApprovalDelete($id: ID!) {
        approvalDelete(by: {id: $id}) {
            deletedId
        }
    }
`