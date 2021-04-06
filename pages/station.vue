<template>
  <div id="app" class="outer">
    <v-app id="inspire">


    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar
            dark
            color="cyan darken-4"
          >
            <v-btn
              dark
              rounded
              color="cyan darken-4"
              depressed
              elevation="4"
              @click="closeDashboard"
            >
              <v-icon
                dark
              > mdi-close
              </v-icon> Close
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title>Temperature Dashboard</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-card
              class="d-flex align-stretch mb-6"
              flat
              height="49%"
              width = "100%"
              tile
           >
             <div id="bodyNorm">
             </div>
           </v-card>
            <v-divider></v-divider>
          <v-card
              class="d-flex align-stretch mb-6"
              flat
              height="49%"
              width = "100%"
              tile
           >
             <div id="bodyStd">
             </div>
           </v-card>

        </v-card>
      </v-dialog>


      <template>

                <v-data-table
                :headers="headers"
                :itemsPerPage="10"
                :items="stations"
                :loading="loading"
                sort-by="datacoverage"
                class="elevation-24"
                >
                    <template v-slot:top>
                    <v-toolbar flat color="white">
                        <v-toolbar-title><h5>Stations List</h5></v-toolbar-title>
                        <v-divider
                        class="mx-4"
                        inset
                        vertical
                        ></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn
                          dark
                          rounded
                          color="cyan darken-4"
                          depressed
                          elevation="4"
                          medium
                          @click="goBack"
                        >
                          <v-icon
                            dark
                            left
                          > mdi-arrow-left
                          </v-icon> Back
                        </v-btn>
                    </v-toolbar>
                    </template>

                    <template v-slot:item.actions="{ item }">
                        <v-btn
                          icon
                          dark
                          rounded
                          medium
                          color="cyan darken-4"
                          depressed
                          elevation="4"
                          @click="selectItem(item)"
                        >
                          <v-icon
                            dark
                            medium
                          > mdi-checkbox-marked-circle
                          </v-icon>
                        </v-btn>
                    </template>

                </v-data-table>
      </template>


    </v-row>
    </v-app>
  </div>
</template>



<script>

import axios from 'axios';
import * as d3 from "d3";

export default {

  computed: {},

  data () {
    return {
      totalStations: 0,
      stations: [],
      loading: true,
      latitude: '',
      longitude: '',
      startDate: '',
      endDate: '',
      dialog: false,
      stationid: '',
      doc_id: '',
      net: '',
      extent: '',
      results:[],
      results_std:[],
      headers: [
        { text: 'Station Name', align: 'start', sortable: false, value: 'name' },
        { text: 'Station ID', value: 'id' },
        { text: 'Elevation Unit', value: 'elevationUnit' },
        { text: 'Data Coverage', value: 'datacoverage', sortable: true },
        { text: 'Latitude', value: 'latitude' },
        { text: 'Longitude', value: 'longitude' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    }
  },
  mounted () {

    this.latitude = this.$route.params.lat;
    console.log(this.latitude)
    this.longitude = this.$route.params.lng
    console.log(this.longitude)
    this.startDate = this.$route.params.start
    console.log(this.startDate)
    this.endDate = this.$route.params.end
    console.log(this.endDate)
    this.net = this.$route.params.net
    console.log(this.net)

    this.getDataFromApi()

  },
  methods: {


    async getDataFromApi () {

      this.loading = true

      const stations = await axios.post('https://solar-api-309118.uc.r.appspot.com/stations', { 'lat': this.latitude, 'lng': this.longitude, 'start': this.startDate, 'end': this.endDate, 'net': this.net })
      console.log(stations)
      console.log(stations.data.results)


      this.doc_id = stations.data.doc_id
      this.extent = stations.data.extent
      let items = stations.data.results

      this.stations = items
      this.loading = false

    },

    async selectItem (item){

        console.log(item.id)
        console.log(this.doc_id)
        this.stationid = item.id
        this.dialog = true;

        const tempData = await axios.post('https://solar-api-309118.uc.r.appspot.com/data', { 'doc_id': this.doc_id, 'extent': this.extent, 'stationid': this.stationid, 'start': this.startDate, 'end': this.endDate })
        console.log(tempData)
        console.log(tempData.data.results)

        this.results = tempData.data.results
        this.results_std = tempData.data.results_std

        createChart(this.results);
        createStdChart(this.results_std)

    },

    goBack (){
        this.$router.go(-1);
    },

    closeDashboard (){
      this.dialog = false;
      d3.select("#bodyNorm").selectAll('svg').remove();
      d3.select("#bodyStd").selectAll('svg').remove();
    },

  },
}


function createChart(data) {

// Set the dimensions of the canvas / graph
var	margin = {top: 30, right: 20, bottom: 30, left: 50},
	width = 1500 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;

// Parse the date / time
var	parseDate = d3.time.format.utc("%Y-%m-%dT%H:%M:%S").parse;

// Set the ranges
var	x = d3.time.scale().range([0, width]);
var	y = d3.scale.linear().range([height, 0]);

// Define the axes
var	xAxis = d3.svg.axis().scale(x)
	.orient("bottom").ticks(20);

var	yAxis = d3.svg.axis().scale(y)
	.orient("left").ticks(10);

// Define the line
var	valueline = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.value); });

// Adds the svg canvas
var	svg = d3.select("#bodyNorm")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
  data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.value = +d.value;
  });

	// Scale the range of the data
	x.domain(d3.extent(data, function(d) { return d.date; }));
	y.domain([0, d3.max(data, function(d) { return d.value; })]);

	// Add the valueline path.
	svg.append("path")		// Add the valueline path.
		.attr("class", "line")
		.attr("d", valueline(data));

	// Add the X Axis
	svg.append("g")			// Add the X Axis
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

  // Add the text label for the x axis
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Date");

	// Add the Y Axis
	svg.append("g")			// Add the Y Axis
		.attr("class", "y axis")
		.call(yAxis);

    // Add the text label for the Y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Temperature (F) NORMAL");


}

function createStdChart(data) {

// Set the dimensions of the canvas / graph
var	margin = {top: 30, right: 20, bottom: 30, left: 50},
	width = 1500 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;

// Parse the date / time
var	parseDate = d3.time.format.utc("%Y-%m-%dT%H:%M:%S").parse;

// Set the ranges
var	x = d3.time.scale().range([0, width]);
var	y = d3.scale.linear().range([height, 0]);

// Define the axes
var	xAxis = d3.svg.axis().scale(x)
	.orient("bottom").ticks(20);

var	yAxis = d3.svg.axis().scale(y)
	.orient("left").ticks(10);

// Define the line
var	valueline = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.value); });

// Adds the svg canvas
var	svg = d3.select("#bodyStd")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
  data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.value = +d.value;
  });

	// Scale the range of the data
	x.domain(d3.extent(data, function(d) { return d.date; }));
	y.domain([0, d3.max(data, function(d) { return d.value; })]);

	// Add the valueline path.
	svg.append("path")		// Add the valueline path.
		.attr("class", "line")
		.attr("d", valueline(data));

	// Add the X Axis
	svg.append("g")			// Add the X Axis
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

    // Add the text label for the x axis
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Date");

	// Add the Y Axis
	svg.append("g")			// Add the Y Axis
		.attr("class", "y axis")
		.call(yAxis);

    // Add the text label for the Y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Temperature (F) STDDEV");


}

</script>


<style>

body {
  font: 12px Arial;
}

path {
  stroke: steelblue;
	stroke-width: 2;
	fill: none;
}

.axis path,
.axis line {
	fill: none;
	stroke: grey;
	stroke-width: 1;
	shape-rendering: crispEdges;
}

</style>
