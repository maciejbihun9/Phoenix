define([
    "app/models/errorModel"
], function (errorModel) {

    describe("ErrorModel is a Singleton, does not require initialization", function () {
        var erM;
        
        beforeEach(function () {
            erM = errorModel;
        });
        
        it("should have non-null store", function () {
            expect(erM.getStore()).not.toBeNull();
        });
    });
});