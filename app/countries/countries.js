viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/countries", {
        templateUrl : "./countries/countries.html",
        controller : 'CountriesCtrl as csc'
    });
}]);

viewsModule.controller('CountriesCtrl', ['$scope', 'ccNavConf', function($scope, ccNavConf) {
    ccNavConf.set({isHome:false, isCountries:true});
}]);