(function(suw){
	var $ = suw.jq;
	$.widget('suw.browserWidget',suw.baseWidget,{
		options : { width: "50%", height: "50%" },
		setupBusinessLogic : function(){
			this.element
			.width(this.options.width)
			.height(this.options.height);
			
			this.element.find('#submitSite')
			.submitSite({ width: "100%", onSubmitSite: $.proxy(this._onSubmitSite,this) });
			
			
		},
		_onSubmitSite: function(event,data){
			this.element.find('#siteViewer')
			.siteViewer({ width: "100%", url: data.siteUrl });
		},
		destroy: function() {
			console.info('fired destroy on [ suw.browserWidget ]');
			this.element.empty();
			suw.baseWidget.prototype.destroy.call(this);
		}
	});
})(suw);