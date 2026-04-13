import React from "react";
import { Box, Container, Divider, Typography } from "@mui/material";
import MonthlyServiceSummaryTable, {
  MonthlySummaryData,
} from "@/features/reporting/components/monthly-service-summary-table";
import RidershipPieChart from "@/features/reporting/components/ridership-pie-chart";
import fixtureData from "@/features/reporting/mock/monthly-summary.json";

const data = fixtureData as MonthlySummaryData;


export default function MonthlySummaryPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 5 }}>
        <RidershipPieChart data={data} />
      </Box>

      <MonthlyServiceSummaryTable data={data} />
    </Container>
  );
}