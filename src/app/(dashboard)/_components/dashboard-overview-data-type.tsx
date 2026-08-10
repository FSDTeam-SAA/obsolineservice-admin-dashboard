export interface DashboardData {
  totalUser: number;
  activeUser: number;
  suspended: number;
  totalEarning: number;
  generateReport: number;
}

export interface DashboardOverviewsApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: DashboardData;
}
