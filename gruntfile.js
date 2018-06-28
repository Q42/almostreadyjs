module.exports = function(grunt) {

  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  var files = [
    'readyjs/style.js',
    'readyjs/game.js',
    'readyjs/utils.js',
    'readyjs/$.js',
    'readyjs/keyCodes.js',
    'readyjs/Keys.js',
    'readyjs/ready.js',
    'readyjs/spriteList.js',
    'readyjs/sprite.js',
    'readyjs/screen.js',
    'readyjs/mouse.js',
    'readyjs/level.js',
    //'readyjs/controls.js',
    //'readyjs/viewportmaster.js',
    //'readyjs/inspector.js',
    'readyjs/sound.js',
    'readyjs/storage.js',
    //'readyjs/log.js',
    'readyjs/spriteSheet.js'
  ];

  grunt.initConfig({

    concat: {
      options: {
        separator: '\n\n// NEXT FILE\n\n',
      },
      dist: {
        src: files,
        dest: 'ready.dev.js',
      },
    },

		uglify : {

		  min : {
		  	options: {
		  		mangle: false
		  	},
				files: [
					{
						src: files,
						dest: 'ready.js'
					}
				]
			}

    },
    
    watch: {
      js: {
        files: ['readyjs/*.js'],
        tasks: ['min']
      }
    }
  });

  grunt.registerTask('min', ['uglify:min']);
  grunt.registerTask('default', ['min', 'concat']);
};
