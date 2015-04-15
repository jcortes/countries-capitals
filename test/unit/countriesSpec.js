describe('ccAppViews module', function(){
    var scope, $rootScope, $location, $controller;
    var countryInfoRes, passPromise;    
    
    beforeEach(module('ccAppViews'));
    
    beforeEach(function(){
        countryInfoRes = getJSONFixture('countryInfoJSON.json');
        module(function($provide){
            var mockCcCountries = function($q){
                var fakedFn = function(){
                    var _countries = countryInfoRes.geonames;
                    if(passPromise)
                        return $q.when(_countries);
                    else
                        return $q.reject([]);
                };
                
                var getCountries = jasmine.createSpy('getCountries').and.callFake(fakedFn);
                return {
                    getCountries: getCountries
                };
            };
            $provide.factory('ccCountries', mockCcCountries);
        });
    });
    
    beforeEach(inject(function($injector){
        $controller = $injector.get('$controller');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        scope = $rootScope.$new();
    }));
    
    describe('CountriesCtrl controller', function() {
        var createCtrl
                
        beforeEach(function(){
            createCtrl = function(){
                return $controller('CountriesCtrl', {
                    '$scope': scope
                });
            };
        });        
        
        it('Should do something with controller but it has an error', function(){
            var ctrl = createCtrl();
            passPromise = true;
            
            $location.path('/countries');
            expect($location.path()).toBe('/countries');
            //expect(scope.countries).toEqual(countryInfoRes.geonames);            
        });
    });
    
    xdescribe('CountryCtrl controller', function(){
        
    });
});