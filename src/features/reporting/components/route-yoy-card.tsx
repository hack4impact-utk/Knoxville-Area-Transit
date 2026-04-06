'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface MonthEntry {
  month: string;
  weekday: number;
  saturday: number;
  sunday: number;
  priorWeekday?: number;
  priorSaturday?: number;
  priorSunday?: number;
}

interface Props {
  routeNumber: string;
  routeName: string;
  data: MonthEntry[];
}

function formatCount(n: number) {
  if (n == null || isNaN(n)) return '0';
  return n.toLocaleString();
}

function formatSigned(n: number) {
  return `${n >= 0 ? '+' : ''}${n.toLocaleString()}`;
}

function formatPercent(n: number) {
  return `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;
}

function deltaColor(n: number) {
  if (n > 0) return 'success' as const;
  if (n < 0) return 'error' as const;
  return 'default' as const;
}

function deltaLabel(n: number) {
  if (n > 0) return '▲';
  if (n < 0) return '▼';
  return '→';
}

const CHART_HEIGHT = 180;
const Y_AXIS_WIDTH = 52;
const NUM_Y_TICKS = 4;

export default function RouteYoYCard({ routeNumber, routeName, data }: Props) {
  const totals = data.map((entry) => {
    const current = entry.weekday + entry.saturday + entry.sunday;
    const hasPrior =
      entry.priorWeekday != null &&
      entry.priorSaturday != null &&
      entry.priorSunday != null;
    const prior = hasPrior
      ? entry.priorWeekday! + entry.priorSaturday! + entry.priorSunday!
      : null;
    return { month: entry.month, current, prior };
  });

  const maxVal = Math.max(...totals.map((d) => d.current));
  const yMax = Math.ceil(maxVal / 1000) * 1000;
  const yTicks = Array.from({ length: NUM_Y_TICKS + 1 }, (_, i) =>
    Math.round((yMax / NUM_Y_TICKS) * i)
  ).reverse();

  // Summary delta across all months with prior data
  const withPrior = totals.filter((d) => d.prior != null);
  const totalCurrent = withPrior.reduce((s, d) => s + d.current, 0);
  const totalPrior = withPrior.reduce((s, d) => s + d.prior!, 0);
  const summaryDelta = totalCurrent - totalPrior;
  const summaryPct = totalPrior > 0 ? (summaryDelta / totalPrior) * 100 : 0;
  const hasSummary = withPrior.length > 0;
  const missingCount = totals.length - withPrior.length;

  return (
    <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2.5 }, height: '100%' }}>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        {routeNumber} - {routeName} Ridership
      </Typography>

      {/* Chart */}
      <Stack direction="row" sx={{ mt: 2 }}>
        {/* Y axis */}
        <Stack
          justifyContent="space-between"
          sx={{ height: CHART_HEIGHT, width: Y_AXIS_WIDTH, flexShrink: 0 }}
        >
          {yTicks.map((tick) => (
            <Typography
              key={tick}
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: 9, lineHeight: 1, textAlign: 'right', pr: 1 }}
            >
              {formatCount(tick)}
            </Typography>
          ))}
        </Stack>

        {/* Bars */}
        <Stack
          direction="row"
          alignItems="flex-end"
          sx={{ flex: 1, height: CHART_HEIGHT, gap: { xs: '3px', sm: '6px' } }}
        >
          {totals.map(({ month, current, prior }) => {
            const heightPct = yMax > 0 ? (current / yMax) * 100 : 0;
            const delta = prior != null ? current - prior : null;
            const barColor =
              delta == null ? '#9e9e9e' : delta >= 0 ? '#3f51b5' : '#e53935';

            return (
              <Stack
                key={month}
                alignItems="center"
                justifyContent="flex-end"
                sx={{ flex: 1, height: '100%' }}
              >
                <Box
                  title={
                    prior != null
                      ? `${month}: ${formatCount(current)} (prior: ${formatCount(prior)}, ${formatSigned(delta!)})`
                      : `${month}: ${formatCount(current)} (no prior data)`
                  }
                  sx={{
                    height: `${heightPct}%`,
                    width: '100%',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 7,
                      color: 'white',
                      fontWeight: 600,
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      position: 'absolute',
                      top: 3,
                      lineHeight: 1,
                      zIndex: 1,
                    }}
                  >
                    {formatCount(current)}
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      bgcolor: barColor,
                      borderRadius: '3px 3px 0 0',
                      transition: 'opacity 0.15s',
                      cursor: 'default',
                      '&:hover': { opacity: 0.8 },
                    }}
                  />
                </Box>
              </Stack>
            );
          })}
        </Stack>
      </Stack>

      {/* X axis labels */}
      <Stack
        direction="row"
        sx={{ ml: `${Y_AXIS_WIDTH}px`, gap: { xs: '3px', sm: '6px' }, mt: 0.5 }}
      >
        {totals.map(({ month }) => (
          <Box key={month} sx={{ flex: 1, textAlign: 'center' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: { xs: 7, sm: 9 }, lineHeight: 1 }}
            >
              {month}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 1.5 }} />

      {/* YoY summary row */}
      {hasSummary ? (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={1}
          sx={{ ml: `${Y_AXIS_WIDTH}px` }}
        >
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Chip
              size="small"
              label={`${deltaLabel(summaryDelta)} ${formatPercent(summaryPct)}`}
              color={deltaColor(summaryDelta)}
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary">
              {formatSigned(summaryDelta)} riders YoY
            </Typography>
          </Stack>
          {missingCount > 0 && (
            <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
              {missingCount} month{missingCount > 1 ? 's' : ''} missing prior data
            </Typography>
          )}
        </Stack>
      ) : (
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontStyle: 'italic', ml: `${Y_AXIS_WIDTH}px` }}
        >
          No prior year data available
        </Typography>
      )}

      {/* Legend */}
      <Stack
        direction="row"
        flexWrap="wrap"
        spacing={1.5}
        sx={{ mt: 1.5, ml: `${Y_AXIS_WIDTH}px` }}
      >
        {[
          { color: '#3f51b5', label: 'Up vs prior year' },
          { color: '#e53935', label: 'Down vs prior year' },
          { color: '#9e9e9e', label: 'No prior data' },
        ].map(({ color, label }) => (
          <Stack key={label} direction="row" alignItems="center" spacing={0.5}>
            <Box sx={{ width: 10, height: 10, bgcolor: color, borderRadius: '2px', flexShrink: 0 }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 9 }}>
              {label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
