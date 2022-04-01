let SHOW_TARGET = "day"
document.addEventListener("DOMContentLoaded", ready);

function ready() {
    console.log("[ready]")
    // console.log("unix : " + moment().unix())
    // console.log("value : " + moment().valueOf())
    // console.log("date : " + moment.unix(1646060400).local().format("LLLL"))

    // event
    eventManage()
    // default
    setDefaultValue()
}

function setDefaultValue() {
    console.log("[setDefaultValue]")

    // default epoch
    document.getElementById("date-e").value = moment(moment().valueOf()).local().unix()
    setEpochToDate()
    // default date
    document.getElementById("input-date-y").value = moment().year()
    document.getElementById("input-date-m").value = moment().month() + 1
    document.getElementById("input-date-d").value = moment().date()
    document.getElementById("input-date-h").value = moment().hour()
    document.getElementById("input-date-mm").value = moment().minutes()
    setDateToEpoch()
}

function eventManage(){
    console.log("[eventManage]")

    // input event only number event
    const input = document.querySelectorAll('.val-input');
    input.forEach(value => {
        value.addEventListener("keyup", numValidator)
    })

    // epoch to date button event
    document.getElementById("etd-btn").addEventListener("click", setEpochToDate)

    // date to epoch button event
    document.getElementById("dte-btn").addEventListener("click", setDateToEpoch)

    // radio y
    const radio = document.querySelectorAll(".radio-date")
    radio.forEach( value => {
        value.addEventListener("click", updateAttr)
        value.addEventListener("click", setDateToEpoch)
    })

    const selectRadio = document.getElementById("date-zone")
    selectRadio.addEventListener("change", setDateToEpoch)
}

function updateAttr(e){
    console.log("[updateAttr]")

    SHOW_TARGET = "day"
    let target = e.target
    let selectLabel = 'label[for=' + target.getAttribute("id") + ']';
    let text = document.querySelector(selectLabel).innerHTML

    document.querySelectorAll(".input-date").forEach( value => {
        value.removeAttribute("disabled")
    })

    if(text === "Year") {
        SHOW_TARGET = "year"
        disableAttr("input-date-m")
        disableAttr("input-date-d")
        disableAttr("input-date-h")
        disableAttr("input-date-mm")
        document.getElementById("table-date-s").innerText = "Start of year"
        document.getElementById("table-date-e").innerText = "End of year"
    }
    if(text === "Month"){
        SHOW_TARGET = "month"
        disableAttr("input-date-d")
        disableAttr("input-date-h")
        disableAttr("input-date-mm")
        document.getElementById("table-date-s").innerText = "Start of month"
        document.getElementById("table-date-e").innerText = "End of month"
    }
    if(text === "Week"){
        SHOW_TARGET = "isoWeek"
        disableAttr("input-date-h")
        disableAttr("input-date-mm")
        document.getElementById("table-date-s").innerText = "Start of Week"
        document.getElementById("table-date-e").innerText = "End of Week"
    }
    if(text === "Day") {
        SHOW_TARGET = "day"
        document.getElementById("table-date-s").innerText = "Start of day"
        document.getElementById("table-date-e").innerText = "End of day"
    }
}

function disableAttr(id) {
    console.log("[disableAttr]")

    document.getElementById(id).setAttribute("disabled", "disabled")
}

function setEpochToDate(){
    console.log("[setEpochToDate]")
    const unix = document.getElementById("date-e").value
    const date = moment.unix(Number(unix))
    document.getElementById("etd-local").innerText = date.local().format('LLLL')
    document.getElementById("etd-gmt").innerText = date.utc().format('LLLL')
}

function setDateToEpoch(){
    console.log("[setDateToEpoch]")
    const zone = document.getElementById("date-zone").value
    const year = document.getElementById("input-date-y").value
    const month = document.getElementById("input-date-m").value
    const day = document.getElementById("input-date-d").value
    const hh = document.getElementById("input-date-h").value
    const mm = document.getElementById("input-date-mm").value
    let date = moment().set({"year" : year, "month" : month-1, "date" : day, "hour" : hh, "minute" : mm, "second" : 0})

    let startEnd = getStartEnd(SHOW_TARGET, date)[zone]
    let epoch_start = startEnd.start_unix
    let epoch_end = startEnd.end_unix
    let date_start = startEnd.start
    let date_end = startEnd.end
    let epoch_current = startEnd.current_epoch
    let date_current = startEnd.current_date_time

    console.log(date)
    console.log(date.unix())
    console.log("zone : " + zone)
    console.log(startEnd)
    console.log("epoch_start : " + epoch_start)
    console.log("epoch_end : " + epoch_end)
    console.log("date_start : " + date_start)
    console.log("date_end : " + date_end)
    console.log("epoch_current : " + epoch_current)
    console.log("date_current : " + date_current)

    document.getElementById("table-epoch-s").innerText = epoch_start
    document.getElementById("table-datetime-s").innerText = date_start
    document.getElementById("table-epoch-e").innerText = epoch_end
    document.getElementById("table-datetime-e").innerText = date_end
    document.getElementById("table-epoch-c").innerText = epoch_current
    document.getElementById("table-datetime-c").innerText = date_current
}

function getStartEnd(t, date){
    console.log("[getStartEnd]")

    const _local = moment(date.valueOf()).local()
    const _utc = moment(date.valueOf()).utc()
    return {
        "local" : {
            "start" : _local.startOf(t).format('LLLL'),
            "end" : _local.endOf(t).format('LLLL'),
            "start_unix" : _local.startOf(t).unix(),
            "end_unix" : _local.endOf(t).unix(),
            "current_epoch" : date.local().unix(),
            "current_date_time" : date.local().format('LLLL')
        },
        "gmt" : {
            "start" : _utc.startOf(t).format('LLLL'),
            "end" : _utc.endOf(t).format('LLLL'),
            "start_unix" : _utc.startOf(t).unix(),
            "end_unix" : _utc.endOf(t).unix(),
            "current_epoch" : date.utc().unix(),
            "current_date_time" : date.utc().format('LLLL')
        }
    }
}

function numValidator(e){
    console.log("[numValidator]")

    e.target.value = e.target.value.replace(/[^0-9]+/g, "");
}