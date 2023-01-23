require('dotenv').config();
require('@shopify/shopify-api/adapters/node');
const { shopifyApi, ApiVersion, Session } = require('@shopify/shopify-api');

const shopify = shopifyApi({
	apiKey: process.env.API_KEY,
	apiSecretKey: process.env.API_SECRET,
	apiVersion: ApiVersion.January23,
	scopes: ['write_inventory', 'read_inventory', 'write_locations', 'read_locations', 'write_products', 'read_products'],
	hostName: process.env.SHOP,
});
const session = new Session({ accessToken: process.env.ADMIN_API_KEY, shop: process.env.SHOP });
const client = new shopify.clients.Rest({ session: session, apiVersion: ApiVersion.January23 });

module.exports = client;
