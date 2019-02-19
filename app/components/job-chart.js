import Component from '@ember/component';
import { get, computed, getProperties, setProperties } from '@ember/object';

// Import the D3 packages we want to use
import { scaleBand, scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft, axis } from 'd3-axis';
import { select } from 'd3-selection';
import { extent, max } from 'd3-array';
import { format } from 'd3-format';

export default Component.extend({
  classNames: ['job-chart'],
  svgEl: null,
  companyData: null,
  chartContainer: null,
  svgSize: { width: 700, height: 500 },
  chartMargins: {
    top: 20,
    right: 20,
    bottom: 150,
    left: 60
  },

  init() {
    this._super(...arguments);
    const data = get(this, 'companyData');
    const numJobsArray = data.map(company => company.numJobs);

    // Used to calculate Y axis ticks and scale
    setProperties(this, {
      jobsDataExtent: extent(numJobsArray), // min and max
      maxNumJobs: max(numJobsArray)
    });
  },

  /**
   * @description Calculate chart dimensions
   */
  chartDimensions: computed(function() {
    const {
      svgSize,
      chartMargins: margins
    } = getProperties(this, 'chartMargins', 'svgSize');
    return {
      height: svgSize.height - margins.top - margins.bottom,
      width: svgSize.width - margins.right - margins.left
    }
  }),

  /**
   * @description Calculate bar bands based on number of bars and chart width
   */
  xScale: computed('companyData', 'chartDimensions', function() {
    const {
      companyData,
      chartDimensions
    } = getProperties(this, 'companyData', 'chartDimensions');

    return scaleBand()
      .domain(companyData.mapBy('name'))
      .range([0, chartDimensions.width])
      .paddingOuter(1);
  }),

  /**
   * @description Used to calculate tick positions on Y axis based on data
   */
  yScale: computed('companyData', 'chartDimensions', function() {
    const {
      jobsDataExtent,
      chartDimensions
    } = getProperties(this, 'jobsDataExtent', 'chartDimensions');

    return scaleLinear()
      .domain(jobsDataExtent)
      .range([chartDimensions.height, 0]);
  }),

  /**
   * @description We are appending an SVG element to our component view and giving it margins
   */
  addSVG: function() {
    const {
      svgSize,
      chartMargins: margins,
    } = getProperties(this, 'chartMargins', 'svgSize');

    // Create an SVG element
    const svg = select(this.element).append('svg')
      .attr('width', svgSize.width)
      .attr('height', svgSize.height);

    // Give margins to make space for axis ticks and labels
    const svgContainer = svg.append('g')
      .attr('transform', `translate(${margins.left},${margins.top})`);

    this.set('svgEl', svgContainer);
  },

  /**
   * @description Appending the X axis element, titlting labels, adding css control
   */
  insertXAxis: function() {
    const {
      svgEl,
      xScale,
      chartDimensions
    } = getProperties(this, 'svgEl', 'xScale', 'chartDimensions');

    // Holds names, ranges, ticks
    const xAxis = axisBottom(xScale)
      .tickSizeInner(4)
      .tickSizeOuter(0);

    // Lets create a text element for each axis name (or band)
    svgEl.insert('g')
      .attr('class', 'job-chart__axis-x')
      .attr('transform', `translate(0,${chartDimensions.height})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');
  },

  /**
   * @description Appending the Y axis element, spreading out the ticks
   */
  insertYAxis: function() {
    const {
      svgEl,
      yScale,
      maxNumJobs,
      jobsDataExtent
    } = getProperties(this, 'svgEl', 'yScale', 'maxNumJobs', 'jobsDataExtent');
    
    // Figure out spacing between ticks
    const ticks = maxNumJobs + 1;
    const diff = jobsDataExtent[1] - jobsDataExtent[0];
    const steps = diff / (ticks - 1);

    // Generate the correct number of tick values
    const tickValues = Array(ticks)
      .fill()
      .map((item, index) => jobsDataExtent[0] + steps * index);

    // Format the tick values
    const yAxis = axisLeft(yScale)
      .tickValues(tickValues)
      .tickFormat(format('.0f'))
      .tickSizeInner(ticks)
      .tickSizeOuter(ticks);

    // Append them to our SVG
    svgEl.insert('g')
      .attr('class', 'job-chart__axis-x')
      .call(yAxis);
  },

  /**
   * @description Binding the data to our chart
   */
  drawData: function() {
    const {
      companyData,
      chartDimensions,
      svgEl,
      xScale,
      yScale
    } = getProperties(this, 'companyData', 'chartDimensions', 'svgEl', 'xScale', 'yScale');

    // Select all bars
    const jobCountBars = svgEl
      .selectAll('.bar-chart__bar') // Have to select something
      .data(companyData, function(d) {
        return d.numJobs;
      });

    // Append bars to graph svg, position them
    jobCountBars.enter()
      .append('rect')
      .attr('class', 'job-chart__bar')
      .attr('x', function(d) {
        return xScale(d.name) + xScale.bandwidth() / 8;
      })
      .attr('width', xScale.bandwidth() / 1.2)
      .attr('y', function(d) {
        return yScale(d.numJobs);
      })
      .attr('height', function(d) {
        return chartDimensions.height - yScale(d.numJobs);
      });
  },

  /**
   * @description Once our view renders, we can append graph elements to it
   */
  didInsertElement: function() {
    // Render SVG with container margins
    this.addSVG();

    // Create the axes, ticks, labels
    this.insertXAxis();
    this.insertYAxis();

    // Draw the actual bars
    this.drawData();
  }
});
