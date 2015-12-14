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

    // Class validation
    it('should add the wrapper and text input classes', function () {
        var text = createElement();
        expect(text).toHaveClass(miClasses.INPUT + ' ' + miClasses.TEXT);
    });

    it('should add and remove the focused class', function () {
        var text = createElement(),
            input = text.find('input');

        // Focus
        input.triggerHandler('focus');
        expect(text).toHaveClass(miClasses.FOCUSED);

        // Blur
        input.triggerHandler('blur');
        expect(text).not.toHaveClass(miClasses.FOCUSED);
    });

    it('should add and remove the has-value class according to model updates', function () {
        var text = createElement('<input ng-model="test">');
        expect(text).not.toHaveClass(miClasses.HAS_VALUE);
        scope.$apply('test = "test"');
        expect(text).toHaveClass(miClasses.HAS_VALUE);
        scope.$apply('test = ""');
        expect(text).not.toHaveClass(miClasses.HAS_VALUE);
    });

    it('should add and remove the has-value class according to DOM updates', function () {
        var text = createElement(),
            input = text.find('input');
        expect(text).not.toHaveClass(miClasses.HAS_VALUE);
        input.val('test').triggerHandler('input');
        expect(text).toHaveClass(miClasses.HAS_VALUE);
        input.val('').triggerHandler('input');
        expect(text).not.toHaveClass(miClasses.HAS_VALUE);
    });

    it('should add the has-value class for static values', function () {
        var text = createElement('<input value="test">');
        expect(text).toHaveClass(miClasses.HAS_VALUE);
    });
});
