'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
} from '@mui/material';

// Formatting utility functions
const formatInteger = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '—';
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

const formatDecimal = (value: number | null | undefined, places: number = 2): string => {
    if (value === null || value === undefined) return '—';
    return value.toLocaleString('en-US', {
        minimumFractionDigits: places,
        maximumFractionDigits: places,
    });
};

const formatSignedPercent = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '—';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
};

const formatFallback = (value: any): string => {
    if (value === null || value === undefined) return '—';
    return String(value);
};

// Determine if a value is a decimal or integer for display purposes
const isDecimal = (value: number): boolean => {
    return !Number.isInteger(value);
};

interface Row {
    rowId: string;
    label: string;
    thisMonthThisYear: number | null;
    thisMonthLastYear: number | null;
    fytdThisYear: number | null;
    fytdLastYear: number | null;
    monthPercentChange?: number | null;
    fytdPercentChange?: number | null;
    percentChange?: number | null; // legacy fallback
}

interface Section {
    sectionId: string;
    sectionTitle: string;
    rows: Row[];
}

interface SystemPerformanceTableProps {
    reportingMonth: string;
    sections: Section[];
}

export const SystemPerformanceTable: React.FC<SystemPerformanceTableProps> = ({
    reportingMonth,
    sections,
}) => {
    const formatValue = (value: number | null | undefined, isPercent: boolean = false): string => {
        if (isPercent) {
            return formatSignedPercent(value);
        }
        if (value === null || value === undefined) {
            return formatFallback(value);
        }
        return isDecimal(value) ? formatDecimal(value) : formatInteger(value);
    };

    const getChangeValue = (row: Row, key: 'month' | 'fytd'): number | null | undefined => {
        if (key === 'month') {
            return row.monthPercentChange ?? row.percentChange;
        }
        return row.fytdPercentChange ?? row.percentChange;
    };

    const getChangeColor = (value: number | null | undefined): string => {
        if (value === null || value === undefined) {
            return 'text.secondary';
        }
        if (value > 0) return 'success.main';
        if (value < 0) return 'error.main';
        return 'text.primary';
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                System Performance Report — {reportingMonth}
            </Typography>

            {sections.map((section) => (
                <Paper
                    key={section.sectionId}
                    sx={{
                        mb: 3,
                        overflow: 'auto',
                    }}
                >
                    <Box sx={{ p: 2, bgcolor: '#5c5c5c' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.dark' }}>
                            {section.sectionTitle}
                        </Typography>
                    </Box>

                    <Table size="small" sx={{ mb: 0 }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 700, minWidth: '180px' }}>Metric</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, minWidth: '120px' }}>
                                    This Month (This Year)
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, minWidth: '120px' }}>
                                    This Month (Last Year)
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, minWidth: '110px' }}>
                                    Month % Change
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, minWidth: '130px' }}>
                                    FYTD (This Year)
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, minWidth: '130px' }}>
                                    FYTD (Last Year)
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, minWidth: '110px' }}>
                                    FYTD % Change
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {section.rows.map((row, idx) => (
                                <TableRow
                                    key={row.rowId}
                                    sx={{
                                        bgcolor: idx % 2 === 0 ? 'white' : '#fafafa',
                                        '&:hover': {
                                            bgcolor: '#f0f0f0',
                                        },
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 500 }}>{row.label}</TableCell>
                                    <TableCell align="right">
                                        {formatValue(row.thisMonthThisYear)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {formatValue(row.thisMonthLastYear)}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            color: getChangeColor(getChangeValue(row, 'month')),
                                            fontWeight: 500,
                                        }}
                                    >
                                        {formatSignedPercent(getChangeValue(row, 'month'))}
                                    </TableCell>
                                    <TableCell align="right">
                                        {formatValue(row.fytdThisYear)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {formatValue(row.fytdLastYear)}
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{
                                            color: getChangeColor(getChangeValue(row, 'fytd')),
                                            fontWeight: 500,
                                        }}
                                    >
                                        {formatSignedPercent(getChangeValue(row, 'fytd'))}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            ))}
        </Box>
    );
};
