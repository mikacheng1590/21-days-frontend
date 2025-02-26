import { isToday, format } from "date-fns"

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
    return isToday(dbDate)
  } catch(error) {
    console.error(error)
    return false
  }
}