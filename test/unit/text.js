describe('material-text', function () {

    var scope, $compile, miClasses;

    beforeEach(module('material-inputs'));

    // Gets services we need to be able to create
    // a new sample directive before each test
    beforeEach(inject(function ($rootScope, _$compile_, _miClasses_) {
        $compile = _$compile_;
        scope = $rootScope.$new();
        miClasses = _miClasses_;
    }));

    // Creates a clean <material-text> before each test
    // takes optional HTML contents
    function createElement(contents) {
        var element,
            template = '<material-text>' + contents || '' + '</material-text>';

        element = $compile(template)(scope);

        // Trigger changes
        scope.$apply();
        return angular.element(element);
    }

    it('should create an input if not provided', function () {
        var text = createElement();
        expect(text).toHaveElement('input');
    });

    it('should create a label if not provided', function () {
        var text = createElement();
        expect(text).toHaveElement('label');
    });

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

    // Attributes


    // Class validation
    it('should add the wrapper class', function () {
        var text = createElement();
        expect(text).toHaveClass(miClasses.input);
    });

    it('should add and remove the focused class', function () {
        var text = createElement(),
            input = text.find('input');

        // Focus
        input.triggerHandler('focus');
        expect(text).toHaveClass(miClasses.focused);

        // Blur
        input.triggerHandler('blur');
        expect(text).not.toHaveClass(miClasses.focused);
    });
});
