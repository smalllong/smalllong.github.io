function drawFan(selector, json, options) {
    var radius = options.radius || 300,
		textDepth = options.textDepth || 0,
		duration = options.duration || 750,
		weight = options.weight || "size",
		count = options.count || false;
		
	var width = 2 * radius,
		height = 2 * radius,
		padding = 0,		//文字与内弧的距离
		level = 0;			//记录当前缩放级别

    var x = d3.scale.linear()	//将0~1线性映射到0~2pi
			.range([0, 2 * Math.PI]);

    var y = d3.scale.sqrt()
			.range([0, radius]);

    var color = d3.scale.category20c();

    var svg = d3.select(selector).append("svg")
			.attr("width", width+"px")
			.attr("height", height+"px")
			.append("g")
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var partition = d3.layout.partition()
			.value(function (d) { if(count) return 1; return d[weight]; });

    var arc = d3.svg.arc()
			.startAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
			.endAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
			.innerRadius(function (d) { return Math.max(0, y(d.y)); })
			.outerRadius(function (d) { return Math.max(0, y(d.y + d.dy)); });

    d3.json(json, function (error, root) {
        if (error) throw error;

        var path = svg.selectAll("path")		//画图形
				.data(partition.nodes(root))
				.enter().append("path")
				.attr("d", arc)
				.style("fill", function (d) { return color((d.children ? d : d.parent).name); })
				.on("click", click);
		
        var text = svg.selectAll("text").data(partition.nodes(root))	//标文字
				.enter().append("text")
				.style("fill", function (d) {
					return brightness(d3.rgb(color((d.children ? d : d.parent).name))) < 125 ? "#fff" : "#000";
				})
				.style("display", function (e) {
					return (e.depth < textDepth) ? null : "none"; 
				})
				.attr("text-anchor", function (d) {
					return x(d.x + d.dx / 4) > Math.PI ? "end" : "start";
				})
				.attr("dy", ".2em")
				.attr("transform", function (d) {
					var angle = x(d.x + d.dx / 4) * 180 / Math.PI - 90;
					return "rotate(" + angle + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
				})
				.on("click", click);
        text.append("tspan")
            .attr("x", 0)
            .text(function (d) { return d.name; });

        function click(d) {
			if(d.depth == level) return;
			if(d.depth > level) {			//放大
				path.transition()
					.duration(duration)
					.attrTween("d", arcTween(d))
					.each("end",function(e){
						d3.select(this).style("display", (isAncestorOf(d, e)||d.parent===e) ? null : "none");
					});
				text.style("display", function (e) {
						return (isAncestorOf(d, e)&&(e.depth - d.depth) < textDepth) ? null : "none"; 
					})
					.transition()
					.duration(duration)
					.attrTween("text-anchor", function (d) {
						return function () {
							return x(d.x + d.dx / 4) > Math.PI ? "end" : "start";
						};
					})
					.attrTween("transform", function (d) {
						return function () {
							var angle = x(d.x + d.dx / 4) * 180 / Math.PI - 90;
							return "rotate(" + angle + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
						};
					});
			}else {							//缩小
				path.style("display", function (e) {
						return (isAncestorOf(d, e)||d.parent===e) ? null : "none";
					})
					.transition()
					.duration(duration)
					.attrTween("d", arcTween(d));
				text.transition()
					.duration(duration)
					.attrTween("text-anchor", function (d) {
						return function () {
							return x(d.x + d.dx / 4) > Math.PI ? "end" : "start";
						};
					})
					.attrTween("transform", function (d) {
						return function () {
							var angle = x(d.x + d.dx / 4) * 180 / Math.PI - 90;
							return "rotate(" + angle + ")translate(" + (y(d.y) + padding) + ")rotate(" + (angle > 90 ? -180 : 0) + ")";
						};
					})
					.each("end",function (e) {
						d3.select(this).style("display", (isAncestorOf(d, e)&&(e.depth - d.depth) < textDepth) ? null : "none");
					});
			}
			level = d.depth;
        }
    });

    function arcTween(d) {
        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
            yd = d3.interpolate(y.domain(), [d.y, 1]),
            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
        return function (d, i) {
            return i
                ? function (t) { return arc(d); }
                : function (t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
        };
    }

    function isAncestorOf(p, c) {
        if (p === c) return true;
        if (p.children) {
            return p.children.some(function (d) {
                return isAncestorOf(d, c);
            });
        }
        return false;
    }

    function brightness(rgb) {
        return rgb.r * .333 + rgb.g * .333 + rgb.b * .333;
    }
}