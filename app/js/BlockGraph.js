(function() {

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


    // BlockGraph.prototype.

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

    BlockGraph.prototype.findShortestPath = function(src, dst) {
        src = this.oneDimensionalIndex(src);
        dst = this.oneDimensionalIndex(dst);
        var vis = [];
        var q = [];
        
        for (var i = 0; i < this.x*this.y*this.z; i++) {
            vis.push(false);
        }

        var current = null;
        vis = this.markVisited(vis, src, null);
        q.unshift(src);

        while (q.length > 0) {
            current = q.pop();

            if (current == dst) {
                return this.backtrack(vis, current);
            }
            var neighbours = this.unvisitedNeighbours(vis, current);
            for (var i = 0; i < neighbours.length; i++) {
                q.unshift(neighbours[i]);
                vis = this.markVisited(vis, neighbours[i], current);
            }
        }

        return false;
    };

    BlockGraph.prototype.markVisited = function(vis, elt, prev) {
        vis[elt] = prev;
        return vis;
    };

    BlockGraph.prototype.unvisitedNeighbours = function(vis, elt) {
        var neighbours = [];
        neighbours = this.check(vis, neighbours, this.west(elt), elt);
        neighbours = this.check(vis, neighbours, this.east(elt), elt);
        neighbours = this.check(vis, neighbours, this.north(elt), elt);
        neighbours = this.check(vis, neighbours, this.south(elt), elt);
        neighbours = this.check(vis, neighbours, this.up(elt), elt);
        /*
        neighbours = this.check(vis, neighbours, this.up(this.west(elt)), elt);
        neighbours = this.check(vis, neighbours, this.up(this.east(elt)), elt);
        neighbours = this.check(vis, neighbours, this.up(this.north(elt)), elt);
        neighbours = this.check(vis, neighbours, this.up(this.south(elt)), elt);
        */
        neighbours = this.check(vis, neighbours, this.down(elt), elt);
        /*
        neighbours = this.check(vis, neighbours, this.down(this.west(elt)), elt);
        neighbours = this.check(vis, neighbours, this.down(this.east(elt)), elt);
        neighbours = this.check(vis, neighbours, this.down(this.north(elt)), elt);
        neighbours = this.check(vis, neighbours, this.down(this.south(elt)), elt);
        */

        return neighbours.map(Math.round);
    };

    BlockGraph.prototype.check = function(vis, neighbours, direction, elt) {
        if (elt !== direction && vis[direction] === false) {
            neighbours.push(direction);
        }
        return neighbours;
    };

    BlockGraph.prototype.north = function(elt) {
        var t = this.threeDimensionalIndex(elt);
        if (t.y > this.y-1) {
            return elt;
        }
        t.y++;
        return this.oneDimensionalIndex(t);
    };

    BlockGraph.prototype.south = function(elt) {
        var t = this.threeDimensionalIndex(elt);
        if (t.y <= 1) {
            return elt;
        }
        t.y--;
        return this.oneDimensionalIndex(t);
    };

    BlockGraph.prototype.west = function(elt) {
        var t = this.threeDimensionalIndex(elt);
        if (t.x <= 1) {
            return elt;
        }
        t.x--;
        return this.oneDimensionalIndex(t);
    };
    

    BlockGraph.prototype.east = function(elt) {
        var t = this.threeDimensionalIndex(elt);
        if (t.x > this.x-1) {
            return elt;
        }
        t.x++;
        return this.oneDimensionalIndex(t);
    };

    BlockGraph.prototype.up = function(elt) {
        var t = this.threeDimensionalIndex(elt);
        if (t.z > this.z-1) {
            return elt;
        }
        t.z++;
        return this.oneDimensionalIndex(t);
    };

    BlockGraph.prototype.down = function(elt) {
        var t = this.threeDimensionalIndex(elt);
        if (t.z <= 1) {
            return elt;
        }
        t.z--;
        return this.oneDimensionalIndex(t);
    };

    BlockGraph.prototype.backtrack = function(vis, elt) {
        var path = [];
        var current = elt;
        while (current !== null) {
            path.push(this.threeDimensionalIndex(current));
            current = vis[current];
        }
        return path;
    };

    BlockGraph.prototype.oneDimensionalIndex = function(elt) {
        return parseInt(elt.x + this.x*elt.y + this.x*this.y*elt.z); 
    };

    BlockGraph.prototype.threeDimensionalIndex = function(i) {
        return {x: parseInt(i % this.x), y: parseInt(parseInt(i/this.x) % this.y), z: parseInt(i/parseInt(this.x*this.y))};
    };

    window.BlockGraph = BlockGraph;

})();
