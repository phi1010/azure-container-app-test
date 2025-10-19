import React, {useState, useEffect, useRef} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';


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

    // Determine current and previous quarter
    const currentQuarter = Math.floor(currentMonthIndex / 3) + 1;
    const prevQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;
    const prevQuarterYear = currentQuarter === 1 ? year - 1 : year;

    const options = [
        //{label: "Custom", value: 'custom'},
        {label: "----", value: null},
        {label: "All time", value: 'all_time'},
        {label: "----", value: null},
        {label: "----", value: null},
        {label: 'Last day', value: 'last_day'},
        {label: "----", value: null},
        {label: "----", value: null},
        {label: 'Last week', value: 'last_week'},
        {label: "----", value: null},
        {label: months[currentMonthIndex], value: `month_${months[currentMonthIndex]}`},
        {label: 'Last month', value: 'last_month'},
        {label: months[prevMonthIndex], value: `month_${months[prevMonthIndex]}`},
        {label: `Q${currentQuarter} ${year}`, value: `q${currentQuarter}_${year}`},
        {label: 'Last 3 months', value: 'last_3_months'},
        {label: `Q${prevQuarter} ${prevQuarterYear}`, value: `q${prevQuarter}_${prevQuarterYear}`},
        {label: year.toString(), value: `year_${year}`},
        {label: 'Last year', value: 'last_year'},
        {label: prevYear.toString(), value: `year_${prevYear}`},
    ];
    return options;
};

export interface TimespanSelectorProps {
    dropdownValue: string;
    startDate: string;
    endDate: string;
    onDropdownChange: (value: string) => void;
    onRangeChange: (start: string, end: string) => void;
}


// Helper to calculate timespan string from dropdown selection
export const calculateTimespan = (dropdownValue: string): [string, string] => {
    const now = new Date();
    const year = now.getFullYear();
    const prevYear = year - 1;
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentMonthIndex = now.getMonth();
    const prevMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;

    if (/^q[1-4]_\d{4}$/.test(dropdownValue)) {
        const [, qStr, yStr] = dropdownValue.match(/^q([1-4])_(\d{4})$/) || [];
        const q = Number(qStr);
        const y = Number(yStr);
        if (q && y) {
            const startMonth = (q - 1) * 3;
            const start = `${y}-${(startMonth + 1).toString().padStart(2, '0')}-01`;
            const endDate = new Date(y, startMonth + 3, 0).getDate();
            const end = `${y}-${(startMonth + 3).toString().padStart(2, '0')}-${endDate}`;
            return [start, end];
        }
    }
    switch (dropdownValue) {
        case 'all_time':
            return ['', ''];
        case 'last_day': {
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            return [yesterday.toISOString().slice(0, 10), now.toISOString().slice(0, 10)];
        }
        case 'last_week': {
            const lastWeek = new Date(now);
            lastWeek.setDate(now.getDate() - 7);
            return [lastWeek.toISOString().slice(0, 10), now.toISOString().slice(0, 10)];
        }
        case 'last_month': {
            const lastMonth = new Date(now);
            lastMonth.setMonth(now.getMonth() - 1);
            return [lastMonth.toISOString().slice(0, 10), now.toISOString().slice(0, 10)];
        }
        case 'last_3_months': {
            const last3Months = new Date(now);
            last3Months.setMonth(now.getMonth() - 3);
            return [last3Months.toISOString().slice(0, 10), now.toISOString().slice(0, 10)];
        }
        case 'last_year': {
            const lastYear = new Date(now);
            lastYear.setFullYear(now.getFullYear() - 1);
            return [lastYear.toISOString().slice(0, 10), now.toISOString().slice(0, 10)];
        }
        case `year_${prevYear}`:
            return [`${prevYear}-01-01`, `${prevYear}-12-31`];
        case `year_${year}`:
            return [`${year}-01-01`, `${year}-12-31`];
        case `month_${months[prevMonthIndex]}`: {
            const y = currentMonthIndex === 0 ? year - 1 : year;
            const m = prevMonthIndex + 1;
            const start = `${y}-${m.toString().padStart(2, '0')}-01`;
            const endDate = new Date(y, m, 0).getDate();
            const end = `${y}-${m.toString().padStart(2, '0')}-${endDate}`;
            return [start, end];
        }
        case `month_${months[currentMonthIndex]}`: {
            const m = currentMonthIndex + 1;
            const start = `${year}-${m.toString().padStart(2, '0')}-01`;
            const endDate = new Date(year, m, 0).getDate();
            const end = `${year}-${m.toString().padStart(2, '0')}-${endDate}`;
            return [start, end];
        }
        default:
            return ['', ''];
    }
};


const TimespanSelector: React.FC<TimespanSelectorProps> = ({
    dropdownValue,
    startDate,
    endDate,
    onDropdownChange,
    onRangeChange
}) => {
    const options = getTimeOptions();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLabel = options.find(opt => opt.value === dropdownValue)?.label || '';
    const gridCols = 3;
    const gridRows: Array<Array<typeof options[0]>> = [];
    for (let i = 0; i < options.length; i += gridCols) {
        gridRows.push(options.slice(i, i + gridCols));
    }

    const handleButtonClick = (value: string | null) => {
        if (value !== null) {
            onDropdownChange(value);
            setDropdownOpen(false);
        }
    };
    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onRangeChange(e.target.value, endDate);
        onDropdownChange('custom'); // Reset selected button
    };
    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onRangeChange(startDate, e.target.value);
        onDropdownChange('custom'); // Reset selected button
    };

    return (
        <div className="field is-horizontal" style={{ marginBottom: '1rem' }}>
            <div className="field-label is-normal">
                <label className="label" htmlFor="timespan-select">Timespan:</label>
            </div>
            <div className="field-body">
                <div className="field has-addons">
                    <div className="control" ref={dropdownRef} style={{ position: 'relative' }}>
                        <div className={`dropdown${dropdownOpen ? ' is-active' : ''}`}>
                            <div className="dropdown-trigger">
                                <button
                                    className="button is-light"
                                    aria-haspopup="true"
                                    aria-controls="dropdown-menu-timespan"
                                    style={{
                                        minWidth: '120px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                    onClick={() => setDropdownOpen(v => !v)}
                                    type="button"
                                >
                                    <span>
                                        {dropdownValue === 'custom' ? '' : currentLabel}
                                    </span>
                                    <span className="icon is-small">
                                        <FontAwesomeIcon icon={faAngleDown} />
                                    </span>
                                </button>
                            </div>
                            <div className="dropdown-menu" id="dropdown-menu-timespan" role="menu">
                                <div className="dropdown-content" style={{ padding: '8px', minWidth: '300px' }}>
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                                            gap: '6px'
                                        }}
                                    >
                                        {gridRows.map((row, rowIdx) =>
                                            row.map((opt, colIdx) =>
                                                opt.value === null ? (
                                                    <div key={rowIdx + '-' + colIdx} />
                                                ) : (
                                                    <button
                                                        key={opt.label + opt.value}
                                                        className={`button is-small${dropdownValue === opt.value ? ' is-primary' : ''}`}
                                                        style={{ width: '100%' }}
                                                        onClick={() => handleButtonClick(opt.value)}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                )
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="control">
                        <input
                            className="input"
                            type="date"
                            value={startDate}
                            onChange={handleStartChange}
                            placeholder="Start date"
                        />
                    </div>
                    <div className="control">
                        <span className="button is-static">to</span>
                    </div>
                    <div className="control">
                        <input
                            className="input"
                            type="date"
                            value={endDate}
                            onChange={handleEndChange}
                            placeholder="End date"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default TimespanSelector;
