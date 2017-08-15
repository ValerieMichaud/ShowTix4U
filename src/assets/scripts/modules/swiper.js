// Strings for accessibility
o_accessibilityLabels = {
	fr: {
		o_phrasePrefix: {
			s_prefix_1: "Cliquez ici pour aller à la ",
			s_prefix_2: "Cliquez ici pour afficher la ",
			s_prefix_3: "Cliquez ici pour vous rendre à la "
		},
		s_previousSlide: "bannière précédente",
		s_nextSlide: "bannière suivante",
		s_firstSlide: "Ceci est la première bannière",
		s_lastSlide: "Ceci est la dernière bannière",
		s_paginationBulletMessage: "bannière {{index}}"
	},
	en: {
		o_phrasePrefix: {
			s_prefix_0: "Click here to go to ",
			s_prefix_1: "Click here to display ",
			s_prefix_2: "Click here to proceed to "
		},
		s_previousSlide: "the previous slide",
		s_nextSlide: "the next slide",
		s_firstSlide: "This is the first slide",
		s_lastSlide: "This is the last slide",
		s_paginationBulletMessage: "slide {{index}}"
	}
}

o_label = o_accessibilityLabels.en;
if(MY_PROJECT_NAME.s_language.indexOf('fr') == 0){
	o_label = o_accessibilityLabels.fr;
}

/*
*	Required configuration for accessibility

*	pagination: '.swiper-pagination',
*	paginationClickable: true,
*	a11y: true,
*	prevSlideMessage: s_previousSlide,
*	nextSlideMessage: s_nextSlide,
*	firstSlideMessage: s_firstSlide,
*	lastSlideMessage: s_lastSlide,
*	paginationBulletMessage: s_paginationBulletMessage,
*	nextButton: '.swiper-button-next',
*	prevButton: '.swiper-button-prev',
*	keyboardControl: true,
*	mousewheelControl: false,
*	autoplayDisableOnInteraction : true,
*/

MY_PROJECT_NAME.o_swiper = {
	o_swiperConfigRequired:{
		paginationClickable: true,
		a11y: true,
		prevSlideMessage: o_label.o_phrasePrefix.s_prefix_1 + o_label.s_previousSlide,
		nextSlideMessage: o_label.o_phrasePrefix.s_prefix_1 + o_label.s_nextSlide,
		firstSlideMessage: o_label.s_firstSlide,
		lastSlideMessage: o_label.s_lastSlide,
		paginationBulletMessage: o_label.o_phrasePrefix.s_prefix_1 + o_label.s_paginationBulletMessage,
		keyboardControl: true,
		mousewheelControl: false,
		autoplayDisableOnInteraction : true
	},
    o_swiperConfig:{
		"channels":{
			direction: 'horizontal',
			slidesPerView: 5,
			centeredSlides: true,
        	paginationClickable: true,
        	spaceBetween: 50,
        	breakpoints: {
				1024: {
					slidesPerView: 5
				},
				768: {
					slidesPerView: 4
				},
				640: {
					slidesPerView: 2
				},
				320: {
					slidesPerView: 1,
					spaceBetween: 20
				}
			}
		},
		"support":{
			direction: 'horizontal',
			slidesPerView: 5,
			paginationClickable: true,
			pagination: '.swiper-pagination-support',
        	spaceBetween: 60,
        	breakpoints: {
				1024: {
					slidesPerView: 5
				},
				768: {
					slidesPerView: 4
				},
				640: {
					slidesPerView: 2
				},
				320: {
					slidesPerView: 1
				}
			}
		},
		"testimonials":{
			direction: 'horizontal',
			slidesPerView: 3,
			centeredSlides: true,
        	spaceBetween: 80,
        	breakpoints: {
				1024: {
					slidesPerView: 1,
					spaceBetween: 60,
				},
				768: {
					slidesPerView: 1,
					spaceBetween: 40
				},
				640: {
					slidesPerView: 1,
					spaceBetween: 20
				},
				320: {
					slidesPerView: 1,
					spaceBetween: 20
				}
			}
		},
    },
	i_swiperCount: 0,
	f_updateAccessibilityLabels: function(swiperIndex, swiperID, config) {
		var _config = config;
		if(swiperIndex > 1 && swiperIndex < 4) {
			o_label = o_accessibilityLabels.en;
			if(MY_PROJECT_NAME.s_language.indexOf('fr') == 0){
				o_label = o_accessibilityLabels.fr;
			}

			_config.prevSlideMessage = o_label.o_phrasePrefix['s_prefix_' + swiperIndex] + o_label.s_previousSlide;
			_config.nextSlideMessage = o_label.o_phrasePrefix['s_prefix_' + swiperIndex] + o_label.s_nextSlide;
			_config.paginationBulletMessage = o_label.o_phrasePrefix['s_prefix_' + swiperIndex] + o_label.s_paginationBulletMessage;
		}
		return _config;
	}
}

function doInitSwiper(){
	if($(".swiper-container").length){
		var o_modifiedSwiperConfig,
			s_swiperID,
			$e;
		$(".swiper-container").each(function(){
			MY_PROJECT_NAME.o_swiper.i_swiperCount +=1;
			var $c = $(this);

			$.each(MY_PROJECT_NAME.o_swiper.o_swiperConfig,function(key,config){
				if($c.attr('data-config') == key){
					//NOTE - Take Accessibility Config and extend it to the specific Swiper Config
					var o_swiperConfig = $.extend({}, MY_PROJECT_NAME.o_swiper.o_swiperConfigRequired, config);

					// Load pagination config, only works if object is defined here
					var paginationConfig = {
						pagination : $c.find('.swiper-pagination')[0],
                        nextButton : $c.find('.swiper-button-next')[0],
                        prevButton : $c.find('.swiper-button-prev')[0],
					}
					$.extend(o_swiperConfig, paginationConfig);
					$e = $("[data-config='"+key+"']");
					s_swiperID = 'swiper_' + key;

					o_modifiedSwiperConfig = MY_PROJECT_NAME.o_swiper.f_updateAccessibilityLabels(MY_PROJECT_NAME.o_swiper.i_swiperCount, window[s_swiperID], o_swiperConfig);
				}
			});
            window[s_swiperID] = new Swiper($(this), o_modifiedSwiperConfig);

			//NOTE - For a two-way swiper
			//if($c.attr('data-control')){
			//	window['swiper_' + $c.attr('data-config')].params.control = window['swiper_' + $c.attr('data-control')];
			//}
		});

		//NOTE - Attach handler on a specific Swiper
		window['swiper_channels'].slideTo(2);
	}


}

