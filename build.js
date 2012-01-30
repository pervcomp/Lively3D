#!/usr/bin/env node
/*
	Build script for Lively3D.
	Widely based on Paul Brunt's GLGE build.js
*/
var util = require('util');
var fs = require('fs');
var sys = require('sys');
var spawn = require('child_process').spawn;

var type = "all";

var flags = {
	all:{
		Lively3D: true, GLGE: false, docs: true, uglify: true
	},
	glge:{
		GLGE: true
	},
	documentation:{
		docs: true, Lively3D: false
	},
	lively3d:{
		Lively3D: true, uglify: true
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


var srcFiles = {
	Lively3D: [ "src/lively3d_application.js", "src/lively3d_scene.js", "src/lively3d_ui.js", "src/lively3d_proxies.js", "src/lively3d.js"]
}

var deps = {
	"src/lively3d.js": [],
	"src/lively3d_application.js": ["src/lively3d.js"],
	"src/lively3d_scene.js": [ "src/lively3d.js"],
	"src/lively3d_ui.js": ["src/lively3d.js"],
	"src/lively3d_proxies.js": ["src/lively3d.js", "src/lively3d_ui.js" ]
};

var listFiles = function(list, all){
	var addDeps = function(file, list){
		if ( deps[file] ){
			for ( var i = 0; i < deps[file].length; i++ ){
				addDeps(deps[file][i], list);
				if (list.indexOf(deps[file][i]) < 0){
					list.push(deps[file][i]);
				}
			}
		}
	}
	
	if(!list){
		list = [];
	}
	console.log(all);
	for ( var i in flags ){
		if ((flags[i] || all ) && srcFiles[i] ){
			for ( var j = 0; j < srcFiles[i].length; j++){
				
				addDeps(srcFiles[i][j], list);
				if (list.indexOf(srcFiles[i][j]) < 0 ){
					list.push(srcFiles[i][j]);
				}
			}
		}
	}
	
	return list;
};

var filearray = listFiles();


if ( flags.GLGE ){
	console.log("Building GLGE..");
	
	var cmd = spawn('node', ["build.js", "scripts", ], {cwd: "externals/GLGE/"});
	cmd.stdout.on('data', function(data){
		util.print(data);
	});
	
	cmd.on('exit', function(code){
		console.log("GLGE finished building!");
		var cp = spawn('cp', ["externals/GLGE/glge-compiled-min.js", "HTML/scripts/"]);
		cp.on('exit', function(code){
			if (code == 0 ){
				console.log("Copied minified GLGE to output-directory.");
			}
		});
	});
}

var files = listFiles([], true);

if ( flags.docs ){
	console.log("Generating docs..");
	var cmd = spawn('node', ["externals/jsdoc-toolkit/app/run.js", "-d=docs", "-t=externals/jsdoc-toolkit/templates/jsdoc"].concat(files));
	cmd.stdout.on('data', function(data){
		util.print(data);
	});
	
	cmd.on('exit', function(code){
		if( code == 0 ){
			console.log("Docs generated!");
		}
	});
}

var combinedList = [];
if ( flags.Lively3D ){
	for ( var i = 0; i < filearray.length; i++ ){
		console.log("Reading file: " + filearray[i]);
		combinedList.push(fs.readFileSync(filearray[i]));
	}

	if ( filearray.length > 0 ){
		console.log("Writing combined javascript file: lively3d-compiled.js");
		combinedList = combinedList.join("");
		fs.writeFileSync('lively3d-compiled.js', combinedList);
		
		if ( flags.uglify ){
			var jsp = require("./externals/uglifyjs/lib/parse-js");
			var pro = require('./externals/uglifyjs/lib/process');
			
			console.log("Parsing JavaScript..");
			var ast = jsp.parse(combinedList);
			console.log("Minifying..");
			ast = pro.ast_mangle(ast)
			console.log("Optimizing..");
			ast = pro.ast_squeeze(ast);
			console.log("Generating minified code..");
			var final_code = pro.gen_code(ast);
			console.log("Writing minified code: lively3d-compiled-min.js");
			fs.writeFileSync("lively3d-compiled-min.js", final_code);
			console.log("Copying to the output directory..");
			
			var cp = spawn('cp', ["lively3d-compiled-min.js", "HTML/scripts/"]);
			cp.on('exit', function(code){
				if (code == 0 ){
					console.log("Copied minified Lively3D to output-directory.");
				}
			});
		}
	}
}


