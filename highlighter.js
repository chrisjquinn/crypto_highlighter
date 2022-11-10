const regexs = {
	BTC: /\bbc1[02-9ac-hj-np-z]{11,71}\b|\b[13][a-zA-HJ-NP-Z0-9]{23,39}\b/,
	ETH: /\b0x[a-fA-F0-9]{40}\b/
};

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
};

const performRegex = (highlight) => {
	  // param highlight will wrap the match in a span if wanted
	  // Construct global and multiline
	  // const btc_re = new RegExp(regexs.BTC, 'gm');
	  // const eth_re = new RegExp(regexs.ETH, 'gm');

	  let matches = {
	  	BTC: [],
	  	ETH: [],
	  	DOGE: [] // left for testing 
	  };

	  let texts = getTextNodes(document.documentElement);
	  // texts = [].concat.apply([],texts);
	  for (let i = 0; i < texts.length; i++){
	  	for (let j = 0; j < Object.keys(regexs).length; j++) {
	  		ticker = Object.keys(regexs)[j];
	  		re = new RegExp(regexs[ticker], 'gm');
	  		match = texts[i].nodeValue.match(re);
		  	if ((match) && (match.indexOf(",") == -1)) {
		  		matches[ticker].push(... match);
		  		// make mark on texts[i]
		  		if (highlight) {wrapTextNode(texts[i], ticker);}
		  	} else if ((match) && (match.indexOf(",") > -1)) {
		  		matches[ticker].push(... match.split(","));
		  		// make mark on texts[i]
		  		if (highlight) {wrapTextNode(texts[i], ticker);}
		  	} else {}

	  	}

	  }

	  // Below is a to:do, figure out how to represent addresses found in commented HTML

	  // let comments = getAllComments(document.documentElement);
	  // for (let i = 0; i < comments.length; i++) {
	  // 	match = comments[i].nodeValue.match(re);
	  // 	if ((match) && (match.indexOf(",") == -1)) {
	  // 		matches.push(...match.map(x => "<!-- " +x)); 
	  // 	} else if ((match) && (match.indexOf(",") > -1)) {
	  // 		matches.push(... match.map(x => "<!-- " +x).split(","));
	  // 	}
	  // }


	  // const whole_html_string_1 = document.documentElement.innerHTML;
	  // const matching_btc_1 = whole_html_string_1.match(re);
	  // if (matching_btc_1) {
	  // 	const uniques_2 = matching_btc_1.filter(onlyUnique);
	  // 	console.log(`${uniques_2.length}  uniques from innerHTML: ${uniques_2}`);
	  // }


	  if (matches) {
	  	let tickers_to_delete = [];
	  	for (let i = 0; i < Object.keys(matches).length; i++){
	  		ticker = Object.keys(matches)[i];
	  		if (matches[ticker].length == 0){
	  			tickers_to_delete.push(ticker);
	  		} else {
		  		let uniques = matches[ticker].filter(onlyUnique);
		  		matches[ticker] = uniques;
	  		}
	  	}
	  	for (let i = 0; i < tickers_to_delete.length; i ++){
	  		delete matches[tickers_to_delete[i]];
	  	}
	  	// console.log(`${Object.values(matches)} matches: ${JSON.stringify(matches)}`);
	  	return matches;
	  }
};

function getAllComments(rootElem) {
    var comments = [];
    var iterator = document.createNodeIterator(rootElem, NodeFilter.SHOW_COMMENT);
    var curNode;
    while (curNode = iterator.nextNode()) {
        comments.push(curNode);
    }
    return comments;
};

function getTextNodes(rootElem){
    var texts = [];
    var iterator = document.createNodeIterator(rootElem, NodeFilter.SHOW_TEXT);
    var curNode;
    while (curNode = iterator.nextNode()) {
        texts.push(curNode);
    }
    return texts;
};

function wrapTextNode(textNode, ticker) {
    var spanNode = document.createElement('span');
    spanNode.setAttribute('class', 'crypto-highlighter-mark-'+ticker.toLowerCase());
    var newTextNode = document.createTextNode(textNode.textContent);
    spanNode.appendChild(newTextNode);
    spanNode.addEventListener("click", copyAddressToClipboard);
    textNode.parentNode.replaceChild(spanNode, textNode);
};

const copyAddressToClipboard = e => {
	// works for span, needs some sort of visual confirmation
	const addressText = e.target.innerText;
	navigator.clipboard.writeText(addressText);
	// console.log(`Copied the text: ${addressText}`);
};


// below are the chrome listeners for messages from background.js
// Think these can be collapsed into one

chrome.runtime.onMessage.addListener((obj, sender, response) => {
	const {type, value} = obj;
	if (type === 'NEW'){
		matches = performRegex(true);
		response(matches);
	}
});


chrome.runtime.onMessage.addListener((obj, sender, response) => {
	const {type, value} = obj;
	if (type === 'SWITCHED'){
		matches = performRegex(false);
		response(matches);
	}
});


chrome.runtime.onMessage.addListener((obj, sender, response) => {
	const {type, value} = obj;
	if (type === 'Addresses'){
		matches = performRegex(false);
		response(matches);
	}
});