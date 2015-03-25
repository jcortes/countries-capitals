angular.module('ccNav', [])

.controller('NavCtrl', ['$scope', 'ccNavConf', function($scope, ccNavConf){
    $scope.$watch(function(){
        return ccNavConf.get();
    }, function(oldConf, newConf){
        $scope.navConf = oldConf;
    });
}])

.factory('ccNavConf', function(){
    var conf = {isHome:true, isCountries: false};
    function set(configuration){
        conf = configuration;
    }
    function get(){
        return conf;
    }
    return {
        set: set,
        get: get
    };
})