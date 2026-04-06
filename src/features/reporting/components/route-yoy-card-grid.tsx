import Grid from '@mui/material/Grid';
import RouteMonthlyChart from './route-yoy-card';

interface MonthEntry {
  routeNumber: string;
  routeName: string;
  month: string;
  weekday: number;
  saturday: number;
  sunday: number;
}

interface Props {
  data: MonthEntry[];
}

export default function RouteYoYCardGrid({ data }: Props) {
  const grouped = data.reduce<Record<string, MonthEntry[]>>((acc, row) => {
    if (!acc[row.routeNumber]) acc[row.routeNumber] = [];
    acc[row.routeNumber].push(row);
    return acc;
  }, {});

  return (
    <Grid container spacing={3}>
      {Object.entries(grouped).map(([routeNumber, entries]) => (
        <Grid key={routeNumber} size={{ xs: 12, md: 6, xl: 4 }}>
          <RouteMonthlyChart
            routeNumber={routeNumber}
            routeName={entries[0].routeName}
            data={entries}
          />
        </Grid>
      ))}
    </Grid>
  );
}