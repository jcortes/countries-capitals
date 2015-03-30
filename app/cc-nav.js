angular.module('ccNav', [])

.value('ccNavData', {
    current: null
})

.controller('NavCtrl', ['$scope', 'ccNavData', function($scope, ccNavData){
    $scope.nav = ccNavData;
}])