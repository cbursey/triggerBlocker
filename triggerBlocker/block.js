var inspectedPosts = [];
//var storyContainerClasses = ["_5jmm", "_5pcr"];
var storyContainerClasses = ["_5pcr"];
var warningMarkers = ["tw:", "cw:", "tw-", "cw-", "tw ", "cw ", "tw/", "cw/"];

function combFeed(){
    chrome.storage.sync.get(null, function(data){
    	var list = data["added_terms"];
    	var terms = (list.length > 0);
    	var warnings = data["block_warnings"];
    	var remove = data["view_type"] === "Remove" ? true : false;
        if (terms || warnings){
            _.each(storyContainerClasses, function(storyContainerClass){
                posts = document.getElementsByClassName(storyContainerClass);
                _.each(posts, function(post){
                    if (inspectedPosts.indexOf(post) === -1){
                    	inspectedPosts.push(post);
        				inspectPost(post, terms, warnings, list, remove);
    				}
                });
            });
        }
    });
}

function inspectPost(post, terms, warnings, list, remove){
	var paragraphs = post.getElementsByTagName("p");
	var foundWarnings = [];
	var foundTerms = [];
	_.each(paragraphs, function(paragraph){
		var content = paragraph.textContent.toLowerCase();
		if (terms){
			_.each(list, function(term){
	            if (content.indexOf(term) !== -1){
	            	if (!foundTerms.includes(term)){
	            		foundTerms.push(term);
	            	}
	            }
	        });

	    }
	    if (warnings){
	    	_.each(warningMarkers, function(warning){
	            if (content.indexOf(warning) !== -1){
	                hidePost(post, content, "warning", remove);
	            }
	        });
	    }
    });
    if (terms && foundTerms.length > 0){
	    hidePost(post, foundTerms, "terms", remove);
	}
}

function parseWarnings(content, type){
	if (type === "warning"){
		return content.split('\n')[0];
	} else {
		var result = "";
			result = "contains: ";
		var i = 0;
		for (i = 0; i < content.length - 1; i++){
			result = result + content[i] + ", ";
		}
		result += content[i];
		return result;
	}
}

function styleWarning(warning){
	warning.style.color = "grey"
	warning.style.marginLeft = "1em";
	warning.style.marginRight = "1em";
	warning.style.fontSize = "1.3em";
	warning.style.fontWeight = "bold";
}

function styleButton(button){
	button.style.color = "white";
	button.style.backgroundColor = "#4266b2";
	button.style.border = "none";
	button.style.padding = "10px";
	button.style.textAlign = "center";
	button.style.display = "inline-block";
	button.style.fontSize = "1.3em";
	button.style.width = "100%";
	button.style.cursor = "pointer";
}

function hidePost(post, content, type, remove){
	if (remove){
		post.style.display = "none";
		return;
	}
	var warningType = post.previousSibling.className;
	if (type === "warning"){
		if (warningType === "TWwarningBox" || warningType === "warningBox"){
			return;
		} else if (warningType === "termWarningBox"){
			post.previousSibling.className = "warningBox";
			var button = post.previousSibling.childNodes[1];
			var twWarning = document.createElement("p");
			twWarning.textContent = parseWarnings(content, type);
			styleWarning(twWarning);
			post.previousSibling.insertBefore(twWarning, button);
			return;
		}
	} else if (type === "terms"){
		if (warningType === "termWarningBox" || warningType === "warningBox"){
			return;
		} else if (warningType === "TWwarningBox"){
			post.previousSibling.className = "warningBox";
			var oldWarning = post.previousSibling.childNodes[0];
			var termWarning = document.createElement("p");
			termWarning.textContent = parseWarnings(content, type);
			styleWarning(termWarning);
			post.previousSibling.insertBefore(termWarning, oldWarning);
			return;
		}
	}

	var newWarning = document.createElement("div");
	newWarning.className = type === "warning" ? "TWwarningBox" : "termWarningBox";
	var showButton = document.createElement("button");
	showButton.textContent = "show";
	showButton.addEventListener("click", function(){
		if (showButton.textContent === 'hide'){
			post.style.display = 'none';
			showButton.textContent = 'show';
		} else {
			post.style.display = 'initial';
			showButton.textContent = 'hide';
		}
	});
	var warningContent = document.createElement("p");
	warningContent.textContent = parseWarnings(content, type);
	styleWarning(warningContent);
	styleButton(showButton);
	newWarning.appendChild(warningContent);
	newWarning.appendChild(showButton);
	post.parentNode.insertBefore(newWarning, post);
	post.style.display = 'none';
}

combFeed(); 

var scrollBlock = _.debounce(combFeed, 300);
document.addEventListener("scroll", scrollBlock);