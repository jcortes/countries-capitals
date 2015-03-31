viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/countries/:country", {
        templateUrl: "./countries/country.html",
        controller: 'CountryCtrl as cc'
    });
}]);

viewsModule.controller('CountryCtrl', ['$scope', '$routeParams', 'ccCountries', 'ccCapPopulation', 'ccNeighbors', 'ccCapitalReq', 'ccNeighborsReq', function($scope, $routeParams, ccCountries, ccCapPopulation, ccNeighbors, ccCapitalReq, ccNeighborsReq) {
    var vm = $scope;
    
    ccCountries.getCountry($routeParams.country)
    .then(function(data){
        vm.country = data;
        
        ccCapitalReq(data.countryCode, data.countryName).then(function(data){
            vm.country.capital_pop = ccCapPopulation(data);
        });
        
        ccNeighborsReq(data.geonameId).then(function(data){
            vm.country.neighbors = ccNeighbors(data);
        });
    });
}]);