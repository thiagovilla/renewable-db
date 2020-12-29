var app = angular.module("app", []);

app.directive("app", function () {
  return {
    restrict: "E",
    templateUrl: "app.html",
  };
});
