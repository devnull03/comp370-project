export const process_image = async (image) => {

	const response = await fetch(`${import.meta.env.VITE_SERVER_ADDR}/api/process_image`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ image }),
	});

	const data = await response.json();

	return data;
}
