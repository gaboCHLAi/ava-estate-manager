export const getGeorgianDate = (dateString) => {
  if (!dateString) return "";

  const months = [
    "იანვარს",
    "თებერვალს",
    "მარტს",
    "აპრილს",
    "მაისს",
    "ივნისს",
    "ივლისს",
    "აგვისტოს",
    "სექტემბერს",
    "ოქტომბერს",
    "ნოემბერს",
    "დეკემბერს",
  ];

  const d = new Date(dateString);
  const day = d.getDate();
  const month = months[d.getMonth()];
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day} ${month}, ${hours}:${minutes}`;
};
