(function (module) {
    'use strict';

    module.directive('materialCheckbox', materialCheckboxDirective);

    function materialCheckboxDirective(miClasses) {
        return {
            restrict: 'E',
            template: '<label><input type="checkbox">' +
                '<span class="mi-check"></span>' +
                '<span class="checkbox-label"><span>Label</span></span>' +
            '</label>',
            compile: function (element) {
                element.addClass(miClasses.INPUT + ' ' + miClasses.CHECKBOX);
                return function postLink() {

                }
            }
        }
    }

}(angular.module('material-inputs')));
