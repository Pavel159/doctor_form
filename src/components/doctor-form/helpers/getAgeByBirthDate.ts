export const getAgeByBirthDate = (date: Date) => {
  if (date) {
    let today = new Date();
    let birthDate = date;
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  } else {
    return null;
  }
};
