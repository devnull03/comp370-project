

const find_places = async (bin, label, { latitude, longitude }) => {
	const response = await fetch(`https://places.googleapis.com/v1/places:searchText`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Goog-Api-Key': process.env.GOOGLE_API_KEY,
			'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.googleMapsUri,places.rating',
		},
		body: JSON.stringify({
			"textQuery": `${bin} places to dispose ${label}`,
			"locationBias": {
				"circle": {
					"center": {
						latitude,
						longitude
					},
					"radius": 3000
				}
			},
			"languageCode": "en",
		}),
	});

	const data = await response.json();

	return data;
}

module.exports = { find_places };
