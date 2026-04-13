import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RouteYoYCardGrid from '@/features/reporting/components/route-yoy-card-grid';
import rawData from '@/features/reporting/mock/route-yoy-cards.json';

export default function RouteYoYCardsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Route Ridership — Year over Year
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Comparing current month ridership to the same month in the prior year.
      </Typography>
      <RouteYoYCardGrid data={rawData} />
    </Box>
  );
}