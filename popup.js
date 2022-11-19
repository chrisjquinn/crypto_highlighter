import {getActiveTab} from "./utils.js"

let color_theme;

const addNewAddress = (addressesElement, ticker, address) => {
	// console.log(`Address: ${address}`);

	let addressTextElement = document.createElement("p");
	let addressPictureElement = document.createElement("img");
	let addressCopyElement = document.createElement("input");

	addressTextElement.textContent = address;
	addressPictureElement.src = "assets/" + ticker + ".svg";
	addressPictureElement.title = ticker + ' logo';
	addressPictureElement.className = '.ticker-image';

	addressCopyElement.src = 'assets/copy-'+color_theme+'.png';
	addressCopyElement.title = 'Copy address to clipboard';
	addressCopyElement.type = 'image';
	addressCopyElement.setAttribute("address", address);
	addressCopyElement.addEventListener("click", copyAddressToClipboard);

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
	titleElement.append(copyAllElement);
};


const copyAllAddressesToClipboard = e => {
	// loop through the table and copy them, spaced by line breaks
	const table = document.getElementById("addresses");
	let allAddressesForClipboard = [];
	for (let i = 0, row; row = table.rows[i]; i++) {
		allAddressesForClipboard.push(row.getAttribute("address"));
	}
	navigator.clipboard.writeText(allAddressesForClipboard.join("\n"));
};


const copyAddressToClipboard = e => {
	const addressText = e.target.getAttribute('address');
	e.target.select();
	navigator.clipboard.writeText(addressText);
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

const setThemeMode = async () => {
	// retrieve current theme
	color_theme = await chrome.storage.sync.get(['theme']);
	color_theme = color_theme.theme;

	// change html root class
	const html_root = document.getElementsByTagName('html')[0];
	html_root.classList = color_theme + '-mode';

	// change the sun / moon image
	const toggle_image = document.getElementById('theme');
	toggle_image.addEventListener("click", toggleThemeMode);
	if (color_theme === "dark"){
		toggle_image.src = 'assets/moon.svg';
	} else {
		toggle_image.src = 'assets/sun.svg';
	}

	// loop through and replace all the copy elements
	let all_inputs = document.getElementsByTagName('input');
	for (let i = 0; i < all_inputs.length; i++) {
		let current = all_inputs[i];
		if (current.src.includes('copy')){
			current.src = 'assets/copy-'+color_theme+'.png';
		}
	}
};

const toggleThemeMode = async () => {
	// change then reload the theme
	color_theme = await chrome.storage.sync.get(['theme']);
	color_theme = color_theme.theme;
	if (color_theme === "dark") {
		await chrome.storage.sync.set({["theme"]: "light"});
	} else {
		await chrome.storage.sync.set({["theme"]: "dark"});
	}
	setThemeMode();
};

const openSettings = () => {
	chrome.tabs.create({url: chrome.runtime.getURL('settings.html')});
};

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', async () => {
	let settings = document.getElementById('Settings');
	settings.addEventListener('click', openSettings);
	//get the color theme the user has decided
	setThemeMode();
	// query for the active tab
	const tabs = await getActiveTab();
	// send a request for the addresses and use callback of viewAddresses on the response
	chrome.tabs.sendMessage(
		tabs[0].id,
		{type: 'Addresses', value: ''},
		viewAddresses);
});
