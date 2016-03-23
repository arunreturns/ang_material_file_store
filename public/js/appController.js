/* global angular */

angular.module('appControllers', ['ngAnimate','ngMaterial','ngFileUpload'])
/**
 * @ngdoc controller
 * @name appControllers.controller:SignupCtrl
 * @description
 * Controller used for Signup the user
 */
.controller('SignupCtrl',
    function($scope, UserService, $state, UIService, $http, $log, $mdDialog) {
        $scope.newUser = {};
        /**
         * @ngdoc method
         * @name signupUser
         * @methodOf appControllers.SignupCtrl
         * @description
         * Method used for Signup the user
         * Calls UserService.signupUser 
         * @param none
         * @returns none
         */
         
        $http.get("/phoneCountryCode").success(function(phoneNumberList) {
            $scope.phoneNumberList = phoneNumberList;
        }).error(function(err) {
            $log.error(err);
        });
        $scope.showCountrySelectDialog = function() {
            $mdDialog.show({
                controller: 'SignupCtrl',
                templateUrl: 'views/country-select.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            }).then(function(phoneData){
                $scope.setPhoneData(phoneData);
            });
        };
        
        $scope.closeDialog = function(){
            $mdDialog.cancel();
        };
        
        $scope.querySearch = function(query) {
            return query ? $scope.phoneNumberList.filter(function(value){
                var name = angular.lowercase(value.name);
                return name.indexOf(angular.lowercase(query)) !== -1;
            }) : $scope.phoneNumberList;
        };
        
        $scope.setPhoneData = function(item){
            $scope.phoneNumberList.map(function(country){
                if ( country.name === item.name ){
                    if ( $scope.newUser.phoneNo ) {
                        $scope.newUser.phoneNo.code = item.dial_code;
                        $scope.newUser.phoneNo.country = item.name;
                    } else {
                        $scope.newUser.phoneNo = {
                            code: item.dial_code,
                            country: item.name,
                            number: 0
                        };
                    }
                }
            });
        };
        
        $scope.setPhoneNumber = function(item){
            if ( typeof(item) == 'undefined' ) {
                $scope.newUser.phoneNo = {};
                return;    
            }
            
            $mdDialog.hide(item);
        };
        
        $scope.signupUser = function(){
            UIService.showLoader();
            UserService.signupUser($scope.newUser).then(function(){
                UIService.showSuccess('Signed up successfully');
                UIService.stopLoader();
                $state.go('profile');
            }, function(err){
                UIService.showError(err.data);
                UIService.stopLoader();
                $scope.clicked = false;
            });
        };
    }
)

/**
 * @ngdoc controller
 * @name appControllers.controller:LoginCtrl
 * @description
 * Controller used for Maintaining Login related data of the user
 */
.controller('LoginCtrl',
    function($scope, UserService, $log, UIService, Modal, $mdDialog) {
        /**
         * @ngdoc method
         * @name updateUser
         * @methodOf appControllers.LoginCtrl
         * @description
         * Method used for updating the user details
         * Calls UserService.updateUser 
         * @param none
         * @returns none
         */
        $scope.updateUser = function(){
            UIService.showLoader();
            UserService.updateUser($scope.user).then(function(){
                UIService.showSuccess('Profile Updated successfully');
                $scope.userDetails.$setPristine();
                $scope.clicked = false;
                UIService.stopLoader();
            }, function(err){
                UIService.showError(err.data);
                $scope.clicked = false;
                UIService.stopLoader();
            });
        };
        
        $scope.showCountrySelectDialog = function() {
            $mdDialog.show({
                controller: 'SignupCtrl',
                templateUrl: 'views/country-select.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            }).then(function(phoneData){
                if ( typeof(phoneData) !== 'undefined' )
                    $scope.setPhoneData(phoneData);
            });
        };
        
        $scope.setPhoneData = function(item){
            $scope.userDetails.$dirty = true;
            $scope.user.phoneNo.code = item.dial_code;
            $scope.user.phoneNo.country = item.name;
        };
        
        $scope.setPhoneNumber = function(item){
            $mdDialog.hide(item);
        };
        
        $scope.closeDialog = function(){
            $mdDialog.cancel();
        };
        /**
         * @ngdoc method
         * @name changePassword
         * @methodOf appControllers.LoginCtrl
         * @description
         * Method used for changing the password of the user
         * Uses the Modal service to open a change password page
         * @param none
         * @returns none
         */
        $scope.changePassword = function(){
            Modal.openModal('views/change-password.html', 'LoginCtrl')
            .then(function () {
                $log.info("[LoginCtrl] => Modal closed");
            })
            .catch(function () {
                $log.info("[LoginCtrl] => Modal cancelled");
            });
            
        };
        if ( UserService.currentUser) {
            UIService.showLoader();
            UserService.getUserData().success(function(user) {
                $scope.user = user;
                UIService.stopLoader();
            })
            .error(function(err) {
                UIService.stopLoader();
                $log.error("Error" + err);
            });
        }
    }
)

/**
 * @ngdoc controller
 * @name appControllers.controller:ModalCtrl
 * @description
 * Controller used for Maintaining Modal data displayed.
 */
.controller('ModalCtrl',
    function ($scope, $mdDialog, $http, $log, UIService, UserService, Modal, $timeout) {
        $scope.alerts = [];
        $scope.user = UserService;
        $scope.togglePassword = false;
        /**
         * @ngdoc method
         * @name login
         * @methodOf appControllers.ModalCtrl
         * @description
         * Method used for logging in the user
         * @param none
         * @returns none
         */
        $scope.login = function(){
            UIService.showLoader();
            $http.post('/login', {
                userName: $scope.userName,
                password: $scope.password
            })
            .success(function(data){
                $log.info("[ModalCtrl] => Login Succesful");
                $mdDialog.hide(data);
                if (data.isPasswordChanged) {
                    Modal.openModal("views/change-password.html")
                    .then(function() {
                        
                    });
                }
                UIService.showSuccess('Welcome back ' + data.firstName);
                UIService.stopLoader();
            })
            .error(function(err){
                UIService.showError(err);
                UIService.stopLoader();
                $log.error("[ModalCtrl] => Error: " + err);
            });
        };
        /**
         * @ngdoc method
         * @name resetPassword
         * @methodOf appControllers.ModalCtrl
         * @description
         * Method used for resetting the password of the user
         * @param none
         * @returns none
         */
        $scope.resetPassword = function(){
            UIService.showLoader();
            $log.info("[ModalCtrl] => Resetting password");
            UserService.resetPassword($scope.email).success(function(user){
                $mdDialog.hide();
                UIService.showSuccess('Password reset successfully');
                UIService.stopLoader();
            })
            .error(function(err){
                UIService.showError(err);
                UIService.stopLoader();
                $log.error(err);
            });
        };
        
        /**
         * @ngdoc method
         * @name changePassword
         * @methodOf appControllers.ModalCtrl
         * @description
         * Method used for changing the password of the user
         * @param none
         * @returns none
         */
        $scope.changePassword = function(){
            UIService.showLoader();
            UserService.changePassword($scope.oldPassword, $scope.newPassword).success(function(user){
                $mdDialog.hide(user);
                UIService.showSuccess('Password updated successfully ');
                UIService.stopLoader();
            })
            .error(function(err){
                UIService.showError(err);
                $log.error(err);
                UIService.stopLoader();
            });
        };
        
        /**
         * @ngdoc method
         * @name dismissModal
         * @methodOf appControllers.ModalCtrl
         * @description
         * Method used for closing the modal
         * @param none
         * @returns none
         */
        $scope.closeDialog = function(){
            $mdDialog.cancel();
        };
}
)

/**
 * @ngdoc controller
 * @name appControllers.controller:MainCtrl
 * @description
 * Controller used for Maintaining the Whole App status
 */
.controller('MainCtrl', 
    function($scope, UserService, UIService, $mdSidenav, $timeout, $log, $state) {
        $scope.user = UserService;
        $scope.ui = UIService;
        /**
         * @ngdoc method
         * @name logOut
         * @methodOf appControllers.MainCtrl
         * @description
         * Method used for logging out the user
         * @param none
         * @returns none
         */
         
        $scope.menuLinks = [
            { link : '#/upload', icon: 'backup', name: 'Upload Files' },
            { link : '#/view', icon: 'explore', name: 'View Uploaded Files' },
            { link : '#/signup', icon: 'person_add', name: 'Signup' },
            { link : '#/home', icon: 'home', name: 'Home' },
            { link : '#/profile', icon: 'description', name: 'Profile' },
        ];
        $scope.logOut = function(){
            UIService.showLoader();
            UserService.logoutUser();
            UIService.showError('User logged out successfully');
            UIService.stopLoader();
            $state.go('home');
        };
        
        $scope.toggleNav = function(){
            $mdSidenav('left').toggle();
        };
}
)

/**
 * @ngdoc controller
 * @name appControllers.controller:ServerCtrl
 * @description
 * Controller used for Running server commands
 */
.controller('ServerCtrl',
    function($scope, $log, $http) {
        /**
         * @ngdoc method
         * @name runServerCommand
         * @methodOf appControllers.ServerCtrl
         * @description
         * Method used for Running server commands
         * @param none
         * @returns none
         */
        $scope.runServerCommand = function(){
            if ( $scope.serverCmd ) {
                $http.post('/runServerCmd', { "serverCmd" : $scope.serverCmd } )
                .success(function(output){
                    $scope.serverOutput = output;
                })
                .error(function(data){
                    $log.error("Error " + data);
                });
            }
        };
        
        $scope.clearOutput = function(){
            $scope.serverOutput = "";
        };
}
)

/**
 * @ngdoc controller
 * @name appControllers.controller:ViewCtrl
 * @description
 * Controller used for Viewing the file on the server
 */
.controller('ViewCtrl',
    function($scope, $http, $log, UserService, UIService) {
        $scope.filesList = [];
        UIService.showLoader();
        $http.post('/viewFiles', {
            userName : UserService.userName
        }).success(function(files){
            $log.info("[ViewCtrl] => Files retrieved successfully");
            $log.info("[ViewCtrl] => Files List is ");
            $log.info(files);
            if ( files.length !== 0 )
                $scope.filesList = files;
            else 
                $scope.filesList = undefined;
            UIService.stopLoader();
        })
        .error(function(err, data){
            UIService.stopLoader();
            $log.error("[ViewCtrl] => Error", err);
        });

        /**
         * @ngdoc method
         * @name removeFile
         * @methodOf appControllers.ViewCtrl
         * @description
         * Method used for removing a file from the server
         * @param id => Id of the file
         * @returns none
         */
        $scope.removeFile = function(id){
            UIService.showLoader();
            $log.info("[ViewCtrl] => Removing id ", id);
            $http.post("/removeFile", {
                id: id,
                userName : UserService.userName
            }).success(function(files){
                $log.info("[ViewCtrl] => File removed successfully");
                $log.info("[ViewCtrl] => Updated file list");
                $log.info(files);
                $scope.filesList = files;
                UIService.showError('File Removed Successfully');
                UIService.stopLoader();
            });  
        };
        
        /**
         * @ngdoc method
         * @name sendMail
         * @methodOf appControllers.ViewCtrl
         * @description
         * Method used for sending mail messages
         * @param id => Id of the file
         * @returns none
         */
        $scope.sendMail = function(id){
            UIService.showLoader();
            $http.post("/sendMail", {
                id: id,
                userName : UserService.userName
            }).success(function(status){
                $log.info(status);
                UIService.showWarning('Mail Sent successfully to ' + (UserService.currentUser.email));
                UIService.stopLoader();
            }).error(function(err){
                UIService.showError(err.message);
                UIService.stopLoader();
            });
        };
        
        /**
         * @ngdoc method
         * @name sendMessage
         * @methodOf appControllers.ViewCtrl
         * @description
         * Method used for sending SMS messages
         * @param id => Id of the file
         * @returns none
         */
        $scope.sendMessage = function(id){
            UIService.showLoader();
            $http.post("/sendMessage", {
                id: id,
                userName : UserService.userName
            }).success(function(url){
                $log.info(url);
                UIService.showWarning('SMS Sent successfully to ' + 
                    (UserService.currentUser.phoneNo.code + UserService.currentUser.phoneNo.number));
                UIService.stopLoader();
            }).error(function(err){
                $log.info(err);
                UIService.showError(err.message);
                UIService.stopLoader();
            });
        };
    }
)

/**
 * @ngdoc controller
 * @name appControllers.controller:UploadCtrl
 * @description
 * Controller used for Uploading the file onto the server
 */
.controller('UploadCtrl',
    function($scope, Upload, UserService, UIService, $log, $http){
        /**
         * @ngdoc method
         * @name upload
         * @methodOf appControllers.UploadCtrl
         * @description
         * Method used for uploading a file to the server
         * @param file => The file to be uploaded
         * @returns none
         */
        $scope.upload = function (file) {
            $scope.f = file;
            console.log($scope.f);
            if ( !file )
                return;
            $log.info("[UploadCtrl] => User " + UserService.userName + " is uploading");
            file.upload = Upload.upload({
                url: 'uploadFiles',
                data: {file: file, 'userName': UserService.userName}
            });
            
            file.upload.then(function (resp) {
                $log.info('[UploadCtrl] => Success ' + resp.config.data.file.name + 'uploaded');
                $log.info('[UploadCtrl] => Response: ' + resp.data);
                UIService.showSuccess('Uploaded ' + resp.config.data.file.name + ' successfully');
                $scope.f = null;
            }, function (resp) {
                $log.info('[UploadCtrl] => Error status: ' + resp.status);
                if ( resp.status === 403 )
                    UIService.showWarning('Upload Failed. Try using the alternate way');
                $scope.f = null;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total, 10));
                $log.info('[UploadCtrl] => Progress: ' + file.progress + '% ' + evt.config.data.file.name);
            });
        };
        /* global JSZip */
        $scope.uploadSecondary = function(){
            console.log("[UploadCtrl] => Uploading using arbitary method");
            var file = $scope.file;
            if (file) {
                var r = new FileReader();
                r.onload = (function(file) {
                    return function(e) {
                        try {
                            var contents = e.target.result;
                            var zip = new JSZip(contents);
                            var FileList = new Array();
                            $.each(zip.files, function(index, zipEntry) {
                                var FileData = new Object();
                                FileData.filename = zipEntry.name;
                                FileData.filecontents = zipEntry.asText();
                                FileList.push(FileData);
                            });
                            console.log("[UploadCtrl] => Folder Name : [%s] ", $scope.foldername);
                            console.log("[UploadCtrl] => File List is", FileList);
                            
                            sendUploadRequest($scope.foldername, FileList);
                        }
                        catch (e) {
                            console.log("[UploadCtrl] => Error reading " + file.name + " : " + e.message);
                        }
                    };
                })(file);
                r.readAsArrayBuffer(file);
            }
            else {
                console.log("[UploadCtrl] => Failed to load file");
            }
        };
        
        var sendUploadRequest = function(foldername, filelist) {
            UIService.showLoader();
            $http.post('/uploadAlt', {
                    foldername: foldername,
                    filelist: filelist,
                    userName: UserService.userName
                }).success(function(msg) {
                    $log.info("[UploadCtrl] => Files written successfully");
                    $log.info(msg);
                    UIService.stopLoader();
                })
                .error(function(err, data) {
                    UIService.stopLoader();
                    $log.error("[UploadCtrl] => Error", err);
                });
        };
        
        }
);