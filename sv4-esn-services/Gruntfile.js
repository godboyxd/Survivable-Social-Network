module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
          local: {
            options: {
              reporter: 'spec',
                // reporter: 'mocha-junit-reporter',
              //captureFile: 'results.txt', // Optionally capture the reporter output to a file
              quiet: false, // Optionally suppress output to standard out (defaults to false)
              clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
              ui: 'tdd',
              timeout: 30000
            },
            src: ['tests/**/**.js'],
          },

        },
        mocha_istanbul: {
            coverage: {
                src: ['tests/unit_tests/**.js'], // a folder works nicely
                options: {
                    excludes : ['*.js', 'controllers/*'],
                    mochaOptions: ['--reporter', 'mocha-junit-reporter', '--ui', 'tdd', '--timeout', '30000'] // any extra options for mocha
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    // grunt.loadNpmTasks('grunt-mocha'); Client Side testing
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    // Default task(s).
    grunt.registerTask('default', []);

    // Test
    grunt.registerTask('test', ['mochaTest:local']);

    // Coverage
    grunt.registerTask('coverage', ['mocha_istanbul']);


};
