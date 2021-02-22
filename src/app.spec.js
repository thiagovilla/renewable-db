describe("App", function () {
  var $compile;
  var $rootScope;

  beforeEach(module("app", "app.html"));

  beforeEach(inject(function (_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it("replaces directive with appropriate content", function () {
    var element = $compile("<app-root></app-root>")($rootScope);

    $rootScope.$digest();

    expect(element.html()).toContain("<h1>Hello World</h1>");
  });
});
