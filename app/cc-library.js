angular.module('ccLibrary', [])

.constant('CC_API_PREFIX', 'http://api.geonames.org')
.constant('CC_COUNTRY_INFO', '/countryInfoJSON?username={{ username }}')
.constant('CC_NEIGHBOURS', '/neighboursJSON?geonameId={{ geonameId }}&username={{ username }}')
.constant('CC_SEARCH', '/searchJSON?q={{ q }}&country={{ country }}&name_equals={{name_equals }}&isNameRequired={{ isNameRequired }}&username={{ username }}')

.factory('ccCountries', ['$location', '$http', '$q', '$interpolate', 'CC_API_PREFIX', 'CC_COUNTRY_INFO', 
                         function($location, $http, $q, $interpolate, CC_API_PREFIX, CC_COUNTRY_INFO){
    var _countries = null;
    
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
            $location.path('/error');
        });
    }
                             
    function getCountry(code){
        var defer = $q.defer();
        defer.resolve(_countries[code]);
        return defer.promise;
    }
    
    return {
        getCountries: getCountries,
        getCountry: getCountry
    };
}])

.factory('ccRequest', ['$http', '$q', 'CC_API_PREFIX', 
                       function($http, $q, CC_API_PREFIX) {
    return function(path) {
        var defer = $q.defer();
        //console.log(CC_API_PREFIX + path);
        $http.get(CC_API_PREFIX + path)
        .success(function(data){
            //console.log(data);
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
        //console.log(path);
        return ccRequest(path);
    };
}])

.factory('ccCapPopulation', function(){
    return function(data){
        var population = 0;
        for(var i=0; i<data.geonames.length; i++){
            if(data.geonames[i].fcodeName.indexOf('capital') > -1){
                population = data.geonames[i].population;
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
    return function(data){
        var neighbors = [];
        for(var i=0; i<data.geonames.length; i++){
            neighbors.push({
                countryCode: data.geonames[i].countryCode,
                countryName: data.geonames[i].countryName,
            });
        }
        return neighbors;
    };
})