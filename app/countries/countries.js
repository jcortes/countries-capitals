viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/countries", {
        templateUrl : "./countries/countries.html",
        controller : 'CountriesCtrl as csc'
    });
}]);

viewsModule.controller('CountriesCtrl', ['$scope', '$location', 'ccAllCountries', 'ccCountryData', function($scope, $location, ccAllCountries, ccCountryData) {
    var vm = $scope;
    
    ccAllCountries().then(function(countries){
        vm.countries = countries.geonames;
    });
    
    vm.setSelected = function(){
        ccCountryData.countryName = this.country.countryName;
        ccCountryData.countryCode = this.country.countryCode;
        ccCountryData.population = this.country.population;
        ccCountryData.areaInSqKm = this.country.areaInSqKm;
        ccCountryData.capital = this.country.capital;
        ccCountryData.geonameId = this.country.geonameId;
        $location.path('/countries/' + this.country.countryCode);
    };
}]);