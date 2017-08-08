// http://amsul.ca/pickadate.js/api/

// Strings for accessibility
o_datepickerAccessibilityLabels = {
	fr: {
		labelMonthNext: 'Mois suivant',
        labelMonthPrev: 'Mois précédent',
        labelMonthSelect: 'Sélectionner un mois',
        labelYearSelect: 'Sélectionner une année',
        selectMonths: true,
        selectYears: true,
        monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
	  	weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
	  	today: 'aujourd\'hui',
	  	clear: 'effacer',
	  	hiddenName: true
	},
	en: {
		labelMonthNext: 'Next month',
        labelMonthPrev: 'Previous month',
        labelMonthSelect: 'Select a month',
        labelYearSelect: 'Select a year',
        selectMonths: true,
        selectYears: true,
        hiddenName: true
	}
}

o_datepickerLabel = o_datepickerAccessibilityLabels.en;
if(MY_PROJECT_NAME.s_language.indexOf('fr') == 0){
	o_datepickerLabel = o_datepickerAccessibilityLabels.fr;
}

o_datepickerCallbacks = {
    onStart: function() {
		console.log('Start')
  	},
  	onRender: function() {
		console.log('Render')
  	},
  	onOpen: function() {
		console.log('Open')
  	},
  	onClose: function() {
		console.log('Close')
  	},
  	onStop: function() {
		console.log('Stop')
  	},
  	onSet: function(context) {
		console.log('Set', context)
  	}
}

// function to call from init or after ajax call to init the datepicker
function doInitDatepicker(){
	if($('[data-datepicker]').length){
		$.each($("[data-datepicker]"), function(key){
			var $this = $(this),
				o_options = $this.data(), // its options
				s_pickadateID = "pickadate_" + key;
			$.extend(o_options, o_datepickerLabel); // add accessibility
			$.extend(o_options, o_datepickerCallbacks); // add callbacks
			window[s_pickadateID] = $this.pickadate(o_options);
		});
	}
}