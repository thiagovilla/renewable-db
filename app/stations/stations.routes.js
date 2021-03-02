angular.module("app.stations").config(routerConfig);

routerConfig.$inject = ["$stateProvider"];

function routerConfig($stateProvider) {
  $stateProvider.state({
    name: "stations",
    url: "",
    template: "<h3>STATIONS!</h3>",
  });
}
