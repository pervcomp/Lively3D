/*
   Copyright (c) 2007 Danny Chapman
   http://www.rowlhouse.co.uk

   This software is provided 'as-is', without any express or implied
   warranty. In no event will the authors be held liable for any damages
   arising from the use of this software.
   Permission is granted to anyone to use this software for any purpose,
   including commercial applications, and to alter it and redistribute it
   freely, subject to the following restrictions:
   1. The origin of this software must not be misrepresented; you must not
   claim that you wrote the original software. If you use this software
   in a product, an acknowledgment in the product documentation would be
   appreciated but is not required.
   2. Altered source versions must be plainly marked as such, and must not be
   misrepresented as being the original software.
   3. This notice may not be removed or altered from any source
   distribution.
 */

/**
 * @author Muzer(muzerly@gmail.com)
 * @link http://code.google.com/p/jiglibflash
 */
 
 (function(jigLib){
	var Vector3D=jigLib.Vector3D;
	var Matrix3D=jigLib.Matrix3D;
	var JMatrix3D=jigLib.JMatrix3D;
        var JNumber3D=jigLib.JNumber3D;
        var JConstraint=jigLib.JConstraint;
        var JConfig=jigLib.JConfig;
        var JSphere=jigLib.JSphere;
	var MaterialProperties=jigLib.MaterialProperties;
	var RigidBody=jigLib.RigidBody;
	var CollPointInfo=jigLib.CollPointInfo;
	var CollisionInfo=jigLib.CollisionInfo;

	 
	var CollDetectSpherePlane=function(){
		this.name = "SpherePlane";
		this.type0 = "SPHERE";
		this.type1 = "PLANE";
	}
	jigLib.extends(CollDetectSpherePlane,jigLib.CollDetectFunctor);
	
	CollDetectSpherePlane.prototype.collDetect=function(info, collArr){
		var tempBody;
		if (info.body0.get_type() == "PLANE"){
			tempBody = info.body0;
			info.body0 = info.body1;
			info.body1 = tempBody;
		}

		var sphere = info.body0;
		var plane = info.body1;
		var oldDist = plane.pointPlaneDistance(sphere.get_oldState().position);
		var newDist = plane.pointPlaneDistance(sphere.get_currentState().position);

		if (Math.min(newDist, oldDist) > sphere.get_boundingSphere() + JConfig.collToll){
			return;
		}
		
		var collPts = [];
		var cpInfo;
		var depth = sphere.get_radius() - oldDist;

		var worldPos = sphere.get_oldState().position.subtract(JNumber3D.getScaleVector(plane.get_normal(), sphere.get_radius()));
		cpInfo = new CollPointInfo();
		cpInfo.r0 = worldPos.subtract(sphere.get_oldState().position);
		cpInfo.r1 = worldPos.subtract(plane.get_oldState().position);
		cpInfo.initialPenetration = depth;
		collPts.push(cpInfo);

		var collInfo = new CollisionInfo();
		collInfo.objInfo = info;
		collInfo.dirToBody = plane.get_normal();
		collInfo.pointInfo = collPts;
		var mat = new MaterialProperties();
		mat.set_restitution(Math.sqrt(sphere.get_material().get_restitution() * plane.get_material().get_restitution()));
		mat.set_friction(Math.sqrt(sphere.get_material().get_friction() * plane.get_material().get_friction()));
		collInfo.mat = mat;
		collArr.push(collInfo);
		info.body0.collisions.push(collInfo);
		info.body1.collisions.push(collInfo);
	}
	
	jigLib.CollDetectSpherePlane=CollDetectSpherePlane;
	 
})(jigLib)
 