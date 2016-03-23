/* global angular */

angular.module('fileApp', ['appRoutes','appControllers','appDirectives','appServices','ngAnimate','ngMaterial','ngMessages'])
.config(function($mdThemingProvider) {
    /*var icon = $mdThemingProvider.extendPalette('gr', {
        'A100': '80D8FF'
    });
    $mdThemingProvider.definePalette('icon', icon);*/
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('pink')
        .warnPalette('red')
        .backgroundPalette('light-blue');
})
.run(
    function ($rootScope, $state, $log, Modal, UserService) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            var requireLogin = toState.data.requireLogin;
            if (requireLogin && UserService.currentUser === null) {
                $log.info("Inside Login");
                event.preventDefault();
                UserService.checkSession().then(function(hasSession) {
                    console.log("Has Session ?", hasSession);
                    if (hasSession) {
                        if ( UserService.currentUser.isPasswordChanged ) {
                            Modal.openModal("views/change-password.html")
                            .then(function () {
                                return $state.go(toState.name, toParams);
                            });
                        } else {
                            return $state.go(toState.name, toParams);  
                        }
                    }
                    else {
                        Modal.openModal("views/login-modal.html")
                        .then(function () {
                            return $state.go(toState.name, toParams);
                        })
                        .catch(function () {
                            return $state.go('home');
                        });
                    }
                });
            } 
        });
        
    }
)
.filter('escape', function() {
  return window.encodeURIComponent;
});