require('dotenv').config();
const express = require('express');
const router = express.Router();
const client = require('../assets/client');
const { shopifyFetch, getActiveLocation, operateQuantitySync } = require('../assets/globalFunctions');

router.post('/updateSkuQuantity', async (req, res) => {
	if (!req.body.sku || !req.body.quantity) return res.status(400).send('Invalid request form. make sure you send sku and quantity');
	try {
		const sku = req.body.sku,
			quantity = req.body.quantity,
			matchingVariants = [];

		//get all products and filter by sku
		const allProducts = await shopifyFetch(client, 'products');

		for (const product of allProducts) {
			for (const variant of product.variants) {
				if (variant.sku == sku) {
					matchingVariants.push(variant);
				}
			}
		}

		//get quantity location
		const locations = await shopifyFetch(client, 'locations');
		const storeLocation = getActiveLocation(locations);

		//calculate and update stock
		for (const variant of matchingVariants) {
			let qty = parseInt(quantity / matchingVariants.length);
			if (matchingVariants.indexOf(variant) < quantity % matchingVariants.length) {
				qty += 1;
			}
			await operateQuantitySync(client, storeLocation, variant, qty);
		}

		res.send('OK');
	} catch (err) {
		console.log(err);
		res.status('500').send('Something went wrong');
	}
});

module.exports = router;
