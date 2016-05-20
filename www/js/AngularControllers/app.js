(function () {
  var aplicacionMundial = angular.module('aplicacionMundial', ['auth0', 'angular-storage', 'angular-jwt', 'ngRoute', 'ngMap']);

  aplicacionMundial.config(function myAppConfig($routeProvider, authProvider, $httpProvider, $locationProvider,
    jwtInterceptorProvider) {

                 // ...config
 // Configure routes for your application
 $routeProvider
 .when( '/', {
  controller: 'HomeCtrl',
  templateUrl: 'templates/home.html',
  requiresLogin: true
})
 .when( '/login', {
  controller: 'LoginCtrl',
  templateUrl: 'templates/login.html',
  pageTitle: 'Login'
});
   // ...config
   
   authProvider.init({
    domain: 'slinan10.auth0.com',
    clientID: 'EjcsWJPJzOEKHKvK21CdzO3sJU5CiKu5',
    loginUrl: '/login'
  });

//Called when login is successful
authProvider.on('loginSuccess', function($location, profilePromise, idToken, store) {
  console.log("Login Success");
  profilePromise.then(function(profile) {
    store.set('profile', profile);
    store.set('token', idToken);
  });
  $location.path('/');
});

//Called when login fails
authProvider.on('loginFailure', function() {
  console.log("Error logging in");
  $location.path('/login');
});

//Angular HTTP Interceptor function
jwtInterceptorProvider.tokenGetter = function(store) {
  return store.get('token');
}
//Push interceptor function to $httpProvider's interceptors
$httpProvider.interceptors.push('jwtInterceptor');

}).run(function(auth) {
  // This hooks all auth events to check everything as soon as the app starts
  auth.hookEvents();
});

aplicacionMundial.run(function($rootScope, auth, store, jwtHelper, $location) {
  $rootScope.$on('$locationChangeStart', function() {

    var token = store.get('token');
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        if (!auth.isAuthenticated) {
          //Re-authenticate user if token is valid
          auth.authenticate(store.get('profile'), token);
        }
      } else {
        // Either show the login page or use the refresh token to get a new idToken
        $location.path('/');
      }
    }
  });
});

aplicacionMundial.controller( 'LoginCtrl', function ( $scope, auth) {

  $scope.auth = auth;

  $scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    $location.path('/');
  }
});

aplicacionMundial.directive('toolbar', function () {
  return{
    restrict: 'E',
    templateUrl: 'partials/toolbar.html',
    controller: function () {
      this.tab = 0;
      this.selectTab = function (setTab) {
        this.tab = setTab;
      };
      this.isSelected = function (tabParam) {
        return this.tab === tabParam;
      };
    },
    controllerAs: 'toolbar'
  };
});


aplicacionMundial.directive('reportesSensores', function () {
  return{
    restrict: 'E',
    templateUrl: 'partials/reportes-sensores.html',
    controller: 'getReportesSensores'
  };
});

aplicacionMundial.directive('eventosSismicos', function () {
  return{
    restrict: 'E',
    templateUrl: 'partials/eventos-sismicos.html',
    controller: 'getEventosSismicos'
  };
});

aplicacionMundial.directive('boletines', function () {
  return{
    restrict: 'E',
    templateUrl: 'partials/boletines.html',
    controller: 'getBoletines'
  };
});

aplicacionMundial.directive('error', function () {
  return{
    restrict: 'E',
    templateUrl: 'partials/error.html'
  };
});

aplicacionMundial.directive('mapa', function () {
  return{
    restrict: 'E',
    templateUrl: 'partials/mapa.html'
  };
});


aplicacionMundial.controller("getBoletines", function ($http, $scope) {
  $http.get('https://sattg1.herokuapp.com/service/boletines').
  success(function (data, status, headers, config) {
    $scope.boletines = data;
    $scope.bol = data[data.length - 1];

  }).
  error(function (data, status, headers, config) {
                    // log error
                  });
});

aplicacionMundial.controller("getReportesSensores", function ($http, $scope, $rootScope) {
  $http.get('https://sattg1.herokuapp.com/service/reportes').
  success(function (data, status, headers, config) {
    $scope.reportes = data;
                    //alert(JSON.stringify(data));
                  }).
  error(function (data, status, headers, config) {
                    // log error
                  });

  $scope.abrirMapa = function(nReporte){
  $rootScope.lat = nReporte.latitud;
  $rootScope.lon = nReporte.longitud;
  $scope.toolbar.selectTab(4);
};

});

aplicacionMundial.controller("getEventosSismicos", function ($http, $scope) {
  $http.get('https://sattg1.herokuapp.com/service/eventosSismicos').
  success(function (data, status, headers, config) {
    $scope.eventos = data;
  }).
  error(function (data, status, headers, config) {
                    // log error
                  });
});


aplicacionMundial.controller("mapa", function ($http, $scope) {

});




})();



