const API_ROOT: string = process.env.EXPO_PUBLIC_API_ROOT!

const updateProducer = async (token: string, values: string) => {

	try {
		
		const response = await fetch(`${API_ROOT}/producers/update`, {
      method: 'PUT',
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `Bearer ${token}`,
        mode: 'cors'
      },
      body: JSON.stringify(values)
    })

		const data = await response.json()

		return data

	} catch (error) {
		console.log(error)
	}
}

export default {
	updateProducer
}