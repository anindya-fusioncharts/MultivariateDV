var gulp = require('gulp');
var closureCompiler = require('google-closure-compiler').gulp();


gulp.task('default', function() {
	 return gulp.src('./js/*.js', {base: './'})
      .pipe(closureCompiler({
          compilation_level: 'SIMPLE',
          warning_level: 'VERBOSE',
          language_in: 'ECMASCRIPT5',
          language_out: 'ECMASCRIPT5',
          output_wrapper: '(function(){\n%output%\n}).call(this)',
          js_output_file: 'multivariateDV.min.js'
        }))
      .pipe(gulp.dest('./js'));	
});