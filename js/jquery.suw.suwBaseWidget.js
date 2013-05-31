(function(suw){
	suw.baseWidget = suw.jq.Widget;
	var $ = suw.jq;

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
	
	suw.baseWidget.prototype["_setupHtmlRes"] = function() {
		if ( typeof this.options.staticHtml == "undefined" || this.options.staticHtml ){
			var resHTML = this.options.resHTML || this.widgetName;
			suw.rl.loadHTML(resHTML,function(data){
					this.element.html(data);
				},
				this.onAjaxError,
				this,false
			);
		}
	};
	
	suw.baseWidget.prototype["_setupCssRes"] = function() {
		var $this = this, resCSS;
		resCSS = this.options.resCSS || this.widgetName;
		suw.rl.loadCSS(resCSS,function(){
			if ( typeof $this.options.docguiThema != "undefined" && !$this.options.docguiThema ){
				$('link').each(function(i,link){
					if(themaURL.test(link.href)){
						$(link).remove();
					}
				});
			}
		});
	};
	
	suw.baseWidget.prototype["_setupJsRes"] = function(){
		suw.rl.loadJS(this.widgetName,
			this.setupBusinessLogic,
			this		
		);
	};
	
	suw.baseWidget.prototype["_loadInput"] = function(){
		this.options.chkBaseWidgetIMD = true;
		
		suw.jq.extend(this.options, this.element.metadata());
		
		if ( typeof(this.options.loadInput) === 'function'){
			this.options.input = this.options.loadInput();
		}
		
		if ( this.options.chkBaseWidgetIMD ){
			var metaData = this.element.find('div.baseWidgetIMD');
			if ( metaData.length ){
				suw.jq.extend( this.options,metaData.metadata() );
			}
		}
	};
	
	suw.baseWidget.prototype["_create"] = function() {
		this._setupHtmlRes();
		this._setupCssRes();
		this._setupEvents();
		this._loadInput();
		
		if ( this.options.debug ){
			
			if ( suw.jq.browser.msie ){
				suw.rl.loadJS("console",function(){
					window.console = log4javascript.getDefaultLogger();
					this.setupBusinessLogic();
				},this);
			}
			else {
				this.setupBusinessLogic();
			}
		}
		else {
			if ( ! window.console ){
				window.console = { info:function(){},error:function(){},debug:function(){},warn:function(){},log:function(){}};
			}
			this.setupBusinessLogic();
		}
		//this._setupJsRes();
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
	suw.baseWidget.prototype["onLightNotify"] = function(event,eventData){
		var opt = { 
            message: eventData.message, 
            fadeIn: ( eventData.fadeIn ) && eventData.fadeIn || 700, 
            fadeOut: ( eventData.fadeOut ) && eventData.fadeOut || 700, 
            timeout: ( eventData.timeout ) && eventData.timeout || 2000, 
            showOverlay: false, 
            centerY: false, 
            css: { 
                width: '350px', 
                top: '10px', 
                left: '', 
                right: '10px', 
                border: 'none', 
                padding: '5px', 
                backgroundColor: '#000', 
                '-webkit-border-radius': '10px', 
                '-moz-border-radius': '10px', 
                opacity: .6, 
                color: '#fff' 
            } 
        };
		
		if ( eventData.noTimeOut ){
			delete opt.timeout;
		}
		$.blockUI(opt);
	};
	suw.baseWidget.prototype["onBlockNotify"] = function(event,eventData){
		$.blockUI({ 
            message: eventData.message, 
            timeout: ( eventData.timeout ) && eventData.timeout || 2000
        }); 
	};
	suw.baseWidget.prototype["onBlock"] = function(event,eventData){
		$.blockUI({ 
            message: eventData.message
        });
	};
	suw.baseWidget.prototype["onUnBlock"] = function(event,eventData){
		$.unblockUI();
	};
	
})(suw);