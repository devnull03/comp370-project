export const post_entry = async (entry_data) => {

	const response = await fetch(`${import.meta.env.VITE_SERVER_ADDR}/create_entry`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
        credentials: "include",
		body: JSON.stringify(entry_data),
	});

	const data = await response.json();

	return data;
}
