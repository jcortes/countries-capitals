viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/countries/:country", {
        templateUrl : "./countries/country.html",
        controller : 'CountryCtrl as cc'
    });
}]);

viewsModule.controller('CountryCtrl', ['$scope', 'ccNavConf', function($scope, ccNavConf) {
    ccNavConf.set({isHome:false, isCountries:false});
}]);