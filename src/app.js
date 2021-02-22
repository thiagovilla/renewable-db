var app = angular.module("app", []);

app.directive("appRoot", function () {
  return {
    restrict: "E",
    templateUrl: "app.html",
  };
});
