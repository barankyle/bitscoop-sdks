module.exports = function(grunt) {
	grunt.initConfig({
		package: grunt.file.readJSON('package.json'),

		clean: {
			dist: 'dist'
		},

		compress: {
			main: {
				options: {
					archive: 'dist/<%= package.name %>-<%= package.version %>.tar.gz'
				},
				expand: true,
				src: [
					'config/**/*',
					'fixtures/**/*',
					'lib/**/*',
					'migrations/**/*',
					'LICENSE',
					'main.js',
					'package.json'
				],
				dest: '<%= package.name %>'
			}
		},

		jscs: {
			all: {
				options: {
					config: 'jscs.json'
				},
				src: [
					'Gruntfile.js',
					'app.js',
					'lib/**/*.js',
					'migrations/**/*.js',
					'test/**/*.js'
				],
				gruntfile: 'Gruntfile.js'
			}
		},

		jshint: {
			all: {
				options: {
					jshintrc: 'jshint.json',
					reporter: require('jshint-stylish')
				},
				src: [
					'Gruntfile.js',
					'app.js',
					'lib/**/*.js',
					'migrations/**/*.js',
					'test/**/*.js'
				]
			}
		},

		jsonlint: {
			config: {
				src: 'config/**/*.json'
			},
			fixtures: {
				src: 'fixtures/**/*.json'
			},
			jscs: {
				src: 'jscs.json'
			},
			jshint: {
				src: 'jshint.json'
			},
			package: {
				src: 'package.json'
			}
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('build', [
		'jsonlint:package',
		'jsonlint:config',
		'jsonlint:fixtures',
		'clean:dist',
		'lint',
		'compress'
	]);

	grunt.registerTask('cleanbuild', [
		'clean',
		'build'
	]);

	grunt.registerTask('lint', [
		'jsonlint:jshint',
		'jshint',
		'jsonlint:jscs',
		'jscs'
	]);

	grunt.registerTask('default', [
		'build'
	]);
};
