//FIrst we have to configure RequireJS
require.config({
	paths: {
		//lib
		domReady: 'lib/require.domReady',
		jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min',
		underscore: '//yastatic.net/underscore/1.6.0/underscore-min',
		
		//modules
		AdvBoot: 'modules/AdvBoot',
		AdvYaDirect: 'modules/yandex-direct/AdvYaDirect',
		AdvAdFox: 'modules/adfox/AdvAdFox',
	}
});

//Now we've configured RequireJS, we can load our dependencies and start
require(['domReady', 'AdvBoot'], function(log, domReady, AdvBoot) {

	domReady(function(){
	
		new AdvBoot()
				.initYaDirect()
				.initAdFox();
				
	});
		
});