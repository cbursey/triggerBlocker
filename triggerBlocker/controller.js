document.addEventListener('DOMContentLoaded', function(){

    var checkbox = document.getElementById('block-all');
    var addButton = document.getElementById('addButton');
    var displayButton = document.getElementById('listDisplay');
    var list = document.getElementById('list');
    var header = document.getElementById('listHeader');
    var viewMenu = document.getElementById('viewType');

    function updateList(data){
        if (!data['showList']){
            list.style.display = 'none';
            header.style.display = 'none';
            return;
        } else {
            list.style.display = 'initial';
            header.style.display = 'initial';
        }
        var addedTerms = data['added_terms'];
        var termList = document.getElementById('terms');
        for (var i = 0; i < addedTerms.length; i++){
            var term = document.createElement("p");
            term.textContent = addedTerms[i];
            term.className = "listWord";
            var button = document.createElement("button");
            button.textContent = "x";
            button.className = "xButton";
            button.id = addedTerms[i];
            var entry = document.createElement("span");
            entry.appendChild(button);
            entry.appendChild(term);
            entry.className = "listEntry";
            button.addEventListener("click", function(){
                var newList = [];
                for (var j = 0; j < addedTerms.length; j++){
                    if (addedTerms[j] !== this.id){
                        newList.push(addedTerms[j]);
                    }
                }
                var obj = {};
                obj['added_terms'] = newList;
                chrome.storage.sync.set(obj);
            }); 
            termList.appendChild(entry);
        }
        if (addedTerms.length === 0){
            header.style.display = "none";
            displayButton.style.display = "none";
        } else {
            header.style.display = "initial";
            displayButton.style.display = "initial";
        }
    };
    function updateCheckbox(data){
        if (data['block_warnings']){
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    };

    function updateViewMenu(data){
        if (data['view_type'] === "Remove"){
            viewMenu.value = "Remove";
        } else {
            viewMenu.value = "Minimize";
        }
    };

    checkbox.addEventListener("change", function(){
        chrome.storage.sync.set({block_warnings: checkbox.checked});
    });

    viewMenu.addEventListener("change", function(){
        var obj = {};
        obj['view_type'] = viewMenu.value;
        chrome.storage.sync.set(obj);
    });

    addButton.addEventListener("click", function(){
        chrome.storage.sync.get('added_terms', function(data){
            var newWord = document.getElementById("inputBox").value;
            var newList = data['added_terms'];
            if (!newList){
                newList = [];
            }
            newList.push(newWord);
            var obj = {};
            obj['added_terms'] = newList;
            chrome.storage.sync.set(obj);
        });
    });

    displayButton.addEventListener("click", function(){
        chrome.storage.sync.get(null, function(data){
            var newVis = true;
            if (data['showList']){
                displayButton.textContent = 'Show List';
                newVis = false;
            } else {
                displayButton.textContent = 'Hide List';
            }
            var obj = {};
            obj['showList'] = newVis;
            data['showList'] = newVis;
            chrome.storage.sync.set(obj, function(){
                updateList(data);
            });
        });
    });

    chrome.storage.sync.get(null, function(data){
        updateList(data);
        updateCheckbox(data);
        updateViewMenu(data);
        if (data['showList']){
            displayButton.textContent = 'Hide List';
        } else {
            displayButton.textContent = 'Show List';
        }
    });
});