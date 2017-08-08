MY_PROJECT_NAME.utils.social = {
	linkedInShareSuccess: function() {
		console.log('linkedin shared');
	},
    googleShareSuccess: function() {
		console.log('google shared');
	},
	twitterShareSuccess: function(intentEvent) {
		if (intentEvent) {
			console.log('twitter shared');
		}
	},
	facebookShareSuccess: function(intentEvent) {
		console.log('facebook shared');
	}
}