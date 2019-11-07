(function () {
    'use strict';

    angular
        .module('mainjs')
        .factory('mainSrvc', mainSrvc);

    mainSrvc.$inject = [
        '$q', // promises service
        '$timeout', // timeout service
        'moment', // does dates really well
        'authenticateSrvc' // holds the auth token
    ];

    function mainSrvc(
        $q,
        $timeout,
        moment,
        authenticateSrvc
    ) {
        var itemArray = [];
        var itemPath = "/"
        var service = {

        };

        var PAUSE_FOR_A_WHILE_MS = 3000;
        var NUM_DUMMY_EVENTS = 10;
        


        var createEvent = function (name, date, postcode) {

            var result = {
                name: name,
                date: date,
                postcode: postcode
            }
            return result;
        }

        var createDummyEvents = function (numToCreate) {
            var result = [];

            for (var index = 0; index < numToCreate; index++) {

                var name = "event " + index;
                var date = moment().add('years', index).toDate();
                var postcode = "M1 5GD";

                result.push(createEvent("event " + index, date, postcode));
            }
            return result;
        }


        var replaceWithRealCode = function () {
            var deferred = $q.defer();

            $timeout(
                function () {
                    itemArray = createDummyEvents(NUM_DUMMY_EVENTS);
                    deferred.resolve(itemArray);
                },
                PAUSE_FOR_A_WHILE_MS);


            return deferred.promise;
        }

        var promiseToUpdateEvents = function () {
            // returns a promise
            return replaceWithRealCode();
        }

        service.updateEvents = function () {
            return promiseToUpdateEvents();
        }




        // Downloads file contents
        // download_uri : temporary authenticated uri for a file (retrieved from file meta data)  
        function download_contents(download_uri) {
            return new Promise(function (resolve, reject) {
                var download_request = new XMLHttpRequest();
                download_request.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            resolve([this.status, download_request.responseText]);
                        } else {
                            reject([this.status, download_request.responseText]);
                        }
                    }
                }
                download_request.open("GET", download_uri, true);
                download_request.send();
            });
        }

        function download_metadata(token, file_path) {
            return new Promise(function (resolve, reject) {
                var URI = "https://graph.microsoft.com/v1.0/me/drive/root:/" + file_path;

                var metaData_request = new XMLHttpRequest();

                metaData_request.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        if (this.status == 200) {
                            resolve([this.status, metaData_request.responseText]);
                        } else {
                            reject([this.status, metaData_request.responseText]);
                        }
                    }
                };
                metaData_request.open("GET", URI, true);
                metaData_request.setRequestHeader("Authorization", "bearer " + token);
                metaData_request.send();
            });

        }




        function download_folder(token, path) {
            return new Promise(function (resolve, reject) {
                download_metadata(token, path).then(function (result) {
                    var response = JSON.parse(result[1]);
                    return response;
                }).then(function (result) {
                    download_contents(result["@microsoft.graph.downloadUrl"]).then(function (result) {
                        resolve(result);
                    })
                }).catch(function (error) {
                    reject(error);
                })
            });
        }




        service.getItems = function () {
            return angular.copy(itemArray);
        }

        service.update = function (path) {
            var token = null;

            try{
                var authInfo = authenticateSrvc.getAuthInfo();
                token = authInfo.access_token;
            }catch(e){
                // ignore this. Pass null to async function. Allow to fail there.
            }


            return downloadFolder(path, token);
        }

        service.getPath = function(){
            return itemPath;
        }

        return service;

    }


})();