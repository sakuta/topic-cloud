'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // init required configurations for each task.
    grunt.initConfig({

        // Project settings
        config: {
            path: {
                webapp: {
                    root: 'src'
                },
                temp: {
                    root: 'temp'
                },
                build: {
                    root: 'build'
                }
            }
        },

        // From grunt-contrib-clean
        clean: {
            build: [
                '<%= config.path.temp.root %>',
                '<%= config.path.build.root %>'
            ]
        },

        // From grunt-bower-install-simple. Downloads the web dependencies.
        "bower-install-simple": {
            options: {
                color:       true,
                production:  false
            }
        },

        // From grunt-wiredep. Automatically inject Bower components into the HTML file
        wiredep: {
            target: {
                src: '<%= config.path.webapp.root %>/index.html',
                ignorePath: '<%= config.path.webapp.root %>'
            }
        },

        // From grunt-contrib-copy. Copies remaining files to places other tasks can use
        copy: {
            build: {
                files: [
                    {
                        src: '<%= config.path.webapp.root %>/index.html',
                        dest: '<%= config.path.build.root %>/index.html'
                    }
                ]
            }
        },

        // From grunt-contrib-htmlmin. Minifies index.html file.
        htmlmin: {
            prod: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.path.build.root %>',
                        src: ['index.html'],
                        dest: '<%= config.path.build.root %>'
                    }
                ]
            }
        },

        // From grunt-usemin. Reads HTML for usemin blocks to enable smart builds
        useminPrepare: {
            html: '<%= config.path.webapp.root %>/index.html',
            options: {
                staging: '<%= config.path.temp.root %>',
                root: '<%= config.path.webapp.root %>',
                dest: '<%= config.path.build.root %>'
            }
        },

        // From grunt-usemin.
        usemin: {
            html: '<%= config.path.build.root %>/index.html'
        },

        // From grunt-contrib-uglify.
        uglify: {
            options: {
                mangle: false
            }
        },

        /**
         * And for rapid development, we have a watch set up that checks to see if
         * any of the files listed below change, and then to execute the listed
         * tasks when they do. This just saves us from having to type "grunt" into
         * the command-line every time we want to see what we're working on; we can
         * instead just leave "grunt watch" running in a background terminal. Set it
         * and forget it, as Ron Popeil used to tell us.
         *
         * But we don't need the same thing to happen for all the files.
         */
        delta: {


            /**
             * By default, we want the Live Reload to work for all tasks; this is
             * overridden in some tasks (like this file) where browser resources are
             * unaffected. It runs by default on port 35729, which your browser
             * plugin should auto-detect.
             */
            options: {
                livereload: true
            },

            /**
             * When the Gruntfile changes, we just want to lint it. In fact, when
             * your Gruntfile changes, it will automatically be reloaded!
             */
            gruntfile: {
                files: 'Gruntfile.js',
               // tasks: ['jshint:gruntfile'],
                options: {
                    livereload: false
                }
            },

            scripts: {
              files: ['<%= config.path.temp.root %>/js/*.js'],
              tasks: ['build'],
              options: {
                spawn: false,
                livereload: false
              }
            },

            jssrc: {
                files: [
                    '<%= config.path.temp.root %>/js/*.js'
                ],
                tasks: ['concurrent:rebuildjs'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },

            /**
             * When index.html changes, we need to compile it.
             */
            html: {
                files: ['<%= config.path.temp.root %>/*.html %>'],
                tasks: ['build']
            }
        },
        jasmine : {
            src : 'src/**/*.js',
            options: {
                vendor: [
                    'bower_components/jquery/jquery.js'
                ],
                specs: 'specs/*spec.js'
            }
        }
    });

    // Task: Build production version ready for deployment
    grunt.registerTask('build', [
        'clean:build',
        'bower-install-simple',
        'wiredep',
        'useminPrepare',
        'concat:generated',
        'cssmin',
        'uglify',
        'copy:build',
        'usemin',
        'htmlmin'
    ]);
    
    /**
     * In order to make it safe to just compile or copy *only* what was changed,
     * we need to ensure we are starting from a clean, fresh build. So we rename
     * the `watch` task to `delta` (that's why the configuration var above is
     * `delta`) and then add a new task called `watch` that does a clean build
     * before watching for changes.
     */
    grunt.renameTask('watch', 'delta');

    grunt.registerTask('watch', ['delta']);
    
    grunt.registerTask('test', [
        'jasmine'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};