import { Container } from "@mui/material";

import RouteSharePieChart from "@/features/reporting/components/route-share-pie-chart";
import routeShareData from "@/features/reporting/mock/route-share.json";

export default function RouteSharePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <RouteSharePieChart data={routeShareData} />
    </Container>
  );
}
