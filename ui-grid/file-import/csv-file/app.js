var app = angular.module('app', ['ngTouch', 'ui.grid']);

app.controller('MainCtrl', ['$scope', function ($scope) {
    var vm = this;
    vm.gridOptions = {};
    vm.reset = reset;
    function reset() {
        vm.gridOptions.data = [];
        vm.gridOptions.columnDefs = [];
    }
}])
    .directive("fileread", [function () {
        return {
            scope: {
                opts: '='
            },
            link: function ($scope, $elm, $attrs) {
                $elm.on('change', function (changeEvent) {
                    var reader = new FileReader();

                    reader.onload = function (evt) {
                        $scope.$apply(function () {
                            var data = evt.target.result;
                            var csv = new CSV(data, null);
                            var parsed = csv.parse();
                            var headerNames = parsed[0];
                            var data1 = parsed.splice(1, parsed.length);
                            $scope.opts.columnDefs = [];
                            headerNames.forEach(function (h) {
                                $scope.opts.columnDefs.push({field: h});
                            });
                            var tempDataArr = [];
                            angular.forEach(data1, function (value, key) {
                                var tempObj = {};
                                angular.forEach(headerNames, function (v, k) {
                                    tempObj[v] = value[k];
                                });
                                tempDataArr.push(tempObj);
                            });
                            $scope.opts.data = tempDataArr;
                            $elm.val(null);
                        });
                    };

                    reader.readAsBinaryString(changeEvent.target.files[0]);
                });
            }
        }
    }]);
