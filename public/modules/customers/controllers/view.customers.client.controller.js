'use strict';

// Customers controller

angular.module('customers').controller('ViewCustomersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Customers', 'Domino', '$state',    
	function($scope, $stateParams, $location, Authentication, Customers, Domino, $state) {
		
		angular.element(document).ready(function () {
		    console.log('page loading completed');
		});
		
		$scope.progress = {
			loadingCustomer : 0,
			retrievingData : 0,
			retrievingBalanceFY : 0,
			processingAction : 0
		};
				
		$scope.records = [];
		$scope.thisstatement = {};
																									
		$scope.authentication = Authentication;
				
		// Init Page
		$scope.initPage = function(){			
		};
			
		function drawProgressChart(data){
						
			document.getElementById("progress-chart").innerHTML = "";
			
			Morris.Bar({
				resize: true, 
				hideHover: 'auto',
				grid: true,
				element: 'progress-chart',
			  	data: data,
			  	xkey: 'Period',
			  	ykeys: ['OpeningBalance', 'HoursPurchased', 'HoursUsed', 'ClosingBalance'],
			  	labels: ['Opening Balance', 'Hours Purchased', 'Hours Used', 'Closing Balance'] 
			});
			
			// Morris.Donut({
			//   element: 'donut-example',
			//   data: [
			//     {label: "Download Sales", value: 12},
			//     {label: "In-Store Sales", value: 30},
			//     {label: "Mail-Order Sales", value: 20}
			//   ]
			// });
		}
		
		function setYearRange(){
			var rng = [];
			var val;
			var yr = new Date().getFullYear();
			
			for(var i=0; i<5; i++){
				val = yr - i;
				rng.push(val.toString());
			}
			
			rng.push('All');
			
			return rng;
		}
		
		var yearrange = setYearRange();
		
		$scope.selectyear = yearrange[0];
		$scope.yearrange = yearrange;
		
		// Get records from statement
		$scope.getRecords = function(dt){
			console.log('dt ' + dt);
			for(var i=0; i<$scope.st_options.data.length; i++){
				console.log('date ' + $scope.st_options.data[i].Date);
				if($scope.st_options.data[i].Date === dt){					
					$scope.records = $scope.st_options.data[i].Records;
				}	
			}
		};
		
		// Select the customer (just in case page was refreshed or a page was accessed by a url)
		if(Domino.customers.length === 0){
			$scope.progress.loadingCustomer = 1;
			$scope.progress.retrievingBalanceFY = 1;
			
			Domino.getCustomers($stateParams.customerId, 1, function(){
				$scope.progress.loadingCustomer = 0;	
				Domino.selectCustomer($stateParams.customerId);
				$scope.customer = Domino.customer;
				console.log(Domino.customer);
								
				Domino.getCustomerData('balancefy', '', function(){
					$scope.progress.retrievingBalanceFY = 0;
					console.log(Domino.customer.balancefy);
					$scope.drawProgressChart($scope.selectyear);
				});
			});
		}
		else{
			$scope.progress.loadingCustomer = 0;
			$scope.progress.retrievingBalanceFY = 1;
			
			Domino.selectCustomer($stateParams.customerId);
			$scope.customer = Domino.customer;
			console.log(Domino.customer);
				
			Domino.getCustomerData('balancefy', '', function(){
				$scope.progress.retrievingBalanceFY = 0;
				console.log(Domino.customer.balancefy);
				$scope.drawProgressChart($scope.selectyear);
			});
		}		
		
		// Draw progress chart
		$scope.drawProgressChart = function(param1){
			
			var bal = Domino.customer.balancefy;
			var data = [];
			var j = 0;
			
			if(bal === 'undefined' || bal.length < 1){return true;}
			
			if(param1 === 'All'){
				drawProgressChart(bal);
			}
			else{
				for(var i=0; i<bal.length; i++){
					if(bal[i].Period.indexOf(param1) >= 0){
						data[j] = bal[i];
						j++;
					}
				}				
				drawProgressChart(data);
			}		
		};
					
		// Get credit purchases for current customer
		$scope.getCreditPurchases = function(param1) {	
			
			var table = 'Credit Purchases';
						
			$scope.progress.retrievingData = 1;
			$scope.progress.message = "";
			$scope.datatable = table;
			
			if(param1 === ''){
				if($scope.selectyear === 'undefined'){
			 		$scope.selectyear = yearrange[0];
			 	}
			}
			else{
				$scope.selectyear = param1;
			}			
			
			Domino.getCustomerData(table.toLowerCase(), $scope.selectyear, function(){
			
				$scope.cp_options = {
					'columnDefs': [{
						'targets': [0], 'title': '#', 'data': null, 'defaultContent': '1', 'searchable': false, 'orderable': false, 'className' : 'dt_cp_col0'
					},
					{
						'targets': [1], 'title': 'Purchase Date', 'data': 'Date', 'orderable': true, 'className' : 'dt_cp_col1'
					},
					{
						'targets': [2], 'title': 'Hourly Rate', 'data': 'HourlyRate', 'orderable': true, 'className' : 'dt_cp_col2'
					},
					{
						'targets': [3], 'title': 'Hours Purchased', 'data': 'Hours', 'orderable': true, 'className' : 'dt_cp_col3'
					},
				  	{
						'targets': [4], 'title': 'Invoice', 'data': 'Invoice', 'orderable': true, 'className' : 'dt_cp_col4'
					},
					{
						'targets': [5], 'title': 'Comments', 'data': 'Comments', 'orderable': true, 'className' : 'dt_cp_col5'				    
					}],
					'order': [[ 1, 'desc' ]],
					'dom' : '<"mydatatable"ftip>',
					'pageLength': 50,
					'pagingType': 'full',
					'autoWidth': false,
					'data': Domino.customer.creditpurchases
				};
				
				$scope.progress.retrievingData = 0;
				$scope.progress.message =$scope.selectyear + " " + table;
				
			});
		};

		// Get work completed for current customer
		$scope.getWorkCompleted = function(param1) {
			
			var table = 'Work Completed';
			
			$scope.progress.retrievingData = 1;
			$scope.progress.message = "";
			$scope.datatable = table;
			
			if(param1 === ''){
				if($scope.selectyear === 'undefined'){
			 		$scope.selectyear = yearrange[0];
			 	}
			}
			else{
				$scope.selectyear = param1;
			}
				
			Domino.getCustomerData(table.toLowerCase(), $scope.selectyear, function(){
				
				$scope.wc_options = {
					'columnDefs': [{
					    'targets': [0], 'title': '#', 'data': null, 'defaultContent': '1', 'searchable': false, 'orderable': false, 'className' : 'dt_wc_col0'
				  	},
					{
						'targets': [1], 'title': 'Date', 'data': 'Date', 'orderable': true, 'className' : 'dt_wc_col1'
					},
					{
						'targets': [2], 'title': 'Developer', 'data': 'Developer', 'orderable': true, 'className' : 'dt_wc_col2'
					},
					{
						'targets': [3], 'title': 'Hours', 'data': 'Hours', 'orderable': true, 'className' : 'dt_wc_col3'
					},
					{
						'targets': [4], 'title': 'Description', 'data': 'Description', 'orderable': true, 'className' : 'dt_wc_col4'
					}],
					'order': [[ 1, 'desc' ]],
					'dom' : '<"mydatatable"ftip>',
					'pageLength': 25,
					'pagingType': 'full',
					'autoWidth': false,
					'data': Domino.customer.workcompleted
				};
				
				$scope.progress.retrievingData = 0;
				$scope.progress.message =$scope.selectyear + " " + table;
				
			});
		};

		// Get time sheets for current customer
		$scope.getTimeSheets = function(param1) {
			
			var table = 'Time Sheets';
			
			$scope.progress.retrievingData = 1;
			$scope.progress.message = "";
			$scope.datatable = table;

			if(param1 === ''){
				if($scope.selectyear === 'undefined'){
			 		$scope.selectyear = yearrange[0];
			 	}
			}
			else{
				$scope.selectyear = param1;
			}
							
			Domino.getCustomerData(table.toLowerCase(), $scope.selectyear, function(){
				
				$scope.ts_options = {
					'columnDefs': [{
					    'targets': [0], 'title': '#', 'data': null, 'defaultContent': '1', 'searchable': false, 'orderable': false, 'className' : 'dt_ts_col0'
					},
					{
						'targets': [1], 'title': 'Date', 'data': 'Date', 'orderable': true, 'className' : 'dt_ts_col1'
					},
					{
						'targets': [2], 'title': 'Start', 'data': 'Start', 'orderable': true, 'className' : 'dt_ts_col2'
					},
					{
						'targets': [3], 'title': 'Finish', 'data': 'Finish', 'orderable': true, 'className' : 'dt_ts_col3'
					},
					{
						'targets': [4], 'title': 'NC', 'data': 'NC', 'orderable': true, 'className' : 'dt_ts_col4'
					},				  
					{
						'targets': [5], 'title': 'Total', 'data': 'Total', 'orderable': true, 'className' : 'dt_ts_col5'
					},				  
					{
						'targets': [6], 'title': 'Who', 'data': 'Who', 'orderable': true, 'className' : 'dt_ts_col6'
					},
					{
						'targets': [7], 'title': 'Description', 'data': 'Description', 'orderable': true, 'className' : 'dt_ts_col7'				    
					}],
					'order': [[ 1, 'desc' ]],
					'dom' : '<"mydatatable"ftip>',
					'pageLength': 25,
					'pagingType': 'full',
					'autoWidth': false,
					'data': Domino.customer.timesheets
				};
				
				$scope.progress.retrievingData = 0;		
				$scope.progress.message =$scope.selectyear + " " + table;
						
			});
		};

		// Get statements for current customer
		$scope.getStatements = function(param1) {
	
			var table = 'Statements';
			
			$scope.progress.retrievingData = 1;
			$scope.progress.message = "";
			$scope.datatable = table;
			
			if(param1 === ''){
				if($scope.selectyear === 'undefined'){
			 		$scope.selectyear = yearrange[0];
			 	}
			}
			else{
				$scope.selectyear = param1;
			}			
						
			Domino.getCustomerData(table.toLowerCase(), $scope.selectyear, function(){
				
				$scope.st_options = {
					'columnDefs': [{
						'targets': [0], 'title': '#', 'data': null, 'defaultContent': '1', 'searchable': false, 'orderable': false, 'className' : 'dt_st_col0'
					},
					{
						'targets': [1], 'title': 'Start Date', 'data': 'StartDate', 'orderable': true, 'className' : 'dt_st_col1'
					},
					{
						'targets': [2], 'title': 'End Date', 'data': 'EndDate', 'orderable': true, 'className' : 'dt_st_col2'
					},
					{
						'targets': [3], 'title': 'Start Amount', 'data': 'StartAmount', 'orderable': true, 'className' : 'dt_st_col3'
					},
					{
						'targets': [4], 'title': 'Purchased Amount', 'data': null, 'orderable': true, 'className' : 'dt_st_col4',
						'render' : function(data, type, full, meta){ 										
							var ret;
							
							if(data.Records.length > 0 ){
								ret = '<test data-date="'+data.Date+'">'+data.PurchasedAmount+'</test>';
							}
							else{
								ret = '<span>'+data.PurchasedAmount+'</span>';
							}
							
							return ret;											
						}
					},				  
					{
						'targets': [5], 'title': 'Used Amount', 'data': 'UsedAmount', 'orderable': true, 'className' : 'dt_st_col5'
					},				  
					{
						'targets': [6], 'title': 'End Amount', 'data': 'EndAmount', 'orderable': true, 'className' : 'dt_st_col6'				    
					}],
					'order': [[ 1, 'desc' ]],
					'dom' : '<"mydatatable"ftip>',
					'pageLength': 25,
					'pagingType': 'full',
					'autoWidth': false,
					'data': Domino.customer.statements
				};

				$scope.progress.retrievingData = 0;	
				$scope.progress.message =$scope.selectyear + " " + table;
							
			});
		};
				
		// Create Credit Purchase for this Customer		
		$scope.cp = {
			'date' : '',
			'creditvalue' : '',
			'creditprice' : '',
			'effectivehourlyrate' : '',
			'creditinvoicenumber' : '',
			'comment' : ''
		};
		
		$scope.createCreditPurchase = function() {
			
			$scope.progress.processingAction = 1;
			
			Domino.createCustomerData('credit purchase', $scope.cp, function(ret){
				
				if(ret === 0){
					$scope.progress.processingAction = -1;
					$scope.message = 'Error creating credit purchase.';
				}
				else{
					$scope.progress.processingAction = 2;
					$scope.message = 'Credit purchase successfuly created.';	
					
					$scope.cp = {
						'date' : '',
						'creditvalue' : '',
						'creditprice' : '',
						'effectivehourlyrate' : '',
						'creditinvoicenumber' : '',
						'comment' : ''
					};	
				}
			});
				
			return true;				
		};
		
		// Create Time Sheet for this Customer
		$scope.ts = {
			'date' : '',
			'dateto' : '',
			'submitors' : ''
		};
		
		$scope.createTimeSheet = function() {

			$scope.progress.processingAction = 1;
			
			Domino.createCustomerData('time sheet', $scope.ts, function(ret){
				
				if(ret === 0){
					$scope.progress.processingAction = -1;
					$scope.message = 'Error creating time sheet.';
				}
				else{
					$scope.progress.processingAction = 2;
					$scope.message = 'Time sheet successfuly created.';	
					
					$scope.ts = {
						'date' : '',
						'dateto' : '',
						'submitors' : ''
					};	
				}
			});	
			
			return true;				
		};
		
		// Create Statement for this Customer
		$scope.st = {
			'date' : '',
			'dateto' : '',
			'submitors' : ''
		};
		
		$scope.createStatement = function() {
						
			$scope.progress.processingAction = 1;
			
			Domino.createCustomerData('statement', $scope.st, function(ret){
				
				if(ret === 0){
					$scope.progress.processingAction = -1;
					$scope.message = 'Error creating statement.';
				}
				else{
					$scope.progress.processingAction = 2;
					$scope.message = 'Statement successfuly created.';	
					
					$scope.st = {
						'date' : '',
						'dateto' : '',
						'submitors' : ''
					};	
				}
			});
						
			return true;				
		};

		// Send notification to selected customer
		$scope.sn = {
			'copyto' : '',
			'type' : '0',
			'subject' : '',
			'message' : ''
		};
		
		$scope.sendNotification = function(){
			
			$scope.progress.processingAction = 1;
			
			Domino.createCustomerData('notification', $scope.sn, function(ret){
				
				if(ret === 0){
					$scope.progress.processingAction = -1;
					$scope.message = 'Error creating notification.';
				}
				else{
					$scope.progress.processingAction = 2;
					$scope.message = 'Notification successfuly created.';	
					
					$scope.sn = {
						'copyto' : '',
						'type' : '0',
						'subject' : '',
						'message' : ''
					};	
				}
			});
			
			return true;
		};									
	}
]);