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
        tasks: ['uglify']
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
    uglify: {
      options: {
        // nameCache: 'public/javascripts/.tmp/grunt-uglify-cache.json',
        // mangle: {
        //   toplevel: true,
        // },
      },
      my_target: {
        files: [{
        expand: true,
        src: ['public/javascripts/*.js', '!public/javascripts/*.min.js'],
        dest: 'public',
        cwd: '.',
        rename: function (dst, src) {
          return src.replace('.js', '.min.js');
        }
        }]
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-uglify');//uglify for ES6: npm install git://github.com/gruntjs/grunt-contrib-uglify.git#harmony --save-dev
  grunt.registerTask('default',['watch']);
}