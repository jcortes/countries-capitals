angular.module('ccLibrary', [])

.constant('CC_API_PREFIX', 'http://api.geonames.org')
.constant('CC_COUNTRY_INFO', '/countryInfoJSON?username={{ username }}')
.constant('CC_NEIGHBOURS', '/neighboursJSON?geonameId={{ geonameId }}&username={{ username }}')
.constant('CC_SEARCH', '/searchJSON?q={{ q }}&country={{ country }}&name_equals={{name_equals }}&isNameRequired={{ isNameRequired }}&username={{ username }}')

.value('ccCountryData', {})

.factory('ccCountries', ['$http', '$q', '$interpolate', 'CC_API_PREFIX', 'CC_COUNTRY_INFO', 
                         function($http, $q, $interpolate, CC_API_PREFIX, CC_COUNTRY_INFO){
    
    var _countries = null;
    var services = {
        getCountries: getCountries,
        getCountry: getCountry
    };
    
    function getCountries(){
        var path = $interpolate(CC_API_PREFIX + CC_COUNTRY_INFO)({username: 'jcortes'});
        return $http.get(path, {cache:true})
        .success(function(data) {
            if(_countries === null){
                _countries = [];
                angular.forEach(data.geonames, function(country){
                    _countries[country.countryCode] = country;
                });
            }
        })
        .error(function(data, status){
            console.log('Error status: ' + status);
        });
    }
    
    function getCountry(code){
        var defer = $q.defer();
        defer.resolve(_countries[code]);
        return defer.promise;
    }
    
    return services;
}])

.factory('ccRequest', ['$http', '$q', 'CC_API_PREFIX', 
                       function($http, $q, CC_API_PREFIX) {
    return function(path) {
        var defer = $q.defer();
        $http.get(CC_API_PREFIX + path)
        .success(function(data){
            defer.resolve(data);
        })
        .error(function(data, status){
            console.log('Error status: ' + status);
        });
        return defer.promise;
    };
}])

.factory('ccCapitalReq', ['$interpolate', 'ccRequest', 'CC_SEARCH', 
                          function($interpolate, ccRequest, CC_SEARCH){
    return function(code, name){
        var path = $interpolate(CC_SEARCH)({
            q: name,
            country: code,
            name_equals: name,
            isNameRequired: false,
            username: 'jcortes'
        });
        return ccRequest(path);
    };
}])

.factory('ccCapPopulation', function(){
    return function(capData){
        var population = 0;
        for(var i=0; i<capData.geonames.length; i++){
            if(capData.geonames[i].fcodeName.indexOf('capital') > -1){
                population = capData.geonames[i].population;
            }
        }
        return population;
    };
})

.factory('ccNeighborsReq', ['$interpolate', 'ccRequest', 'CC_NEIGHBOURS', 
                            function($interpolate, ccRequest, CC_NEIGHBOURS){
    return function(id){
        var path = $interpolate(CC_NEIGHBOURS)({
            geonameId: id,
            username: 'jcortes'
        });
        return ccRequest(path);
    };
}])

.factory('ccNeighbors', function(){
    return function(neighborsData){
        var neighbors = [];
        for(var i=0; i<neighborsData.geonames.length; i++){
            neighbors.push({
                countryCode: neighborsData.geonames[i].countryCode,
                countryName: neighborsData.geonames[i].countryName,
            });
        }
        return neighbors;
    };
})