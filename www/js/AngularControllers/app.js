(function(){var aplicacionMundial= angular.module('aplicacionMundial',[]);
   

    aplicacionMundial.directive('toolbar', function(){
        return{
            restrict:'E',
            templateUrl: 'partials/toolbar.html',
            controller:function(){
                this.tab=0;
                this.selectTab=function(setTab){
                    this.tab=setTab;
                };
                this.isSelected=function(tabParam){
                    return this.tab===tabParam;
                };
            },
            controllerAs:'toolbar'
        };
    });
    
    
     aplicacionMundial.directive('reportesSensores', function(){
        return{
            restrict:'E',
            templateUrl:'partials/reportes-sensores.html',
            controller: 'getReportesSensores'
        };
    });
    
         aplicacionMundial.directive('eventosSismicos', function(){
        return{
            restrict:'E',
            templateUrl:'partials/eventos-sismicos.html',
            controller: 'getEventosSismicos'
        };
    });
    
             aplicacionMundial.directive('boletines', function(){
        return{
            restrict:'E',
            templateUrl:'partials/boletines.html',
            controller: 'getBoletines'
        };
    });
    
          aplicacionMundial.controller("getBoletines", function($http, $scope) {
    $http.get('http://localhost/service/boletines').
      success(function(data, status, headers, config) {
        $scope.boletines = data;
        $scope.bol = data[data.length - 1];

      }).
      error(function(data, status, headers, config) {
        // log error
      });
    });
    
      aplicacionMundial.controller("getReportesSensores", function($http, $scope) {
    $http.get('http://localhost/service/reportes').
      success(function(data, status, headers, config) {
        $scope.reportes = data;
        //alert(JSON.stringify(data));
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    });
    
          aplicacionMundial.controller("getEventosSismicos", function($http, $scope) {
    $http.get('http://localhost/service/eventosSismicos').
      success(function(data, status, headers, config) {
        $scope.eventos = data;
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    });
    
    aplicacionMundial.directive('currentCompetitor', function(){
        return{
            templateUrl:'partials/current-competitor.html',
            controller: 'competitorCtrl'
            
        };
        
        
        
    });
    
     
})();


    
    