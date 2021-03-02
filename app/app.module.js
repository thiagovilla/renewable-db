var app = angular.module("app", ["app.core", "app.layout"]);

app.config(function ($stateProvider) {
  var helloState = {
    name: "hello",
    url: "/hello",
    template: "<h3>Hello</h3>",
  };

  $stateProvider.state(helloState);
});
