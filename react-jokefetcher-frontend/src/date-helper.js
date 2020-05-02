//Fri May 01 2020 11:15:52 GMT+0200 (Central European Summer Time)
export function dateFormatter(date) {
  let month = date.toString().substring(4, 7);
  const day = date.toString().substring(8, 10);
  const year = date.toString().substring(11, 15);

  switch (month) {
    case "Jan":
      month = "01";
      break;
    case "Feb":
      month = "02";
      break;
    case "Mar":
      month = "03";
      break;
    case "Apr":
      month = "04";
      break;
    case "May":
      month = "05";
      break;
    case "Jun":
      month = "06";
      break;
    case "Jul":
      month = "07";
      break;
    case "Aug":
      month = "08";
      break;
    case "Sep":
      month = "09";
      break;
    case "Oct":
      month = "10";
      break;
    case "Nov":
      month = "11";
      break;
    case "Dec":
      month = "12";
      break;
    default:
      console.log("Something went wrong with reading the month");
  }
  return year + "-" + month + "-" + day;
}
