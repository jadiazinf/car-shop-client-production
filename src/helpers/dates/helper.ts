class DatesHelpers {
  static isInvalidDate(dateString: string): boolean {
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
    const parts = value.split("-");

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    return `${day}/${month}/${year}`;
  }

  static formatFullDate(dateString: string): string {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}

export const MONTHS_ABBR: string[] = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export const months = [
  { value: 0, label: "Enero" },
  { value: 1, label: "Febrero" },
  { value: 2, label: "Marzo" },
  { value: 3, label: "Abril" },
  { value: 4, label: "Mayo" },
  { value: 5, label: "Junio" },
  { value: 6, label: "Julio" },
  { value: 7, label: "Agosto" },
  { value: 8, label: "Septiembre" },
  { value: 9, label: "Octubre" },
  { value: 10, label: "Noviembre" },
  { value: 11, label: "Diciembre" },
];

export default DatesHelpers;
