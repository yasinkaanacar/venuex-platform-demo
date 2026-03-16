// Re-export all domain mock services
export { overviewDataService, mockOverviewData, mockEnrichmentSuggestions } from './overview';
export { segmentDataService, mockSegments } from './segments';
export { notificationDataService } from './notifications';
export { settingsDataService } from './settings';
export { profileDataService, mockCurrentUser, mockTeamMembers, mockPendingInvites } from './profile';
export { locationFormDataService } from './location-form';

// Re-export catalog and locations
export * from './catalog';
export { mockLocations, getUniqueValues, filterLocations, paginateLocations } from './locations';

// Assembled mockDataService — backwards-compatible facade used by queryClient.ts
import { overviewDataService } from './overview';
import { segmentDataService } from './segments';

export const mockDataService = {
  // Overview
  getOverviewData: overviewDataService.getOverviewData.bind(overviewDataService),
  getEnrichmentSuggestions: overviewDataService.getEnrichmentSuggestions.bind(overviewDataService),
  updateEnrichmentSuggestion: overviewDataService.updateEnrichmentSuggestion.bind(overviewDataService),
  dismissAlert: overviewDataService.dismissAlert.bind(overviewDataService),

  // Segments
  getSegments: segmentDataService.getSegments.bind(segmentDataService),
  getSegmentById: segmentDataService.getSegmentById.bind(segmentDataService),
  getSegmentSummary: segmentDataService.getSegmentSummary.bind(segmentDataService),
  getPushLog: segmentDataService.getPushLog.bind(segmentDataService),
  getFeedLabels: segmentDataService.getFeedLabels.bind(segmentDataService),
  getExports: segmentDataService.getExports.bind(segmentDataService),
  getScheduledExports: segmentDataService.getScheduledExports.bind(segmentDataService),
  getTopOverlaps: segmentDataService.getTopOverlaps.bind(segmentDataService),
  getLookalikeAudiences: segmentDataService.getLookalikeAudiences.bind(segmentDataService),
  getABTests: segmentDataService.getABTests.bind(segmentDataService),
  getSegmentAttributions: segmentDataService.getSegmentAttributions.bind(segmentDataService),
  getAttributionTimeseries: segmentDataService.getAttributionTimeseries.bind(segmentDataService),
  getPerformanceSummaries: segmentDataService.getPerformanceSummaries.bind(segmentDataService),
  getPerformanceDetail: segmentDataService.getPerformanceDetail.bind(segmentDataService),
};
