(function (module) {
    'use strict';

    /**
     * @ngdoc directive
     * @name materialText
     * @module material-inputs
     *
     * @restrict E
     *
     * @param mi-label
     */
    module.directive('materialText', materialTextDirective);
    module.directive('input', inputDirective);

    function materialTextDirective($compile, miClasses) {

        // TODO: add/remove classes and styling
        // TODO: ID/name
        // - make created label/input match existing label/input ID/name
        // - observe label attribute to match ID
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

        /**
         * The post link function is executed in a bottom-up manner, so the HTML
         * of child directives is already available. If a child directive has added an input
         * or a label, this function will see it and not auto-add.
         * @param scope
         * @param element
         * @param attrs
         */
        function postLink(scope, element, attrs) {
            setupInput(scope, element);
            setupLabel(scope, element, attrs['miLabel']);
        }

        /**
         * Adds an input if one hasn't been provided.
         * @param scope
         * @param element
         */
        function setupInput(scope, element) {
            var input = element.find('input');
            if (input.length > 1) {
                throw new Error('material-text can only have one <input>.');
            }

            if (!input.length) {
                input = angular.element('<input>');
                element.append(input);
                $compile(input)(scope);
            }
        }

        /**
         * Adds a label if one hasn't been provided.
         * @param scope
         * @param element
         * @param miLabel
         */
        function setupLabel(scope, element, miLabel) {
            var label = element.find('label');
            if (label.length > 1) {
                throw new Error('material-text can only have one <label>.');
            }

            if (!label.length) {
                var newLabel = angular.element('<label>' + (miLabel || '') + '</label>');
                element.append(newLabel);
                $compile(label)(scope);
            }
        }

        return {

            compile: function (element) {
                element.addClass(miClasses.input + ' ' + miClasses.text);
                return postLink;
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
    }

    /**
     * <input> directive listens to value updates
     *  and notifies <material-text> via shared controller.
     *  Does not run for inputs not wrapped in <material-text>.
     */
    function inputDirective() {
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
    }

}(angular.module('material-inputs')));
