/**
 * Get the user's info to store
 * @param apiUrl the url of the backend
 * @param token  the clerk token needed to fetch
 * @returns {object} Get only email, firstname, lastname, avatar, favSearch and bookmarks
 */
const getUserInfos = async (apiUrl: string, token: string) => {
	try {
    const response = await fetch(`${apiUrl}/users/getuserinfos`, {
      method: 'GET',
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors'
      }
    })
    const data = await response.json()
    return (data) ? data : false

  } catch (error) {
    console.log(error)
  }
}

module.exports = { getUserInfos }