/**
 * @ngdoc directive
 * @name materialText
 * @module material-inputs
 *
 * @restrict E
 *
 * @param mi-label
 */
angular.module('material-inputs').directive('materialText', function (miClasses) {
    'use strict';

    // TODO: add/remove classes and styling
    // TODO: ID/name
    // TODO: attribute pass-through (?)
    // Todo: mi-autocomplete
    // Todo: label states/classes/styling

    function updateHasValue(element) {
        var input = element.find('input'),
            hasValue = input.val().length > 0;

        // Todo check for invalid input too
        if (hasValue) {
            element.addClass(miClasses.hasValue);
        } else {
            element.removeClass(miClasses.hasValue);
        }
    }

    function setupInput(element) {
        var input = element.find('input');
        if (input.length > 1) {
            throw new Error('material-text can only have one <input>.');
        }

        // If an input isn't included, insert the default
        if (!input.length) {
            input = angular.element('<input>');
            element.append(input);
        }

        // Event handlers
        input.on('focus', function () {
            element.addClass(miClasses.focused);
        });

        input.on('blur', function () {
            element.removeClass(miClasses.focused);
        });

        input.on('input', function () {
            updateHasValue(element);
        });

        updateHasValue(element);
    }

    function setupLabel(element, miLabel) {
        var label = element.find('label');
        if (label.length > 1) {
            throw new Error('material-text can only have one <label>.');
        }

        // If a label isn't included, insert the default
        if (!label.length) {
            var newLabel = angular.element('<label>' + (miLabel || '') + '</label>');
            element.append(newLabel);
        }
    }

    return {
        compile: function (element, attrs) {

            element.addClass(miClasses.input + ' ' + miClasses.text);
            setupInput(element);
            setupLabel(element, attrs['miLabel']);

        },

        link: function (scope, element, attrs) {

        },

        controller: function ($scope, $element, $attrs) {

            this.setHasValue = function (hasValue) {
                if (hasValue) {
                    $element.addClass(miClasses.hasValue);
                } else {
                    $element.removeClass(miClasses.hasValue);
                }
            }
        }
    };
});

/**
 * <input> directive allows us to hook into ngModel updates.
 */
angular.module('material-inputs').directive('input', function () {
    return {
        restrict: 'E',
        require: ['^?materialText', '?ngModel'],
        link: function (scope, element, attr, ctrls) {
            var miCtrl = ctrls[0],
                ngModelCtrl = ctrls[1];

            // Only use custom input directive
            // if nested within <material-text>
            if (!miCtrl) return;

            // Update has-value status when reading values from the DOM ($parsers)
            // and when model updates are pushed to the DOM ($formatters)
            if (ngModelCtrl) {

                function updateHasValue(value) {
                    miCtrl.setHasValue(!ngModelCtrl.$isEmpty(value));
                    return value;
                }

                ngModelCtrl.$parsers.push(updateHasValue);
                ngModelCtrl.$formatters.push(updateHasValue);
            }
        }
    }
});
