(function (module) {
    'use strict';

    module.directive('materialCheckbox', materialCheckboxDirective);

    function materialCheckboxDirective(miClasses, $compile) {
        return {
            restrict: 'E',
            template: '<label>' +
                          '<input type="checkbox">' +
                          '<span class="mi-check"></span>' +
                          '<span class="checkbox-label"></span>' +
                      '</label>',
            transclude: true,
            compile: function (element) {
                element.addClass(miClasses.INPUT + ' ' + miClasses.CHECKBOX);
                return function postLink(scope, element, attrs, ctrl, transclude) {

                    // Copy transcluded input or wrapped html into checkbox label
                    transclude(function(clone) {
                        if (clone) {

                            // Check to see if our transcluded HTML includes an input
                            var label = angular.element(element[0].querySelector('.checkbox-label')),
                                inputCount = 0;

                            // Add transcluded input or label content in appropriate places
                            for (var i = 0; i < clone.length; i++) {
                                if (clone[i].nodeName.toLowerCase() == 'input') {
                                    element.find('input').remove();
                                    element.find('label').prepend(clone[i]);
                                    element.find('input').attr('type', 'checkbox');
                                    inputCount += 1;
                                } else {
                                    label.append(clone[i]);
                                }
                            }

                            // Connect our DOM changes to the scope
                            $compile(element.find('label')[0])(scope);

                            if (inputCount > 1) {
                                throw new Error('<material-checkbox> can only have one <input>.');
                            }
                        }
                    });
                }
            }
        }
    }
}(angular.module('material-inputs')));
