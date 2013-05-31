(function(suw){
	var $ = suw.jq;
	$.widget('suw.siteViewer',suw.baseWidget,{
		options : { width: "50%", height: "50%" },
		setupBusinessLogic : function(){
			this.element
			.width(this.options.width)
			.height(this.options.height);
			
			this.element.find('div')
			.width("100%")
			.height("100%");
		
			this.element.find('iframe')
			.prop("width","100%")
			.prop("height","100%")
			.prop("src",this.options.url);
		},
		destroy: function() {
			console.info('fired destroy on [ suw.siteViewer ]');
			this.element.empty();
			suw.baseWidget.prototype.destroy.call(this);
		}
	});
})(suw);