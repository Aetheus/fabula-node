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
		$("<style type='text/css'> .highlighted{ border: 2px solid yellow;} #FabulaSelectorMenu{ position:fixed; top:10px; right:10px; width:200px; border: 2px solid black; background-color:white; font-size:large; text-align:center; z-index:9999; } </style>").appendTo("head");


		/* Stores values of jQuery objects for the Title, Link, Description*/
		/* Current Selector Focus keeps track of which button was pressed*/
		var FabulaSelectorTitle = $();
		var FabulaSelectorLink= $();
		var FabulaSelectorDescription= $();
		var currentFabulaSelectorFocus = "title";

		
		/*create a floating "menu"*/
		$("body").append("<div id='FabulaSelectorMenu'> <input id='FabulaSelectorTitleButton' type='button' value='Title' /><p id='FabulaSelectorTitleDisplay'></p> <input id='FabulaSelectorLinkButton' type='button' value='Link' /><p id='FabulaSelectorLinkDisplay'></p>  <input id='FabulaSelectorDescriptionButton' type='button' value='Description' /><p id='FabulaSelectorDescriptionDisplay'></p> </div> <input id='FabulaSubmitButton' type='button' value='Submit to Web' />");


		/*jqObj will be the jquery object we're passing. 
		  desc of object will be either "title", "link" or "description" */
		function setFabulaSelectorMenu(jqObj, descOfObj){ 
			if(descOfObj === "title"){
				FabulaSelectorTitle = jqObj;
				var jqObjDisplay = FabulaSelectorTitle.text() + "";
				$("#FabulaSelectorTitleDisplay").html(jqObjDisplay);
			}else if(descOfObj === "link"){
				FabulaSelectorLink = jqObj;
				var jqObjDisplay = FabulaSelectorLink.attr("href") + "";
				$("#FabulaSelectorLinkDisplay").text(jqObjDisplay);
			}else{
				FabulaSelectorDescription = jqObj;
				var jqObjDisplay = FabulaSelectorTitle.text() + "";
				$("#FabulaSelectorDescriptionDisplay").text(jqObjDisplay);
			} 
		}

		/*Code to highlight clicked element*/
		var selectedEle = $();
		function FabulaSelectorFunction(e){
				if (typeof currentFabulaSelectorFocus === "undefined"){
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
        		var FabulaSelectorMenuText = "<p>" + numOfEle + "</p>";
        		$("#FabulaSelectorMenu").html(FabulaSelectorMenuText);*/
        		setFabulaSelectorMenu(tempSelectedEle,currentFabulaSelectorFocus);

        		/*prevent link propogation*/
        		if(tempSelectedEle.is("a")){
					e.stopPropagation();
        		}
		}
		document.addEventListener('click', FabulaSelectorFunction,false);
		/*no need to pass event to FabulaSelectoFunction as param when adding listener since jscript automatically passes event to the function as first arg */

		$("#FabulaSelectorMenu").click(function(ev){
			ev.preventDefault();
			ev.stopPropagation();
		});

		$("#FabulaSelectorTitleButton").click(function(ev){
			ev.preventDefault();
			ev.stopPropagation();
			currentFabulaSelectorFocus = "title";
			alert("Selecting for Title");
		});

		$("#FabulaSelectorLinkButton").click(function(ev){
			ev.preventDefault();
			ev.stopPropagation();
			currentFabulaSelectorFocus = "link";
			alert("Selecting for Link");
		});

		/*Old listener to disable link propogation
		$("a").click(function(ev){
			ev.preventDefault();
			ev.stopPropagation();
			FabulaSelectorFunction(ev);
		});*/


		/* message to check we reached the end of script without major problems */
		alert("we didnt crash!");
	}
)();