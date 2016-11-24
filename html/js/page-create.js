$(function () {
    $('#column-container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: '每日卡路里统计'
        },
        xAxis: {
            categories: [
                '周一',
                '周二',
                '周三',
                '周四',
                '周五',
                '周六',
                '周日'
            ]
        },
        yAxis: [{
            min: 0,
            title: {
                text: '卡路里'
            }
        }],
        legend: {
            shadow: false
        },
        tooltip: {
            shared: true
        },
        plotOptions: {
            column: {
                grouping: false,
                shadow: false,
                borderWidth: 0
            }
        },
        series: [{
            name: '卡路里',
            color: 'rgba(165,170,217,1)',
            data: [150, 73, 80, 200, 160, 170, 180],
            pointPadding: 0.1,
            pointPlacement: -0.0
        }]
    });
});
