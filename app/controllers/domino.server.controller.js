'use strict';

/**
 * Module dependencies.
 */
var http = require('http');

function doHttp(options, res){
	
	var host = 'britten1.internal.isw.net.au';
	var path = '/__CA257E05001FCD7D.nsf';
	
	options.host = host;
	options.path = path + options.path;
	
	console.log('host ' + options.host);
	console.log('path ' + options.path);
	
	http.request(options, function(response) {
		var str = '';

	  	//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
			str += chunk;
		});

		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
			res.send(str);
		});
	}).end();		
}

/**
 * List of Organisation names
 */
function getOrgsByOrg(req, res) {
	var options = { 
	  path: encodeURI('/contacts?openagent&lookup=orgs&nam='+req.param('nam'))
	};

	doHttp(options, res); 
}

/**
 * List of Contact names
 */
function getContactsByOrg (req, res) {
	var options = {
	  path: encodeURI('/contacts?openagent&lookup=conts&org='+req.param('nam'))
	};

	doHttp(options, res); 
}

/**
 * Get Customers (with balance)
 */
function getCustomers (req, res) {
	var options = {
	  path: encodeURI('/icare?openagent&lookup=cust&nam='+(typeof req.param('nam') === 'undefined'? '': req.param('nam'))+'&bal=1')
	};

	doHttp(options, res); 
}

/**
 * Balance by Customer name
 */
function getBalanceByCustomer (req, res) {
	var options = {
	  path: encodeURI('/icare?openagent&lookup=bal&nam='+req.param('nam'))
	};

	doHttp(options, res); 
}

/**
 * Balance by Customer name
 */
function getBalanceFYByCustomer (req, res) {
	var options = {
	  path: encodeURI('/icare?openagent&lookup=balfy&nam='+req.param('nam'))
	};

	doHttp(options, res); 
}

/**
 * List of Credit Purchases
 */
function getCreditPurchasesByCustomer(req, res) {
	var options = {
	  path: encodeURI('/icare?openagent&lookup=cred&flat=1&nam='+req.param('nam')+'&dat='+(typeof req.param('dat') === 'undefined'? '': req.param('dat')))
	};

	doHttp(options, res); 
}

/**
 * List of Work Completed
 */
function getWorkCompletedByCustomer(req, res) {
	var options = {
	  path: encodeURI('/icare?openagent&lookup=work&flat=1&nam='+req.param('nam')+'&dat='+(typeof req.param('dat') === 'undefined'? '': req.param('dat')))
	};

	doHttp(options, res); 
}

/**
 * List of Time Sheets
 */
function getTimeSheetsByCustomer(req, res) {
	var options = {
	  path: encodeURI('/icare?openagent&lookup=time&flat=1&nam='+req.param('nam')+'&dat='+(typeof req.param('dat') === 'undefined'? '': req.param('dat')))
	};

	doHttp(options, res); 
}

/**
 * List of Statements
 */
function getStatementsByCustomer(req, res) {
	var options = {
	  path: encodeURI('/icare?openagent&lookup=stat&nam='+req.param('nam')+'&dat='+(typeof req.param('dat') === 'undefined'? '': req.param('dat')))
	};

	doHttp(options, res); 
}

/**
 * Create Credit Purchase
 */
function createCreditPurchase(req, res) {
	var options = {
	  path: encodeURI('/icare?openagent&lookup=createcred&id='+req.query.id+'&dt='+req.query.dt+'&cv='+req.query.cv+'&cp='+req.query.cp+'&ehr='+req.query.ehr+'&cin='+req.query.cin+'&cmt='+req.query.cmt)
	};
	
	doHttp(options, res); 
}	

/**
 * Create Statement
 */
function createStatement(req, res) {
	var options = {
	  path: encodeURI('/icare?openagent&lookup=createstat&id='+req.query.id+'&dt='+req.query.dt+'&dt2='+req.query.dt2+'&sub='+(typeof req.param('sub') === 'undefined'? '': req.param('sub')))
	};
	
	doHttp(options, res); 
}

/**
 * Create Time Sheet
 */
function createTimeSheet(req, res) {
	var options = {
	  path: encodeURI('/icare?openagent&lookup=createtime&id='+req.query.id+'&dt='+req.query.dt+'&dt2='+req.query.dt2+'&sub='+(typeof req.param('sub') === 'undefined'? '': req.param('sub')))
	};
	
	doHttp(options, res); 
}

/**
 * Send Notification
 */
function sendNotification(req, res) {
	var options = {
	  path: encodeURI('/icare?openagent&lookup=notification&id='+req.query.id+'&cc2='+req.query.cc2+'&typ='+req.query.typ+'&sbj='+req.query.sbj+'&msg='+req.query.msg)
	};
	
	doHttp(options, res); 
}

exports.doStuff = function(req, res) {

	var db 		= '';
	var lookup 	= '';
	
	db = req.param('db');
	lookup = req.param('lookup');
	
	console.log('db lookup ' + db + ' ' + lookup);
	
	if(db === 'contacts'){
		if(lookup === 'orgsbyorg') {
			getOrgsByOrg(req, res);
		}	
		else if(lookup === 'contsbyorg') {
			getContactsByOrg(req, res);
		}
		else{
			res.send('invalid url');
		}
	}
	else if(db === 'icare'){
		if(lookup === 'customers'){
			getCustomers(req, res);
		}
		else if(lookup === 'balbycust'){
			getBalanceByCustomer(req, res);
		}
		else if(lookup === 'balfybycust'){
			getBalanceFYByCustomer(req, res);
		}
		else if(lookup === 'statsbycust') {
			getStatementsByCustomer(req, res);
		}
		else if(lookup === 'workbycust'){
			getWorkCompletedByCustomer(req, res);
		}
		else if(lookup === 'timebycust'){
			getTimeSheetsByCustomer(req, res);
		}
		else if(lookup === 'credpbycust'){
			getCreditPurchasesByCustomer(req, res);
		}
		else if(lookup === 'createcredp'){
			createCreditPurchase(req, res);
		}
		else if(lookup === 'createstat'){
			createStatement(req, res);
		}
		else if(lookup === 'createtime'){
			createTimeSheet(req, res);
		}
		else if(lookup === 'notification'){
			sendNotification(req, res);
		}					
		else{
			res.send('invalid url');
		}
	}
	else{
		res.send('invalid url');
	}		
};