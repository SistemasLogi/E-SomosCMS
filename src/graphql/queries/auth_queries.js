export const UserAuthQueries = {
  getTokenAuth: (user, password) => `
    {
        loginCollaborator(user: "${user}", password: "${password}") {
            status
            status_code
            status_message
            accessToken
            expiresIn
            measureTime
            accessType
            encryptedKey
            permissions
        }
    }`,

  getRefreshToken: (enciptedKey) => `
    {
        refreshTokenCollaborator(encryptedKey: "${enciptedKey}") {
            status
            status_code
            status_message
            accessToken
            expiresIn
            measureTime
            accessType
            encryptedKey
            permissions
        }
    }`,
};
