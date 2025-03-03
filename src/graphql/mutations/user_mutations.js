export const UserMutations = {
  createCollaboratorUser: ({
    roles_id,
    document_number,
    collaborator_name,
    collaborator_email,
    collaborator_status,
    user,
    password,
  }) => `
        mutation {
          createCollaboratorUser(input: {
            roles_id: ${roles_id}
            document_number: "${document_number}"
            collaborator_name: "${collaborator_name}"
            collaborator_email: "${collaborator_email}"
            collaborator_status: ${collaborator_status}
            user: "${user}"
            password: "${password}"
          }) {
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
                permission_id
              }
            }
          }
        }
      `,

  updateCollaboratorUser: ({
    id,
    roles_id = null,
    document_number = null,
    collaborator_name = null,
    collaborator_email = null,
    collaborator_status = null,
    user = null,
    password = null,
  }) => {
    if (!id) {
      throw new Error("El campo 'id' es requerido para actualizar un usuario.");
    }

    // Construcción dinámica del input
    let input = `id: ${id}`;

    if (roles_id !== null) input += `\n      roles_id: ${roles_id}`;
    if (document_number !== null)
      input += `\n      document_number: "${document_number}"`;
    if (collaborator_name !== null)
      input += `\n      collaborator_name: "${collaborator_name}"`;
    if (collaborator_email !== null)
      input += `\n      collaborator_email: "${collaborator_email}"`;
    // Incluir el status solo si es 1 o 0
    if (collaborator_status === 0 || collaborator_status === 1) {
      input += `\n      collaborator_status: ${collaborator_status}`;
    }
    if (user !== null) input += `\n      user: "${user}"`;
    if (password !== null) input += `\n      password: "${password}"`;

    return `
          mutation {
            updateCollaboratorUser(input: { ${input} }) {
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
                  permission_id
                }
              }
            }
          }
        `;
  },

  updatePermissionsCollaboratorUser: ({ user_id, permissions }) => {
    

    return `
      mutation {
        updatePermissionsCollaboratorUser(user_id: ${user_id}, permissions: [${permissions.join(
      ", "
    )}]) {
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
            permissionCollaborator {
              permission_id
            }
          }
        }
      }
    `;
  },
};
