(function(global,conf){
	var suw = global[conf.suwNS], $ = suw.jq;
	suw.baseWidget = suw.jq.Widget;

	suw.baseWidget.prototype["_setupEvents"] = function() {
		var enp = new RegExp('^on[A-Z].+'), key; 
		for( key in this ){
			if (typeof(this[key]) === 'function' ){
				if ( ! this.options[key] && enp.test(key) ){
					this.options[key] = this[key];
				}
			}
		}
		
		if ( ! this.options.loadInput ){
			this.options.loadInput = this.loadInput;
		}
	};
	
	suw.baseWidget.prototype["_completeSetup"] = function() {
		this._setupCssRes();
		this._setupEvents();
		this._loadInput();
		if ( ! window.console ){
			window.console = { info:function(){},error:function(){},debug:function(){},warn:function(){},log:function(){}};
		}
		this.setupBusinessLogic();
	}
	
	suw.baseWidget.prototype["_setupHtmlRes"] = function() {
		var $this = this;
		if ( typeof this.options.staticHtml == "undefined" || this.options.staticHtml ){
			var resHTML = this.options.resHTML || this.widgetName;
			$.wrl.loadGET("loader",resHTML,function(htmlRes){
				$this.element.html(htmlRes[0].data);
				$this._completeSetup();
			});
		}
		else {
			this._completeSetup();
		}
	};
	
	suw.baseWidget.prototype["_setupCssRes"] = function() {
		var $this = this, resCSS;
		resCSS = this.options.resCSS || this.widgetName;
		$.wrl.loadCSS('loader',resCSS);
	};
	
	suw.baseWidget.prototype["_setupJsRes"] = function(){
		$.wrl.loadJS('loader',this.widgetName,this.setupBusinessLogic);
	};
	
	suw.baseWidget.prototype["_loadInput"] = function(){
		this.options.chkBaseWidgetIMD = true;
		
		$.extend(this.options, this.element.data());
		
		if ( typeof(this.options.loadInput) === 'function'){
			this.options.input = this.options.loadInput();
		}
		
		if ( this.options.chkBaseWidgetIMD ){
			var metaData = this.element.find('div.baseWidgetIMD');
			if ( metaData.length ){
				$.extend( this.options,metaData.data() );
			}
		}
	};
	
	suw.baseWidget.prototype["_create"] = function() {
		this._setupHtmlRes();
		/*
		this._setupCssRes();
		this._setupEvents();
		this._loadInput();
		if ( ! window.console ){
			window.console = { info:function(){},error:function(){},debug:function(){},warn:function(){},log:function(){}};
		}
		this.setupBusinessLogic();
		*/
	};
	
	suw.baseWidget.prototype["overWriteEvent"] = function( eventName,eventFunction ){
		this[eventName] = eventFunction;
		this.options[eventName] = eventFunction;
	};
	
	suw.baseWidget.prototype["overWriteMethod"] = function( methodName,methodFunction ) {
		this[methodName] = methodFunction;
	};
	
	suw.baseWidget.prototype["getMethod"] = function( methodName ) {
		var $this = this;
		return function(){
			$this[methodName].apply($this,arguments);
		};
	};
	
	// Metodo per il setup del plugin  ( connessione eventi, inizializzazione data table ecc.. ) 
	suw.baseWidget.prototype["setupBusinessLogic"] = function(){};
	
	// Metodo richiamato prima setupBusinnessLogic utile per ricevere i dati di input options.input = {}
	//suw.baseWidget.prototype["loadInput"] = function(){};
	
	// eventData = { widget : {.. the widget .. } , jqXHR: {}, textStatus:{} , errorThrown:{} }
	suw.baseWidget.prototype["onAjaxError"] = function(event,eventData){
		console.error('fire event onAjaxError: status [ ' + eventData.jqXHR.status + ' ][ ' + eventData.jqXHR.responseText + ' ]');
	};
	// eventData = { widget : {.. the widget .. } , message = "message error" , error = { .. complex obj err .. } }
	suw.baseWidget.prototype["onWarning"] = function(event,eventData){
		console.warn('fire event "onWarning(' + event +',' + JSON.stringify(eventData) + ')"');
	};
	// eventData = { widget : {.. the widget .. } , message = "message error" , error = { .. complex obj err .. } }
	suw.baseWidget.prototype["onError"] = function(event,eventData){
		console.error('fire event "onError(' + event +',' + JSON.stringify(eventData) + ')"');
	};
	// eventData = { widget : {.. the widget .. } , message = "success message" , data = { .. complex obj .. } }
	suw.baseWidget.prototype["onSuccess"] = function(event,eventData){
		console.info('fire event "onSuccess(' + event +',' + JSON.stringify(eventData) + ')"');
	};
	// eventData = { widget : {.. the widget .. } , [ message = "success message" , data = { .. complex obj .. } ] }
	suw.baseWidget.prototype["onTerminate"] = function(event,eventData){
		console.info('fire event "onTermina(' + event +',' + JSON.stringify(eventData) + ')"');
	};
	// eventData = { widget : {.. the widget .. } , [ message = "success message" , data = { .. complex obj .. } ] }
	suw.baseWidget.prototype["onStartProgress"] = function(event,eventData){
		console.info('fire event "onStartProgress(' + event +',' + JSON.stringify(eventData) + ')"');
	};
	// eventData = { widget : {.. the widget .. } , [ message = "success message" , data = { .. complex obj .. } ] }
	suw.baseWidget.prototype["onStopProgress"] = function(event,eventData){
		console.info('fire event "onStopProgress(' + event +',' + JSON.stringify(eventData) + ')"');
	};
	
})(window,{ suwNS: "suw" });