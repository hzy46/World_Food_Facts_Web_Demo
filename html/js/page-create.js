function showBar(data){
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
            data: data,
            pointPadding: 0.1,
            pointPlacement: -0.0
        }]
    });
}


$(function () {
    var init_data =  [150, 73, 80, 200, 160, 170, 180];
    showBar(init_data);

    $('#search-button').on('click', function(){
        var url = api_address + '/menu?';
        if ($('#input-energy').val()) url += "energy_gt=" + $('#input-energy').val() + "&";
        if ($('#input-fat').val()) url += "fat_lt=" + $('#input-fat').val() + "&";
        if ($('#input-sugar').val()) url += "sugar_lt=" + $('#input-sugar').val() + "&";
        if ($('#input-salt').val()) url += "salt_lt=" + $('#input-salt').val() + "&";
        if ($('#input-protein').val()) url += "proteins_lt=" + $('#input-protein').val() + "&";
        if ($('#input-country').val()) url += "country=" + $('#input-country').val() + "&";
        if(url[url.length-1] == '&') url = url.substring(0, url.length-1);
        console.log(url);
        $.ajax({
            url:url,
            type:'get',
            success: function(result){
                result = eval("(" + result + ")");
                console.log(result);
                if (result.error_msg=="Counld not find a proper menu"){
                    $('#error-msg').html('找不到合适的食谱，请重新配置要求。');
                    $('#modal-error-msg').modal();
                    return;
                }
                var bar_data = result.data.energy;
                var menu = result.data.menu_text.trim().split('###');
                var day = 1;
                var text = "";
                for (var i in menu){
                    var day_menu = menu[i];
                    if(day_menu == "") continue;
                    var items = day_menu.split('@');
                    text += "第 " + (day).toString() + ' 天<br>';
                    for(var i=0;i<items.length;i++){
                        text += (i+1).toString() + '. ' +  items[i] + '<br>';        
                    }
                    text += '<br>';
                    day += 1 
                }
                // console.log(text);
                $('#menu-display').html(text);
                showBar(bar_data);
            },
            error: function(){
                $('#error-msg').html('Api调用错误，请检查设置！');
                $('#modal-error-msg').modal();
            },
        });
    });
});
