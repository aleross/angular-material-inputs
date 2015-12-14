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
        var checkbox = createElement();
        expect(checkbox).toHaveClass(miClasses.INPUT + ' ' + miClasses.CHECKBOX);
    });

    it('should transclude text as the checkbox label', function () {
        var test = 'Checkbox',
            checkbox = createElement(test),
            labelText = angular.element(checkbox[0].querySelector('.checkbox-label')).text();
        expect(labelText).toEqual(test);
    });

    it('should transclude an input as the checkbox input', function () {
        var test = 'test',
            checkbox = createElement('<input name="' + test + '">'),
            inputName = checkbox.find('input').attr('name');
        expect(inputName).toEqual(test);
    });

    it('should transclude an input and label text separately', function () {
        var test = 'test',
            checkbox = createElement('<label>' + test + '</label><input name="' + test + '">'),
            inputName = checkbox.find('input').attr('name'),
            labelText = angular.element(checkbox[0].querySelector('.checkbox-label')).text();
        expect(inputName).toEqual(test);
        expect(labelText).toEqual(test);
    });

    it('should throw an error if more than one input is transcluded', function () {
        var error = new Error('<material-checkbox> can only have one <input>.');
        expect(function () {
            createElement('<input><input>');
        }).toThrow(error);
    });
});
