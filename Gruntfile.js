module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        buildPath: 'public',
        pkg: grunt.file.readJSON('package.json'),

        ts: {
            default: {
                src: ["src/script/**/**/*.ts", "!node_modules/**"],
                dest: "src/script/script.js"
            }
        },

        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'src/style/style.css': 'src/style/style.scss'
                }
            }
        },
        watch: {
            sass: {
                files: ['**/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false,
                },
            },
            ts: {
                files: ['**/*.ts', '**/**/*.ts', '**/**/**/*.ts', '**/**/**/**/*.ts'],
                tasks: ['ts'],
                options: {
                    spawn: false,
                },
            },
            handlebars: {
                files: ['src/script/**/*.hbs'],
                tasks: ['handlebars'],
                options: {
                    spawn: false,
                },
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: function(filename) {
                        //var s  = filename.substring(filename.lastIndexOf('/'), )

                        //var names = filename.replace(/src\/script\/templates\/(.*)\.hbs/, '$1');
                        //return names.split('/').join('.');
                        return "app.templates";
                    },
                    processName: function(filename) { // input: templates/_header.hbs
                        console.log(filename);
                        return filename.replace(/src\/script\/templates\/(.*)\.hbs/, '$1')
                            //var pieces = filePath.split('/');
                            // return pieces[pieces.length - 1];       // output: _header.hbs
                    }
                },
                files: {
                    'src/script/template.js': ['src/script/**/*.hbs']
                }
            }
        },
        htmlbuild: {
            dist: {
                src: 'src/*.html',
                dest: 'public/',
                options: {
                    beautify: true,
                    prefix: '//some-cdn',
                    relative: true,
                    scripts: {
                        bundle: [
                            'public/scripts/*.js',
                            '!**/main.js',
                        ],
                        main: '<%= buildPath %>/scripts/main.js'
                    },
                    styles: {
                        bundle: [
                            '<%= buildPath %>/css/libs.css',
                            '<%= buildPath %>/css/dev.css'
                        ],
                        test: '<%= buildPath %>/css/inline.css'
                    },
                    sections: {
                        views: '<%= buildPath %>/views/**/*.html',
                        templates: '<%= buildPath %>/templates/**/*.html',
                        layout: {
                            header: '<%= buildPath %>/layout/header.html',
                            footer: '<%= buildPath %>/layout/footer.html'
                        }
                    },
                    data: {
                        // Data to pass to templates
                        version: "0.1.0",
                        title: "test",
                    },
                }
            }
        },
        copy: {
            html:{
                files: [{
                        //cwd: "src/",
                        expand: true,
                        flatten:true,
                        src: ['src/*.html'],
                        dest: 'public',
                        filter: 'isFile'
                    },
                ]
            },
            images: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: "src/images/",
                        src: ['**'],
                        dest: '<%= buildPath %>/images/',
                        filter: 'isFile'
                    },

                    // includes files within path and its sub-directories
                    //{expand: true, src: ['path/**'], dest: 'dest/'},

                    // makes all src relative to cwd
                    //{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

                    // flattens results to a single level
                    //{expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
                ],
            },
        },
        concat: {
            generated: {
                files: [{
                        dest: '.tmp/script/vendor.js',
                        src: ['src/script/*.js']
                    },
                    {
                        dest: '.tmp/script/vendor.js',
                        src: ['src/external/*.js']
                     },{
                            dest: '.tmp/css/site.css',
                            src: ['src/style/*.css']
                     },
                     {
                            dest: '.tmp/css/vendor.css',
                            src: ['src/external/*.css']
                     }
                ]
            }
        },

        uglify: {
            generated: {
                files: [{
                    dest: 'public/script/app.js',
                    src: ['.tmp/script/app.js']
                },
                {
                    dest: 'public/script/vendor.js',
                    src: ['.tmp/script/vendor.js']
                }]
            }
        },

        cssmin: {
            generated: {
                files: [{
                    dest: 'public/styles/site.min.css',
                    src: ['.tmp/css/site.css']
                },
                {
                    dest: 'public/styles/vendor.min.css',
                    src: ['.tmp/css/vendor.css']
                }]
            }
        },
        useminPrepare: {
	      html: 'public/index.html',
	      options: {
	        dest: 'dist'
	      }
	  },
      usemin: {
        html: 'public/index.html',
     },
    });
    /*grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-html-build');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-sass');
    */
    grunt.registerTask('build', [
        'copy:html',
        'copy:images',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
       // 'filerev',
        'usemin'
    ]);

    grunt.registerTask('default', ['ts', 'sass', 'handlebars', 'watch']);
};