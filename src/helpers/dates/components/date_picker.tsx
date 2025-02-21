import { useState, useEffect, useMemo } from "react";

const currentYear = new Date().getFullYear();
const months = [
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

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

function DatePicker({
  label,
  onChange,
}: {
  label: string;
  onChange: (date: Date | null) => void;
}) {
  const years = useMemo(
    () =>
      Array.from(
        { length: currentYear - 1900 + 1 },
        (_, i) => 1900 + i
      ).reverse(),
    []
  );

  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  useEffect(() => {
    if (year !== null && month !== null) {
      const days = getDaysInMonth(year, month);
      setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));
      if (day !== null && day > days) {
        setDay(null);
      }
    }
  }, [year, month]);

  useEffect(() => {
    if (year !== null && month !== null && day !== null) {
      onChange(new Date(year, month, day));
    } else {
      onChange(null);
    }
  }, [year, month, day]);

  return (
    <div className="flex flex-col space-y-4 w-full p-4 border rounded-xl shadow-md bg-white">
      <h3 className="text-lg font-semibold">{label}</h3>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">Año</label>
          <select
            value={year ?? ""}
            onChange={(e) =>
              setYear(e.target.value ? Number(e.target.value) : null)
            }
            className="border border-gray-400 bg-transparent p-2 rounded-md w-32 focus:border-blue-500 focus:outline-none transition"
          >
            <option value="">Selecciona</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">Mes</label>
          <select
            value={month ?? ""}
            onChange={(e) =>
              setMonth(e.target.value !== "" ? Number(e.target.value) : null)
            }
            className="border border-gray-400 bg-transparent p-2 rounded-md w-40 focus:border-blue-500 focus:outline-none transition"
          >
            <option value="">Selecciona</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-600 text-sm mb-1">Día</label>
          <select
            value={day ?? ""}
            onChange={(e) =>
              setDay(e.target.value ? Number(e.target.value) : null)
            }
            disabled={year === null || month === null}
            className="border border-gray-400 bg-transparent p-2 rounded-md w-24 focus:border-blue-500 focus:outline-none transition disabled:opacity-50"
          >
            <option value="">Selecciona</option>
            {daysInMonth.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export function DateRangePicker({
  dateRange,
  setDateRange,
}: {
  dateRange: { startDate: Date | null; endDate: Date | null };
  setDateRange: (newRange: {
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
}) {
  const [localStartDate, setLocalStartDate] = useState<Date | null>(
    dateRange.startDate
  );
  const [localEndDate, setLocalEndDate] = useState<Date | null>(
    dateRange.endDate
  );
  const [error, setError] = useState<string | null>(null);

  const validateDates = () => {
    if (!localStartDate || !localEndDate) {
      setError("Ambas fechas deben estar seleccionadas.");
      return false;
    }
    if (localStartDate > localEndDate) {
      setError("La fecha de inicio debe ser menor que la fecha final.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSave = () => {
    if (validateDates()) {
      setDateRange({ startDate: localStartDate, endDate: localEndDate });
    }
  };

  return (
    <div className="p-6 w-full max-w-lg mx-auto">
      <div className="mb-6">
        <DatePicker label="Fecha de inicio" onChange={setLocalStartDate} />
      </div>
      <div className="mb-6">
        <DatePicker label="Fecha final" onChange={setLocalEndDate} />
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <button
        className="mt-6 w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
        onClick={handleSave}
        disabled={!localStartDate || !localEndDate}
      >
        Guardar fechas
      </button>
    </div>
  );
}
