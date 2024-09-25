// src/components/DonutChart.js
import React, { useEffect, useState } from 'react';
import { AgChartsReact } from 'ag-charts-react';

const DonutChart = ({ data }) => {
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    setChartOptions({
      title: {
        text: 'Leads by Follow-up Status',
        fontSize: 18,
      },
      type: 'donut',
      data: data,
      series: [
        {
          angleKey: 'count',
          labelKey: 'category',
          outerRadiusOffset: 0.1,
        },
      ],
      legend: {
        position: 'bottom',
      },
      innerRadiusRatio: 0.4,
      tooltip: {
        renderer: (params) => {
          return `${params.datum.category}: ${params.datum.count} leads`;
        },
      },
    });
  }, [data]);

  if (!chartOptions) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <AgChartsReact options={chartOptions} />
    </div>
  );
};

export default DonutChart;
