export async function getActiveTab() {
	let queryOptions = {active: true, currentWindow: true};
	let tab = await chrome.tabs.query(queryOptions);
	return tab;
}


export async function getActiveTabURL(async) {
	let tab = await getActiveTab();
	return tab[0].url;
}


export async function getAddressInfoFromCryptoscamdb(address) {
	const url = 'https://api.cryptoscamdb.org/v1/check/'

	const requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};

	const response = await fetch(url+address, requestOptions)
	// if we have a reponse with a HTTP code
	console.log(`${response.status}`);
	if (response.ok){
		let response_json = await response.json();
		if ((response_json.result) && (response_json.result.entries.length > 0)) {
			console.log(response_json.result.entries[0].type + ', ' + response_json.result.entries[0].url);
			return response_json.result.entries[0].type + ', ' + response_json.result.entries[0].url
		} else {
			return null;
		}
	} else {
		return null;
	}
}