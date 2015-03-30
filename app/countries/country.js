viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/countries/:country", {
        templateUrl: "./countries/country.html",
        controller: 'CountryCtrl as cc',
        resolve: {
            capData: ['ccCountryData', 'ccCapitalReq', function(ccCountryData, ccCapitalReq){
                return ccCapitalReq(ccCountryData.countryCode, ccCountryData.countryName);
            }],
            neighborsData: ['ccCountryData', 'ccNeighborsReq', function(ccCountryData, ccNeighborsReq){
                return ccNeighborsReq(ccCountryData.geonameId);
            }]
        }
    });
}]);

viewsModule.controller('CountryCtrl', ['$scope', 'ccCountryData', 'capData', 'ccCapPopulation', 'neighborsData', 'ccNeighbors',
                                       function($scope, ccCountryData, capData, ccCapPopulation, neighborsData, ccNeighbors) {
    var vm = $scope;
    vm.country = ccCountryData;
    vm.country.capital_pop = ccCapPopulation(capData);
    vm.country.neighbors = ccNeighbors(neighborsData);
}]);