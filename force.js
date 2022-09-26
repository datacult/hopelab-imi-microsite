'use strict'

let force = ((selector = '#force') => {

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false

    ////////////////////////////////////
    //////////// svg setup /////////////
    ////////////////////////////////////

    var body = d3.select(selector)
    body.html("")

    // margins for SVG
    const margin = isMobile ? {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
    } : {
        left: 100,
        right: 100,
        top: 100,
        bottom: 100
    }

    // responsive width & height
    const svgWidth = 500 // parseInt(d3.select(selector).style('width'), 10)
    const svgHeight = 500 // parseInt(d3.select(selector).style('height'), 10)

    // helper calculated variables for inner width & height
    const height = svgHeight - margin.top - margin.bottom
    const width = svgWidth - margin.left - margin.right

    // add SVG
    d3.select(`${selector} svg`).remove();

    const svg = d3.select(selector)
        .append('svg')
        .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    ////////////////////////////////////
    //////////////globals///////////////
    ////////////////////////////////////



    ////////////////////////////////////
    //////////////wrangle///////////////
    ////////////////////////////////////

    const data = {
        "nodes": [
            { "id": "1", "group": 1, "href": "https://hopelab.org/discovery" },
            { "id": "2", "group": 1, "href": "https://hopelab.org/research/" },
            { "id": "3", "group": 1, "href": "https://hopelab.org/insights" },
            { "id": "4", "group": 1, "href": "https://hopelab.org/investments" },
            { "id": "5", "group": 1, "href": "https://hopelab.org/studio" },
        ],
        "links": [
            { "source": "1", "target": "2", "value": 1 },
            { "source": "1", "target": "5", "value": 1 },
            { "source": "2", "target": "3", "value": 1 },
            { "source": "2", "target": "5", "value": 1 },
            { "source": "3", "target": "4", "value": 1 },
            { "source": "3", "target": "5", "value": 1 },
            { "source": "4", "target": "5", "value": 1 },
        ]
    }

    const links = data.links.map(d => Object.create(d))
    const nodes = data.nodes.map(d => Object.create(d))


    ////////////////////////////////////
    //////// simulation setup //////////
    ////////////////////////////////////   

    let drag = simulation => {

        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            event.subject.fx = event.subject.x
            event.subject.fy = event.subject.y
        }

        function dragged(event) {
            event.subject.fx = event.x
            event.subject.fy = event.y
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0)
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    }


    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(10))
        .force("charge", d3.forceManyBody())
        .force("collide", d3.forceCollide(50).iterations(100))
        .force("center", d3.forceCenter(width / 2, height / 2))
        // .alphaDecay(0.01)


    ////////////////////////////////////
    //////////// add to DOM ////////////
    ////////////////////////////////////  

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value))

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll(".forcebubbles")
        .data(nodes)
        .join("a")
        .attr("xlink:href", d => d.href)
        .attr("target","_blank")
        .append("svg:image")
        .attr("xlink:href", (d,i) => `/assets/force/${i+1}.svg`)
        .attr("width", 100)
        .attr("height", 100)
        .style("transform", "translate(-50px,-50px)")
        .attr("class", "forcebubbles")
        .call(drag(simulation))

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)

        node
            .attr("x", d => d.x)
            .attr("y", d => d.y)
    })

})

