var app = angular.module("app", ["ui.router", "app.layout"]);

app.config(function ($stateProvider) {
  var helloState = {
    name: "hello",
    url: "/hello",
    template: "<h3>Hello</h3>",
  };

  $stateProvider.state(helloState);
});
