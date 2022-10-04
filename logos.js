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

    var paths = ['M237.5 9.60989C143.1 8.00989 -37.6905 -21.5567 -60.0238 32.61C-66.8572 69.11 -91.3003 353.21 -94.5003 449.61C-98.5003 570.11 -166.524 756.644 120.976 818.11C265.976 849.11 641.453 833.803 691 532.61C710 417.11 616.476 385.11 593.976 249.11C557.251 27.125 355.5 11.6099 237.5 9.60989Z','M1.00032 293.218C0.200323 100.018 210.526 135.045 340 118.718C510.5 97.2178 798.5 -55.2821 901.5 21.7179C983.9 83.3179 824.834 343.718 784.5 397.718C711.167 454.218 531.6 566.818 400 565.218C235.5 563.218 2.00032 534.718 1.00032 293.218Z','M431.5 150.991C555.1 158.591 788.833 54.4912 868 0.491211L854.5 695.491C807.5 639.491 704.5 532.091 514.5 558.491C277 591.491 146.5 567.991 43.9999 509.991C-58.5001 451.991 38.2546 216.098 134.5 150.991C219.5 93.4912 277 141.491 431.5 150.991Z']
    var path_position = [{x:0,y:80},{x:698,y:0},{x:656,y:535}]
    var group_position = [{x:85,y:181},{x:832,y:187},{x:749,y:710}]
    var scl = 1
    } else {
       // margins for SVG
    var margin = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    } 

    // responsive width & height
    var svgWidth = 375
    var svgHeight = 1100

    var paths = ['M100.98 5.45625C48.511 4.56694 -51.9757 -11.8667 -64.3889 18.2401C-68.187 38.5275 -81.773 196.436 -83.5516 250.017C-85.7749 316.993 -123.584 420.672 36.2143 454.836C116.808 472.066 325.505 463.559 353.044 296.15C363.605 231.953 311.622 214.166 299.117 138.575C278.704 15.1915 166.567 6.56789 100.98 5.45625Z','M0.0287226 162.408C-0.405867 57.4548 101.983 65.5747 172.318 56.7054C264.94 45.0257 365.19 -29.1636 421.144 12.6656C465.907 46.1291 457 414.922 435.09 444.257C395.252 474.95 311.778 325.349 194.338 301.127C106.811 283.074 0.57196 293.6 0.0287226 162.408Z','M217.433 167.415C317.257 146.129 380.527 27.7331 420.017 0.797004L424.103 469.168C400.659 441.234 349.281 387.662 254.506 400.83C136.037 417.291 82.8596 419.482 31.731 390.551C-19.3977 361.619 -2.66164 237.628 47.8793 209.253C89.7149 185.765 141.918 183.517 217.433 167.415Z']
    var path_position = [{x:0,y:345},{x:12,y:0},{x:10,y:672}]
    var group_position = [{x:16,y:402},{x:85,y:97},{x:30,y:872}]
    var scl = 0.543
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
    .attr('d',paths[0])
    .attr('fill','#52E0BE')
    .attr('opacity',0.3)
    .attr('transform','translate('+path_position[0].x+','+path_position[0].y+')')

    svg.append('path')
    .attr('d',paths[1])
    .attr('fill','#FFE599')
    .attr('opacity',0.6)
    .attr('transform','translate('+path_position[1].x+','+path_position[1].y+')')

    svg.append('path')
    .attr('d',paths[2])
    .attr('fill','#F9CB9C')
    .attr('transform','translate('+path_position[2].x+','+path_position[2].y+')')

    var groups = ['youth','community','academic']

    groups.forEach(d => {

        svg.append('g')
        .attr('id',d)

    })

    data.forEach(logo => {
        console.log(logo)

        d3.select('#'+logo[data_map.cat])
            .append('image')
            .attr('class','logo')
            .attr('id',logo[data_map.org])
            .attr('href','https://datacult.github.io/hopelab-imi-microsite/assets/logos/'+logo[data_map.url])
            .attr('x',logo[data_map.x])
            .attr('y',logo[data_map.y])
            .attr('transform','scale('+scl+')')
            .style('-webkit-filter','grayscale(100%)')
            .on("mouseover", function() {
                d3.select('#'+this.id)
                .style('-webkit-filter','grayscale(0%)')
            })
            .on("mouseout", function() {
                d3.select('#'+this.id)
                .style('-webkit-filter','grayscale(100%)')
            });
        
    });

    svg.select('#youth').attr('transform','translate('+group_position[0].x+','+group_position[0].y+')')
    svg.select('#academic').attr('transform','translate('+group_position[1].x+','+group_position[1].y+')')
    svg.select('#community').attr('transform','translate('+group_position[2].x+','+group_position[2].y+')')

})
