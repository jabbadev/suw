/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:suw.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      dist: {
						//{src: ['<banner:meta.banner>','<file_strip_banner:src/wrl.js>','src/head_wrl.js',
						src: ['<banner:meta.banner>','src/suw.js'],
						dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>','<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    lint: {
      //files: ['grunt.js', 'src/**/*.js', 'test/**/*.js'],exclude: ['src/head_wrl.js','src/tail_wrl.js']
      files: [ 'grunt.js', 'src/config.js', 'test/loader.js','src/resource.js' ]
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {},
    connect: {
        suw: {
          port: 8080,
          base: '.'
        }
      }
  });

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min');
  
  grunt.loadNpmTasks('grunt-connect');

};
