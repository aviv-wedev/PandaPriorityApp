const { DataType } = require('@shopify/shopify-api');

async function shopifyFetch(client, path, queryList = []) {
	let allObjects = [];
	let newObject;
	let nextPageQuery = {
		limit: 250,
	};

	for (const query of queryList) {
		nextPageQuery[query.split('=')[0]] = query.split('=')[1];
	}

	let bodyPath = path;
	if (path.includes('/')) {
		bodyPath = path.split('/')[0];
	}

	while (nextPageQuery) {
		const response = await client.get({
			path: path,
			query: nextPageQuery,
		});
		newObject = response.body[bodyPath];
		allObjects.push(...newObject);
		nextPageQuery = response?.pageInfo?.nextPage?.query;
	}

	return allObjects;
}

async function operateQuantitySync(client, location, variant, available) {
	const body = {
		available: available,
		inventory_item_id: variant.inventory_item_id,
		location_id: location.id,
	};

	const response = await client
		.post({
			path: `inventory_levels/set`,
			data: body,
			type: DataType.JSON,
		})
		.catch((err) => console.log(err));

	const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));
	await sleep(1000);
}

function getActiveLocation(locations) {
	return locations.find((location) => location.active && !location.legacy);
}

module.exports = {
	shopifyFetch,
	operateQuantitySync,
	getActiveLocation,
};
