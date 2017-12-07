'use strict';

module.exports = function(grunt) {
  var path = require('path');

  grunt.registerMultiTask('init_repo', 'Initialize a git repository in a directory.', function () {
    var dest = this.files[0].dest;
    var destAbs = path.resolve() + '/' + dest;
    var done = this.async();

    grunt.config.set('_svnURl', destAbs);

    if (!grunt.file.exists(dest)) {
      grunt.file.mkdir(dest);
    } else if (!grunt.file.isDir(dest)) {
      grunt.fail.warn('A source directory is needed.');
      return false;
    }

    function cmd(command, args) {
      return function (cb) {
        grunt.log.writeln('Running ' + command + ' ' + args.join(' ').green + ' in ' + dest);
        grunt.util.spawn({
          cmd: command,
          args: args,
          opts: {
            cwd: dest
          }
        }, cb);
      };
    }

    grunt.util.async.series([
      cmd('svnadmin', ['create', '.']),
      cmd('mkdir', ['trunk', 'tags', 'assets', 'branches']),
      cmd('svn', ['import', '.', 'file://' + destAbs, '-m"structure"']),
    ], done);

  });
};
