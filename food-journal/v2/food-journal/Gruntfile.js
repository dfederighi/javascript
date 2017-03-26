// test
module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'include/js/src/**/*.js'],
            options: {
                jshintrc: true,
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            },
            react: {
                src: ['include/js/build/react/**/*.js']
            },
        },
        concat: {
            options: {
                separator: ''
            },
            js: {
                src: ['include/js/src/**/*.js', '<%= jshint.react.src %>'],
                dest: 'include/js/build/<%= pkg.name %>.js'
            },
            css: {
                src: 'include/css/src/**/*.css',
                dest: 'include/css/build/<%= pkg.name %>.css'
            }
        },
        cssmin: {
            css: {
                src: 'include/css/build/<%= pkg.name %>.css',
                dest: 'include/css/build/<%= pkg.name%>.min.css'
            } 
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'include/js/build/<%= pkg.name %>.min.js': 'include/js/build/<%= pkg.name %>.min.js'
                }
            }
        },
        browserify: {
            js: {
                options: {
                    debug: true,
                    transform: [ require('grunt-react').browserify ]
                },
                src: 'include/js/build/<%= pkg.name %>.js',
                dest: 'include/js/build/<%= pkg.name %>.min.js'
            }
        },
        react: {
            files: {
                expand: true,
                cwd: 'include/js/src/',
                src: ['**/*.jsx'],
                dest: 'include/js/build/react/',
                ext: '.js'
            }
        },
        clean: ['include/js/build/*','include/css/build/*'],
        scp: {
            options: {
                host: 'www.federighi.net',
                username: 'serveradmin@federighi.net',
                password: '7amy3Kaiser_'
            },
            your_target: {
                files: [{
                    cwd: 'include/css/build/',
                    src: '**/*',
                    dest: '/home/123153/users/.home/domains/food-journal.federighi.net/html/css/' 
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-jsx');
    grunt.loadNpmTasks('grunt-scp');

    grunt.registerTask('default', [
        'react',
        'jshint:react',
        'jshint',
        'concat:js',
        'concat:css',
        'cssmin:css',
        'uglify'
    ]);     

    grunt.registerTask('js', [
        'react',
        'jshint:react',
        'jshint',
        'concat:js',
        'browserify',
        'uglify'
    ]);

    grunt.registerTask('js-dev', [
        'react',
        'jshint:react',
        'jshint',
        'concat:js',
        'browserify'
    ]);

    grunt.registerTask('css', [
        'concat:css',
        'cssmin:css',
        'scp'
    ]);
};
