'use strict';

// Customers controller
angular.module('customers').controller('ListCustomersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Customers', 'Domino', '$state',   
	function($scope, $stateParams, $location, Authentication, Customers, Domino, $state) {
		
		$scope.message = ''; 
			
		$scope.progress = {
			loadingCustomer : 0,
			retrievingData : 0,
			retrievingBalanceFY : 0,
			processingAction : 0
		};
		
		$scope.customers = Domino.customers;
		$scope.thisLookup = Domino.lookup;
		
		$scope.authentication = Authentication;
								
		// Init Page
		$scope.initPage = function(){
			
		};
		
		// Select customer
		$scope.selectCustomer = function(customerId){
			
			$scope.message = ''; 
			$scope.progress.processingAction = 0;
			 							
			Domino.selectCustomer(customerId);
		};		
							
		// Get customers (with balance)
		$scope.getCustomers = function() {
						
			$scope.progress.loadingCustomer = 1;
			
			Domino.getCustomers($scope.thisLookup, 1, function(){
				
				$scope.progress.loadingCustomer = 0;
				
				if(Domino.customers.length > 0){
					
					Domino.lookup = $scope.thisLookup;	
					$scope.customers = Domino.customers;
					console.log(Domino.customers);
					console.log($scope.customers[0].CompanyName);	
				}
			});
				
			return true;
		};

		// Get organisation (names)
		$scope.getOrganisations = function(val){
			
			// return Domino.getCustomerData('customer names', val, function(){
							
			//  	var orgs = Domino.organisations;
			// 	var orgNames = [' '];
						  				
  			//  	for (var i=0; i<orgs.length; i++){
			//  		orgNames[i] = orgs[i].Org;
			//  	}
													   
			//  	console.log(orgNames); 
			//  	return orgNames;	
			//  });
			 
			 return Domino.data.get({
				db: 'contacts', 
				lookup: 'orgsbyorg',
				nam: val,
			}).$promise.then(function(data){

				var orgs = [];
				var orgNames = ['No customers found.'];
  				
				if(data.Status === 'Ok'){
					orgs = data.Organisations;
  				  				
	  				for (var i = 0; i < orgs.length; i++) {
						orgNames[i] = orgs[i].Org;
					}
				}
				console.log(orgNames);
				return orgNames;	
			});
		};
		
		// Select organisation
		$scope.selectOrganisation = function ($item, $model, $label){
			if($label === 'No customers found.'){
				$scope.thisLookup = '';
			}
			else{
				$scope.getCustomers();
			}		   	
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