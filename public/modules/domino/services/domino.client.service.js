'use strict';

//Contacts service used to communicate Contacts REST endpoints
angular.module('customers').factory('Domino', ['$resource',
	function($resource) {		
		
		var sortByProperty = function(property){
		    return function (x, y) {
		        return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
		    };
		};
		
		function whatClassIsIt(bal){
			
			var ret = '';
			
			if (bal.Balance <= 0){
				ret = 'red';	
			}
			else{
				
				if(bal.Balance > ((75*bal.HoursPurchased)/100)){
					ret = 'yellow';	
				}
				else if(bal.Balance > ((50*bal.HoursPurchased)/100)){
					ret = 'green';	
				}
				else{
					ret = 'blue';
				}			
			}
			
			return ret;
		};
		
		var service = {};
		
		service.lookup = '';
		service.customers = [];
		service.customer = {};
		service.data = $resource('domino/:db');
		
		// Get customers
		service.getCustomers = function(customer, balance, callback) {
			
			console.log('Retrieving customers.');
						
			service.data.get({
				db: 'icare',  
				lookup: 'customers',
				nam: customer,
				bal: balance
			}).$promise.then(function(data){
				
				var ret;
				
				if(data.Status !== 'Ok'){
					ret = false;					
					service.customers = [];
					console.log('Error retrieving customers.');
				}
				else if(data.Customers.length < 1){
					ret = false;					
					service.customers = [];
					console.log('No customers retrieved.');
				}
				else{	
					ret = true;															
					service.customers = data.Customers.sort(sortByProperty('CompanyName'));
										
					for(var i=0; i<service.customers.length; i++){
						service.customers[i].class = whatClassIsIt(service.customers[i].Balance);
					}
					
					console.log(service.customers.length + ' Customers successfuly retrieved.');
				}
				
				callback();							
				
				return ret;												
			});						
		};
		
		// Select customer
		service.selectCustomer = function(customerId){								 							
			for(var i=0; i<service.customers.length; i++){
				if(customerId === service.customers[i].DocID){
					service.lookup = service.customers[i].CompanyName;
					service.customer = service.customers[i];					
				} 
			}	
		};
		
		// Get credit purchases, work completed, time sheets and statements and notifications
		service.getCustomerData = function(param1, param2, callback){
			
			console.log('Retrieving ' + param1);
						
			var options = {
				db: 'icare',  
				lookup: '',
				nam: service.customer.ProjectName === 'General' || service.customer.ProjectName === '' ? service.customer.CompanyName : service.customer.CompanyName + ' - ' + service.customer.ProjectName,
				dat: param2 === 'All' ? '' : param2
			}
			
			if(param1 === 'customer names'){
				options = {
					db: 'contacts',  
					lookup: 'orgsbyorg',
					nam: param2,
					dat: ''
				}
			}
			else if(param1 === 'credit purchases'){
				options.lookup = 'credpbycust';
			}
			else if(param1 === 'work completed'){
				options.lookup = 'workbycust';
			}
			else if(param1 === 'time sheets'){
				options.lookup = 'timebycust';
			}
			else if(param1 === 'statements'){
				options.lookup = 'statsbycust';
			}
			else if(param1 === 'balancefy'){
				options.lookup = 'balfybycust';
			}
			console.log(options);
			return service.data.get(options).$promise.then(function(data){
				console.log(data);
				var ret;
				
				if(data.Status !== 'Ok'){
					
					if(param1 === 'customer names'){
						service.organisations = [];
					}					
					else if(param1 === 'credit purchases'){
						service.customer.creditpurchases = [];
					}
					else if(param1 === 'work completed'){
						service.customer.workcompleted = [];
					}
					else if(param1 === 'time sheets'){
						service.customer.timesheets = [];
					}
					else if(param1 === 'statements'){
						service.customer.statements = [];
					}
					else if(param1 === 'balancefy'){
						service.customer.balancefy = [];
					}
					
					console.log('Error retrieving ' + param1);
					
					ret = false;					
				}
				else{
										
					if(param1 === 'customer names'){
						service.organisations = data.Organisations;											
						console.log(data.Organisations.length + ' ' + param1 + ' retrieved');
					}					
					else if(param1 === 'credit purchases'){
						service.customer.creditpurchases = data.CreditPurchases;											
						console.log(data.CreditPurchases.length + ' ' + param1 + ' retrieved');
					}
					else if(param1 === 'work completed'){
						service.customer.workcompleted = data.Work;											
						console.log(data.Work.length + ' ' + param1 + ' retrieved');
					}
					else if(param1 === 'time sheets'){
						service.customer.timesheets = data.TimeSheets;											
						console.log(data.TimeSheets.length + ' ' + param1 + ' retrieved');
					}
					else if(param1 === 'statements'){
						service.customer.statements = data.Statements;											
						console.log(data.Statements.length + ' ' + param1 + ' retrieved');
					}
					else if(param1 === 'balancefy'){
						service.customer.balancefy = data.Balance;											
						console.log(data.Balance.length + ' ' + param1 + ' retrieved');
					}
						
					ret = true;    						
				}
				
				callback();	
				
				return ret;			
			});
		};
		
		// Create credit purchases, work completed, time sheets and statements
		service.createCustomerData = function(datatype, data, callback){
			
			console.log('Creating ' + datatype);
			
			var options = {};
			
			if(datatype === 'credit purchase'){
				options = {
					db: 'icare',  
					lookup: 'createcredp',
					id: service.customer.DocID,
					dt: data.date.toDateString(),
					cv: data.creditvalue,
					cp: data.creditprice,
					ehr: data.effectivehourlyrate,
					cin: data.creditinvoicenumber,
					cmt: data.comment
				};
			}
			else if(datatype === 'time sheet'){
				options = {
					db: 'icare',  
					lookup: 'createtime',
					id: service.customer.DocID,
					dt: data.date.toDateString(),
					dt2: data.dateto.toDateString(),
					sub: data.submitors
				};
			}
			else if(datatype === 'statement'){
				options = {
					db: 'icare',  
					lookup: 'createstat',
					id: service.customer.DocID,
					dt: data.date.toDateString(),
					dt2: data.dateto.toDateString(),
					sub: data.submitors
				};
			}
			else if(datatype === 'notification'){
				options = {
					db: 'icare',  
					lookup: 'notification',
					id: service.customer.DocID,
					cc2: data.copyto,
					typ: data.type,
					sbj: data.subject,
					msg: data.message
				};
			}
			
			service.data.get(options).$promise.then(function(data){
				
				var ret;
				
				if(data.Status.toLowerCase() === 'ok'){
					
					console.log('Created ' + datatype);
					
					ret = 1;
				}
				else{
					console.log('Error creating ' + datatype);
					
					ret = 0;
				}
				
				callback(ret);
				
				return ret;
			});
		};
			
		// Test function				
		service.test = function(){
			console.log('this is just a test');
		};
		
		return service;
		//return $resource('domino/:db');		
	}
]);