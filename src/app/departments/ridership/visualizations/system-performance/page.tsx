'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import { SystemPerformanceTable } from '@/features/reporting/components/system-performance-table';
import systemPerformanceData from '@/features/reporting/mock/system-performance.json';

export default function SystemPerformancePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <SystemPerformanceTable
          reportingMonth={systemPerformanceData.reportingMonth}
          sections={systemPerformanceData.sections}
        />
      </Box>
    </Container>
  );
}
