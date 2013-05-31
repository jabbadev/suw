(function(global,config){
	var suw = config.suwNS,
	jqURL = config.jqURL,
	wrlURL = config.wrlURL,
	fMain = config.main,
	conf = config.conf,
	jqReady = false,
	wrlReady = false,
	jQuery;
	
	this[suw] = this[suw] &&  this[suw] || {};
	
	this[suw].ready = function(callback){
		var t = setInterval(function(){
			if( jqReady && wrlReady ){
				clearInterval(t);
				global[suw].jq.type(callback)=="function" && callback(global[suw].jq);
			}
		},1);
	}
	
	this[suw].widgets = function() {
		var self = this;
		var args = [];
		for( var i = 0; i < arguments.length; i++ ){
			args.push(arguments[i]);
		}
		var jqsel = args.shift();
		var wname = args.shift();
		
		this.ready(function(){
			self.jq(function(){
				self.jq.wrl.loadJS('loader',wname,function(){
					self.jq(jqsel)[wname](args[0]);
				});
			});
		});
	};
	
	if (global.jQuery === undefined || global.jQuery.fn.jquery !== '1.7') {
	    var script_tag = document.createElement('script');
	    script_tag.setAttribute("type","text/javascript");
	    script_tag.setAttribute("charset","utf-8");
	    script_tag.setAttribute("src",jqURL);
	    script_tag.onload = scriptLoadHandler;
	    script_tag.onreadystatechange = function () { /* Same thing but for IE */
	    	if (this.readyState == 'complete' || this.readyState == 'loaded') {
	    		scriptLoadHandler();
	        }
	    };
	    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
	} else {
		global[suw].jq = window.jQuery;
	}
	
	function scriptLoadHandler() {
		var t = setInterval(function(){
			if( window.jQuery != undefined ){
				clearInterval(t);
				jqReady = true;
				global[suw]['jq'] = window.jQuery.noConflict(true);
				var script_tag = document.createElement('script');
			    script_tag.setAttribute("type","text/javascript");
			    script_tag.setAttribute("charset","utf-8");
			    script_tag.setAttribute("src",wrlURL);
			    script_tag.onload = main;
			    script_tag.onreadystatechange = function () {
			    	if (this.readyState == 'complete' || this.readyState == 'loaded') {
			    		main();
			        }
			    };
			    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
			}
		},1);
	}
	
	function main(){
		wrlReady = true;
		if (conf){
			global[suw].jq.wrl.addLoader({
				name: "loader",config: conf},
				function(loader){
					global[suw].jq.type(window[fMain]) == "function" && window[fMain](global[suw].jq);
				}
			);
		}
		else {
			global[suw].jq.type(window[fMain]) == "function" && window[fMain](global[suw].jq);
		}
	}
})(window,{
	main   : "main",
	suwNS  : "suw",
	jqURL  : "/js/libs/jquery-1.7.2.min.js",
	wrlURL : "/js/libs/jquery.wrl.min.js",
	conf   : "/js/etc/suw.json"
})