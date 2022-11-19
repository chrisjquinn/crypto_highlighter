export async function getActiveTab() {
	let queryOptions = {active: true, currentWindow: true};
	let tab = await chrome.tabs.query(queryOptions);
	return tab;
}


export async function getActiveTabURL(async) {
	let tab = await getActiveTab();
	return tab[0].url;
}