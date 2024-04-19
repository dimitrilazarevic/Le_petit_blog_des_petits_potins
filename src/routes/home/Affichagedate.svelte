<script>
    export let date;
    date = new Date(date)
    let month = date.getMonth()
    let day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let seconds = date.getSeconds()
    let values = {month:month,day:day,hours:hours,minutes:minutes,seconds:seconds} 
    for(const key in values){
        (values[key]<10)?values[key]="0"+values[key]:values[key]=values[key];
    }
    let displayedDate,displayedHour ;
    displayedDate = values.day+"/"+values.month+'/'+date.getFullYear();
    displayedHour = values.hours+":"+values.minutes+":"+values.seconds;

</script>

Le {displayedDate} à {displayedHour}