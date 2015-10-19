var THREE_BezierCurveGeometry = function()
{
	this.controlPoints;
	this.subdivisions = 3;
	this.vertices = [];	
};

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

THREE_BezierCurveGeometry.prototype.calculateB = function()
{
	var step = 1 / this.subdivisions;
	for(var sub_i = 0; sub_i <= this.subdivisions; sub_i++)
	{
		var u = sub_i * step;
		var x = 0;
		var y = 0;
		var z = 0;
		for(var i = 0; i < this.controlPoints.length; i++)
		{
			var n = this.controlPoints.length - 1;
			x += this.calculateBernstein(n, i, u) * this.controlPoints[i].x;
			y += this.calculateBernstein(n, i, u) * this.controlPoints[i].y;
			z += this.calculateBernstein(n, i, u) * this.controlPoints[i].z;
		}
		this.vertices.push(new THREE.Vector3(x, y, z));
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

THREE_BezierCurveGeometry.prototype.calculateBernstein = function(n,i, u)
{
	return Math_factorial(n) / (Math_factorial(i) * Math_factorial(n-i)) * Math.pow(u,i) * Math.pow(1 - u, n-i);
};

function Math_factorial(num) {
	var fact = 1;
	for (var i = 2; i <= num; i++)
		fact = fact * i;
	return fact;
}; 
