import './App.css'
import 'bulma/css/bulma.css';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import TimespanSelector, { calculateTimespan } from './TimespanSelector';

// Extend the default schema to allow <mark> tag
const customSchema = {
    ...defaultSchema,
    tagNames: [...(defaultSchema.tagNames || []), 'mark'],
};

function App() {
    const [markdown, setMarkdown] = useState(`# Hello Markdown\n\nThis is **bold** and <i>italic</i> text.<br />\nHere is a <a href='https://example.com' target='_blank'>link</a> and some <code>inline code</code>.\n\n<ul><li>HTML list item 1</li><li>HTML list item 2</li></ul>\n\nHere is <mark>highlighted text</mark>.\n\n## GFM Features\n\n- [x] Task list item 1\n- [ ] Task list item 2\n\n~~Strikethrough~~\n\n| Table | Test |\n|-------|------|\n| Cell  | Cell |`);
    const [dropdownValue, setDropdownValue] = useState('custom');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleRangeChange = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
    };

    // Update date range when dropdownValue changes (except for custom/all_time)
    useEffect(() => {
        if (dropdownValue !== 'custom' && dropdownValue !== 'all_time') {
            const [start, end] = calculateTimespan(dropdownValue);
            setStartDate(start);
            setEndDate(end);
        } else if (dropdownValue === 'all_time') {
            setStartDate('');
            setEndDate('');
        }
        // For 'custom', keep manual input
    }, [dropdownValue]);

    return (
        <>
            <TimespanSelector
                dropdownValue={dropdownValue}
                startDate={startDate}
                endDate={endDate}
                onDropdownChange={setDropdownValue}
                onRangeChange={handleRangeChange}
            />
            <div className="notification is-info" style={{marginBottom: '1rem'}}>
                {dropdownValue === 'all_time' ? (
                    <span>All time selected</span>
                ) : dropdownValue === 'custom' ? (
                    startDate && endDate ? (
                        <span>Custom range: {startDate} to {endDate}</span>
                    ) : (
                        <span>No timespan selected</span>
                    )
                ) : (
                    startDate && endDate ? (
                        <span>Selected range: {startDate} to {endDate}</span>
                    ) : (
                        <span>No timespan selected</span>
                    )
                )}
            </div>
            <div className="card">
                <textarea
                    value={markdown}
                    onChange={e => setMarkdown(e.target.value)}
                    rows={14}
                    style={{ width: '100%', fontFamily: 'monospace', fontSize: '1rem' }}
                />
            </div>
            <div className="card">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, [rehypeSanitize, customSchema]]}
                >
                  {markdown}
                </ReactMarkdown>
            </div>
        </>
    )
}

export default App
