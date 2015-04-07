describe('ccLibrary module', function(){
    beforeEach(module('ccLibrary'));
    
    beforeEach(function(){
        // Very Useful !
        // http://stackoverflow.com/questions/17370427/loading-a-mock-json-file-within-karmaangularjs-test
        jasmine.getJSONFixtures().fixturesPath = 'base/test/mock';
    });
    
    describe('ccCountries factory', function(){
        var ccCountries, $httpBackend, countriesRes;
        
        beforeEach(inject(function($injector) {
            // Set up the mock http service responses
            $httpBackend = $injector.get('$httpBackend');
            ccCountries = $injector.get('ccCountries');
            
            countriesRes = getJSONFixture('countryInfoJSON.json');
            
            // backend definition common for list of countries
            $httpBackend.whenGET('http://api.geonames.org/countryInfoJSON?username=jcortes').respond(countriesRes);
        }));
        
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('ccCountries.getCountries()', function(){
            
            it('Should return a list of countries when query the countryInfoJSON web service endpoint', function(){
                ccCountries.getCountries().then(function(data){
                    expect(data.data).toEqual(countriesRes);
                });
                $httpBackend.flush();
            });

            it('The list of countries should have 250 countries', function(){
                ccCountries.getCountries().then(function(data){
                    expect(data.data.geonames.length).toEqual(250);
                });
                $httpBackend.flush();
            });
        });
        
        describe('ccCountries.getCountry(code)', function(){
            var andorraRes;
            
            beforeEach(function(){
                andorraRes = getJSONFixture('countryInfoAD.json');
            });
            
            it('Should query Andorra Country data when countryCode is AD', function(){
                ccCountries.getCountries();
                $httpBackend.flush();
                ccCountries.getCountry('AD').then(function(data){
                    expect(data).toEqual(andorraRes);
                });
            });
        });
    });
    
    describe('ccRequest factory', function(){
        var ccRequest, $httpBackend, $rootScope, searchADRes, neighboursADRes;
        
        beforeEach(inject(function($injector) {
            // Set up the mock http service responses
            $rootScope = $injector.get('$rootScope');
            $httpBackend = $injector.get('$httpBackend');
            ccRequest = $injector.get('ccRequest');
            
            searchADRes = getJSONFixture('searchAD.json');
            neighboursADRes = getJSONFixture('neighboursAD.json');
        }));
        
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
        
        it('Should query the capital of Andorra', function(){
            $httpBackend.expectGET('http://api.geonames.org/searchJSON?q=Andorra&country=AD&name_equals=Andorra&isNameRequired=false&username=jcortes').respond(searchADRes);
            // make the call
            var promise = ccRequest('/searchJSON?q=Andorra&country=AD&name_equals=Andorra&isNameRequired=false&username=jcortes');            
            var result;
            promise.then(function(response){
                result = response;
            });
            $httpBackend.flush();
            expect(result).toEqual(searchADRes);
        });
        
        it('Should query the Andorra country neighbours, must be 2', function(){
            $httpBackend.expectGET('http://api.geonames.org/neighboursJSON?geonameId=3041565&username=jcortes').respond(neighboursADRes);
            //make the call
            var promise = ccRequest('/neighboursJSON?geonameId=3041565&username=jcortes');
            var result;
            promise.then(function(response){
                result = response;
            });
            $httpBackend.flush();
            expect(result).toEqual(neighboursADRes);
            expect(result.geonames.length).toBe(2);
        });
    });
    
    describe('ccCapitalReq factory', function(){
        var $rootScope, ccCapitalReq, searchADRes, passPromise;
        
        // very useful 'Mocking Methods Returning Promises'
        // http://www.sitepoint.com/mocking-dependencies-angularjs-tests/
        beforeEach(function(){
            searchADRes = getJSONFixture('searchAD.json');
            module(function($provide){
                $provide.factory('ccRequest', function($q){
                    return function(path){
                        if(passPromise){
                            return $q.when(searchADRes);
                        } else {
                            return $q.reject({});
                        }
                    };
                });
            });
        });
        
        beforeEach(inject(function($injector) {            
            // Set up the mock http service responses
            $rootScope = $injector.get('$rootScope');
            ccCapitalReq = $injector.get('ccCapitalReq');
        }));
        
        it('Sould return the capital of Andorrra', function(){
            passPromise = true;
            ccCapitalReq('AD', 'Andorra').then(function(res){
                expect(res).toEqual(searchADRes);
            });
            $rootScope.$digest();
        });
    });
    
    describe('ccCapPopulation factory', function(){
        var ccCapPopulation, searchADRes;
        
        beforeEach(inject(function($injector){
            searchADRes = getJSONFixture('searchAD.json');
            ccCapPopulation = $injector.get('ccCapPopulation');
        }));
        
        it('Should return the population of Andorra capital', function(){
            expect(ccCapPopulation(searchADRes)).toEqual(20430);
        });
    });
    
    describe('ccNeighborsReq factory', function(){
        var $rootScope, ccNeighborsReq, passPromise;
            
        beforeEach(function(){
            neighborsADRes = getJSONFixture('neighboursAD.json');
            module(function($provide){
                $provide.factory('ccRequest', function($q){
                    return function(path){
                        if(passPromise){
                            return $q.when(neighborsADRes);
                        } else {
                            return $q.reject({});
                        }
                    };
                });
            });
        });
        
        beforeEach(inject(function($injector) {            
            // Set up the mock http service responses
            $rootScope = $injector.get('$rootScope');
            ccNeighborsReq = $injector.get('ccNeighborsReq');
        }));
        
        it('Sould return the neighbours of Andorrra (France and Spain)', function(){
            passPromise = true;
            ccNeighborsReq(3041565).then(function(res){
                expect(res).toEqual(neighborsADRes);
            });
            $rootScope.$digest();
        });
    });
    
    describe('ccNeighbors factory', function(){
        var ccNeighbors, neighborsADRes;
        
        beforeEach(inject(function($injector){
            neighborsADRes = getJSONFixture('neighboursAD.json');
            ccNeighbors = $injector.get('ccNeighbors');
        }));
        
        it('Should return the neighbours array of Andorra', function(){
            var andorraNeigbors = [
                {countryCode:'FR', countryName:'France'}, 
                {countryCode:'ES', countryName:'Spain'}
            ];
            expect(ccNeighbors(neighborsADRes)).toEqual(andorraNeigbors);
        });
    });
});