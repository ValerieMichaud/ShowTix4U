MY_PROJECT_NAME.utils.url = {
	getBaseUrl: function(){
		pathArray = window.location.href.split( '/' );
		protocol = pathArray[0];
		host = pathArray[2];
		return protocol + '//' + host;
	},
	getParameterByName: function(param){
		name = param.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},
	processTwitterLinks: function(text){
		return text.replace(/[\@\#]([a-zA-z0-9-àáâãäåòóôõöøèéêëçìíîïùúûüÿñ_]*)/g,
		function(m,m1) {
			var t = '<a href="http://twitter.com/';
			if(m.charAt(0) == '#')
			t += 'hashtag/';
			return t + encodeURI(m1) + '" target="_blank">' + m + '</a>';
		});
	},
	popUpURL: function(url, width, height){
		newwindow=window.open(url,'name','height='+height+',width='+width);
		if (window.focus) {newwindow.focus()}
		return false;
	},
	shortenURL: function(long_url, func){
		$.getJSON(
			"http://api.bitly.com/v3/shorten?callback=?",
			{
				"format": "json",
				"apiKey": "", // need to add api key
				"login": "", // need to add login name
				"longUrl": long_url
			},
			function(response){
				if(response.status_txt == "RATE_LIMIT_EXCEEDED"){
					func(long_url);
				}else{
					func(response.data.url);
				}
			}
		);
	},
	returnFBShareURL: function(shortURL){
		return "https://www.facebook.com/sharer/sharer.php?s=100&p[url]=" + shortURL;
	},
	returnTWShareText: function(shortURL, textPrefix){
		return "https://twitter.com/intent/tweet?text=" + textPrefix + shortURL;
	},
	// Read a page's GET URL variables and return them as an associative array.
	//http://stackoverflow.com/questions/4656843/jquery-get-querystring-from-url
	getUrlVars: function() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			if (hashes[i].indexOf('=') > -1){
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
		}
		return vars;
	},
	getUrlParameter: function getUrlParameter(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	}
};