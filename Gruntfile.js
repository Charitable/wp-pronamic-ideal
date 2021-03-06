/* jshint node:true */
module.exports = function( grunt ) {
	require( 'load-grunt-tasks' )( grunt );

	// Project configuration.
	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),

		// PHPLint
		phplint: {
			options: {
				phpArgs: {
					'-lf': null
				}
			},
			all: [
				'**/*.php',
				'!bower_components/**',
				'!build/**',
				'!deploy/**',
				'!includes/xmlseclibs/**',
				'!node_modules/**',
				'!vendor/**',
				'!wp-content/**'
			]
		},

		// PHP Code Sniffer
		phpcs: {
			application: {
				src: [
					'**/*.php',
					'!bower_components/**',
					'!build/**',
					'!deploy/**',
					'!includes/xmlseclibs/**',
					'!node_modules/**',
					'!vendor/**',
					'!wp-content/**'
				]
			},
			options: {
				bin: 'vendor/bin/phpcs',
				standard: 'phpcs.ruleset.xml',
				showSniffCodes: true
			}
		},

		// PHPUnit
		phpunit: {
			classes: {}
		},

		// JSHint
		jshint: {
			options: grunt.file.readJSON( '.jshintrc' ),
			grunt: [ 'Gruntfile.js' ],
			plugin: [
				'src/js/*.js'
			]
		},

		// Check WordPress version
		checkwpversion: {
			options: {
				readme: 'readme.txt',
				plugin: 'pronamic-ideal.php'
			},
			check: {
				version1: 'plugin',
				version2: 'readme',
				compare: '=='
			},
			check2: {
				version1: 'plugin',
				version2: '<%= pkg.version %>',
				compare: '=='
			}
		},
		
		// Check textdomain errors
		checktextdomain: {
			options:{
				text_domain: 'pronamic_ideal',
				keywords: [
					'__:1,2d',
					'_e:1,2d',
					'_x:1,2c,3d',
					'esc_html__:1,2d',
					'esc_html_e:1,2d',
					'esc_html_x:1,2c,3d',
					'esc_attr__:1,2d',
					'esc_attr_e:1,2d',
					'esc_attr_x:1,2c,3d',
					'_ex:1,2c,3d',
					'_n:1,2,4d',
					'_nx:1,2,4c,5d',
					'_n_noop:1,2,3d',
					'_nx_noop:1,2,3c,4d'
				]
			},
			files: {
				src:  [
					'**/*.php',
					'!bower_components/**',
					'!build/**',
					'!deploy/**',
					'!node_modules/**',
					'!tests/**',
					'!wp-content/**'
				],
				expand: true
			}
		},

		// Make POT
		makepot: {
			target: {
				options: {
					domainPath: 'languages',
					type: 'wp-plugin',
					updatePoFiles: true,
					updateTimestamp: false,
					exclude: [
						'bower_components/.*',
						'build/.*',
						'deploy/.*',
						'node_modules/.*',
						'wp-content/.*',
						'vendor/wp-cli/.*'
					]
				}
			}
		},

		// Imagemin
		imagemin: {
			build: {
				files: [
					{ // Images
						expand: true,
						cwd: 'src/images/',
						src: ['**/*.{png,jpg,gif,svg,ico}'],
						dest: 'images/'
					}
				]
			}
		},

		// Shell
		shell: {
			// PlantUML
			plantuml: {
				command: 'plantuml ./documentation/*.plantuml'
			},

			// WordPress test environment
			test: {
				command: 'bash tests/setup.sh'
			},

			// Generate readme.txt
			readme_txt: {
				command: 'php src/readme-txt/readme.php > readme.txt'
			},

			// Generate README.md
			readme_md: {
				command: 'php src/readme-md/README.php > README.md'	
			},

			// Generate CHANGELOG.md
			changelog_md: {
				command: 'php src/changelog-md/CHANGELOG.php > CHANGELOG.md'	
			},

			// Composer
			deploy: {
				command: [
					'cd deploy/latest',
					'composer install --no-dev'
				].join( '&&' )
			}
		},

		// Copy
		copy: {
			styles: {
				files: [
					{ // CSS
						expand: true,
						cwd: 'src/css/',
						src: [ '**' ],
						dest: 'css'
					}
				]
			},
			scripts: {
				files: [
					{ // JS
						expand: true,
						cwd: 'src/js/',
						src: [ '**' ],
						dest: 'js'
					}
				]
			},
			assets: {
				files: [
					{ // Flot - http://www.flotcharts.org/
						expand: true,
						cwd: 'bower_components/flot/',
						src: [
							'jquery.flot.js',
							'jquery.flot.time.js',
							'jquery.flot.resize.js'
						],
						dest: 'assets/flot'
					},
					{ // accounting.js - http://openexchangerates.github.io/accounting.js
						expand: true,
						cwd: 'bower_components/accounting.js/',
						src: [
							'accounting.js'
						],
						dest: 'assets/accounting'
					}
				]
			},
			deploy: {
				src: [
					'**',
					'!bower.json',
					'!composer.lock',
					'!Gruntfile.js',
					'!package.json',
					'!phpunit.xml',
					'!phpunit.xml.dist',
					'!phpcs.ruleset.xml',
					'!CHANGELOG.md',
					'!README.md',
					'!bin/**',
					'!bower_components/**',
					'!build/**',
					'!deploy/**',
					'!etc/**',
					'!documentation/**',
					'!node_modules/**',
					'!src/**',
					'!tests/**',
					'!vendor/**',
					'!wp-content/**'
				],
				dest: 'deploy/latest',
				expand: true
			}
		},

		// Composer
		composer : {
			options : {

			},
			some_target: {
            	options : {
                	cwd: 'deploy/latest'
				}
			}
		},

		// Compass
		compass: {
			build: {
				options: {
					sassDir: 'src/sass',
					cssDir: 'src/css'
				}
			}
		},

		// Autoprefixer
		autoprefixer: {
			options: {
		 		browsers: [ 'last 2 version', 'ie 8', 'ie 9' ]
			},
			admin: {
				src: 'src/css/admin.css'
			}
		},

		// CSS min
		cssmin: {
			styles: {
				files: {
					'css/admin.min.css': 'src/css/admin.css',
					'css/admin-about.min.css': 'src/css/admin-about.css',
					'css/admin-tour.min.css': 'src/css/admin-tour.css',
					'css/forms.min.css': 'src/css/forms.css'
				}
			},
			assets: {
				files: {
					
				}
			}
		},

		// Uglify
		uglify: {
			scripts: {
				files: {
					// Accounting
					'assets/accounting/accounting.min.js': 'assets/accounting/accounting.js',
					// Flot
					'assets/flot/jquery.flot.min.js': 'assets/flot/jquery.flot.js',
					'assets/flot/jquery.flot.resize.min.js': 'assets/flot/jquery.flot.resize.js',
					'assets/flot/jquery.flot.time.min.js': 'assets/flot/jquery.flot.time.js',
					// Admin
					'js/admin.min.js': 'src/js/admin.js',
					'js/admin-reports.min.js': 'src/js/admin-reports.js',
					'js/admin-tour.min.js': 'src/js/admin-tour.js'
				}
			},
			assets: {
				files: {
					
				}
			}
		},

		// Clean
		clean: {
			deploy: {
				src: [ 'deploy/latest' ]
			},
			deploy_composer: {
				src: [
					'deploy/latest/vendor/wp-pay*/*/bin/**',
					'deploy/latest/vendor/wp-pay*/*/test/**',
					'deploy/latest/vendor/wp-pay*/*/tests/**',
					'deploy/latest/vendor/wp-pay*/*/.gitignore',
					'deploy/latest/vendor/wp-pay*/*/.travis.yml',
					'deploy/latest/vendor/wp-pay*/*/Gruntfile.js',
					'deploy/latest/vendor/wp-pay*/*/package.json',
					'deploy/latest/vendor/wp-pay*/*/phpcs.ruleset.xml',
					'deploy/latest/vendor/wp-pay*/*/phpmd.ruleset.xml',
					'deploy/latest/vendor/wp-pay*/*/phpunit.xml.dist'
				]
			},
			deploy_wp_content: {
				src: [
					'deploy/latest/wp-content'
				]
			}
		},

		// Compress
		compress: {
			deploy: {
				options: {
					archive: 'deploy/archives/<%= pkg.name %>.<%= pkg.version %>.zip'
				},
				expand: true,
				cwd: 'deploy/latest',
				src: ['**/*'],
				dest: '<%= pkg.name %>/'
			}
		},

		// Git checkout
		gitcheckout: {
			tag: {
				options: {
					branch: 'tags/<%= pkg.version %>'
				}
			},
			develop: {
				options: {
					branch: 'develop'
				}
			}
		},

		// S3
		aws_s3: {
			options: {
				region: 'eu-central-1'
			},
			deploy: {
				options: {
					bucket: 'downloads.pronamic.eu',
					differential: true
				},
				files: [
					{
						expand: true,
						cwd: 'deploy/archives/',
						src: '<%= pkg.name %>.<%= pkg.version %>.zip',
						dest: 'plugins/<%= pkg.name %>/'
					}
				]
			}
		},
		
		// WordPress deploy
		rt_wp_deploy: {
			app: {
				options: {
					svnUrl: 'http://plugins.svn.wordpress.org/<%= pkg.name %>/',
					svnDir: 'deploy/wp-svn',
					svnUsername: 'pronamic',
					deployDir: 'deploy/latest',
					version: '<%= pkg.version %>'
				}
			}
		}
	} );

	// Default task(s).
	grunt.registerTask( 'default', [ 'jshint', 'phplint', 'phpunit', 'checkwpversion' ] );
	grunt.registerTask( 'assets', [ 'compass', 'autoprefixer', 'copy:styles', 'copy:scripts', 'copy:assets' ] );
	grunt.registerTask( 'min', [ 'cssmin:styles', 'uglify:scripts', 'imagemin' ] );
	grunt.registerTask( 'plantuml', [ 'shell:plantuml' ] );
	grunt.registerTask( 'pot', [ 'makepot' ] );
	grunt.registerTask( 'doc', [ 'shell:readme_txt', 'shell:readme_md', 'shell:changelog_md' ] );

	grunt.registerTask( 'deploy', [
		'default',
		'assets',
		'min',
		'doc',
		'clean:deploy',
		'copy:deploy',
		'shell:deploy',
		'clean:deploy_composer',
		'clean:deploy_wp_content',
		'compress:deploy'
	] );

	grunt.registerTask( 'wp-deploy', [
		'gitcheckout:tag',
		'deploy',
		'rt_wp_deploy',
		'gitcheckout:develop'
	] );
	
	grunt.registerTask( 's3-deploy', [
		'gitcheckout:tag',
		'deploy',
		'aws_s3:deploy',
		'gitcheckout:develop'
	] );
};
