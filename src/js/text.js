/**
 * @ngdoc directive
 * @name materialText
 * @module material-inputs
 *
 * @restrict E
 *
 * @param mi-label
 */
angular.module('material-inputs').directive('materialText', function () {
    'use strict';

    // TODO: add/remove classes and styling
    // TODO: ID/name
    // TODO: attribute pass-through (?)

    function setupInput(element) {
        var input = element.find('input');
        if (input.length > 1) {
            throw new Error('material-text can only have one <input>.');
        }

        // If an input isn't included, insert the default
        if (!input.length) {
            var newInput = angular.element('<input>');
            element.append(newInput);

            newInput.on('focus', function () {

            });

            newInput.on('blur', function () {

            });

            newInput.on('input', function () {

            });
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
        compile: function (element, attrs) {

            setupInput(element);
            setupLabel(element, attrs['miLabel']);



        },

        link: function (scope, element, attrs) {

        },
    };
});
