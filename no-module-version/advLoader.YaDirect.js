// Надо переписать на jQuery и без Underscore


'use strict';

var YaDirect = function() {

	this.key_elements = {
		ya_direct: '.yadirect-adv'
	}

	this.ya_direct = {
		el_adv: null,
		lib_src: '//an.yandex.ru/system/context.js',
		lib_method: 'yandex_context_callbacks',
		options: {
			ad_format: 'direct',
			favicon: true,
			limit: 3,
			type: 'vertical',

			font_size: .9,
			font_family: 'arial',
			
			header_bg_color: 'd7d7d7',
			border_color: 'd7d7d7',
			title_color: '990000',
			bg_color: 'ffffff',
			url_color: '006699',
			site_bg_color: 'ffffff',
			all_color: '666666', 
			text_color: '004261', 
			hover_color: 'ff0000' 
		}
	}

	return this;
};

YaDirect.fn = YaDirect.prototype;

/* --- elements --- */

YaDirect.fn.getYaDirectEl = function() {

	var el_adv = document.querySelectorAll(this.key_elements.ya_direct);
	
	this.ya_direct.el_adv = el_adv;
	
	return this;

};

/* --- processing --- */

YaDirect.fn.initYaDirectLib = function() {
	
	var _this = this,
		 lib_src = _this.ya_direct.lib_src,
		 t, s;
	
		t = document.getElementsByTagName("script")[0];
		s = document.createElement("script");
		s.src = lib_src;
		s.type = "text/javascript";
		s.async = true;
		t.parentNode.insertBefore(s, t);
	
	return _this;
	
};

YaDirect.fn.initYaDirectAdv = function() {

	var el_adv = this.ya_direct.el_adv,
		lib_method = this.ya_direct.lib_method;
		
	//each to adv element and setup options
	_.each(el_adv, function(el_adv_item, index, adv_list) {
	
		var el_adv_attr = el_adv_item.attributes,
			partner_id = null,
			el_id = null,
			options = _.clone(this.ya_direct.options);
		
		//check to custom options
		_.each(el_adv_attr, function(val, index){
		
			var attr_val = val.name.split('-')[1];
			
			//set element_adv id
			if (val.name === 'id') el_id = val.value;
			
			if (!!attr_val) {
			
				//set partner_id
				if (attr_val === 'partner_id') {
					partner_id = val.value;
					options.partner_id = val.value;
				}
			
				//override option value
				if (!!options[attr_val] && options[attr_val] !== val.value) options[attr_val] = val.value; log('replace ' + val.value);
			
			}
		
		}, this);
		
		window[lib_method] = window[lib_method] || [];
		
		window[lib_method].push(function() {
			Ya.Direct.insertInto(partner_id, el_id, options);
		});
		
		// load lib
		this.initYaDirectLib();
	
	}, this);
	
	return this;
};

/* --- init --- */

YaDirect.fn.init = function() {

	this.getYaDirectEl()
		.initYaDirectAdv();

	return this;
};