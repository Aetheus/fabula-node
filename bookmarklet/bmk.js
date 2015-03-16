javascript:(
	function(){		
		/*load jquery if it isn't already loaded*/
		if(typeof jQuery === 'undefined'){
			alert("jQuery not found. Loading jQuery . . .");
			var jqscript = document.createElement("script");
			jqscript.src = "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
			document.head.appendChild(jqscript);
		}
		
		alert("jQuery loaded.");

		/* Styles*/
		$("<style type='text/css'> .highlighted{ border: 2px solid yellow;} #FabulaSysMenu{ position:fixed; top:10px; right:10px; width:500px; border: 2px solid black; background-color:white; font-size:large; text-align:center; z-index:9999; } </style>").appendTo("head");


		/* Stores values of jQuery objects for the Title, Link, Description*/
		/* Current Selector Focus keeps track of which button was pressed*/
		var FabulaSysTitle = $();
		var FabulaSysLink= $();
		var FabulaSysDescription= $();
		var FabulaSysAncestor = $();
		var currentFabulaSysFocus = "title";

		var FabulaSysTitleSelector = null;
		var FabulaSysLinkSelector = null;
		var FabulaSysDescriptionSelector = null;
		var FabulaSysAncestorSelector = null;

		
		/*create a floating "menu"*/
		$("body").append("<div id='FabulaSysMenu'> <input id='FabulaSysTitleButton' type='button' value='Title' /><p id='FabulaSysTitleDisplay'></p> <input id='FabulaSysLinkButton' type='button' value='Link' /><p id='FabulaSysLinkDisplay'></p>  <input id='FabulaSysDescriptionButton' type='button' value='Description' /><p id='FabulaSysDescriptionDisplay'></p> <p id='FabulaSysAncestorDisplay'></p> <input id='FabulaSubmitButton' type='button' value='Submit to Web' /> </div>");


		/*utility function to get common ancestor of link, description and title*/
		/*credit to a stackoverflow page*/
		function getCommonAncestor(a, b, c){
			$parentsa = $(a).parents();
			$parentsb = $(b).parents();
			$parentsc = $(c).parents();
		
			var found = null;
			
			/*the calls to return false in the callbacks to "each" are meant to "break" the callbacks early when match is found*/
			$parentsa.each(function() {
				var thisa = this;
				
				$parentsb.each(function() {
				    if (thisa == this){
				        var thisb = this;

				        $parentsc.each(function(){
				        	if (thisb == this);
				        	found = this;
				        	return false;
				        });

				        if (found) return false;
				    }
				});
				
				if (found) return false;
		    });
			
			if (found != null){
				return $(found);
			}else{
				return null;
			}
		}		


		/*utility function to expand relative url to fully qualified url using DOM trickery*/
		/*credit to a blog post: https://grack.com/blog/2009/11/17/absolutizing-url-in-javascript/*/
		function makeQualified(url) {
    		var div = document.createElement('div');
    		div.innerHTML = "<a></a>";
    		div.firstChild.href = url;
    		div.innerHTML = div.innerHTML; 
    		return div.firstChild.href;
		}

		/*utility functions to deal with strings*/
		function domListToString(domList,separator){
  			var arr = [];
  			for (var i = 0, ref = arr.length = domList.length; i < ref; i++) {
				arr[i] = domList[i];
  			}
  			return arr.join(separator);
		}
		function stringBuilder(){
	  		return domListToString(arguments,"");
		}

		/*utility function to generate a jQuery selector for an element*/
		function getSelectorText(elem){
			var elemTagName = elem.prop("tagName");
			if(elem.attr("class") !== undefined){
				var elemClasses = domListToString(elem[0].classList,".");
				var selectText = stringBuilder(elemTagName,".",elemClasses);
				return selectText;
			}else{
				return elemTagName;
			}
		}

		/*jqObj will be the jquery object we're passing. 
		  desc of object will be either "title", "link" or "description" */
		function setFabulaSysMenu(jqObj, descOfObj){ 
			if(descOfObj === "title"){
				FabulaSysTitle = jqObj;
				FabulaSysTitleSelector = getSelectorText(jqObj);
				$("#FabulaSysTitleDisplay").html(FabulaSysTitle.text() + " " + FabulaSysTitleSelector);
			}else if(descOfObj === "link"){
				FabulaSysLink = jqObj;
				FabulaSysLinkSelector = getSelectorText(jqObj);
				var fullURL = makeQualified(FabulaSysLink.attr("href"));
				$("#FabulaSysLinkDisplay").text(fullURL + " " + FabulaSysLinkSelector);
			}else{
				FabulaSysDescription = jqObj;
				FabulaSysDescriptionSelector = getSelectorText(jqObj);
				$("#FabulaSysDescriptionDisplay").text(FabulaSysDescription.text() + " " + FabulaSysDescriptionSelector);
			} 

			
			FabulaSysAncestor = getCommonAncestor(FabulaSysTitle,FabulaSysLink,FabulaSysDescription);
			if(FabulaSysAncestor != null){
				FabulaSysAncestorSelector = getSelectorText(FabulaSysAncestor);
				$("#FabulaSysAncestorDisplay").text("Common Ancestors: " + FabulaSysAncestorSelector);
			}
		}

		

	

		/*Code to highlight clicked element and call setFabulaSysMenu*/
		var selectedEle = $();
		function FabulaSysFunction(e){
				if (typeof currentFabulaSysFocus === "undefined"){
					alert("Error: Not selecting for either title, link or description");
					return false;
				}

				e.preventDefault();

				var isClickedBefore = selectedEle.is(e.target);
        		var tempSelectedEle = $(e.target);

        		if(isClickedBefore){
        			selectedEle = selectedEle.not(e.target);
        		}else{
					selectedEle = selectedEle.add(e.target);
        		}
        		tempSelectedEle.toggleClass("highlighted");
	
        		/*counter of selected elements
        		var numOfEle = selectedEle.length;
        		var FabulaSysMenuText = "<p>" + numOfEle + "</p>";
        		$("#FabulaSysMenu").html(FabulaSysMenuText);*/
        		setFabulaSysMenu(tempSelectedEle,currentFabulaSysFocus);

        		/*prevent link propogation*/
        		if(tempSelectedEle.is("a")){
					e.stopPropagation();
        		}
		}
		document.addEventListener('click', FabulaSysFunction,false);
		/*no need to pass event to FabulaSelectoFunction as param when adding listener since jscript automatically passes event to the function as first arg */

		$("#FabulaSysMenu").click(function(ev){
			ev.preventDefault();
			ev.stopPropagation();
		});

		$("#FabulaSysTitleButton").click(function(ev){
			ev.preventDefault();
			ev.stopPropagation();
			currentFabulaSysFocus = "title";
			alert("Selecting for Title");
		});

		$("#FabulaSysLinkButton").click(function(ev){
			ev.preventDefault();
			ev.stopPropagation();
			currentFabulaSysFocus = "link";
			alert("Selecting for Link");
		});

		$("#FabulaSysDescriptionButton").click(function(ev){
			ev.preventDefault();
			ev.stopPropagation();
			currentFabulaSysFocus = "desc";
			alert("Selecting for Desc");
		});


		$("#FabulaSubmitButton").click(function(){
		    $.post("https://fabula-node.herokuapp.com/supervisordemo",
		    {
		        title: FabulaSysTitleSelector,
		        link: FabulaSysLinkSelector,
		        description: FabulaSysDescriptionSelector,
		        ancestor: FabulaSysAncestor
		    },
		    function(data, status){
		        alert("Data: " + data + "\nStatus: " + status);
		    });
		});
		

		/*Old listener to disable link propogation
		$("a").click(function(ev){
			ev.preventDefault();
			ev.stopPropagation();
			FabulaSysFunction(ev);
		});*/


		/* message to check we reached the end of script without major problems */
		alert("Fabula plugin succesfully loaded");
	}
)();