(function(Lively3D){
	/**
		@class Represents single scene.
	*/
	Lively3D.Scene = function(){
		
		var Model;
		/**
			Sets Model for Lively3D scene.
			@param model Model of the scene.
		*/
		this.SetModel = function(model){
			Model = model;
			return this;
		}
		
		/**
			Gets the model of the scene.
			@returns Model of the scene.
		*/
		this.GetModel = function(){
			return Model;
		}
		
		var Scene;
		/**
			Sets GLGE Scene for the Lively3D scene.
			@param scene GLGE Scene.
		*/
		this.SetScene = function(scene){
			Scene = scene;
			return this;
		}
		
		/**
			Gets GLGE scene of the Lively3d scene.
			@returns GLGE Scene.
		*/
		this.GetScene = function(){
			return Scene;
		}
	};
}(Lively3D));