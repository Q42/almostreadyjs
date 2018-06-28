module.exports = function(grunt) {

  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({

		uglify : {

		  min : {
		  	options: {
		  		mangle: false
		  	},
				files: [
					{
						src: [
              'readyjs/style.js',
              'readyjs/utils.js',
              'readyjs/$.js',
              'readyjs/keyCodes.js',
              'readyjs/Keys.js',
              'readyjs/ready.js',
              'readyjs/spriteList.js',
              'readyjs/sprite.js',
              'readyjs/mouse.js',
              'readyjs/screen.js',
              'readyjs/level.js',
              //'readyjs/controls.js',
              //'readyjs/viewportmaster.js',
              //'readyjs/inspector.js',
              'readyjs/sound.js',
              'readyjs/storage.js',
              //'readyjs/log.js',
              'readyjs/spriteSheet.js'
						],
						dest: 'demos/readyjs.min.js'
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
  grunt.registerTask('default', ['min']);
};
