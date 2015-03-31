viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when("/countries", {
        templateUrl : "./countries/countries.html",
        controller : 'CountriesCtrl as csc'
    });
}]);

viewsModule.controller('CountriesCtrl', ['$scope', '$location', 'ccCountries', 'ccCountryData', function($scope, $location, ccCountries, ccCountryData) {
    var vm = $scope;
    
    ccCountries.getCountries().then(function(data){
        vm.countries = data.data.geonames;
    });
    
    vm.setSelected = function(){
        ccCountryData.countryName = this.country.countryName;
        ccCountryData.geonameId = this.country.geonameId;
        $location.path('/countries/' + this.country.countryCode);
    };
}]);