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
            template = '<material-checkbox>' + contents || '' + '</material-checkbox>';

        element = $compile(template)(scope);
        scope.$apply();

        return angular.element(element);
    }

    // Class validation
    it('should add the wrapper and checkbox classes', function () {
        var text = createElement();
        expect(text).toHaveClass(miClasses.INPUT + ' ' + miClasses.CHECKBOX);
    });
});
