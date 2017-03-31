define(["dojo/store/Observable" , "dojo/store/Memory"], function(Observable, Memory){
    var someData =
        {
		title : "title",
		version : "13.22.3",
		revision : "2323423",
		timestamp : "2016-11-23 13:00"
	}
    ;

    return {
    	headerData : someData
    }
})