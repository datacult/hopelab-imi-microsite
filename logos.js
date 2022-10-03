'use strict'

let logo = ((data, data_map = {org:'organization', url:'url', x:'x', y:'y',cat:'category'}, selector = '#logos-placeholder') => {

    ////////////////////////////////////
    //////////// svg setup /////////////
    ////////////////////////////////////

    var body = d3.select(selector)
    body.html("")

    if (window.outerWidth > 900){
    
    // margins for SVG
    var margin = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }

    // responsive width & height
    var svgWidth = 1440
    var svgHeight = 1160
    } else {
       // margins for SVG
    var margin = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    } 

    // responsive width & height
    var svgWidth = 400
    var svgHeight = svgWidth/1
    }
    

    // helper calculated variables for inner width & height
    const height = svgHeight - margin.top - margin.bottom
    const width = svgWidth - margin.left - margin.right

    // add SVG
    d3.select(".logos-svg").remove();

    const svg = body.append('svg')
        .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
        .attr('class', 'logos-svg')
        .append('g')
        .attr('id','logos-group')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // draw shapes

    svg.append('path')
    .attr('d','M237.5 9.60989C143.1 8.00989 -37.6905 -21.5567 -60.0238 32.61C-66.8572 69.11 -91.3003 353.21 -94.5003 449.61C-98.5003 570.11 -166.524 756.644 120.976 818.11C265.976 849.11 641.453 833.803 691 532.61C710 417.11 616.476 385.11 593.976 249.11C557.251 27.125 355.5 11.6099 237.5 9.60989Z')
    .attr('fill','#52E0BE')
    .attr('opacity',0.3)
    .attr('transform','translate(0,80)')

    svg.append('path')
    .attr('d','M1.00032 293.218C0.200323 100.018 210.526 135.045 340 118.718C510.5 97.2178 798.5 -55.2821 901.5 21.7179C983.9 83.3179 824.834 343.718 784.5 397.718C711.167 454.218 531.6 566.818 400 565.218C235.5 563.218 2.00032 534.718 1.00032 293.218Z')
    .attr('fill','#FFE599')
    .attr('opacity',0.6)
    .attr('transform','translate(698,0)')

    svg.append('path')
    .attr('d','M431.5 150.991C555.1 158.591 788.833 54.4912 868 0.491211L854.5 695.491C807.5 639.491 704.5 532.091 514.5 558.491C277 591.491 146.5 567.991 43.9999 509.991C-58.5001 451.991 38.2546 216.098 134.5 150.991C219.5 93.4912 277 141.491 431.5 150.991Z')
    .attr('fill','#F9CB9C')
    .attr('transform','translate(656,535)')

    var groups = ['youth','community','academic']

    groups.forEach(d => {

        svg.append('g')
        .attr('id',d)

    })

    data.forEach(logo => {
        console.log(logo)

        d3.select('#'+logo[data_map.cat])
            .append('image')
            .attr('id',logo[data_map.org])
            .attr('href','https://datacult.github.io/hopelab-imi-microsite/assets/logos/'+logo[data_map.url])
            .attr('x',logo[data_map.x])
            .attr('y',logo[data_map.y])
            .style('filter','grayscale(100%)')
            .on("mouseover", function() {
                d3.select('#'+this.id)
                .style('filter','grayscale(0%)')
            })
            .on("mouseout", function() {
                d3.select('#'+this.id)
                .style('filter','grayscale(100%)')
            });
        
    });

    svg.select('#youth').attr('transform','translate(85,181)')
    svg.select('#academic').attr('transform','translate(832,187)')
    svg.select('#community').attr('transform','translate(749,710)')

})
