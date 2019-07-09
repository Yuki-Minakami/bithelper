/**
 * Created by likai on 16/4/29.
 */
function getUserTime(){
    var begin = document.getElementById('begin').value;
    var end = document.getElementById('end').value;
    var beginDate = begin.substring(0,4) + begin.substring(5,7) + begin.substring(8,10);
    var endDate = end.substring(0,4) + end.substring(5,7) + end.substring(8,10);

    if(parseInt(beginDate)> parseInt(endDate)){
        console.log("data format error")
    }
    else{
        getHistoryPrice("priceChart_info",begin,end);
    }


}

laydate({
    elem: '#begin'
});
laydate({
    elem: '#end'
});