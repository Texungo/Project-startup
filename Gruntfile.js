module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options : {
                sourceMap :true
            },
            defaultScripts: {
                src: ["src/js/**/*.js"],
                dest: "src/scripts/all-scripts.js"
            },
            defaultStyles: {
                src: [
                    "src/sass/base.scss",
                    "src/sass/default.scss"
                ],
                dest: 'src/sass/default-styles.scss'
            },
            homeStyles: {
                src: [
                    "src/sass/base.scss",
                    "src/sass/home.scss",
                    "src/sass/services.scss"
                ],
                dest: 'src/sass/home-styles.scss',
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'src/js/**/*.js',
                '../../Frontend/**/*.json',
            ]
        },
        uglify: {
            options : {
                sourceMap: true,
                sourceMapIncludeSources: true,
                sourceMapIn: '.tmp/main.js.map'
            },
            files : {
                "../frontend/js/all-scripts.min.js": ["<%= concat.defaultScripts.dest %>"]
            }
        },
        sass: {
            dist: {
                options: {
                    sourceMap: true,
                    style: 'compressed'
                },
                files: {
                    "../frontend/css/default-styles.css": "<%= concat.defaultStyles.dest %>",
                    "../frontend/css/home-styles.css": "<%= concat.homeStyles.dest %>"
                }
            }
        },
        watch: {
            concat: {
                tasks: ['concat:homeStyles', 'concat:defaultStyles']
            },
            sass: {
                files: 'src/sass/**/*.scss',
                tasks: ['sass']
            },
            scripts: {
                files: ['src/js/**/*.js'],
                tasks: ['jshint', 'uglify'],
                options: {
                  spawn: false,
                },
            },
            livereload: {
                files: [
                    '../../Frontend/**/*.html',
                    '../../Frontend/**/*.json',
                    '../../../paginas/*.php',
                    'js/**/*.js',
                    'css/*.css',
                    'img/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                options: {
                    livereload: true
                }
            },
            grunt: {
                files: ['Gruntfile.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('dev', ['concat', 'jshint', 'uglify', 'sass']);
    grunt.registerTask('dev-watch', ['concat', 'jshint', 'uglify', 'sass', 'watch']);
};
