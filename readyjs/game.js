var Game = new (function(){
	var self 			= this;
	
	self.title  	= undefined;
	self.author 	= undefined;
	self.path 		= undefined

	setTimeout(init);

	function init() {
		if (self.title) {
			document.title = self.title;
		}
	}
})();