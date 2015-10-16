var THREE_BezierCurveGeometry = function()
{
	this.controlPoints;
	this.subdivisions = 3;
	this.vertices = [];	
	// this.bernsteinBasis = [
		// function(u){ return Math.pow(1 - u, 3); },
		// function(u){ return 3 * u * Math.pow(1 - u, 2);},
		// function(u){ return 3 * u * u * (1 - u); },
		// function(u){ return Math.pow(u, 3);},
	// ];
};

// THREE_BezierCurveGeometry.prototype.calculate = function()
// {
	// var step = 1 / this.subdivisions;
	// //Using Bernstein Basis
	// for(var i = 0; i <= this.subdivisions; i++)
	// {
		// var u = i * step;
// 		
		// var x = 0;
		// var y = 0;
		// var z = 0;
		// for(var j = 0; j < 4; j++)
		// {
			// x += this.controlPoints[j].x * this.bernsteinBasis[j](u);
			// y += this.controlPoints[j].y * this.bernsteinBasis[j](u);
			// z += this.controlPoints[j].z * this.bernsteinBasis[j](u);
		// }
		// this.vertices.push(new THREE.Vector3(x, y, z));
	// }
// 	
// };

THREE_BezierCurveGeometry.prototype.calculate = function()
{
	var step = 1 / this.subdivisions;
	for(var i = 0; i <= this.subdivisions; i++)
	{
		var u = i * step;
		var newPoint = this.calculateDeCasteljau_i(u);
		this.vertices.push(new THREE.Vector3(newPoint.x, newPoint.y, newPoint.z));
	}
};

THREE_BezierCurveGeometry.prototype.calculateDeCasteljau_i = function(u)
{
	var q = [];
	for(var i = 0; i < this.controlPoints.length; i++)
	{
		q.push(new THREE.Vector3(this.controlPoints[i].x, this.controlPoints[i].y, this.controlPoints[i].z));		
	}
	for(var k = 1; k < this.controlPoints.length; k++)
	{
		for(var i = 0; i < this.controlPoints.length - k; i++)
		{
			q[i].x = ((1 - u) * q[i].x) + (u * q[i + 1].x);
			q[i].y = ((1 - u) * q[i].y) + (u * q[i + 1].y);
			q[i].z = ((1 - u) * q[i].z) + (u * q[i + 1].z);
		}		
	}
	return q[0];
};


