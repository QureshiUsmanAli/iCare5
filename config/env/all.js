'use strict';

module.exports = {
	app: {
		title: 'iCare',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				
				'public/lib/angular-ui-select/dist/select.css',
				
				'public/lib/toastr/toastr.min.css',
								
				'public/lib/morrisjs/morris.css',
												
				'public/lib/datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.css',
				'public/lib/datatables-responsive/css/dataTables.responsive.css',
								
				'public/lib/font-awesome/css/font-awesome.min.css',	
							
				'public/lib/dist/css/sb-admin-2.css',
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				
				'public/lib/bootstrap/dist/js/bootstrap.min.js',
				
				'public/lib/angular-ui-select/dist/select.js',
													
				'public/lib/toastr/toastr.min.js',
				
				'public/lib/raphael/raphael-min.js',
			    'public/lib/morrisjs/morris.min.js',
	
				'public/lib/angular-morris-chart/src/angular-morris-chart.min.js',
				
				'public/lib/datatables/media/js/jquery.dataTables.min.js',
				'public/lib/datatables-plugins/integration/bootstrap/3/dataTables.bootstrap.min.js',
				'public/lib/datatables-responsive/js/dataTables.responsive.js',
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};