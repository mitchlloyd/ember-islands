/* jshint node: true */
'use strict';

var path = require('path');
var VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: 'ember-islands',

  treeForApp: function (tree) {
    var checker = new VersionChecker(this);
    var dep = checker.for('ember', 'bower');

    var version = dep.satisfies('<= 1.12') ? 'prefastboot' : 'fastboot';

    return this.treeGenerator(path.join(this.root, 'app', version));
  }
};
