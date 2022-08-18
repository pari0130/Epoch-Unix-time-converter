let SHOW_TARGET = "day"
const DATE_FORMAT = "YYYY-MM-DD(ddd) HH:mm:ss.SSS" // "YYYY-MM-DD(ddd) hh:mm:ss a"
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
    document.getElementById("input-date-sec").value = moment().second()
    document.getElementById("input-date-miles").value = moment().millisecond()
    setDateToEpoch()
}

function eventManage(){
    console.log("[eventManage]")

    // input event only number event
    const input = document.querySelectorAll('.val-input');
    input.forEach(value => {
        value.addEventListener("keyup", inputKeyEvent)
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
        disableAttr("input-date-sec")
        disableAttr("input-date-miles")
        document.getElementById("table-date-s").innerText = "Start of year"
        document.getElementById("table-date-e").innerText = "End of year"
    }
    if(text === "Month"){
        SHOW_TARGET = "month"
        disableAttr("input-date-d")
        disableAttr("input-date-h")
        disableAttr("input-date-mm")
        disableAttr("input-date-sec")
        disableAttr("input-date-miles")
        document.getElementById("table-date-s").innerText = "Start of month"
        document.getElementById("table-date-e").innerText = "End of month"
    }
    if(text === "Week"){
        SHOW_TARGET = "isoWeek"
        disableAttr("input-date-h")
        disableAttr("input-date-mm")
        disableAttr("input-date-sec")
        disableAttr("input-date-miles")
        document.getElementById("table-date-s").innerText = "Start of week"
        document.getElementById("table-date-e").innerText = "End of week"
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
    let date = 0
    if(unix.length === 13) {
        date = moment(Number(unix))
        document.getElementById("etd-local").innerText = date.local().format(DATE_FORMAT)
        document.getElementById("etd-gmt").innerText = date.utc().format(DATE_FORMAT)
    }
    if(unix.length <= 10) {
        date = moment.unix(Number(unix))
        document.getElementById("etd-local").innerText = date.local().format(DATE_FORMAT)
        document.getElementById("etd-gmt").innerText = date.utc().format(DATE_FORMAT)
    }
}

function setDateToEpoch(){
    console.log("[setDateToEpoch]")
    const zone = document.getElementById("date-zone").value
    const year = document.getElementById("input-date-y").value
    const month = document.getElementById("input-date-m").value
    const day = document.getElementById("input-date-d").value
    const hh = document.getElementById("input-date-h").value
    const mm = document.getElementById("input-date-mm").value
    const sec = document.getElementById("input-date-sec").value
    const miles = document.getElementById("input-date-miles").value
    let date = moment().set({"year" : year, "month" : month-1, "date" : day, "hour" : hh, "minute" : mm, "second" : sec, "millisecond" : miles})

    let startEnd = getStartEnd(SHOW_TARGET, date)[zone]
    let epoch_start = startEnd.start_unix
    let miles_start = startEnd.start_miles
    let epoch_end = startEnd.end_unix
    let miles_end = startEnd.end_miles
    let date_start = startEnd.start
    let date_end = startEnd.end
    let epoch_current = startEnd.current_epoch
    let date_current = startEnd.current_date_time
    let miles_current = startEnd.current_miles

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
    document.getElementById("table-miles-s").innerText = miles_start
    document.getElementById("table-epoch-e").innerText = epoch_end
    document.getElementById("table-datetime-e").innerText = date_end
    document.getElementById("table-miles-e").innerText = miles_end
    document.getElementById("table-epoch-c").innerText = epoch_current
    document.getElementById("table-datetime-c").innerText = date_current
    document.getElementById("table-miles-c").innerText = miles_current
}

function getStartEnd(t, date){
    console.log("[getStartEnd]")

    const _local = moment(date.valueOf()).local()
    const _utc = moment(date.valueOf()).utc()
    return {
        "local" : {
            "start" : _local.startOf(t).format(DATE_FORMAT),
            "end" : _local.endOf(t).format(DATE_FORMAT),
            "start_unix" : _local.startOf(t).unix(),
            "start_miles" : _local.startOf(t).valueOf(),
            "end_unix" : _local.endOf(t).unix(),
            "end_miles" : _local.endOf(t).valueOf(),
            "current_epoch" : date.local().unix(),
            "current_miles" : date.local().valueOf(),
            "current_date_time" : date.local().format(DATE_FORMAT)
        },
        "gmt" : {
            "start" : _utc.startOf(t).format(DATE_FORMAT),
            "end" : _utc.endOf(t).format(DATE_FORMAT),
            "start_unix" : _utc.startOf(t).unix(),
            "start_miles" : _utc.startOf(t).valueOf(),
            "end_unix" : _utc.endOf(t).unix(),
            "end_miles" : _utc.endOf(t).valueOf(),
            "current_epoch" : date.utc().unix(),
            "current_miles" : date.local().valueOf(),
            "current_date_time" : date.utc().format(DATE_FORMAT)
        }
    }
}

function inputKeyEvent(e) {
    numValidator(e)
    enterConert(e)
    setEpochToDate()
}

function numValidator(e){
    console.log("[numValidator]")

    e.target.value = e.target.value.replace(/[^0-9]+/g, "");
}

function enterConert(e) {
    console.log("[enterConert]")
    if (e.key === "Enter"){
        if(e.target.classList.contains("input-epoch")){
            setEpochToDate()
        }
        if(e.target.classList.contains("input-date")){
            setDateToEpoch()
        }
    }
}