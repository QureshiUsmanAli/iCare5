'use strict';

// Customers controller
angular.module('customers').controller('CustomersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Customers', 'Domino', '$state',  
	function($scope, $stateParams, $location, Authentication, Customers, Domino, $state) {
		
		$scope.authentication = Authentication;
				
		$scope.getOrgs = function(val){
			
			// return Domino.getCustomerData('customer names', $scope.companyname, function(){
							
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

				if(data.Status !== 'Ok'){
					return [' '];
				}
				
  				var orgs = data.Organisations;
  				var orgNames = [' '];
  				  				
  				for (var i = 0; i < orgs.length; i++) {
					orgNames[i] = orgs[i].Org;
				}
				
				console.log(orgNames[i]);
				return orgNames;	
			});
  		};

  		$scope.onSelectOrg = function ($item, $model, $label) {
		    $scope.$item = $item;
		    $scope.$model = $model;
		    $scope.$label = $label;

		    $scope.companyname = $label;
		    console.log('onSelectOrgName' , $scope.companyname);
		};

		$scope.getContacts = function(val){
			
			return Domino.data.get({
				db: 'contacts',  
				lookup: 'contsbyorg',
				nam: $scope.companyname,
			}).$promise.then(function(data){

				if(data.Status === 'Error'){
					return [' '];
				}

				var k = 0;
  				var locations;
  				var contacts;
  				var contNames = [];

  				locations = data.Locations;

  				$scope.locations = locations;

  				for (var i = 0; i < locations.length; i++) {
  					console.log('accountexec ' + locations[i]['Account Executive']);
  					contacts = locations[i].Contacts;
  					
  					for (var j = 0; j < contacts.length; j++) {
  						contNames[k] = contacts[j].FirstName + ' ' + contacts[j].LastName + ' | ' + locations[i].Location;
  						console.log(contNames[k]);
  						k++;					  				    		
  					}						
				}
				return contNames.sort();	
			});
		};

		$scope.onSelectContact = function ($item, $model, $label) {
		    $scope.$item = $item;
		    $scope.$model = $model;
		    $scope.$label = $label;

		    $scope.contactname = $label.substring(0, $label.lastIndexOf('|')).trim();

		    var locations;
		    var contacts;

		    locations = $scope.locations;

		    for (var i = 0; i < locations.length; i++) {

		    	contacts = locations[i].Contacts;

		    	for (var j = 0; j < contacts.length; j++) {

		    		if(contacts[j].FirstName + ' ' + contacts[j].LastName === $scope.contactname){
		    			$scope.customerlocation = locations[i].Location;
		    			$scope.accountexec = locations[i].AccountExecutive;
		    		}
		    	}	
		    }	

		    console.log('onSelectContact' , $scope.contactname);
			console.log('onSelectContact' , $scope.customerlocation);
			console.log('onSelectContact' , $scope.accountexec);
		};
	
		// Create new Customer
		$scope.create = function() {
			// Create new Customer object
			var customer = new Customers ({
				companyname: this.companyname,
				customerlocation: this.customerlocation,
				contactname: this.contactname,
				accountexec: this.accountexec,
				projectname: this.projectname,
				statementline2opt: this.statementline2opt,
				statementline2: this.statementline2,
				additionalinfo: this.additionalinfo
			});
			
			if(this.statementline2opt ==='2' && (typeof(this.statementline2) === 'undefined' || this.statementline2 === '')){
				$scope.error = 'Please fill Statement heading line 2';
				return true;
			}
	
			// Redirect after save
			customer.$save(function(response) {
				$location.path('customers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Customer
		$scope.remove = function(customer) {
			if ( customer ) { 
				customer.$remove();

				for (var i in $scope.customers) {
					if ($scope.customers [i] === customer) {
						$scope.customers.splice(i, 1);
					}
				}
			} else {
				$scope.customer.$remove(function() {
					$location.path('customers');
				});
			}
		};

		// Update existing Customer
		$scope.update = function() {
			var customer = $scope.customer;

			customer.$update(function() {
				$location.path('customers/' + customer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Customers
		$scope.find = function() {
			$scope.customers = Customers.query();	
			console.log($scope.customers);		
		};

		// Find existing Customer
		$scope.findOne = function() {
			$scope.customer = Customers.get({ 
				customerId: $stateParams.customerId
			}, function (){
				if($scope.customer.statementline2opt === '2'){
					$scope.statementline2show = '1';
				}
				else {
					$scope.statementline2show = '0';			
				}	
			});			
		};		
	}
]);