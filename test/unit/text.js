describe('material-text', function () {

    var scope, $compile;

    beforeEach(module('material-inputs'));


    beforeEach(inject(function ($rootScope, _$compile_) {
        $compile = _$compile_;

        scope = $rootScope.$new();
    }));

    // Creates
    function createElement(contents) {
        var element,
            template = '<material-text>' + contents + '</material-text>';

        element = $compile(template)(scope);

        // Trigger changes
        scope.$apply();
        return element;
    }

    it('should not allow two inputs', function () {
        var error = new Error('material-text can only have one <input>.');
        expect(function () {
            createElement('<input><input>');
        }).toThrow(error);
    });

    it('should not allow two labels', function () {
        var error = new Error('material-text can only have one <label>.');
        expect(function () {
            createElement('<label></label><label></label>');
        }).toThrow(error);
    });
});
