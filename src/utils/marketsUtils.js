export const addMarket = async (marketId, description, accountId ,categories, signedMessage) => {
	if (typeof marketId !== "number") throw new Error("Invalid marketId type");
	let markets = JSON.parse(localStorage.getItem('markets'));
	if (!Array.isArray(markets)) {
		markets = []; 
	}
	markets.unshift({
			 marketId,
			 description,
			 accountId,
			 categories,
			 publicKey: signedMessage.publicKey.toString() 
		});
	localStorage.setItem("markets", JSON.stringify(markets));
	window.location.reload();
	return { success: true };
}



export const getMarkets = async (categories) => {
	if (categories.length === undefined) throw new Error("categories need to be an array, pass an empty array if no category filters");
	let markets = JSON.parse(localStorage.getItem('markets'));
	if (!Array.isArray(markets)) markets = [];
	console.log(markets);
	return { markets }; 
}

export const removeMarket = async (marketId) => {
	console.log('deleting...');
	const markets = JSON.parse(localStorage.getItem('markets'));
	if (!Array.isArray(markets)) return;
	const indexToRemove = markets.findIndex(market => market.marketId == marketId);
	console.log(marketId);
	console.log('deleting...' + markets[indexToRemove]);
	markets.splice(indexToRemove, 1);
	console.log("Market removed!" + markets[indexToRemove]);
	localStorage.setItem('markets', JSON.stringify(markets));
	window.location.reload();
	return JSON.stringify({ success: true });
}
export const updateMarket = (market) => {
	const markets = JSON.parse(localStorage.getItem('markets'));
	if (!Array.isArray(markets)) return;
	const index = markets.findIndex(market => market.marketId == market.id);
	markets[index] = market;
}
