'use strict';

module.exports = {
	app: {
		title: 'bvnonesuch',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 80,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/bootstrap-social/bootstrap-social.css',
				'public/lib/font-awesome/css/font-awesome.css',
				'public/lib/ng-table/dist/ng-table.min.css',
				'public/lib/bootstrap-social/bootstrap-social.css',
				'public/lib/textAngular/dist/textAngular.css',
				'public/lib/sweetalert/dist/sweetalert.css',
				'public/lib/angular-notify/dist/angular-notify.css'

			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/ng-table/dist/ng-table.min.js',
				'public/lib/textAngular/dist/textAngular-rangy.min.js',
				'public/lib/textAngular/dist/textAngular-sanitize.min.js',
				'public/lib/textAngular/dist/textAngular.min.js',
				'public/lib/ngSweetAlert/SweetAlert.min.js',
				'public/lib/sweetalert/dist/sweetalert.min.js',
				'public/lib/spin.js/spin.js',
				'public/lib/angular-spinner/angular-spinner.js',
				'public/lib/angular-notify/dist/angular-notify.js',
				'https://cdnjs.cloudflare.com/ajax/libs/ngStorage/0.3.6/ngStorage.min.js',
				'public/lib/angularUtils-disqus/dirDisqus.js',
				"https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.5.1/pixi.min.js"
			]
		},
		css: [
			'public/modules/**/css/*.css',
			'public/modules/style/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/services/services.client.js',
			'public/services/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
