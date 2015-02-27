'use strict';

define(['jquery', 'underscore'], function($, _) {

	var AdFox = function() {
	
		this.key_elements = {
			elements_adv: '.adfox-adv'
		}
		
		this.meta_adv = {
			$elements_adv: [],
			 lib_src: '../lib/adfox.reload_code.embeds.js'
		}
	
		return this;
	};
	
	AdFox.fn = AdFox.prototype;
	
	/* --- elements --- */
	
	AdFox.fn.getAdFoxEl = function() {
	
		var $elements_adv = $(this.key_elements.elements_adv);
		
		this.meta_adv.$elements_adv = $elements_adv;
		
		return this;
	
	};
	
	/* --- processing --- */
	
	AdFox.fn.getAdFoxLib = function() {
	
		var _this = this,
			$lib_deff = null,
			 lib_src = _this.meta_adv.lib_src;
			 
		$lib_deff = $.getScript(lib_src);
		
		$lib_deff.done(function(data){
			_this.initAdFoxAdv();
		});
		
		$lib_deff.fail(function(data){
			console.error(data);
		});
	
		return this;
	
	};
	
	AdFox.fn.initAdFoxAdv = function() {
	
		var $adv = this.meta_adv.$elements_adv;
			
		//load lib AdFox
			
		_.each($adv, function(adv_obj, index, adv_list) {
		
			var $adv_obj = $(adv_obj),
				 adv_id = $adv_obj.attr('id'),
				 adv_src = $adv_obj.attr('data-src');
		
			this.initAdFoxUnit(adv_id, adv_src);
		
		}, this);
	
		return this;
	
	};
	
	AdFox.fn.initAdFoxUnit = function(bannerPlaceId, requestSrc) {

		var $adv_el = $('#' + bannerPlaceId),
			tgNS = window.ADFOX.RELOAD_CODE,
			initData = null;
		
		//get banner data AdFox lib
		initData = tgNS.initBanner(bannerPlaceId, requestSrc);
		
		//append to html
		$adv_el.html(initData.html);
		
		//load banner AdFox lib
		tgNS.loadBanner(initData.pr1, requestSrc, initData.sessionId);

		return this;

	};

	/* --- init --- */
	
	AdFox.fn.init = function() {
	
		this.getAdFoxEl()
			.getAdFoxLib();

		return this;
	};
	
	return AdFox;
});