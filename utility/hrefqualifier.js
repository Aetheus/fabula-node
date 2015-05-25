var url = require("url");

//takes a href and a full location url and qualifies it
var hrefQualifier = function (href, fullLocation){
	//get protocol + host, build a basic uri		
	var parsedObj = url.parse(fullLocation);
	var uri = parsedObj.protocol + "//" + parsedObj.host;

	console.log("case for: " + fullLocation + " with a href of " + href);

	//if the input path is relative-from-here, delete the ./ token to make it relative
	if( /^(.\/)([^\/]?)/.test(href)){
		href = href.replace(new RegExp("/^(./)([^/]?)/, '$2'"));
	}

	//if the input href is already qualified, copy it unchanged
	if( /^([a-z]+):\/\//.test(href) ){
		uri = href;
		console.log("case 1");
	}

	//or if the input href begins with a leading slash, then it's base relative
	//so just add the input href to the base URI
	else if(href.substr(0, 1) == '/'){
		uri += href;
		console.log("case 2");
	}

	//or if it's an up-reference the path has to be computed
	else if(/^((..\/)+)([^\/].*$)/.test(href)){
		console.log("case 3");
		//get the last part of the path, minus up-references
		var lastpath = href.match(new RegExp("/^((../)+)([^/].*$)/"));
		lastpath = lastpath[lastpath.length - 1];

		//count the number of up-references
		var references = href.split('../').length - 1;

		//get the path parts and delete the last one (this page or directory)
		var parts = parsedObj.pathname.split('/');
		parts = parts.splice(0, parts.length - 1);

		//for each of the up-references, delete the last part of the path
		for(var i=0; i<references; i++)
		{
			parts = parts.splice(0, parts.length - 1);
		}

		//now rebuild the path
		var path = '';
		for(i=0; i<parts.length; i++){
			if(parts[i] != ''){
				path += '/' + parts[i];
			}
		}
		path += '/';

		//and add the last part of the path
		path += lastpath;

		//then add the path and input href to the base URI
		uri += path;
	}

	//otherwise it's a relative path,
	else{
		console.log("case 4");
		//calculate the path to this directory
		path = '';
		parts = parsedObj.pathname.split('/');
		parts = parts.splice(0, parts.length - 1);
		for(var i=0; i<parts.length; i++)
		{
			if(parts[i] != '')
			{
				path += '/' + parts[i];
			}
		}
		path += '/';

		//then add the path and input href to the base URI
		uri += path + href;
	}

	//return the final uri
	return uri;
}


module.exports = hrefQualifier;