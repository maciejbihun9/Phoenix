define([ "dojo/_base/declare" ], function(declare) {
	var Counter = declare(null, {
		 privateValue : 0 ,
	     increment: function(){ this.privateValue++; },
	     decrement: function(){ this.privateValue--; },     
	     getValue: function(){ return this.privateValue; } 
	   });
	var result = new Counter();
	
	return result;
});
