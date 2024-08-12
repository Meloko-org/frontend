/**
 * Get the user's info to store
 * @param apiUrl the url of the backend
 * @param token  the clerk token needed to fetch
 * @returns {object} Get only email, firstname, lastname, avatar, favSearch and bookmarks
 */
const getUserInfos = async (token: string) => {
	try {
    const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!
    const response = await fetch(`${API_ROOT}/users/logged`, {
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

export default { 
  getUserInfos 
}