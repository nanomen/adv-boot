/**
	Namespace module;
	methods:
		window.ADFOX.getNSReference
	properties:
		window.ADFOX
	Modify: 21-06-2013
*/
(function(){
	window.ADFOX = (window.ADFOX) || {};
	window.ADFOX.getNSReference = (window.ADFOX.getNSReference) || function(referenceString, value)
	{
		var referenceArray = referenceString.split('.'), 
			currentElement = window.ADFOX; 
			if (referenceArray[0] === "ADFOX") { 
				referenceArray = referenceArray.slice(1); 
			} 
			for (var i = 0, len = referenceArray.length; i < len ; i += 1) { 
				if (typeof currentElement[referenceArray[i]] === "undefined") { 
					currentElement[referenceArray[i]] = {}; 
				}
				currentElement = currentElement[referenceArray[i]]; 
			}
		return currentElement;
	};
})();

/**
	Embed code module;
	API in window.ADFOX.RELOAD_CODE:
		methods:
			loadBanner
				@param {String} placeholderId
				@param {String} requestSrc
				@param {Number} sessionId
			clearSession
			getSessionId
	API in window.ADFOX.RELOAD_CODE.embeds:
		properties:
			'<id баннерного места RELOAD_CODE>':{
				placeholderId: '<id placeholder adfox>',
				requestSrc: '<ссылка запроса за банером>'
			}
			
*/
(function(){
	var 
		tgEmbeds = window.ADFOX.getNSReference('RELOAD_CODE.embeds'),
		tgNS = window.ADFOX.getNSReference('RELOAD_CODE'),
		pageReferrer = (typeof(document.referrer) != 'undefined') ? escape(document.referrer) : '';
		
	/**
		API method;
		returns id for current session, id is the same for all request;
	*/
	function getSessionId()
	{
		tgNS.sessionId = (tgNS.sessionId) ? tgNS.sessionId : (Math.floor(Math.random() * 1000000))
		return tgNS.sessionId;
	}
	
	/**
		API method;
		clears current session; Subsequent getSessionId call will create new id;
	*/
	function clearSession()
	{
		tgNS.sessionId = 0;
	}
	
	/**
		Private method;
		sends new banner request, reuses existing iframe;
		@param {String} placeholderId
		@param {String} requestSrc
	*/
	function sendRequest(placeholderId, requestSrc){
		var iframeDocument = null,
			iframeId = 'AdFox_iframe_' + placeholderId;
		
		try{
			if(document.all && !window.opera){
				iframeDocument = window.frames[iframeId].document;
			}
			else if(document.getElementById){
				iframeDocument = document.getElementById(iframeId).contentDocument;
			}
		}
		catch(e){}
		
		if(iframeDocument){
			iframeDocument.write('<scr'+'ipt type="text/javascript" src="'+requestSrc+'"><\/scr'+'ipt>');
		}
	}
	
	/**
		API method;
		forms parameters for banner request, call sendRequest method;
		@param {String} placeholderId
		@param {String} requestSrc
		@param {Number} sessionId
	*/
	function loadBanner(placeholderId, requestSrc, sessionId){
		var 
			addate = new Date(),
			dl = escape(document.location);

		var dynamicParameters = 
			'&amp;pt=b' +
			'&amp;prr=' + pageReferrer + //closure;
			'&amp;pr1=' + placeholderId + 
			'&amp;pr=' + sessionId +  
			'&amp;pd=' + addate.getDate() + 
			'&amp;pw=' + addate.getDay() + 
			'&amp;pv=' + addate.getHours() + 
			'&amp;dl=' + dl;

		document.getElementById('AdFox_banner_'+placeholderId).innerHTML = '';;
		
		sendRequest(placeholderId, requestSrc + dynamicParameters);
	};

	function initBanner(bannerPlaceId,requestSrc) {
		var 
			pr1 = Math.floor(Math.random() * 1000000),
			placeholderHtml = '<div id="AdFox_banner_'+pr1+'"></div>',
			iframeHtml = '<div style="visibility:hidden; position:absolute;"><iframe id="AdFox_iframe_'+pr1+'" width=1 height=1 marginwidth=0 marginheight=0 scrolling=no frameborder=0></iframe></div>',
			html = placeholderHtml + '\n' + iframeHtml;

		tgEmbeds[bannerPlaceId] = {
				'placeholderId': pr1,
				'requestSrc': requestSrc
			};

		return {
			placeholderHtml: placeholderHtml,
			sessionId: getSessionId(),
			iframeHtml: iframeHtml,
			html: html,
			pr1: pr1
		}
	}
	
	function reloadBanners(bannerPlaceId) {
		var tgNS = window.ADFOX.getNSReference('RELOAD_CODE'),
			tgEmbeds = window.ADFOX.getNSReference('RELOAD_CODE.embeds');
			
		tgNS.clearSession();

		if (typeof(bannerPlaceId) == "object" || !bannerPlaceId)  {//EXAMPLE 1; reload all banners;
			for(var currentEmbed in tgEmbeds) {
				tgNS.loadBanner(
					tgEmbeds[currentEmbed].placeholderId,
					tgEmbeds[currentEmbed].requestSrc,
					tgNS.getSessionId()
				);
			}
		} else {//EXAMPLE 2; reload any banner;
			tgNS.loadBanner(
				tgEmbeds[bannerPlaceId].placeholderId,
				tgEmbeds[bannerPlaceId].requestSrc,
				tgNS.getSessionId()
			);
		}
	}

	/**
		Open API methods in namespace;
	*/
	
	tgNS.loadBanner = loadBanner;
	tgNS.getSessionId = getSessionId;
	tgNS.clearSession = clearSession;
	tgNS.initBanner = initBanner;
	tgNS.reloadBanners = reloadBanners;
})();

/*
** Имя функции, при вызове которой будет перезагружаться баннер.
** Если ни чего не указывать доступ к функция будет доступна в пространстве имен ADFOX (путь к функции) "window.ADFOX.RELOAD_CODE.reloadBanners".
** Поумолчанию передается "adfox_reloadBanner".
*/
(function(functionName){
	if (functionName) {
		window[functionName] = window.ADFOX.RELOAD_CODE.reloadBanners;
	}		
})('adfox_reloadBanner')