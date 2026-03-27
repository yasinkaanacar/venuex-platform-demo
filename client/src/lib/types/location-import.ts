// ========== ENUMS ==========

export enum ImportDecision {
  NOT_DECIDED = 'NOT_DECIDED',
  DELETE_EXISTING = 'DELETE_EXISTING',
  CLOSE_EXISTING = 'CLOSE_EXISTING',
  KEEP_EXISTING = 'KEEP_EXISTING',
  OVERWRITE_EXISTING = 'OVERWRITE_EXISTING',
  CREATE_NEW = 'CREATE_NEW',
}

export enum DecidedBy {
  USER = 'USER',
  AUTO = 'AUTO',
}

export enum MatchingCriteria {
  NONE = 'NONE',
  AUTO = 'AUTO',
  STORE_CODE = 'STORE_CODE',
  ADDRESS = 'ADDRESS',
  USER = 'USER',
}

export enum AnalyzeStep {
  Initial = 'Initial',
  MappingColumns = 'MappingColumns',
  FileAnalysis = 'FileAnalysis',
  Matching = 'Matching',
  LocationsCreated = 'LocationsCreated',
  LocationsRemoved = 'LocationsRemoved',
  Summary = 'Summary',
}

export enum ImportMethod {
  OwnFormat = 'ownFormat',
  VenueXFormat = 'venueXFormat',
}

// ========== FILE LOCATION ==========

export interface FileLocationDto {
  _id: string;
  brand: string;
  store_code: string;
  store_name?: string;
  primary_phone?: string;
  postal_code?: string;
  city?: string;
  country_code?: string;
  locality?: string;
  full_address?: string;
  address_lines?: string[];
  latitude: number;
  longitude: number;
  primary_category?: string;
  additional_categories?: string[];
  opening_date?: string;
  website_uri?: string;
  regular_hours?: string;
  email?: string;
  description?: string;
  amenities?: string[];
  status?: string;
}

export interface FileLocationForMatchDto {
  _id: string;
  store_name?: string;
  store_code: string;
  full_address?: string;
  locality?: string;
  city?: string;
  longitude: number;
  latitude: number;
}

export interface VenueXLocationForMatchDto {
  _id: string;
  store_name?: string;
  store_code: string;
  full_address?: string;
  city?: string;
  longitude: number;
  latitude: number;
}

// ========== ANALYSIS ==========

export interface ErrorDetailDto {
  errors: string[];
  index: number;
}

export interface LocationFileImportAnalysisDto {
  brand: string;
  totalRowCount: number;
  validRowCount: number;
  errorRowCount: number;
  errorDetails?: ErrorDetailDto[];
  locationFileImport?: string;
}

export interface DuplicateFileLocationDto {
  first: FileLocationForMatchDto;
  second: FileLocationForMatchDto;
}

export interface AnalyzeFileLocationResultDto {
  duplicates: DuplicateFileLocationDto[];
  searchRadiusInMeter: number;
}

// ========== MATCHING ==========

export interface FileLocationStatusDto {
  venuex?: VenueXLocationForMatchDto;
  file?: FileLocationForMatchDto;
  matchingCriteria?: MatchingCriteria;
}

export interface GetFileLocationStatusesResultDto {
  matching_statuses: FileLocationStatusDto[];
}

// ========== DECISIONS ==========

export interface MakeFileLocationDecisionDto {
  venuex?: string;
  file?: string;
  decision: ImportDecision;
  temporarily_close?: boolean;
}

export interface MakeFileLocationDecisionsResultDto {
  savedCount: number;
  createDecisionCount: number;
  deleteDecisionCount: number;
  closeDecisionCount: number;
  keepDecisionCount: number;
  overwriteDecisionCount: number;
  errorCount: number;
  errorMessages: string[];
}

export interface GetFileLocationSummaryDto {
  willBeCreatedCount: number;
  willBeDeletedCount: number;
  willBeClosedCount: number;
  willBeKeptCount: number;
  willBeOverwrittenCount: number;
  isDecisionProcessFinished: boolean;
  isDecisionsUpToDate: boolean;
}

export interface ApplyFileLocationDecisionsResultDto {
  processedCount: number;
  createdCount: number;
  updatedCount: number;
  deletedCount: number;
  closedCount: number;
  skippedCount: number;
  alreadyAppliedCount: number;
  errorCount: number;
}

// ========== IMPORT RESULTS ==========

export interface LocationImportResultCounts {
  processedLocationCount: number;
  newLocationCount: number;
  updatedLocationCount: number;
}

export interface ImportFileRecord {
  id: string;
  fileName: string;
  fileUploadDate: string;
  rowCount: number;
  fileSize: number;
  fileExtension: string;
  useCustomMapping: boolean;
  importResult?: LocationImportResultCounts;
  analysisComplete: boolean;
}

// ========== COLUMN MAPPING ==========

export interface MappingFieldDto {
  key: string;
  label: string;
  required: boolean;
}

export interface ColumnMappingDto {
  sourceColumn: string;
  targetField: string;
}

export interface AnalyzeColumnsResultDto {
  columns: string[];
  fields: MappingFieldDto[];
  mappings: ColumnMappingDto[];
}
