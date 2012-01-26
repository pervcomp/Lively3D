#!/usr/bin/env node

var util = require('util');
var fs = require('fs');
var sys = require('sys');
var spawn = require('child_process').spawn;

var type = "all";

var flags = {
	all:{
		Lively3D: true, GLGE: true, docs: true, uglify: true
	},
	glge:{
		GLGE: true
	}
};

var helpGiven = false;
process.argv.forEach(function(val, index, array){
	if ( val == "--help" ){
		helpGiven = true;
		return;
	}
	if(flags[val]){
		flags = flags[val];
		type = val;
	}
});


if ( flags[type] ){
	flags=flags[type];
}

if ( helpGiven == true ){
	return;
}



if ( flags.GLGE ){
	console.log("Building GLGE..");
	
	var cmd = spawn('node', ["build.js", "scripts", ], {cwd: "externals/GLGE/"});
	cmd.stdout.on('data', function(data){
		util.print(data);
	});
	
	cmd.on('exit', function(code){
		console.log("GLGE finished building!");
		var cp = spawn('cp', ["externals/GLGE/glge-compiled-min.js", "HTML/"]);
		cp.on('exit', function(code){
			if (code == 0 ){
				console.log("Copied minified GLGE to output-directory.");
			}
		});
	});
}

if ( flags.docs ){
	console.log("Generating docs..");
	
	
}
if ( flags.Lively3D ){


}
