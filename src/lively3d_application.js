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
		Creates new application.
		@class Represents single Lively3D Application.
	*/
	Lively3D.Application = function(){
		
		/**
			Gets application's inner state as javascript object.
			@returns {object} inner state.
		*/
		this.Save = function(){
			var state = {};
			return state;
		}
		
		/**
			Sets application's inner state.
			@param {object} state The state object which was created in the Save-function.
		*/
		this.Load = function(state){
		}
		
		var closed = true;
		/**
			Is application open or closed. Default closed.
			@returns {boolean} true for closed application, otherwise false.
		*/
		this.isClosed = function(){
			return closed;
		}
		
		var AppClose = function(){
		}
		
		/**
			Closes the application and calls settable closing function.
		*/
		this.Close = function(){
			closed = true;
			AppClose();
		}
		
		/**
			Sets closing function which is called during closing.
			@param {function} func Code that is executed at closing.
		*/
		this.SetAppClose = function(func){
			AppClose = func;
			return this;
		}
		
		var AppOpen = function(){
		}
		
		/**
			Opens the application and calls settable opening function.
		*/
		this.Open = function(){
			closed = false;
			AppOpen();
		}
		
		/**
			Sets opening function whis is called during opening.
			@param {function} func Code that is executed at opening.
		*/
		this.SetAppOpen = function(func){
			AppOpen = func;
			return this;
		}
		
		var maximized = false;
		
		/**
			Is application maximized or minimized. Default minimized.
			@returns {boolean} True if application is maximized, otherwise false.
			
		*/
		this.isMaximized = function(){
			return maximized;
		}
		
		/**
			Maximizes application.
		*/
		this.Maximize = function(){
			maximized = true;
		}
		
		/**
			Minimizes application
		*/
		this.Minimize = function(){
			maximized = false;
		}
		
		var Permissions = [];
		
		/**
			Adds new permission for application.
			@param {string} permission Literal for permission.
			@param {GLGE.Object} glge_object The GLGE Object in which the permission is applied.
		*/
		this.AddPermission = function(permission, glge_object){
			if (!Permissions[permission]){
				Permissions[permission] = [];
			}
			Permissions[permission].push(glge_object);
		}
		
		/**
			Checks that the given object has the requested permission.
			@param {string} permission Literal for permission.
			@param {GLGE.Object} glge_object The GLGE object to be checked for permission.
			@return {boolean} true if object has the permission, otherwise false.
		*/
		this.CheckPermission = function(permission, glge_object){
			
			if ( Permissions[permission] ){
				for ( var i in Permissions[permission] ){
					if ( Permissions[permission].hasOwnProperty(i)){
						if ( Permissions[permission][i] instanceof GLGE.Group ){
							var objs = Permissions[permission][i].children;
							for ( var j in objs ){
								if ( objs[j] === glge_object ){
									return true;
								}
							}
						}
						
						else if ( Permissions[permission][i] === glge_object ){
							return true;
						}
					}
				}
			}
				
			return false;
		}
		
		var SceneObjects = [];
		/**
			Add new Scene object to the application.
			@param obj The object that represents application within the scene.
		*/
		this.AddSceneObject = function(obj){
			SceneObjects.push(obj);
			if ( CurrentObject == null ){
				CurrentObject = obj;
			}
			return this;
		}
		
		var WindowObject;
		/**
			Set the application window object.
			@param window Object which represents application window.
		*/
		this.SetWindowObject = function(window){
			WindowObject = window;
			return this;
		}
		
		/**
			Gets Application window.
		*/
		this.GetWindowObject = function(){
			return WindowObject;
		}
		
		/**
			Gets application material where js events are bound.
		*/
		this.GetWindowMaterial = function(){
			return WindowObject.children[2].getMaterial();
		}
		
		var CurrentObject;
		/**
			Switches between scene object and application window.
		*/
		this.ToggleWindowObject = function(){
			if ( CurrentObject == WindowObject ){
				CurrentObject = SceneObjects[Lively3D.GetCurrentSceneIndex()];
			}
			else{
				CurrentObject = WindowObject;
			}
			return this;
		}
		
		/**
			Gets the current scene object within the scene.
		*/
		this.GetCurrentSceneObject = function(){
			if ( CurrentObject.group ){
				return CurrentObject.group;
			}
			return CurrentObject;
		}
		
		/**
			Get the current application object within the scene.
		*/
		this.GetCurrentObject = function(){
			return CurrentObject;
		}
		
		/**
			Sets the current scene object.
			@param {integer} index Index of the scene.
		*/
		this.SetCurrentSceneObject = function(index){
			if ( index != null  && index >= 0 && index < SceneObjects.length ){
				CurrentObject = SceneObjects[index];
			}
			else{
				console.log("No such scene object");
			}
		}
		
		/**
			Gets scene object for specified scene.
			@param {integer} index Index of the scene.
		*/
		this.GetSceneObject = function(index){
			if ( index != null  && index >= 0 && index < SceneObjects.length ){
				return SceneObjects[index].group;
			}
			else{
				console.log("No such scene object");
			}
		}
		
		/**
			Gets app object for the scene.
			@param {integer} index Index of the scene.
		*/
		this.GetAppObject = function(index){
			if ( index != null  && index >= 0 && index < SceneObjects.length ){
				return SceneObjects[index];
			}
			else{
				console.log("No such scene object");
			}
		}
		
		var Name;
		/**
			Sets application name.
			@param {string} name Name of application.
		*/
		this.SetName = function(name){
			Name = name;
			return this;
		}
		
		/**
			Gets application name.
		*/
		this.GetName = function(){
			return Name;
		}
		
		var ApplicationCode;
		/**
			Sets application code.
			@param {function} code Code of the canvas application.
		*/
		this.SetApplicationCode = function(code){
			ApplicationCode = code;
			return this;
		}
		
		/**
			Gets application code.
			@returns Code of the canvas application.
		*/
		this.GetApplicationCode = function(){
			return ApplicationCode;
		}
		
		var InitializationCode;
		/**
			Sets application's initalization code.
			@param {function} code Initalization code.
		*/
		this.SetInitializationCode = function(code){
			InitializationCode = code;
			return this;
		}
		
		/**
			Gets application's iniitalization code.
			@returns Initialization code.
		*/
		this.GetInitializationCode = function(){
			return InitializationCode;
		}
		
		/**
			Sets Save function for state creation.
			@param {function} func Function to be called during state save.
		*/
		this.SetSave = function(func){
			this.Save = func;
			return this;
		}
		
		/**
			Sets Load function for state parsing.
			@param {function} func Function to be called during state load.
		*/
		this.SetLoad = function(func){
			this.Load = func;
			return this;
		}
		
		/**
			Set the function which is executed after the application is initialized.
			@param {function} func Function for execution.
		*/
		this.SetStart = function(func){
			this.StartApp = func;
			return this;
		}
	}
}(Lively3D));