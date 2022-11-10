import {getActiveTabURL} from "./utils.js"

const addNewAddress = (addressesElement, ticker, address) => {
	// console.log(`Address: ${address}`);

	let addressTextElement = document.createElement("p");
	let addressPictureElement = document.createElement("img");
	let addressCopyElement = document.createElement("input");

	addressTextElement.textContent = address;
	addressPictureElement.src = "assets/" + ticker + ".svg";
	addressPictureElement.title = ticker + ' logo';
	addressPictureElement.className = '.ticker-image';

	addressCopyElement.src = 'assets/copy.svg';
	addressCopyElement.title = 'Copy address to clipboard';
	addressCopyElement.type = 'image';
	addressCopyElement.setAttribute("address", address);
	addressCopyElement.addEventListener("click", copyAddressToClipboard);


	// could do with an improvement
	let addressRowElement = addressesElement.insertRow();
	addressRowElement.setAttribute("address", address);
	let td = addressRowElement.insertCell();
	td.appendChild(addressPictureElement);
	td = addressRowElement.insertCell();
	td.appendChild(addressTextElement);
	td = addressRowElement.insertCell();
	td.appendChild(addressCopyElement);

};

const addCopyAllElement = () => {
	const titleElement = document.getElementById("header");
	let copyAllElement = document.createElement("button");
	copyAllElement.textContent = "Copy All";
	copyAllElement.addEventListener("click", copyAllAddressesToClipboard);
	titleElement.appendChild(copyAllElement);
};


const copyAllAddressesToClipboard = e => {
	// loop through the table and copy them, spaced by line breaks
	const table = document.getElementById("addresses");
	let allAddressesForClipboard = [];
	for (let i = 0, row; row = table.rows[i]; i++) {
		allAddressesForClipboard.push(row.getAttribute("address"));
	}
	// console.log(`All addresses for clipboard: ${allAddressesForClipboard}`);
	navigator.clipboard.writeText(allAddressesForClipboard.join("\n"));
};


const copyAddressToClipboard = e => {
	const addressText = e.target.getAttribute('address');
	e.target.select();
	navigator.clipboard.writeText(addressText);
	// console.log(`Copied the text: ${addressText}`);
};


const viewAddresses = (addresses) => {
	const addressesElement = document.getElementById("addresses");
	addressesElement.innerHTML = "";

	if (Object.values(addresses).length > 0){
		addCopyAllElement();
		for (let i = 0; i < Object.keys(addresses).length; i++){
			let ticker = Object.keys(addresses)[i];
			for (let j = 0; j < addresses[ticker].length; j ++) {
				const address = addresses[ticker][j];
				addNewAddress(addressesElement, ticker, address);
			}
		}
	} else {
		addressesElement.innerHTML = "None Found";
	}
};


// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', async () => {
  // ...query for the active tab...
  const tabs = await getActiveTabURL();
  // ...and send a request for the DOM info...
  chrome.tabs.sendMessage(
  	tabs[0].id,
  	{type: 'Addresses', value: ''},
  	// ...also specifying a callback to be called 
  	//    from the receiving end (content script).
  	viewAddresses);
});
