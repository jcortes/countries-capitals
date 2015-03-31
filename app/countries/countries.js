viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/countries", {
        templateUrl : "./countries/countries.html",
        controller : 'CountriesCtrl as csc'
    });
}]);

viewsModule.controller('CountriesCtrl', ['$scope', '$rootScope', '$location', 'ccCountries', function($scope, $rootScope, $location, ccCountries) {
    var vm = $scope;
    
    $rootScope.isLoading = true;
    ccCountries.getCountries().then(function(data){
        vm.countries = data.data.geonames;
        $rootScope.isLoading = false;
    });
    
    vm.setSelected = function(){
        $location.path('/countries/' + this.country.countryCode);
    };
}]);