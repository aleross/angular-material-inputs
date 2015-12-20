angular.module('material-inputs', []);

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

angular.module('material-inputs').constant('miClasses', {
    INPUT: 'mi-input',
    TEXT: 'mi-text',
    CHECKBOX: 'mi-checkbox',

    // input states
    FOCUSED: 'mi-focused',
    HAS_VALUE: 'mi-has-value',

    // touched?
    // dirty?
});

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
                element.addClass(miClasses.INPUT + ' ' + miClasses.TEXT);
                return postLink;
            },

            controller: function ($scope, $element) {

                function toggleClass(bool, name) {
                    if (bool) $element.addClass(name); else $element.removeClass(name);
                }

                this.setFocused = function (isFocused) {
                    toggleClass(isFocused, miClasses.FOCUSED);
                };

                this.setHasValue = function (hasValue) {
                    toggleClass(hasValue, miClasses.HAS_VALUE);
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
