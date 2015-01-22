'use strict';

define(['AdvYaDirect', 'AdvAdFox'], function(AdvYaDirect, AdvAdFox) {

	var AdvBoot = function() {
	
		this.AdvBootYaDirect = new AdvYaDirect();
		this.AdvBootAdFox = new AdvAdFox();
	
	};
	
	AdvBoot.fn = AdvBoot.prototype;
	
	AdvBoot.fn.initYaDirect = function() {
	
		this.AdvBootYaDirect.init();
	
		return this;
	
	};
	
	AdvBoot.fn.initAdFox = function() {
	
		this.AdvBootAdFox.init();
	
		return this;
	
	};
	
	return AdvBoot;
});