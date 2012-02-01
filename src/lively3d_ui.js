/*
Copyright (C) 2012 Jari-Pekka Voutilainen

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
(function(Lively3D){
	/**
		@namespace Functions for user interface.
	*/
	Lively3D.UI = {};
	Lively3D.UI.HTTPServers = {
		LOCAL: { inUse: false },
		NODE: { inUse: false },
		PROXY: { inUse: true }
	}
	
	/**
		Toggles between PHP- and Node.js proxies. Default is PHP-proxy.
	*/
	Lively3D.UI.ToggleNode = function(){
		Lively3D.UI.HTTPServers.NODE.inUse = !Lively3D.UI.HTTPServers.NODE.inUse;
		Lively3D.UI.HTTPServers.PROXY.inUse = !Lively3D.UI.HTTPServers.PROXY.inUse;
	}
	
	/**
		Enables usage of local web server. Functionality will be broken if web server is unavailable.
	*/
	Lively3D.UI.UseLocal = function(){
		console.log("Going offline...");
		Lively3D.UI.HTTPServers.LOCAL.inUse = true;
	}
	/**
		Enables usage of online resources.
	*/
	Lively3D.UI.UseOnline = function(){
		console.log("Going online...");
		Lively3D.UI.HTTPServers.LOCAL.inUse = false;
	}
	
	/**
		Shows notification about completing load process.
	*/
	Lively3D.UI.ShowLoadCompleted = function(){
		var div = $("<div id='loadcompleted'><p>Load Compeleted</p></div>")
		div.appendTo("#container");
		div.fadeIn("slow",function(){
			setTimeout(function(){div.fadeOut("slow",function(){div.remove();});}, 1000);
		});
	}
	
	/**
		Shows application list.
	*/
	Lively3D.UI.ShowAppList = function(){
		if ( this.HTTPServers.LOCAL.inUse == true ){
			Lively3D.Proxies.Local.ShowAppList();
		}
		else if ( this.HTTPServers.PROXY.inUse == true ){
			Lively3D.Proxies.PHP.ShowAppList();
		}
		else{
			Lively3D.Proxies.Node.ShowAppList();
		}
	}
	
	/**
		Loads applications.
		@param app Application name.
	*/
	Lively3D.UI.LoadApplication = function(app){
		if ( this.HTTPServers.LOCAL.inUse == true ){
			Lively3D.Proxies.Local.LoadApplication(app);
		}
		else if ( this.HTTPServers.PROXY.inUse == true ){
			Lively3D.Proxies.PHP.LoadApplication(app);
		}
		else{
			Lively3D.Proxies.Node.LoadApplication(app);
		
		}
	}
	
	/**
		Shows state list for current user.
	*/
	Lively3D.UI.ShowStateList = function(){
		if ( this.HTTPServers.LOCAL.inUse == true ){
			Lively3D.Proxies.Local.ShowStateList();
		}
		else if ( this.HTTPServers.PROXY.inUse == true ){
			Lively3D.Proxies.PHP.ShowStateList();
		}
		else{
			Lively3D.Proxies.Node.ShowStateList();
		}
	}
	
	/**
		Shows Scene list.
	*/
	Lively3D.UI.ShowSceneList = function(){
		if ( this.HTTPServers.LOCAL.inUse == true ){
			Lively3D.Proxies.Local.ShowSceneList();
		}
		else if ( this.HTTPServers.PROXY.inUse == true ){
			Lively3D.Proxies.PHP.ShowSceneList();
		}
		else{
			Lively3D.Proxies.Node.ShowSceneList();
		}
	}
	
	/**
		Loads Scene.
		@param scene Name of the scene.
	*/
	Lively3D.UI.LoadScene = function(scene){
		if ( this.HTTPServers.LOCAL.inUse == true ){
			Lively3D.Proxies.Local.LoadScene(scene);
		}
		else if ( this.HTTPServers.PROXY.inUse == true ){
			Lively3D.Proxies.PHP.LoadScene(scene);
		}
		else{
			Lively3D.Proxies.Node.LoadScene(scene);
		
		}
	}
	
	/**
		Saves desktop state
		@param filename Name of the state.
	*/
	Lively3D.UI.SaveDesktop = function(filename){
		if ( this.HTTPServers.LOCAL.inUse == true ){
			Lively3D.Proxies.Local.SaveDesktop(filename);
		}
		else if ( this.HTTPServers.PROXY.inUse == true ){
			Lively3D.Proxies.PHP.SaveDesktop(filename);
		}
		else{
			Lively3D.Proxies.Node.SaveDesktop(filename);
		
		}
	}
	
	/**
		Loads desktop state.
		@param state Name of the state.
	*/
	Lively3D.UI.LoadDesktop = function(state){
		if ( this.HTTPServers.LOCAL.inUse == true ){
			Lively3D.Proxies.Local.LoadDesktop(state);
			Lively3D.UI.CloseDialog();
		}
		else if ( this.HTTPServers.PROXY.inUse == true ){
			Lively3D.Proxies.PHP.LoadDesktop(state);
			Lively3D.UI.CloseDialog();
		}
		else{
			Lively3D.Proxies.Node.LoadDesktop(state);
			Lively3D.UI.CloseDialog();
		}
	};
	
	/**
		Switches to the next scene. If current scene is the last scene, switches to the first scene.
	*/
	Lively3D.UI.ChangeScene = function(){
		
		for ( var i in Applications){
			if ( Applications.hasOwnProperty(i)){
				if ( !Applications[i].isClosed() ){
					Lively3D.Close(Applications[i]);
				}
			}
		}
		
		CurrentScene += 1;
		if (CurrentScene == Scenes.length ){
			CurrentScene = 0;
		}
		
		for ( var i in Applications){
			Applications[i].SetCurrentSceneObject(CurrentScene);
		}
				
		Lively3D.GLGE.renderer.setScene(Scenes[CurrentScene].GetScene());
		DefaultCanvasEvents(document.getElementById(canvasName));
		Scenes[CurrentScene].GetModel().BindCanvasEvents(document.getElementById(canvasName));
		
	}
	
	var tmpApp;
	/**
		Shows dialog for saving desktop state. User enter state name in the dialog.
	*/
	Lively3D.UI.ShowSaveDialog = function(){
		var content = $('<h1>Save state</h1>State name:<input type="text" name="statename" id="statename"/><h3 onclick="Lively3D.UI.CloseSaveDialog();">Save</h3>');
		this.ShowHTML(content);
		tmpApp = Lively3D.GLGE.clickedObject;
		Lively3D.GLGE.clickedObject = null;	
	}
	
	/**
		Closes save dialog. If statename field contains string, Desktopstate is saved.
	*/
	Lively3D.UI.CloseSaveDialog = function(){
		var name = $("#statename");
		if ( name[0].value.length != 0 ){
			Lively3D.UI.SaveDesktop(name[0].value);
			this.CloseDialog();
			if (tmpApp){
				Lively3D.GLGE.clickedObject = tmpApp;
				tmpApp = null;
			}
		}
		else{
			$("<h3>Please supply state name</h3>").appendTo("#dialog");
		}
	}
	
	/**
		Shows about dialog.
	*/
	Lively3D.UI.ShowAbout = function(){
		var content = $("<h1>About</h1><p>Lively3D code made by Jari-Pekka Voutilainen</p><p>Applications developed by: Arto Salminen, Matti Anttonen, Anna-Liisa Mattila, Lotta Liikkanen, Jani Heininen, Mika Välimäki</p>");
		this.ShowHTML(content);
	}
	
	/**
		Shows message in dialog.
		@param {string} message Message to display.
	*/
	Lively3D.UI.ShowMessage = function(message){
		var content = $("<p>" + message + "</p>");
		this.ShowHTML(content);
	}
	

	
	Lively3D.UI.ActiveDialog;
	/**
		Shows HTML content to user.
		@param content HTML code to display.
		@param {boolean} omitCancel Whether to display cancel-button or not. If true, button is omitted.
	*/
	Lively3D.UI.ShowHTML = function(content, omitCancel){
		if ( this.ActiveDialog != null ){
			if ( this.ActiveDialog.cancelOmitted != true){
				SwitchDialog(content);
			}
		}
		else{
			if ( omitCancel != true ){
				var dialog = $("<div class='dialog' id='dialog'><h3 onclick='Lively3D.UI.CloseDialog();'>Cancel</h3></div>");
			}
			else{
				var dialog = $("<div class='dialog' id='dialog'></div>");
				dialog.cancelOmitted = true;
			}
			dialog.prepend(content);
			dialog.appendTo($('#container'));
			dialog.fadeIn("slow");
			this.ActiveDialog = dialog;
		}
	}
	
	/**
		Closes dialog.
	*/
	Lively3D.UI.CloseDialog = function(){
		this.ActiveDialog.fadeOut("slow", function(){
			Lively3D.UI.ActiveDialog.remove();
			Lively3D.UI.ActiveDialog = null;
		});
	}
	
	/**
		Switches existing dialog.
		@param content Contents of new dialog.
	*/
	var SwitchDialog = function(content){
		Lively3D.UI.ActiveDialog.fadeOut("fast", function(){
			Lively3D.UI.ActiveDialog.remove();
			var dialog = $("<div class='dialog' id='dialog'><h3 onclick='Lively3D.UI.CloseDialog();'>Cancel</h3></div>");
			dialog.prepend(content);
			dialog.appendTo($('#container'));
			dialog.fadeIn("fast");
			Lively3D.UI.ActiveDialog = dialog;
		});
	}
	
	var username;
	/**
		Saves username from the original dialog.
	*/
	Lively3D.UI.EnterUsername = function(){
		var name = $("#username");
		if ( name[0].value.length != 0 ){
			username = name[0].value;
			this.CloseDialog();
		}
		else{
			$("<h3>Please enter username</h3>").appendTo("#dialog");
		}
	}
}(Lively3D));