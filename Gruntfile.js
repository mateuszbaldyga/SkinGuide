module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      css: {
        files: 'public/stylesheets/**/*.scss',
        tasks: ['sass', 'autoprefixer']
      }
    },
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
    }
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.registerTask('default',['watch']);
}

//sass': sass --watch stylesheets/main.scss:stylesheets/style.css