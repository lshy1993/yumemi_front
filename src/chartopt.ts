const options = {
    chart: {
        renderTo: 'container',
        type: 'line'
    },
    title: {
        text: '総人口数',
        align: 'left'
    },
    yAxis: {
        title: {
            text: "人口数"
            // enabled: false
        }
    },
    xAxis: {
        title:{
            text: "年度"
        },
        type: 'year',
        dateTimeLabelFormats: { // don't display the year
            year: '%b'
        },
        accessibility: {
            rangeDescription: 'Range: 1980 to 2045'
        }
    },
    series: []
};

export default options;