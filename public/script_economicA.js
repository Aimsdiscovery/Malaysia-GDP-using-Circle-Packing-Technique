fetch('flare-economicA.json')
  .then(response => response.json())
  .then(actualData => {
    const width = 800;
    const height = width;

    // Create the layout using the actual data
    const pack = data => d3.pack()
      .size([width/10, height/10])
      .padding(3)
    (d3.hierarchy(actualData)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value));
    const root = pack(actualData);

    // Create the SVG container using the actual data
    const svg = d3.create("svg")
      .attr("viewBox", `-${width/2} -${height/2} ${width} ${height}`)
      .attr("width", "70%")
      .attr("height", "20%")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("style", `max-width: ${width}px; height: auto; display: block; margin: 0 auto; background: white; cursor: pointer; border: 1px solid black; border-radius: 10px;`);

    // Append the nodes using the actual data
    const node = svg.append("g")
  .selectAll("circle")
  .data(root.descendants().slice(1))
  .join("circle")
    .attr("fill", d => {
      // Get the color from data or default to steelblue
      const color = d.data.color || "steelblue";
      // Set the transparency value (0.5 in this case for 50% transparency)
      const transparency = 0.65;
      
      // Convert color to RGBA format
      const rgb = d3.color(color).rgb();
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${transparency})`;
    })
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("pointer-events", d => !d.children ? "none" : null)
        .on("mouseover", function() { 
          d3.select(this)
            .attr("stroke", "#000")
            .attr("stroke-width", 2);
        })
        .on("mouseout", function() { 
          d3.select(this)
            .attr("stroke", "black")
            .attr("stroke-width", 1);
        })
        .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

    // Append the text labels using the actual data
    const label = svg.append("g")
      .style("font", "bold 20px sans-serif")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .style("fill", "black")
      .style("fill-opacity", d => d.parent === root ? 1 : 0)
      .style("display", d => d.parent === root ? "inline" : "none")
      .text(d => {
        const name = d.data.name || ''; // Use an empty string if name is missing
        const value = d.data.GDP !== undefined && d.data.GDP !== null ? d.data.GDP : ''; // Use an empty string if value is missing or null
        return value ? `${name}: ${value}` : name; // Only include ": value" if value is present
      })
    // Create the zoom behavior and zoom immediately in to the initial focus node using the actual data
    svg.on("click", (event) => zoom(event, root));
    let focus = root;
    let view;
    zoomTo([focus.x, focus.y, focus.r * 2]);

    function zoomTo(v) {
      const k = width / v[2];

      view = v;

      label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("r", d => d.r * k);
    }

    function zoom(event, d) {
      const focus0 = focus;

      focus = d;

      const transition = svg.transition()
          .duration(event.altKey ? 7500 : 750)
          .tween("zoom", d => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return t => zoomTo(i(t));
          });

      label
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .transition(transition)
          .style("fill-opacity", d => d.parent === focus ? 1 : 0)
          .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }

    // Append the SVG to the DOM
    document.body.appendChild(svg.node());
  })
  .catch(error => {
    console.error('Error fetching or parsing flare-2.json:', error);
  });
