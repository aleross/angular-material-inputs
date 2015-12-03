/**
 * @ngdoc directive
 * @name materialInput
 * @module enplug.sdk.utils
 *
 * @param field {expression=} The model value to bind the input to.
 * @param type {String} Input type
 * @param label {String} Input label
 * @param directives {Object} key:value of directives to assign to input. This directive creates isolate+transcluded scope, so remember to use $parent in values.
 * @param required {boolean},
 * @param autofocus {boolean} - causes this input to be focused after creation
 *
 * For better ways to do a lot of this, look to: https://github.com/angular/material/blob/master/src/components/input/input.js
 *
 */
angular.module('material-inputs').directive('materialInput', ['$log', '$compile', '$parse', '$document',
    function ($log, $compile, $parse, $document) {
        'use strict';

        return {
            restrict: 'E',
            require: '^form',
            scope: {
                model: '=field'
            },
            transclude: true, // Allows us to wrap up custom html
            templateUrl: 'templates/input.tpl.html',
            link: function ($scope, $element, $attrs, $form, $transclude) {

                var ignoreAttributes = ['class', 'label', 'directives', 'field', 'focus', 'ng-if', 'ng-show', 'ng-hide'],
                    input = $document[0].createElement('input'),
                    directives = $parse($attrs.directives)($scope),
                    autofocus = typeof $attrs.autofocus !== 'undefined',
                    id = $attrs.field + '-' + 1234;

                $scope.id = id; // better to use name?
                $scope.label = $attrs.label;
                $element.removeAttr('label');
                input.setAttribute('name', id);

                // Convenience method so we don't have to apply form-groups
                if (!$element.parent().hasClass('form-group')) {
                    $element.addClass('form-group');
                }

                // Copy attributes over to input
                angular.forEach($attrs, function (value, _attr) {
                    var attr = _attr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
                    if (attr.indexOf('$') === -1 && ignoreAttributes.indexOf(attr) === -1) {
                        $element.removeAttr(attr);
                        input.setAttribute(attr, value);
                    }
                });

                // Type may have been set by copying attributes, if not default to text
                if (!input.getAttribute('type')) {
                    input.setAttribute('type', 'text');
                }

                // Set fields that used to be in HTML
                input.setAttribute('class', 'form-control');
                input.setAttribute('ng-model', 'model');
                input.setAttribute('ng-class', '{ active: model }');
                input.setAttribute('ng-model-options', '{ allowInvalid: true, debounce: 100 }');
                input.setAttribute('id', $scope.id);

                // Copy custom directives
                angular.forEach(directives, function (value, directive) {
                    input.setAttribute(directive, value);
                });

                $element.removeAttr('directives');

                // Copy any wrapped html into input template
                $transclude(function(clone) {

                    var hasInput = false;
                    if (clone) {

                        // Check to see if our transcluded HTML includes an input
                        var newInput;
                        for (var i = 0; i < clone.length; i++) {
                            if (clone[i].nodeName.toLowerCase() == 'input') {
                                hasInput = true;
                                newInput = clone[i];
                            }
                        }

                        if (hasInput) {

                            // Add default attributes to the transcluded input
                            newInput.setAttribute('class', 'form-control');
                            newInput.setAttribute('id', $scope.id);
                            input.setAttribute('name', $scope.id);

                            // Connect this input's model and scope to our directive's scope
                            // FIXME: Known bug when transcluded input is number type, and has an existing model value
                            newInput.setAttribute('ng-class', '{ active: model }');
                            newInput.setAttribute('ng-model', 'model');
                            $compile(clone)($scope);

                            // Add input and any other included HTML to beginning of input
                            // This case ignores all the work we did on the input above. Messy, needs refactoring.
                            $element.prepend(clone);
                        }
                    }

                    if (!hasInput) {

                        // Add our manufactured input
                        $compile(input)($scope);
                        $element.prepend(input);
                    }
                });

                if (autofocus) {
                    input.focus();
                }

                $scope.formField = $form[id]; // used for ng-messages. Must retrieve after re-$compiling input

                // Stupid hack to get $dirty state to be correctly set, which bizarrely doesn't happen. WTF
                $scope.$watch('model', function (val) {
                    if (val !== undefined && val !== null && $scope.formField) {
                        $scope.formField.$dirty = true;
                    }
                });
            }
        };
    }
]);
