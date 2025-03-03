export const UserCollaboratorQueries = {
  getCollaboratorUserData: (collaborator_user_id) => `
    {
        collaboratorUserData${
          collaborator_user_id
            ? `(collaborator_user_id: ${collaborator_user_id})`
            : ""
        } {
            status
            status_code
            status_message
            collaborator_user {
                id
                roles_id
                document_number
                collaborator_name
                collaborator_email
                collaborator_status
                roles {
                    id
                    rol_name
                }
                permissionCollaborator {
                    collaborator_user_id
                    permission_id
                }
            }
        }
    }`,

  getCollaboratorUserByToken: `
    {
        collaboratorUserByToken {
            status
            status_code
            status_message
            collaborator_user {
                id
                roles_id
                document_number
                collaborator_name
                collaborator_email
                collaborator_status
                roles {
                    id
                    rol_name
                }                
            }
        }
    }`,

  getRolesList: `
    {
        getRoles{
            id
            rol_name
        }
    }`,

  getPermissionList: `
    {
        permissionList{
            status
            status_code
            status_message
            permissions{
                id
                permission_name
                access_level
            }
        }
    }`,
};
