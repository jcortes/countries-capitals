describe('ccAppViews module', function(){
    beforeEach(module('ccAppViews'));
    
    var scope, $rootScope, $location, $controller;
    
    beforeEach(inject(function($injector){
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $controller = $injector.get('$controller');
        scope = $rootScope.$new();
    }));
    
    describe('CountriesCtrl controller', function(){
        
        var createCtrl, countryInfoRes, passPromise;
        
        beforeEach(function(){
            countryInfoRes = getJSONFixture('countryInfoJSON.json');
            module(function($provide){
                $provide.factory('ccCountries', function($q){
                    
                    var getCountries = jasmine.createSpy('getCountries').andFakeCall(function(){
                        var _countries = countryInfoRes.geonames;
                        if(passPromise)
                            return $q.when(_countries);
                        else
                            return $q.reject([]);
                    });
                    
                    return {
                        getCountries: getCountries
                    };
                });
            });
        });
        
        
        beforeEach(function(){
            createCtrl = function(){
                return $controller('CountriesCtrl', {
                    '$scope': scope
                });
            };
        });        
        
        it('Should do something with controller but it has an error', function(){
            var ctrl = createCtrl();
            //passPromise = true;
            
            //$location.path('/countries');
            //expect($location.path()).toBe('/countries');
            //expect(scope.countries).toEqual(countryInfoRes.geonames);            
        });
    });
    
    xdescribe('CountryCtrl controller', function(){
        
    });
});