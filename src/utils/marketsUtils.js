import { API_URL } from "../constants";

export const addMarket = async (marketId, description, accountId ,categories, signedMessage) => {
	if (typeof marketId !== "number") throw new Error("Invalid marketId type");
	let markets = JSON.parse(localStorage.getItem('markets'));
	if (!Array.isArray(markets)) {
		markets = []; 
	}
	markets.push({
			 marketId,
			 description,
			 accountId,
			 categories,
			 publicKey: signedMessage.publicKey.toString() 
		});
	localStorage.setItem("markets", JSON.stringify(markets));
	return { success: true };
}



export const getMarkets = async (categories) => {
	if (categories.length === undefined) throw new Error("categories need to be an array, pass an empty array if no category filters");
	console.log(localStorage.getItem('markets'));
	let markets = JSON.parse(localStorage.getItem('markets'));
	if (!Array.isArray(markets)) markets = [];
	return { markets }; 
}

export const removeMarket = async (marketId) => {
	const markets = JSON.parse(localStorage.getItem('markets'));
	if (!Array.isArray(markets)) return;
	const indexToRemove = markets.findIndex(market => market.marketId == marketId);
	markets.splice(indexToRemove, 1);
	localStorage.setItem('markets', JSON.stringify(markets));
	return JSON.stringify({ success: true });
}
