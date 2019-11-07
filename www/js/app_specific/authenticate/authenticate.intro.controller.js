(function () {
    'use strict';

    angular
        .module('authenticatejs')
        .controller('authenticateIntroCtrl', control);

    control.$inject = [
        '$state',
        'authenticateSrvc'
        ];
    
    function control(
        $state,
        authenticateSrvc

    ) {
        var vm = angular.extend(this, {

         });
        
        
         function update(){
            vm.authInfo = authenticateSrvc.getAuthInfo();
            vm.isLoggedIn = !(vm.authInfo == null);
         }

        vm.login = function(){
          authenticateSrvc.authenticate().then(
              update,
              update
          );
        }      
        
        vm.goBack = function(){
            $state.go('list');
        }

        update();


    }
})();
