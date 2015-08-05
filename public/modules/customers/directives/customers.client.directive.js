'use strict';

angular.module('customers').directive('thisTable', function ($compile) {
    return {       
        restrict : 'A',
        replace : true,
        template : '<span><label class="control-label"><div ng-transclude></div></label><div id="table-div" style="display: none;"><table class="table table-bordered table-hover nowrap display compact" cellspacing="0" width="100%"></table></div><div id="alert-div" class="alert alert-danger" role="alert" style="display: none;">No records found.</div></span>',
        transclude : true,
        scope: {
            options : '='
        },
        controler : ['$scope', function ($scope) {
            
        }],
        link : function (scope, element, attrs, controller) {
			
			console.log('thisTable directive ' + attrs.id);							
			
			scope.$watch('options.data', handleModelUpdates, true);
        	
			function handleModelUpdates(newData) {
				
                var tbl = angular.element(element).find('#table-div');
                var msg = angular.element(element).find('#alert-div');
                
				if (typeof(scope.options) === 'undefined' || scope.options.data === null) {
					return true;
				}
                else if (scope.options.data.length < 1 ) {                                     
                    
                    tbl.css({'display': 'none'});
                    msg.css({'display': 'block'});  
                    
                    console.log('draw alert');
                }
                else{
                    
                    tbl.css({'display': 'block'});
                    msg.css({'display': 'none'});  
                    
                    console.log('draw table');
                	
                    scope.options.processing = false;
                    scope.options.jQueryUI = false;
                    scope.options.destroy = true;
                    
                    scope.options.responsive = {
                        breakpoints: [
                            { name: 'desktop', width: Infinity },
                            { name: 'tablet',  width: 1024 },
                            { name: 'fablet',  width: 768 },
                            { name: 'phone',   width: 480 }
                        ]
                    };
                    
                    if (scope.options.dom === ''){
                        scope.options.dom = '<"mydatatable"ftipl>';                        
                    }                    
                                    						
    				var dataTable = angular.element(element).find('table').DataTable(scope.options);
                    // dataTable.columns.adjust().draw();                                                         		
                    
                    dataTable.on( 'order.dt search.dt', function () {
                        dataTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
                            cell.innerHTML = i+1;
                        } );
                    } ).columns.adjust().draw();       
                }                
        	}			
        }
    };
}).directive('test', function() {
    return {
        restrict : 'E',
        replace : true,
        template : '<a href="#!" ng-click="$event.preventDefault(); getRecords();" data-toggle="modal" data-target="#iCareModal5"><div ng-transclude></div></a>',						
        transclude : true,
        scope : false,
        controller : function($scope, $element) {
            $scope.getRecords = function () {
                               
                var dt = $element.data('date');
                var data = $scope.$parent.st_options.data;
                
                $scope.$parent.records = [];
                $scope.$parent.thisstatement = {};
                
                for(var i=0; i<data.length; i++){
                    
                    if(data[i].Date === dt){
                        $scope.$parent.records = data[i].Records;
                        $scope.$parent.thisstatement = data[i];
                    } 
                }               
            };
        },
        link: function (scope, element, attrs, controller) {
            
        }
    };
}); 
    
function childRow(d){
	
	var thead = '<thead>'+
					'<tr style="background-color: #d9edf7;">'+
						'<th>Purchased Amount</th>'+
						'<th>Used Amount</th>'+
						'<th>Invoice #</th>'+
					'</tr>'+
                '</thead>';
    
    var tbody = '';

	for (var i=0; i<d.length; i++){

		tbody = tbody + '<tr><td>' + d[i].PurchasedAmount + '</td><td>' + d[i].UsedAmount + '</td><td>' + d[i].Invoice + '</td></tr>';
	}

	return '<table class="pull-right" width="50%">' + thead + tbody + '</table>';
}
