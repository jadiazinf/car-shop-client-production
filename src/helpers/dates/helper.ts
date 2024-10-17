class DatesHelpers {
  static isInvalidDate(dateString: string):boolean {
    const date = new Date(dateString);
    return isNaN(date.getTime());
  }

  static getYearsDescending(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];

    for (let year = currentYear + 1; year >= 1900; year--) {
      years.push(year);
    }

    return years;
  }

  static formatYYYYMMDDtoDDMMYYYY(value: string) {
    const parts = value.split('-');

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    return `${day}/${month}/${year}`;
  }
}

export default DatesHelpers;
