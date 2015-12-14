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
    // - make created label/input match existing label/input ID/name
    // TODO: attribute pass-through (?)
    // - list of defined ones:
    //      - type
    //      - required
    // Todo: mi-autocomplete
    //  - show filled state when autofilled, by having a timer to detect filling?
    // Todo: min/max length
    //  - show message
    // Todo: required/ng-messages
    // - show message
    // Todo: input addon/prepend
    // Todo: additional form validation states: dirty, valid, invalid, pristine

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

        // TODO:
        // - compile v.s. link: what if a nested directive adds an <input>?
        // - maybe add a flag for no-autoadd input
        compile: function (element, attrs) {

            element.addClass(miClasses.input + ' ' + miClasses.text);
            setupInput(element);
            setupLabel(element, attrs['miLabel']);

        },

        controller: function ($scope, $element) {

            function toggleClass(bool, name) {
                if (bool) $element.addClass(name); else $element.removeClass(name);
            }

            this.setFocused = function (isFocused) {
                toggleClass(isFocused, miClasses.focused);
            };

            this.setHasValue = function (hasValue) {
                toggleClass(hasValue, miClasses.hasValue);
            };
        }
    };
});

/**
 * <input> directive notifies parent <material-input> directive of changes.
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

            // Checks for input that is invalid based on native Constraints API.
            function hasValue() {
                return element.val().length > 0 || (element[0].validity || {}).badInput;
            }

            // Update has-value status when reading values from the DOM ($parsers)
            // and when model updates are pushed to the DOM ($formatters)
            if (ngModelCtrl) {

                // Parse updates state when user interacts with DOM by typing in the input.
                // If we have an ng-model controller, we tap into the $parser pipeline because
                // it lets us leverage the work that Angular's <input> directive does before calling
                // the ngModelCtrl $setViewValue. Lots of cross-browser and fringe-cases, like IE9 not
                // supporting 'input' event on backspace etc, or non-Latin language composition events.

                // Note: this will not be called when a value is entered that is considered invalid by native
                // Constraints API. So we also tap into 'input' below.
                ngModelCtrl.$parsers.push(function (value) {
                    miCtrl.setHasValue(!ngModelCtrl.$isEmpty(value));
                    return value;
                });

                // Formatter updates state when $scope value is set
                ngModelCtrl.$formatters.push(function (value) {
                    miCtrl.setHasValue(!ngModelCtrl.$isEmpty(value));
                    return value;
                });
            } else {

                // Call this once in case a static value has been set using value="Foo"
                miCtrl.setHasValue(hasValue());
            }

            // We listen to the 'input' event as well as tapping into the $parsers pipeline
            // in case the user has entered a value into an input, but the native Constraints API
            // has hidden the value from the $parsers pipeline because it is invalid.

            // Note: there are fringe case and cross-browser issues with listening to only the 'input' event
            // IE9 backspace, chinese composition event, etc.
            element.on('input', function () {
                miCtrl.setHasValue(hasValue());
            });

            // Focused state
            element.on('focus', function () {
                miCtrl.setFocused(true);
            });

            element.on('blur', function () {
                miCtrl.setFocused(false);
            });
        }
    }
});
