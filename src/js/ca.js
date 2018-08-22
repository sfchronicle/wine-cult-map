const d3 = require('d3');

const topojson = require('topojson');



const margin = {top: 10, bottom: 10, right: 10, left: 10}
const chart = sschart()
const el = d3.select('#ca-reference')

let width = 0
let height = 0
let chartWidth = 0
let chartHeight = 0


let projection = d3.geoAlbers().parallels([34, 40.5]).rotate([120, 0])
let path = d3.geoPath();


const annotations = [
  {
    "two_adults": 56160,
    "snap_threshold": 49200,
    "self_sufficiency": 125995,
    "i": 2,
    "path": "M35,30L0,0",
    "text": "In San Mateo, two adults working full-time making minimum wage would be ineligible for SNAP.",
    "textOffset": [43, 11]
  },
  {
    "two_adults": 62400,
    "snap_threshold": 49200,
    "self_sufficiency": 123442,
    'i': 3.5,
    "path": "M35,30L0,0",
    "text": "In SF, minimum wage increased to $15.00 on July 1, 2018, widening the gap for SNAP eligibility.",
    "textOffset": [43, 11]
  }
]

function resize() {
  const width = window.innerWidth > 900 ? 250 : 175
  const height = width * (600/514)
  chart.width(width).height(height)
  el.call(chart)
}

function sschart() {
  
  function enter({ container, data }) {
  	const svg = container.selectAll('svg').data([data])
    const svgEnter = svg.enter().append('svg').attr("class", "ca-svg")
    const gEnter = svgEnter.append('g')
    gEnter.append("g").attr("class", "states")
    gEnter.append("g").attr("class", "cities")
    gEnter.append("g").attr("class", "oregonhouse")
    
  }

 

  function updateDom({ container, data }) {
  	
  	const svg = container.select('svg')
  	svg
      .attr('width', width)
      .attr('height', height)

    const g = svg.select('g')
    const states = g.select(".states")
    const cities = g.select(".cities")
    const oregonhouse = g.select(".oregonhouse")

    g.attr('transform', `translate(${margin.left}, ${margin.top})`)

    var land = topojson.feature(data, {
	    type: "GeometryCollection",
	    geometries: data.objects['cb_2017_us_state_500k'].geometries.filter(function(d) {
	      return d.properties['STATEFP'] == '06' 
	    }),
	    arcs: data.objects['cb_2017_us_state_500k'].geometries.map(function(d) {
	      d.arcs = [d.arcs[d.arcs.length-1]]
	    })
	  })

    projection
     .fitExtent([[0,0], [chartWidth,chartHeight]], land)
 	
    path.projection(projection)

    const state = states
      .selectAll(".state")
      .data(land.features)

    state
      .enter()
      .append("path")
      .attr("class", "state")
    .merge(state)
      .attr("fill", "#d3d3d3")
      .attr("d", path)
      
    const cityG = cities.selectAll(".city-g")
      .data(california_cities)

    const city = cityG
      .enter()
      .append("g")
      .attr("class", "city-g")
    .merge(cityG)
      .attr("transform", d => {
        return `translate(${projection([d['lng'], d['lat']])[0]}, ${projection([d['lng'], d['lat']])[1]})`
      })

    const cityCircle = city.selectAll(".city-circle")
      .data(d => [d])

    cityCircle
      .enter()
      .append("circle")
      .attr("class", "city-circle")
    .merge(cityCircle)
      .attr("r", 3)

    const cityText = city.selectAll(".city-text")
      .data(d => [d])

    cityText
      .enter()
      .append("text")
      .attr("class", "city-text")
    .merge(cityText)
      .text(d => d['city'])
      .attr("x", 7.5)

    const oregong = oregonhouse.selectAll(".oregong")
     	.data([{lat: 39.3293, lng: -121.2525}])

    const oregongEnter = oregong
     	.enter()
     	.append("g")
     	.attr("class", "oregong")
     .merge(oregong)
     	.attr("transform", d => `translate(${projection([d['lng'], d['lat']])[0]}, ${projection([d['lng'], d['lat']])[1]})`)

    const oregon = oregongEnter.selectAll(".oregon")
    	.data(d => [d])

    oregon
    	.enter()
    	.append("rect")
    	.attr("class", "oregon")
    .merge(oregon)
    	.attr("width", chartWidth/10)
    	.attr("height", chartWidth/20)




    
   
	}

  function chart(container) {
    const data = container.datum()
    enter({ container, data })
    updateDom({ container, data })

  }

  chart.width = function(...args) {
    if (!args.length) return width
    width = args[0]
    chartWidth = width - margin.left - margin.right

  

    return chart
  }

  chart.height = function(...args) {
    if (!args.length) return height
    height = args[0]
    chartHeight = height - margin.top - margin.bottom
    return chart
  }
  return chart
}

function init() {

	el.datum(us_data)
  resize()
  window.addEventListener('resize', resize)
}


init()