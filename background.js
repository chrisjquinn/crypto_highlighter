const setBadgeIcon = items =>  {
  // items will be an object of {TICKER: [Addresses]}
  // console.log(`Object.keys(items): ${Object.keys(items)}`);
  // console.log(`Object.keys(items).length: ${Object.keys(items).length}`);

  let total_length = 0;

  // Loop through the tickers to find total number of addrs found
  if (Object.keys(items)) {
    for (i = 0; i < Object.keys(items).length; i++) {
      ticker = Object.keys(items)[i];
      total_length = total_length + items[ticker].length;

    }
  }

  if (total_length > 0 && total_length < 100) {
    chrome.action.setBadgeText({"text": `${total_length}`});
  } else if (total_length > 0 && total_length >= 100) {
    chrome.action.setBadgeText({"text": `99+`});
  } else {
    chrome.action.setBadgeText({"text": ""});
  }
  
};


// Below are the listeners for when the tab is updated or activated
chrome.tabs.onUpdated.addListener((tabId, tab) => {
  chrome.tabs.sendMessage(tabId, {
      type: "NEW",
    }, setBadgeIcon);
});


chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.sendMessage(activeInfo.tabId, {
    type: "SWITCHED",
  }, setBadgeIcon);
});

