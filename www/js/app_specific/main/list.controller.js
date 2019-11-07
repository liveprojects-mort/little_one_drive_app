(function () {
    'use strict';

    angular
        .module('mainjs')
        .controller('listCtrl', control);

    control.$inject = [
        '$state',
        'mainSrvc',
        'authenticateSrvc'
        ];
    
    function control(
        $state,
        mainSrvc,
        authenticateSrvc
    ) {

        

        var vm = angular.extend(this, {
            items : [],
            path : ""
         });
        

        
        vm.onItemSelected = function(index){
            console.log("Item : " + index);

            // we're passing parameters into the new state
            // 'selected is an attribute in a parameter object, defined in the module definition
            // I'm going to write the destination controller, so it knows to look for an object with a 'selected' attribute
            $state.go('detail', {selected: index});


        }

        vm.noItems = function(){
            return vm.items.length == 0;
        }

        

        vm.pathUpdate = function(path){

            if(authenticateSrvc.getAuthInfo() == null){
                alert("Press 'Authenticate'.");
            }else{
                $state.go('update',{path:path});
            }
        }

        vm.authenticate = function(){
            $state.go('authenticate_intro');
        }

        vm.path = mainSrvc.getPath();

        vm.items = mainSrvc.getItems();
              
    }
})();
