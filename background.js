import {getActiveTabURL} from "./utils.js"

const setBadgeIcon = items =>  {
  // items will be an object of {TICKER: [Addresses]}
  // console.log(`Object.keys(items): ${Object.keys(items)}`);
  // console.log(`Object.keys(items).length: ${Object.keys(items).length}`);

  if (items){
    let total_length = 0;
    for (let i = 0; i < Object.keys(items).length; i++) {
      let ticker = Object.keys(items)[i];
      total_length = total_length + items[ticker].length;
    }
    if (total_length > 0 && total_length < 100) {
      chrome.action.setBadgeText({"text": `${total_length}`});
    } else if (total_length > 0 && total_length >= 100) {
      chrome.action.setBadgeText({"text": `99+`});
    } else { // < 0 or some other type?
      chrome.action.setBadgeText({"text": ""});
    }
  } else { // is null
    chrome.action.setBadgeText({"text": ""});
  }

  // do some more stress testing before deleting below

  // Loop through the tickers to find total number of addrs found
  // if (Object.keys(items) && items) {
  //   for (let i = 0; i < Object.keys(items).length; i++) {
  //     let ticker = Object.keys(items)[i];
  //     total_length = total_length + items[ticker].length;
  //   }
  // }

  // if (total_length > 0 && total_length < 100) {
  //   chrome.action.setBadgeText({"text": `${total_length}`});
  // } else if (total_length > 0 && total_length >= 100) {
  //   chrome.action.setBadgeText({"text": `99+`});
  // } else {
  //   chrome.action.setBadgeText({"text": ""});
  // }
  
};

//determine if we should send a message to perform address checking
const runOnSite = async () => {
  let current_url = await getActiveTabURL();
  console.log(`current_url: ${current_url}`);
  let dnr_sites = await chrome.storage.sync.get(['doNotRun']);
  dnr_sites = dnr_sites.doNotRun;
  console.log(`dnr_sites: ${dnr_sites}`);
  for (let i = 0; i < dnr_sites.length; i++){
    if (current_url.includes(dnr_sites[i])){
      console.log(`${current_url} includes ${dnr_sites[i]}`);
      return false;
    }
  }
  return true;
};


// Below are the listeners for when the tab is updated or activated
chrome.tabs.onUpdated.addListener(async (tabId, tab) => {
  if (await runOnSite()) {
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
    }, setBadgeIcon);
  } else {
    setBadgeIcon();
  }
});


chrome.tabs.onActivated.addListener(async activeInfo => {
  if (await runOnSite()) {
    chrome.tabs.sendMessage(activeInfo.tabId, {
      type: "SWITCHED",
    }, setBadgeIcon);
  } else {
    setBadgeIcon();
  }
});


// When we are installed, set the theme to light until clicked
chrome.runtime.onInstalled.addListener(details => {
  chrome.storage.sync.set({["theme"]: "light"});
  chrome.storage.sync.set({["doNotRun"]: ['etherscan.io']});
});

