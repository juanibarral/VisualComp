var THREE_BezierSurfaceGeometry = function()
{
	this.controlPoints = [];
	this.subdivisionsU = 3;
	this.subdivisionsV = 3;
	this.vertices;
};

THREE_BezierSurfaceGeometry.prototype.createMesh = function()
{
	var controlPointsV = this.createMeshU(this.controlPoints);
	this.vertices = this.createMeshV(controlPointsV);
};

THREE_BezierSurfaceGeometry.prototype.createMeshVU = function()
{
	var controlPointsU = this.createMeshV(this.controlPoints);
	this.vertices = this.createMeshV(controlPointsU);
};

THREE_BezierSurfaceGeometry.prototype.createMeshU = function(controlPoints)
{
	var maxI = controlPoints.length;
	var maxJ = controlPoints[0].length;
	
	var newControlPoints = [];
	
	for(var i = 0; i < maxI; i ++)
	{
		var points = [];
		for(var j = 0; j < maxJ; j ++)
		{
			points.push(new THREE.Vector3(controlPoints[i][j].x, controlPoints[i][j].y, controlPoints[i][j].z));
		}
		
		var bezierCurve = new THREE_BezierCurveGeometry();
		bezierCurve.controlPoints = points;
		bezierCurve.subdivisions = this.subdivisionsU;
		bezierCurve.calculate();
		newControlPoints[i] = bezierCurve.vertices;
	};
	
	return newControlPoints;
};

THREE_BezierSurfaceGeometry.prototype.createMeshV = function(controlPoints)
{
	var maxI = controlPoints.length;
	var maxJ = controlPoints[0].length;
	
	var newControlPoints = [];
	
	for(var j = 0; j < maxJ; j ++)
	{
		var points = [];
		for(var i = 0; i < maxI; i ++)
		{
			points.push(new THREE.Vector3(controlPoints[i][j].x, controlPoints[i][j].y, controlPoints[i][j].z));
		}
		var bezierCurve = new THREE_BezierCurveGeometry();
		bezierCurve.controlPoints = points;
		bezierCurve.subdivisions = this.subdivisionsV;
		bezierCurve.calculate();
		newControlPoints[j] = bezierCurve.vertices;
		
	};
	
	return newControlPoints;
};



