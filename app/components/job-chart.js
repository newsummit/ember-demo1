import Component from '@ember/component';
import { get, computed, getProperties, setProperties } from '@ember/object';

// Import the D3 packages we want to use
import { scaleBand, scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { extent, max } from 'd3-array';
import { format } from 'd3-format';

export default Component.extend({
  classNames: ['job-chart'],
  svgEl: null,
  svgSize: { width: 700, height: 500 },
  chartContainer: null,
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
      .paddingOuter(1)
      .paddingInner(0.3);
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

    const container = select(this.element).append('svg')
      .attr('class', `chart`)
      .attr('width', svgSize.width)
      .attr('height', svgSize.height);

    let svg = container.append('g')
      .attr('transform', `translate(${margins.left},${margins.top})`);

    this.set('svgEl', svg);
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

    const xAxis = axisBottom(xScale)
      .tickSizeInner(4)
      .tickSizeOuter(0);

    svgEl.insert('g')
      .attr('class', 'chart__axis chart__axis--x')
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

    // Generate an array of tick values
    const tickValues = Array(ticks)
      .fill()
      .map((item, index) => jobsDataExtent[0] + steps * index);

    const yAxis = axisLeft(yScale)
      .tickValues(tickValues)
      .tickFormat(format('.0f'))
      .tickSizeInner(ticks)
      .tickSizeOuter(ticks);

    svgEl.insert('g')
      .attr('class', 'chart__axis chart__axis--y')
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

    // Append bars to graph svg
    jobCountBars.enter()
      .append('rect')
      .attr('class', 'bar-chart__bar')
      .attr('x', function(d) {
        return xScale(d.name) + xScale.bandwidth() / 8;
      })
      .attr('width', xScale.bandwidth() / 1.2)
      .attr('y', function(d) {
        return yScale(d.numJobs);
      })
      .attr('height', function(d) {
        return chartDimensions.height - yScale(d.numJobs);
      })
      .attr('fill', '#60a425');
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
