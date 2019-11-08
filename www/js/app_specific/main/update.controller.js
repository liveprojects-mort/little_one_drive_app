(function () {
    'use strict';

    angular
        .module('mainjs')
        .controller('updateCtrl', control);

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
        
      var path = $stateParams.path;

        // TODO: Error Handling
        mainSrvc.update(path)
        .then(
            function(){
            $state.go('list');
        })
        .catch(
            function(error){
                alert("Sorry, we couldn't reach that path!")
                $state.go('list');
            }
        );    
    }
})();
