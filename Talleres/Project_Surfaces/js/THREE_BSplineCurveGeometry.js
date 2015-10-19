var THREE_BSplineCurveGeometry = function()
{
	this.controlPoints;
	this.subdivisions = 3;
	this.vertices = [];	
	this.knotVector;
	this.degree = 3;
	
	this.precision = 0.999999;
};

THREE_BSplineCurveGeometry.prototype.calculate2 = function()
{
	if(!this.knotVector)
		this.calculateUniformKnotVector2();
	else 
		this.degree = this.knotVector.length - this.controlPoints.length - 1;
	
	var step = 1 / this.subdivisions ;
	for(var sub_i = 0; sub_i <= this.subdivisions; sub_i++)
	{
		var u = sub_i * step;
		var x = 0;
		var y = 0;
		var z = 0;
		var coeffSum = 0;
		
		for(var i = 0; i < this.controlPoints.length; i++)
		{
			var coefficient = this.calculateBasisFunction(i, this.degree , u); 
			coeffSum += coefficient;
			x += coefficient * this.controlPoints[i].x;
			y += coefficient * this.controlPoints[i].y;
			z += coefficient * this.controlPoints[i].z;
			
			if(coefficient < 0)
				console.log("es negativo");
		}
		if(coeffSum >= this.precision)
		{
			this.vertices.push(new THREE.Vector3(x, y, z));
		}
		else
		{
			console.log('************************************');
			console.log('sum ' + coeffSum + '. u: ' + u );
			console.log(this.knotVector);	
		}
	}
};

/**
 * Calculates the bases function for a B-Spline
 * @param {Object} i index of control point
 * @param {Object} p degree of the basis function
 * @param {Object} u 
 */
THREE_BSplineCurveGeometry.prototype.calculateBasisFunction = function(i, p, u)
{
	var u_i = this.knotVector[i];
	var u_i1 = this.knotVector[i + 1];
	var u_ip = this.knotVector[i + p];
	var u_ip1 = this.knotVector[i + p + 1];
	
	if(p == 0)
	{
		if(u_i <= u && u < u_i1)
			return 1;
		else
			return 0;
	}
	else
	{	
		var a = (u_ip - u_i) == 0 ? 0 : ((u - u_i) / (u_ip - u_i)) ;
		var b = (u_ip1 - u_i1) == 0 ? 0 :((u_ip1 - u) / (u_ip1 - u_i1)) ;
		return a * this.calculateBasisFunction(i,p-1,u) + b * this.calculateBasisFunction(i + 1,p-1,u);
	}
};

/**
 * 
 * @param {Object} u
 */
THREE_BSplineCurveGeometry.prototype.getXYZ = function(u)
{
	var x = 0;
	var y = 0;
	var z = 0;
	var coefficients = this.calculateBasisDeBoor(u);
	for(var i = 0; i < this.controlPoints.length; i++)
	{
		var coefficient = coefficients[i];
		x += coefficient * this.controlPoints[i].x;
		y += coefficient * this.controlPoints[i].y;
		z += coefficient * this.controlPoints[i].z;
	}
	
	return new THREE.Vector3(x,y,z);
};

THREE_BSplineCurveGeometry.prototype.calculateUniformKnotVector2 = function()
{
	this.knotVector = [];
	var size = this.controlPoints.length + this.degree + 1;    
	var step = 1 / (size - 1);
	for(var i = 0; i < size; i++)
	{
		this.knotVector.push(step * i);
	}
};

THREE_BSplineCurveGeometry.prototype.calculateUniformKnotVector = function()
{
	this.knotVector = [];
	var size = this.controlPoints.length + this.degree + 1;    
	var step = 1 / (size - (this.degree * 2) - 1);
	
	for(var i = 0; i < this.degree; i++)
	{
		this.knotVector.push(0.0);
	}
	var j = 0;
	for(var i = this.degree; i < size - this.degree - 1; i++)
	{
		this.knotVector.push(step * j);
		j++;
	}
	for(var i = size - this.degree - 1; i < size; i++)
	{
		this.knotVector.push(1.0);
	}
};


THREE_BSplineCurveGeometry.prototype.calculate = function()
{
	if(!this.knotVector)
		this.calculateUniformKnotVector();
	else 
		this.degree = this.knotVector.length - this.controlPoints.length - 1;
	
	var step = 1 / (this.subdivisions - 1);
	for(var sub_i = 0; sub_i < this.subdivisions; sub_i++)
	{
		var u = sub_i * step;
		
		var x = 0;
		var y = 0;
		var z = 0;
		var coefficients = this.calculateBasisDeBoor(u);
		for(var i = 0; i < this.controlPoints.length; i++)
		{
			var coefficient = coefficients[i]; 
			x += coefficient * this.controlPoints[i].x;
			y += coefficient * this.controlPoints[i].y;
			z += coefficient * this.controlPoints[i].z;
		}
		this.vertices.push(new THREE.Vector3(x, y, z));
	}
};

THREE_BSplineCurveGeometry.prototype.calculateBasisDeBoor = function(u)
{
	var N = [];
	var p = this.degree;
	for(var i in this.controlPoints)
	{
		N.push(0);
	}
	if(u == this.knotVector[0])
	{
		N[0] = 1.0;
	}
	else if(u == this.knotVector[this.knotVector.length - 1])
	{
		N[this.controlPoints.length - 1] = 1.0;
	}
	else
	{
		var k = -1;
		for(var u_i in this.knotVector)
		{
			var temp_i = this.knotVector[u_i];
			var temp_i1 = this.knotVector[parseInt(u_i) + 1];
			if( temp_i <= u && u < temp_i1)
			{
				k = parseInt(u_i);
				break;
			}
		}
		N[k] = 1.0;
		for(var d = 1; d <= p; d++)
		{
			N[k-d] = (this.knotVector[k + 1] - u) / (this.knotVector[k + 1] - this.knotVector[k - d + 1]) * N[k - d + 1];
			for(var i = k - d + 1; i < k; i++)
			{
				var a = (u - this.knotVector[i]) / (this.knotVector[i + d] - this.knotVector[i]);
				var b = (this.knotVector[i + d + 1] - u) / (this.knotVector[i + d + 1] - this.knotVector[i + 1]);
				N[i] = a * N[i] + b * N[i + 1];
			}
			N[k] = (u - this.knotVector[k]) / (this.knotVector[k + d] - this.knotVector[k]) * N[k];
		}
	}
	return N;
};

