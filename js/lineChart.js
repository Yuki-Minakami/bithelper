/**
 * Created by likai on 16/4/20.
 */
var option = {
    title : {
        text: '价格走势',
    },
    tooltip : {
        trigger: 'axis'
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {show: true, type: ['line', 'bar']},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : []
        }
    ],
    yAxis : [
        {
            type : 'value',
            min: 400,
            max :440,
            axisLabel : {
                formatter: '{value}'
            }
        }
    ],
    series : [
        {
            name:'价格',
            type:'line',
            data:[],
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值'}
                ]
            }
        }
    ]
};
function getHistoryPrice(id,start,end){
    if(start == undefined || end == undefined){
        var url = "http://api.coindesk.com/v1/bpi/historical/close.json";
    }else{
        var url = "http://api.coindesk.com/v1/bpi/historical/close.json" + "?start="+ start + "&end="+end;
    }
    $.ajax({
        type:"GET",
        url: url,
        success:function(data){
        },
        error:function(data){
            var obj = JSON.parse(data.responseText);
            option.xAxis[0].data = [];
            option.series[0].data = [];
            $.each(obj.bpi,function(date,price){
                option.xAxis[0].data.push(date);
                option.series[0].data.push(price);
            });



            var max = Math.max.apply(null, option.series[0].data);
            var  min = Math.min.apply(null, option.series[0].data);

            option.yAxis[0].max = max +10;
            option.yAxis[0].min = min -10;

            var myChart = echarts.init(document.getElementById(id));
            // 为echarts对象加载数据
            myChart.setOption(option);


        }
    })
}

function getTime(type){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();

    var currentTime = date + "-" + month.length>1 ? "0"+month : month + "-" +day;

    if(type == "week"){

    }


}