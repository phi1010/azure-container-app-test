import React, { useEffect, useState } from 'react';

// Helper to get previous/current year and month names
const getTimeOptions = () => {
  const now = new Date();
  const year = now.getFullYear();
  const prevYear = year - 1;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthIndex = now.getMonth();
  const prevMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;

  return [
    { label: 'Last day', value: 'last_day' },
    { label: 'Last week', value: 'last_week' },
    { label: 'Last month', value: 'last_month' },
    { label: 'Last year', value: 'last_year' },
    { label: prevYear.toString(), value: `year_${prevYear}` },
    { label: year.toString(), value: `year_${year}` },
    { label: months[prevMonthIndex], value: `month_${months[prevMonthIndex]}` },
    { label: months[currentMonthIndex], value: `month_${months[currentMonthIndex]}` },
  ];
};

export interface TimespanSelectorProps {
  dropdownValue: string;
  timespanValue: string;
  onDropdownChange: (value: string) => void;
  onTimespanChange: (value: string) => void;
}

// Helper to calculate timespan string from dropdown selection
const calculateTimespan = (dropdownValue: string): string => {
  const now = new Date();
  const year = now.getFullYear();
  const prevYear = year - 1;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthIndex = now.getMonth();
  const prevMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;

  switch (dropdownValue) {
    case 'last_day': {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      return `${yesterday.toISOString().slice(0, 10)} to ${now.toISOString().slice(0, 10)}`;
    }
    case 'last_week': {
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      return `${lastWeek.toISOString().slice(0, 10)} to ${now.toISOString().slice(0, 10)}`;
    }
    case 'last_month': {
      const lastMonth = new Date(now);
      lastMonth.setMonth(now.getMonth() - 1);
      return `${lastMonth.toISOString().slice(0, 10)} to ${now.toISOString().slice(0, 10)}`;
    }
    case 'last_year': {
      const lastYear = new Date(now);
      lastYear.setFullYear(now.getFullYear() - 1);
      return `${lastYear.toISOString().slice(0, 10)} to ${now.toISOString().slice(0, 10)}`;
    }
    case `year_${prevYear}`:
      return `${prevYear}-01-01 to ${prevYear}-12-31`;
    case `year_${year}`:
      return `${year}-01-01 to ${year}-12-31`;
    case `month_${months[prevMonthIndex]}`: {
      const y = currentMonthIndex === 0 ? year - 1 : year;
      const m = prevMonthIndex + 1;
      const start = `${y}-${m.toString().padStart(2, '0')}-01`;
      const endDate = new Date(y, m, 0).getDate();
      const end = `${y}-${m.toString().padStart(2, '0')}-${endDate}`;
      return `${start} to ${end}`;
    }
    case `month_${months[currentMonthIndex]}`: {
      const m = currentMonthIndex + 1;
      const start = `${year}-${m.toString().padStart(2, '0')}-01`;
      const endDate = new Date(year, m, 0).getDate();
      const end = `${year}-${m.toString().padStart(2, '0')}-${endDate}`;
      return `${start} to ${end}`;
    }
    default:
      return '';
  }
};

const TimespanSelector: React.FC<TimespanSelectorProps> = ({ dropdownValue, timespanValue, onDropdownChange, onTimespanChange }) => {
  const options = getTimeOptions();

  // Update timespanValue when dropdown changes
  useEffect(() => {
    const calculated = calculateTimespan(dropdownValue);
    if (calculated && calculated !== timespanValue) {
      onTimespanChange(calculated);
    }
    // eslint-disable-next-line
  }, [dropdownValue]);

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <label htmlFor="timespan-select" style={{ marginRight: '0.5rem' }}>Timespan:</label>
      <select
        id="timespan-select"
        value={dropdownValue}
        onChange={e => onDropdownChange(e.target.value)}
        style={{ fontSize: '1rem', padding: '0.25rem' }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <input
        type="text"
        value={timespanValue}
        onChange={e => onTimespanChange(e.target.value)}
        style={{ fontSize: '1rem', padding: '0.25rem', width: '18em' }}
        placeholder="Enter timespan manually"
      />
    </div>
  );
};

export default TimespanSelector;
