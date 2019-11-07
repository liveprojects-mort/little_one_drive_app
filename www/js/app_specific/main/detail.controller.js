(function () {
    'use strict';

    angular
        .module('mainjs')
        .controller('detailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'mainSrvc'
        ];
    
    function control(
        $state,
        $stateParams,
        mainSrvc
    ) {
        var vm = angular.extend(this, {
            event : {
                name: "no name",
                date: new Date(),
                postcode : "no location"
            }
         });
        

        vm.done = function(){
            $state.go('list');
        }

        var params = $stateParams;

        vm.event = mainSrvc.getEventAt(params.selected);

        

    }
})();
