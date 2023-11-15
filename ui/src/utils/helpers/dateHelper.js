const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


/**
 * Returns date in format of "July 17" etc with MONTH + DAY
 * @param {string|Date} dateInput date to be converted to string
 */
const getDateInfo = (dateInput) => {
    
    let date;

    // check date and convert to date if not already a date
    if(typeof dateInput.getMonth === 'function')
        date = dateInput
    if(Date.parse(dateInput))
        date = new Date(dateInput)
    else
        return false

    // return the date string
    return MONTHS[date?.getMonth()] + " " + date?.getDate()
}

/**
 * Same as getDayInfoComparedToToday but returns 'today' and 'yesterday' for those dates
 * @param {string|Date} dateInput date to be converted to string
 * @returns 
 */
const getDayInfoComparedToToday = (dateInput) => {

    let date;

    if(typeof dateInput.getMonth === 'function')
        date = dateInput
    if(Date.parse(dateInput))
        date = new Date(dateInput)
    else
        return false

    // today's date
    let today = new Date();

    // if today return 'today
    if(date.getDate() === today.getDate())
        return 'Today'

    // if yesterday return 'yesterday'
    if(date.getDate() === (today.getDate() - 1 ))
        return 'Yesterday'
    
    // otherwise return date 
    return MONTHS[date?.getMonth()] + " " + date?.getDate()
}

/**
 * Returns true if the provided date is the same day as today (accounts for same year)
 * @param {Date} dateString date to be checked
 * @returns true if date is same date as now and false if not
 */
const isDateFromToday = (dateString) => {
    let date;

    if(typeof dateString.getMonth === 'function')
        date = dateInput
    if(Date.parse(dateString))
        date = new Date(dateString)
    else
        return false

    // today's date
    let today = new Date();

    // if same date as today return true. Note toDateString() returns format: "Wed Jul 28 1993"
    return date.toDateString() === today.toDateString()
}

/**
 * Returns a string showing how long until the day is over
 * @returns string formatted like "6 hours 22 minutes" for how long until the day is over
 */
const getTimeUntilEndOfDay = () => {
    // today's date
    let dateNow = new Date();

    var hours = dateNow.getHours();
    var minutes = dateNow.getMinutes();
    var seconds = dateNow.getSeconds();
    var minutesUntilEndOfDay  = (24*60) - (hours*60) - (minutes);

    return ((minutesUntilEndOfDay/60 + "").includes(".") ? (minutesUntilEndOfDay/60 + "").split(".")[0] : minutesUntilEndOfDay/60) + " hours and " + minutesUntilEndOfDay%60 + " minutes"
}

/**
 * Returns true if two dates are on the same day
 * @param {Date} day1
 * @param {Date} day2 
 * @returns 
 */
const areSameDay = (day1, day2) => {

    let date1;
    let date2

    // convert date1 to Date object if not already one
    if(typeof day1.getMonth === 'function')
        date1 = day1
    if(Date.parse(day1))
        date1 = new Date(day1)
    else
        return false

    // convert date2 to Date object if not already one
    if(typeof day2.getMonth === 'function')
        date2 = day2
    if(Date.parse(day2))
        date2 = new Date(day2)
    else
        return false

    return date1?.getFullYear() === date2?.getFullYear() && date1?.getMonth() === date2?.getMonth() && date1?.getDate() === date2?.getDate();
}

/**
 * 
 * @param {*} day1 
 * @param {*} day2 
 * @returns 
 */
const returnNewerDate = (day1, day2) => {
    let date1;
    let date2

    // convert date1 to Date object if not already one
    if(typeof day1.getMonth === 'function')
        date1 = day1
    if(Date.parse(day1))
        date1 = new Date(day1)
    else
        return false

    // convert date2 to Date object if not already one
    if(typeof day2.getMonth === 'function')
        date2 = day2
    if(Date.parse(day2))
        date2 = new Date(day2)
    else
        return false

    return Date.parse(date1) > Date.parse(date2) ? -1 : 1
}

/**
 * Returns how long has elapsed since the date/time
 * @returns string representing how long since the date/time
 */
const getTimeSinceDate = (dateInput) => {
    let date;

    if(typeof dateInput?.getMonth === 'function')
        date = dateInput
    if(Date.parse(dateInput))
        date = new Date(dateInput)
    else
        return false

    // today's date
    let today = new Date();

    // one day
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    let minutesBetweenDates = (today.getTime() - date.getTime())/60000

    if(minutesBetweenDates < 60){
        if(minutesBetweenDates < 1)
            return "now"
        else
            return (Math.round(minutesBetweenDates) + "m")
    }
    else if(minutesBetweenDates < 1440){
        return (Math.round(minutesBetweenDates / 60) + "h")
    }
    else {
        return (Math.round(Math.abs((today - date) / oneDay)) + "d")
    }

}


export { getDayInfoComparedToToday, isDateFromToday, getDateInfo, getTimeUntilEndOfDay, areSameDay, returnNewerDate, getTimeSinceDate };