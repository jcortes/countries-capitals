viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl : "./home/home.html",
        controller : 'HomeCtrl'
    });
}]);

viewsModule.controller('HomeCtrl', ['$scope', 'ccNavConf', function($scope, ccNavConf) {
    ccNavConf.set({isHome:true, isCountries:false});
}]);