chrome.tabs.onUpdated.addListener(function(id, info, tab){
    if (tab.url.toLowerCase().indexOf("facebook.com") > -1){
        chrome.pageAction.show(tab.id);
    }
});

chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.pageAction.show(tab.id);
});

chrome.tabs.onUpdated.addListener(function(id, info, tab){
    chrome.pageAction.show(tab.id);
    chrome.tabs.executeScript(null, {"file": "block.js"});
});
