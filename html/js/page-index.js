

function showPie(data){
       $('#pie-container').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: '营养成分'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            data: data
        }]
    });
}

$(function () {
    init_data =  [
                ['糖分',   48.0],
                ['脂肪',       26.8],
                ['蛋白质',    8.5],
                ['盐',       26.8],
                ['碳水化合物',   0.7]
            ];
    showPie(init_data);

    $('#search-result').on('click', '.search-result-item', function(){
        // console.log($(this).attr('data-id'));
        var id = $(this).attr('data-id');
        var url = api_address + '/id/' + id;
        var clicked_item = $(this);
        console.log(url);
        $.get(url, function(result){
            result = eval("(" + result + ")");
            console.log(result);
            var data = result.data;
            var question_mark = '<span class="glyphicon glyphicon-question-sign text-primary"></span>';
            var dict={
                "id": "detect-id",
                "brands": "detect-brands",
                "countries_en": "detect-country",
                //"main_category_en": "detect-category",
                "quantity": "detect-quantity",

                "energy_100g": "detect-energy",
                "fat_100g": "detect-fat",
                "sugars_100g": "detect-sugar",
                "carbohydrates_100g": "detect-carbohydrates",
                "proteins_100g": "detect-protein",
                "salt_100g": "detect-salt"
            }
            for (key in dict){
                if(data[key])
                    $("#" + dict[key]).html(data[key]);
                else
                    $("#" + dict[key]).html(question_mark);
            }
            pie_data =  [
                ['糖分',   parseFloat(data.sugars_100g)],
                ['脂肪',    parseFloat(data.fat_100g)  ],
                ['蛋白质',    parseFloat(data.proteins_100g)],
                ['盐',       parseFloat(data.salt_100g)],
                ['碳水化合物',   parseFloat(data.carbohydrates_100g)]
            ];
            showPie(pie_data);
            $('.list-group-item').removeClass('active');
            clicked_item.addClass('active');


        });

    })

    $('#search').on('click', function(){
        var search_text = $('#search-text').val();
        var url = api_address + '/search/' + search_text;
        console.log(url);
        $.get(url, function(result){
            var json_result = eval("(" + result + ")");
            // console.log(json_result);
            // console.log(json_result.data);
            $('#search-result').empty();
            if(json_result.data.length == 0){
                $('#search-result').append('<h4>没有找到任何结果。请尝试其他关键词。</h4>');
            }else{
                 $('#search-result').append('<h5>搜索结果：</h5>');
                for(var i=0; i<json_result.data.length;i++){
                     $('<a/>', {
                            'class': 'list-group-item search-result-item',
                            'href': '#',
                            'text': json_result.data[i].name,
                            'data-id': json_result.data[i].id
                        }).appendTo($('#search-result'));
                }
            }
        });
    });
});
