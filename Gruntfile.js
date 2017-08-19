module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    //WATCH
    watch: {
      scss: {
        files: 'public/stylesheets/**/*.scss',
        tasks: ['sass', 'autoprefixer']
      },
      js: {
        files: ['public/javascripts/*.js', '!public/javascripts/*.min.js'],
        tasks: ['babel', 'uglify']
        },
      },

    //TASKS
    sass: {
      dist: {
        options:{
          style:'compressed'
        },
        files: {
          'public/stylesheets/style.css' : 'public/stylesheets/main.scss'
        }
      }
    },
    autoprefixer:{
      dist:{
        files:{
          'public/stylesheets/style.css':'public/stylesheets/style.css'
        }
      }
    },
    babel: {
      options: {
        sourceMap: false,
        presets: ['env']
      },
      dist: {
        files: [{
        expand: true,
        src: ['public/javascripts/*.js', '!public/javascripts/*.min.js'],
        dest: '.',
        cwd: '.',
        rename: function (dst, src) {
          return src.replace('.js', '.min.js');
        }
        }]
      }
    },
    uglify: {
      options: {
        // mangle: false,
        // beautify: true,
      },
      my_target: {
        files: [{
        expand: true,
        src: ['public/javascripts/*.min.js'],
        dest: '.',
        cwd: '.',
        // rename: function (dst, src) {
        //   return src.replace('.js', '.min.js');
        // }
        }]
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-babel');
  grunt.registerTask('default',['watch']);
}
