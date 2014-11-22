module.exports = function(grunt) {
    'use strict';

    var tasks = {
        dev: ['jshint', 'concat', 'uglify', 'copy', 'sass', 'autoprefixer'],
        devWatch: []
    };

    tasks.devWatch.push.apply(tasks.devWatch, tasks.dev);
    tasks.devWatch.push('watch');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                sourceMap: false
            },
            defaultScripts: {
                src: ['src/js/**/*.js'],
                dest: 'dist/js/all-scripts.js'
            },
            defaultStyles: {
                src: ['src/sass/**/*.scss', '!src/sass/**/_*.scss'],
                dest: 'dist/sass/all-styles.scss'
            }
        },
        jshint: {
            beforeconcat: [
                'Gruntfile.js',
                'src/js/**/*.js',
                '../../Frontend/**/*.json',
            ],
            afterconcat: ['<%= concat.defaultScripts.dest %>']
        },
        uglify: {
            options: {
                sourceMap: false,
            },
            dist: {
                files: {
                    '../frontend/js/all-scripts.min.js': ['<%= concat.defaultScripts.dest %>']
                }
            }
        },
        copy: {
            sass: {
                files: [
                    {
                        flatten: true,
                        expand: true,
                        src: ['src/sass/**/_*.scss'],
                        dest: 'dist/sass/'
                    }
                ]
            }
        },
        sass: {
            dist: {
                options: {
                    sourcemap: 'none',
                    style: 'expanded'
                },
                files: {
                    '../frontend/css/all-styles.css': '<%= concat.defaultStyles.dest %>'
                }
            }
        },
        autoprefixer: {
            dist: {
                expand: true,
                flatten: true,
                src: '../frontend/css/**/*.css',
                dest: '../frontend/css/'
            }
        },
        watch: {
            sass: {
                files: 'src/sass/**/*.scss',
                tasks: ['concat:defaultStyles', 'copy:sass', 'sass', 'autoprefixer']
            },
            scripts: {
                files: ['src/js/**/*.js'],
                tasks: ['jshint', 'concat:defaultScripts', 'uglify'],
                options: {
                  spawn: false,
                },
            },
            livereload: {
                files: [
                    '../../Frontend/**/*.html',
                    '../../Frontend/**/*.json',
                    '../../../paginas/*.php',
                    'img/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                options: {
                    livereload: true
                }
            },
            grunt: {
                files: ['Gruntfile.js'],
                tasks: tasks.dev
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('dev', tasks.dev);
    grunt.registerTask('dev-watch', tasks.devWatch);
};
