/**
 * @ngdoc directive
 * @name materialText
 * @module material-inputs
 *
 * @restrict E
 *
 * @param mi-nolabel
 * @param mi-maxlength
 * @param mi-minlength
 */
angular.module('material-inputs').directive('materialText', function () {
    'use strict';

    return {
        templateUrl: 'templates/text.tpl.html',
        link: function (scope, element, attrs) {

        },
    };
});
