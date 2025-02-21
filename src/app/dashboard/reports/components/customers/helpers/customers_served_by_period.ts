import { MONTHS_ABBR } from "../../../../../../helpers/dates/helper";

export type CustomersServedTransformedDataProps = {
  period: string;
  value: number;
};

export function transformCustomersServedData(data: {
  [key: string]: number | null;
}): CustomersServedTransformedDataProps[] {
  const groupedData: { [key: string]: number } = {};

  Object.entries(data).forEach(([date, value]) => {
    const year = date.substring(0, 4);
    const monthIndex = parseInt(date.substring(5, 7), 10) - 1;
    const period = `${MONTHS_ABBR[monthIndex]} ${year}`;

    const numericValue = value === null ? 0 : value;

    if (groupedData[period]) {
      groupedData[period] += numericValue;
    } else {
      groupedData[period] = numericValue;
    }
  });

  const result = Object.entries(groupedData).map(([period, value]) => ({
    period,
    value,
  }));

  result.sort((a, b) => a.period.localeCompare(b.period, "es"));

  return result;
}
