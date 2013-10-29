var AnimateDataviz;

;(function(global, document, $, d3){

    "use strict";

    AnimateDataviz = global.AnimateDataviz = global.AnimateDataviz || {};

    AnimateDataviz.graph;

    AnimateDataviz.duration = 1000 * 30;

    AnimateDataviz.pause = 1000 * 10 ;

    AnimateDataviz.stations;
        
    AnimateDataviz.data_acum;

    AnimateDataviz.currentPanel = 'NUMBERS';

    AnimateDataviz.$panels = $('.panel');
    
    AnimateDataviz.$usuarios;
    AnimateDataviz.$recorridos;
    AnimateDataviz.$kms;

    window.odometerOptions = {
          auto: false,
          format: '(.ddd),dd'
        };

    AnimateDataviz.init = function (){

        queue()
          .defer(d3.csv, 'data/estaciones_fecha.csv')
          .defer(d3.csv, 'data/accumRecorBici.csv')
          .defer(d3.csv, 'data/UsuariosXMes.csv')
          .awaitAll(AnimateDataviz.filesLoaded);

    };

    AnimateDataviz.filesLoaded = function(error, results){
        AnimateDataviz.stations = results[0];
        AnimateDataviz.data_acum = results[1];
        AnimateDataviz.usuarios_mes = results[2];
        AnimateDataviz.graph = d3.animate_dataviz('graph-container',AnimateDataviz.stations,AnimateDataviz.data_acum,AnimateDataviz.duration,AnimateDataviz.pause);
        AnimateDataviz.start();
    };

    AnimateDataviz.startOdometers = function(){
        var a = new Odometer({
          el: document.querySelector('#usuarios'),
          value: 0
        });

        var b = new Odometer({
          el: document.querySelector('#recorridos'),
          value: 0
        });

        var c = new Odometer({
          el: document.querySelector('#kms'),
          value: 0
        });
        AnimateDataviz.$usuarios = $('#usuarios');
        AnimateDataviz.$recorridos = $('#recorridos');
        AnimateDataviz.$kms = $('#kms');
    };

    AnimateDataviz.start = function(){
        AnimateDataviz.startOdometers();
        AnimateDataviz.graph.start();
        /*AnimateDataviz.$usuarios.html(85793);
        AnimateDataviz.$recorridos.html(1815274);
        AnimateDataviz.$kms.html(5794413);*/
        AnimateDataviz.updateNumbers();
        setInterval(AnimateDataviz.everyStart,AnimateDataviz.duration+AnimateDataviz.pause);
    };

    AnimateDataviz.updateNumbers = function(){
        var r = AnimateDataviz.duration / AnimateDataviz.data_acum.length;
        var i = 0;
        var intervalID = setInterval(function(){
            if(
                AnimateDataviz.updateRecorridos(i) && 
                AnimateDataviz.updateUsuarios(i)
                ){
                i++;
            } else {
                i = 0;
                clearInterval(intervalID);
            }
        },r);
    };

    AnimateDataviz.updateRecorridos = function(i){
        if(AnimateDataviz.data_acum[i]){
            AnimateDataviz.$recorridos.html(AnimateDataviz.data_acum[i].Acumm);
            return true;
        }
        return false;
    };

    AnimateDataviz.updateUsuarios = function(i){
        if(AnimateDataviz.usuarios_mes[i]){
            AnimateDataviz.$usuarios.html(AnimateDataviz.usuarios_mes[i].usuarios_acum);
            return true;
        }
        return false;
    };

    AnimateDataviz.clearNumbers = function(){
        AnimateDataviz.$usuarios.html(1);
        AnimateDataviz.$recorridos.html(1);
        AnimateDataviz.$kms.html(1);
        AnimateDataviz.$usuarios.html(0);
        AnimateDataviz.$recorridos.html(0);
        AnimateDataviz.$kms.html(0);
    };

    AnimateDataviz.updateMap = function(){
        //TODO
    };

    AnimateDataviz.clearMap = function(){
        //TODO
    };
    
    AnimateDataviz.everyStart = function(){
        AnimateDataviz.switchPanel();
        if($('.panel').not('.panel-hide').is('#map-container')){
            AnimateDataviz.currentPanel = 'MAP';
            AnimateDataviz.clearNumbers();
            AnimateDataviz.updateMap();
        } else {
            AnimateDataviz.currentPanel = 'NUMBERS';
            AnimateDataviz.clearMap();
            AnimateDataviz.updateNumbers();
        }
        AnimateDataviz.graph.start();
    };

    AnimateDataviz.switchPanel = function(){
        AnimateDataviz.$panels.toggleClass('panel-hide');
    };

})(window, document,jQuery, d3);

window.onload = function() {
    AnimateDataviz.init(); 
}