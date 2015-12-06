(function () {

    beforeEach(function () {

        jasmine.mockElementFocus = function(test) {
            var focus = angular.element.prototype.focus;
            inject(function($document) {
                angular.element.prototype.focus = function() {
                    $document.activeElement = this[0];
                    this[0].focus();
                };
            });
            // Un-mock focus after the test is done
            afterEach(function() {
                angular.element.prototype.focus = focus;
            });
        };

        jasmine.addMatchers({

            toHaveClass: function () {
                return {
                    compare: function (actual, expected) {
                        var results = { pass: true };
                        var classes = expected.trim().split(/\s+/);

                        for (var i = 0; i < classes.length; ++i) {
                            if (!angular.element(actual).hasClass(classes[i])) {
                                results.pass = false;
                            }
                        }

                        var negation = !results.pass ? "" : " not ";

                        results.message = "";
                        results.message += "Expected '";
                        results.message += angular.mock.dump(actual);
                        results.message += negation + "to have class '" + expected + "'.";

                        return results;
                    }
                };
            }
        });
    });
})();
