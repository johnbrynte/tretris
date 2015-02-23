(function(){

	var cy = cytoscape({
		headless: true,
		renderer: {name: null}
	});

	var BlockGraph = function (dimension) {
		this.x = dimension.x;
		this.y = dimension.y;
		this.z = dimension.z;

		this.graph = [];

		for (var i = 0; i < this.x; i++) {
			this.graph.push([]);
			for (var j = 0; j < this.y; j++) {
				this.graph[i].push([]);
				for (var k = 0; k < this.z; k++) {
					this.graph[i][j].push(0);
				}
			}
		}
	};


	BlockGraph.prototype.

	BlockGraph.prototype.setPoint = function (point) {
		var x = point.x;
		var y = point.y;
		var z = point.z;
		this.graph[x][y][z] = 1;
	};

	BlockGraph.prototype.getRandomPoint = function() {
		var x1 = Math.floor(Math.random()*this.x), 
			y1 = Math.floor(Math.random()*this.y),
			z1 = Math.floor(Math.random()*this.z);
		return {x:x1, y:y1, z:z1};
	};

	BlockGraph.prototype.connectPoints = function(p1, p2) {
		var path = this.findShortestPath(p1, p2);
		for (var i = 0; i < path.length; i++) {
			this.setPoint(path[i]);
		}
	};

	BlockGraph.prototype.getConnectedRandomBlockOfThreePoints = function() {
		var p1 = this.getRandomPoint();
		var p2 = this.getRandomPoint();
		var p3 = this.getRandomPoint();

		this.connectPoints(p1, p2);
		this.connectPoints(p2, p3);
		this.connectPoints(p3, p1);
	};

})();