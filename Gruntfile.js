module.exports = function( grunt ) {
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
			all: [ 'classes/**/*.php' ]
		},

		// PHP Code Sniffer
		phpcs: {
			application: {
				dir: [ './' ],
			},
			options: {
				standard: 'project.ruleset.xml',
				extensions: 'php',
				ignore: 'wp-svn,wp-content,deploy,node_modules,vendor'
			}
		},

		// PHPUnit
		phpunit: {
			classes: {},
		},

		// JSHint
		jshint: {
			files: ['Gruntfile.js', 'admin/js/*.js' ],
			options: {
				// options here to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true
				}
			}
		},

		// Check WordPress version
		checkwpversion: {
			options: {
				readme: 'readme.txt',
				plugin: 'pronamic-ideal.php',
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

		// Make POT
		makepot: {
			target: {
				options: {
					cwd: '',
					domainPath: 'languages',
					type: 'wp-plugin',
					exclude: [ 'deploy/.*', 'wp-svn/.*', 'wp-content/.*' ],
				}
			}
		},

		// Shell
		shell: {
			plantuml: {
				command: 'plantuml ./documentation/*.plantuml'
			}
		},

		// Copy
		copy: {
			deploy: {
				src: [
					'**',
					'!composer.lock',
					'!Gruntfile.js',
					'!package.json',
					'!phpunit.xml',
					'!phpunit.xml.dist',
					'!project.ruleset.xml',
					'!readme.md',
					'!build/**',
					'!documentation/**',
					'!node_modules/**',
					'!tests/**',
					'!wp-svn/**',
					'!wp-content/**',
				],
				dest: 'deploy',
				expand: true
			},
		},

		// Clean
		clean: {
			deploy: {
				src: [ 'deploy' ]
			},
		},

		// WordPress deploy
		rt_wp_deploy: {
			app: {
				options: {
					svnUrl: 'http://plugins.svn.wordpress.org/pronamic-ideal/',
					svnDir: 'wp-svn',
					svnUsername: 'pronamic',
					deployDir: 'deploy',
					version: '<%= pkg.version %>',
				}
			}
		},
	} );

	grunt.loadNpmTasks( 'grunt-phplint' );
	grunt.loadNpmTasks( 'grunt-phpcs' );
	grunt.loadNpmTasks( 'grunt-phpunit' );
	grunt.loadNpmTasks( 'grunt-composer' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-checkwpversion' );
	grunt.loadNpmTasks( 'grunt-wp-i18n' );
	grunt.loadNpmTasks( 'grunt-shell' );
	grunt.loadNpmTasks( 'grunt-rt-wp-deploy' );

	// Default task(s).
	grunt.registerTask( 'default', [ 'jshint', 'phplint', 'phpcs', 'phpunit', 'checkwpversion' ] );
	grunt.registerTask( 'plantuml', [ 'shell:plantuml' ] );
	grunt.registerTask( 'pot', [ 'makepot' ] );

	grunt.registerTask( 'deploy', [
		'default',
		'composer:update',
		'composer:dump-autoload:optimize',
		'clean:deploy',
		'copy:deploy'
	] );

	grunt.registerTask( 'wp-deploy', [
		'deploy',
		'rt_wp_deploy'
	] );
};
