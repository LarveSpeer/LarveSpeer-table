/* @flow */

var fs = require("fs")
var path = require("path")
var express = require("express")
var jade = require("jade")
var parse = require('csv-parse')

module.exports = function(pathToWorkingDir){
	var app = express()
	app.locals.path = pathToWorkingDir
	app.locals.config = require(path.resolve(app.locals.path, "config.js"))

	app.use(express.static(app.locals.path))

	app.locals.data = []
	var indexPath = path.resolve(app.locals.path, app.locals.config.contentFile)
	parse(
		fs.readFileSync(indexPath).toString(),
		{
			delimiter: ";"
		},
		function(err, data){
			if(err) throw err;
			app.locals.data = data
		}
	);

	// this function provides the HTML code, which one will be displayed to the page
	app.html = function() {
		return jade.compileFile(__dirname + "/views/layout.jade")(app.locals)
	}

	// here we can return LESS css, which will only effect the page HTML code
	app.less = function(){
		return ""
	}


	return app
}
