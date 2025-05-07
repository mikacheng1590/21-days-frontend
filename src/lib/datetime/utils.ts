import { isSameDay, format } from "date-fns"
import { toZonedTime } from 'date-fns-tz'

const timeZone = 'America/Los_Angeles'

export const convertToDate = (dbDate: string, formatString: string = 'yyyy-MM-dd hh:mm aaaa'): string => {
  try {
    return format(dbDate, formatString)
  } catch(error) {
    console.error(error)
    return ''
  }
}

export const isDateToday = (dbDate: string): boolean => {
  try {
    const now = new Date()
    const userNow = toZonedTime(now, timeZone)
    const entryDate = toZonedTime(new Date(dbDate), timeZone)
    
    return isSameDay(entryDate, userNow)
  } catch(error) {
    console.error(error)
    return false
  }
}