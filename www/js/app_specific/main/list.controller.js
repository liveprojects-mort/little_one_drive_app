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
            items: [],
            path: ""
        });



        vm.onItemSelected = function (index) {
            var selectedItem = vm.items[index];

            var path = "/";
            if(vm.path.length == 0){
                // root
                path = selectedItem.name;
            }else{
                path = vm.path + "/" + selectedItem.name;
            }
            
            vm.pathUpdate(path);
        }

        vm.noItems = function () {
            var result = true;
            try{
                result = vm.items.length == 0;
            }catch(e){}
            return result;
        }



        vm.pathUpdate = function (path) {

            if (authenticateSrvc.getAuthInfo() == null) {
                alert("Press 'Authenticate'.");
            } else {
                $state.go('update', { path: path });
            }
        }

        vm.authenticate = function () {
            $state.go('authenticate_intro');
        }

        vm.path = mainSrvc.getPath();


        // we 'know' that the downloaded item is an array
        vm.items = mainSrvc.getItem();

    }
})();
