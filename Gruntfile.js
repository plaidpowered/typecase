/*global module,require*/

module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scss: {
                files: ['blocks/*/*.scss'],
                tasks: ['sass', 'concat:editorCSS', 'concat:frontCSS', 'postcss', 'bump'],
                options: {
                    spawn: false,
                    livereload: false
                }
            },
            js: {
                files: ['blocks/*/*.js'],
                tasks: ['run', 'concat:editor', 'concat:front', 'bump'],
                options: {
                    spawn: false,
                    livereload: false
                }
            }
        },
        postcss: {
            options: {
                map: {
                    inline: false
                },
                processors: [
                    require('autoprefixer')({browsers: 'last 2 versions', grid: true}),
                    require('cssnano')({zindex: false, reduceIdents: false})
                ]
            },
            dist: {
                src: '_dist/*.css'
            }
        },
        sass: {
            options: {
                sourceMap: false,
                style: 'expanded'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'blocks',
                    src: ['*/*.scss'],
                    dest: '_build',
                    ext: '.css'
                }]
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: false,
                createTag: false,
                push: false,
                globalReplace: false,
                prereleaseName: false,
                metadata: '',
                regExp: false
            }
        },
        concat: {
            options: {
                separator: '\n',
                sourceMap: true
            },
            editor: {
                src: ['_build/*/*.js'],
                dest: '_dist/typecase-editor.min.js',
            },
            front: {
                src: ['blocks/*/typecase.*.js'],
                dest: '_dist/typecase.js',
            },
            editorCSS: {
                src: ['_build/*/editor.css'],
                dest: '_dist/typecase-editor.min.css',
            },
            frontCSS: {
                src: ['_build/*/style.css'],
                dest: '_dist/typecase-default.min.css',
            }
        },
        uglify: {
            options: {
                compress: true,
                sourceMap: true,           
            },
            dist: {
                files: {
                  '_dist/typecase.min.js': ['_dist/typecase.js']
                }
            }
        },
        run: {
            compile_blocks: {
                args: [
                    'build-blocks'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-cachebuster');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('compile', ['run', 'sass', 'concat', 'uglify', 'postcss', 'bump']);

};
