function vector(a,b) {
	this.i = a;
	this.j = b;
	
	//Adds a vector
	this.add = function(v){
		this.i += v.i;
		this.j += v.j;
	}
	//Adds a vector
	this.addn = function(x,y){
		this.i += x;
		this.j += y;
	}
	//Subtracts a vector
	this.sub = function(v){
		this.i -= v.i;
		this.j -= v.j;
	}
	//Subtracts a vector
	this.subn = function(x,y){
		this.i -= x;
		this.j -= y;
	}
	//Computes the dot product
	this.dotProduct = function(v){
		return this.i * v.j - this.j * v.i;
	}
	//Returns a norm
	this.norm = function(){
		var n = 1/Math.sqrt(this.i*this.i + this.j*this.j); 
		//document.write(n);
		var v = new vector(n*i,n*j);
		//document.write("" + v.i + " " + v.j);
		return v;
	}
}
