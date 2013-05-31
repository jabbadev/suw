(function(suw){
	var $ = suw.jq;
	$.widget('suw.submitSite',suw.baseWidget,{
		options : { width: "50%" },
		setupBusinessLogic : function(){
			this.element.css({ width: this.options.width });
			this.element.find('span')
			.button()
			.click($.proxy(this._submitSite,this));
		},
		_submitSite: function(event){
			var siteUrl = this.element.find('input').val()
			
			if ( this._checkUrl(siteUrl) ){
				this._trigger('onSubmitSite',event,{
					siteUrl: this.element.find('input').val()
				});
			}
			else {
				this._trigger('onBadUrl',{},{ msg: "Attention bad URL [ " + siteUrl + " ]" });
			}
		},
		_checkUrl: function(url){
			return /^(http|https):\/\/[^ "]+$/.test(url);
		},
		onBadUrl: function(event,data){
			console.info('fired event suw.submitSite.onBedUrl(event={',event,'},data={',data,'})');
		},
		onSubmitSite: function(event,data){
			console.info('fired event suw.submitSite.onSubmitSite(event={',event,'},data={',data,'})');
		},
		destroy: function() {
			console.info('fired destroy on [ suw.submitSite ]');
			this.element.empty();
			suw.baseWidget.prototype.destroy.call(this);
		}
	});
})(suw);