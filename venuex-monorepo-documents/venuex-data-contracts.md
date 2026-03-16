# VenueX Data Contracts

> Auto-compiled from exploration agent outputs on 2026-03-11

## Table of Contents

1. [Stores & Locations](#stores--locations)
2. [Campaigns & Marketing](#campaigns--marketing)
3. [Integrations & Platforms](#integrations--platforms)
4. [Users & Auth](#users--auth)
5. [Analytics & Segments](#analytics--segments)
6. [Shared Enums & Constants](#shared-enums--constants)
7. [Queues & Events](#queues--events)
8. [Media & Content](#media--content)

---

## Stores & Locations

### Database Models

**File:** `libs/database/src/mongoose/schemas/location/location.schema.ts`

```typescript
export class Location extends TypegooseBase {
    @prop({required: true})
    location_name!: string;

    @prop({enum: LocationSources})
    source?: LocationSource;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: false, ref: "Venue"})
    venue?: Ref<Venue>;

    @prop({required: true, default(this: Location | null) {...}})
    store_code!: string;

    @prop({required: false})
    descriptor?: string;

    @prop({required: false})
    profile_description?: string;

    @prop({required: true, ref: "Address"})
    address!: Ref<Address>;

    @prop({required: false})
    website?: string;

    @prop({required: false})
    email?: string;

    @prop({required: false})
    primary_phone?: string;

    @prop({required: false, _id: false, type: Phone}, PropType.ARRAY)
    additional_phones?: Phone[];

    @prop({required: false, ref: "Contact"})
    contacts!: Ref<Contact>[];

    @prop({required: false})
    gmb_account_code?: string;

    @prop({required: false})
    gmb_location_code?: string;

    @prop({required: false, _id: false})
    gbp_metadata?: GoogleBusinessMetadata;

    @prop({required: false})
    gbp_account_id?: string;

    @prop({required: false})
    meta_page_id?: string;

    @prop({required: false})
    apple_brand_id?: string;

    @prop({_id: false})
    store_verification_status!: StorePlatformVerifications;

    @prop({_id: false})
    store_listing_status!: StorePlatformListings;

    @prop({enum: LocationStatusEnum, default: LocationStatusEnum.OPEN})
    location_status!: LocationStatusEnum;

    @prop({required: false, type: RegularHours, _id: false}, PropType.ARRAY)
    regular_hours?: RegularHours[];

    @prop({required: false}, PropType.NONE)
    labels?: string[];

    @prop({required: false, _id: false}, PropType.NONE)
    special_hours?: mybusinessbusinessinformation_v1.Schema$SpecialHourPeriod[];

    @prop({required: false, ref: "ProviderLocationCategory"})
    primary_category?: Ref<ProviderLocationCategory>;

    @prop({required: false, ref: "ProviderLocationCategory"})
    additional_categories?: Ref<ProviderLocationCategory>[];

    @prop({required: false, _id: false}, PropType.NONE)
    attributes?: mybusinessbusinessinformation_v1.Schema$Attributes;

    @prop({required: false, _id: false}, PropType.NONE)
    more_hours?: mybusinessbusinessinformation_v1.Schema$MoreHours[];

    @prop({required: false})
    time_zone?: string;

    @prop({required: false, ref: () => "SmartImportLocation"})
    public smart_import_location?: Ref<SmartImportLocation>;

    @prop({required: false})
    time_zone_offset?: string;

    @prop({required: false})
    notification_settings_ids?: string[];

    @prop({_id: false})
    social?: Social;

    @prop({required: false, _id: false}, PropType.NONE)
    opening_date?: mybusinessbusinessinformation_v1.Schema$Date;

    @prop({required: false, ref: "MetaLocation"})
    meta_location?: Ref<MetaLocation>;

    @prop({required: false, ref: "AppleLocation"})
    apple_location?: Ref<AppleLocation>;

    @prop({required: false, ref: "ProviderLocationCategory", match: {provider: ProviderEnum.meta_graph_api_pages}})
    meta_categories?: Ref<ProviderLocationCategory>[];

    @prop({required: false, ref: "ProviderLocationCategory", match: {provider: ProviderEnum.apple_business_connect}})
    apple_business_categories?: Ref<ProviderLocationCategory>[];

    @prop({required: false, ref: "ProviderLocationCategory", match: {provider: ProviderEnum.yandex_business}})
    yandex_rubrics?: Ref<ProviderLocationCategory>[];

    @prop({required: false})
    meta_store_incremental_number?: number;

    @prop({required: false})
    yandex_photos_gallery_url?: string;

    @prop({required: false, type: LocationAmenityValue, _id: false}, PropType.ARRAY)
    amenities?: LocationAmenityValue[];
}
```


**File:** `libs/database/src/mongoose/schemas/address/address.schema.ts`

```typescript
export enum AddressType {
    venue = "Venue",
    organization = "Organization",
    location = "Location",
}

export class Address extends TypegooseWithImdfId {
    @prop({required: true})
    lat!: number;

    @prop({required: true})
    lng!: number;

    @prop({required: false})
    locality?: string;

    @prop({required: false})
    sublocality?: string;

    @prop({required: true})
    fullAddress!: string;

    @prop({required: true, type: String}, PropType.ARRAY)
    addressLines!: string[];

    @prop({required: false})
    geocodedAddressForYandex?: string;

    @prop({required: false})
    geocodedAddressExtrasForYandex?: string;

    @prop({required: false})
    postalCode?: string;

    @prop({enum: AddressType})
    addressType!: string;

    @prop({refPath: "addressType"})
    belongsTo!: Ref<Venue | Organization | Location>;

    @prop({required: true})
    countryCode!: string;

    @prop({required: false})
    administrativeArea?: string;

    @prop({required: false, ref: "Country"})
    country?: Ref<Country>;

    @prop({required: false, ref: "Province"})
    province?: Ref<Province>;
}
```


**File:** `libs/database/src/mongoose/schemas/venue/venue.schema.ts`

```typescript
export class Venue extends TypegooseWithImdfId {
    @prop({required: true})
    vmsName!: string;

    @prop({unique: true})
    vmsSlug!: string;

    @prop({required: true, type: Schema.Types.Mixed, validate: {...}})
    names!: LocalizedTextType;

    @prop({required: true})
    logo!: string;

    @prop({type: Schema.Types.Mixed, validate: {...}})
    altNames!: LocalizedTextType;

    @prop({ref: "Organization", validate: {...}})
    organization?: Ref<Organization>;

    @prop({ref: "VenueGroup", required: true, validate: {...}})
    venueGroup!: Ref<VenueGroup>;

    @prop({required: true, ref: "Address", validate: {...}})
    address!: Ref<Address>;

    @prop({required: false, ref: "Contact", validate: {...}}, PropType.ARRAY)
    contacts!: Ref<Contact>[];

    @prop({enum: VenueCategories, required: true})
    category!: VenueCategory;

    @prop({enum: RestrictionCategories, addNullToEnum: true})
    restriction?: RestrictionCategory;

    @prop()
    email?: string;

    @prop()
    website?: string;

    @prop()
    landlinePhone?: string;

    @prop({_id: false})
    displayPoint?: Point;

    @prop({_id: false})
    geometry?: Polygonal;

    @prop({_id: false})
    openingHours?: OpeningHours;

    @prop({required: false, ref: "File", validate: {...}})
    logo_file?: Ref<File>;

    @prop({required: true, validate: {...}})
    language!: string;
}
```


**File:** `libs/database/src/mongoose/schemas/location/store-set.schema.ts`

```typescript
export class StoreSet extends TypegooseBase {
    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    name!: string;

    @prop({required: true, ref: "Location", default: []})
    location_ids!: Ref<Location>[];
}
```


**File:** `libs/database/src/mongoose/schemas/location/location-platform-status.schema.ts`

```typescript
export class StorePlatformVerifications extends TypegooseWithoutId implements StoreVerificationStatusPlatformMap {
    @prop({enum: StoreVerificationStatus, default: StoreVerificationStatus.UNKNOWN})
    meta?: StoreVerificationStatus;

    @prop({enum: StoreVerificationStatus, default: StoreVerificationStatus.UNKNOWN})
    yandex?: StoreVerificationStatus;

    @prop({enum: StoreVerificationStatus, default: StoreVerificationStatus.UNKNOWN})
    google?: StoreVerificationStatus;

    @prop({enum: StoreVerificationStatus, default: StoreVerificationStatus.UNKNOWN})
    apple?: StoreVerificationStatus;

    @prop({enum: StoreVerificationStatus, default: StoreVerificationStatus.UNKNOWN})
    togg?: StoreVerificationStatus;
}

export class StorePlatformListings extends TypegooseWithoutId implements StoreListingStatusPlatformMap {
    @prop({enum: StoreListingStatus, default: StoreListingStatus.UNLISTED})
    meta?: StoreListingStatus;

    @prop({enum: StoreListingStatus, default: StoreListingStatus.UNLISTED})
    yandex?: StoreListingStatus;

    @prop({enum: StoreListingStatus, default: StoreListingStatus.UNLISTED})
    google?: StoreListingStatus;

    @prop({enum: StoreListingStatus, default: StoreListingStatus.UNLISTED})
    apple?: StoreListingStatus;

    @prop({enum: StoreListingStatus, default: StoreListingStatus.UNLISTED})
    togg?: StoreListingStatus;
}
```


**File:** `libs/database/src/mongoose/schemas/meta/meta-location.schema.ts`

```typescript
export class MetaLocationCategory {
    @prop({required: true})
    id!: string;

    @prop({required: true})
    name!: string;
}

export class MetaLocationAddress implements IMetaLocationAddress {
    @prop({required: false})
    latitude?: number;

    @prop({required: false})
    longitude?: number;

    @prop({required: false})
    country?: string;

    @prop({required: false})
    countryCode?: string;

    @prop({required: false})
    city?: string;

    @prop({required: false})
    street?: string;

    @prop({required: false})
    zip?: string;

    @prop({required: false})
    single_line_address?: string;
}

export class MetaLocation extends TypegooseBase {
    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    main_page_id!: string;

    @prop({required: true})
    store_number!: number;

    @prop({required: false})
    old_store_number?: number;

    @prop({required: false})
    location_page_id?: string;

    @prop({required: false, _id: false})
    category_list?: MetaLocationCategory[];

    @prop({required: false})
    store_location_descriptor?: string;

    @prop({required: false})
    is_deleted?: boolean;

    @prop({required: false})
    store_code?: string;

    @prop({required: false, _id: false})
    address?: MetaLocationAddress;

    @prop({required: false, ref: () => "Location"})
    public location?: Ref<Location>;
}
```


**File:** `libs/database/src/mongoose/schemas/apple/apple-location.schema.ts`

```typescript
export class AppleLocation extends TypegooseBase {
    @prop({required: true, unique: true})
    appleId!: string;

    @prop({required: true})
    appleCompanyId!: string;

    @prop({required: true})
    appleBrandId!: string;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    etag!: string;

    @prop({required: true, enum: LocationState})
    state!: LocationState;

    @prop({required: true, _id: false, type: AppleTimestamp})
    appleTimestamps!: AppleTimestamp;

    @prop({required: false, _id: false, type: AppleLocationDetails})
    oldLocationDetails?: AppleLocationDetails;

    @prop({required: true, _id: false, type: AppleLocationDetails})
    locationDetails!: AppleLocationDetails;

    @prop({required: false, default: false})
    isMarkedDeleted?: boolean;

    @prop({required: false})
    pushedForLaunchDate?: Date;

    @prop({required: false, default: false})
    pushedForLaunch?: boolean;

    @prop({required: false, default: false})
    bannedForPushed?: boolean;

    @prop({required: false, ref: () => "Location"})
    public location?: Ref<Location>;
}
```


**File:** `libs/database/src/mongoose/schemas/import/location-conflict.schema.ts`

```typescript
export class ConflictLocationSnapshot {
    @prop()
    locationName?: string;

    @prop()
    locationId?: string;

    @prop()
    storeCode?: string;

    @prop()
    displayName?: string;

    @prop()
    phone?: string;

    @prop()
    website?: string;

    @prop()
    address?: string;
}

export class ConflictSnapshots {
    @prop({_id: false, type: () => ConflictLocationSnapshot})
    google?: ConflictLocationSnapshot;

    @prop({_id: false, type: () => ConflictLocationSnapshot})
    duplicateGoogle?: ConflictLocationSnapshot;

    @prop({_id: false, type: () => ConflictLocationSnapshot})
    venuex?: ConflictLocationSnapshot;
}

export class LocationConflict extends TypegooseBase {
    @prop({required: true, enum: LocationConflictTypeEnum})
    conflictType!: LocationConflictTypeEnum;

    @prop({required: true, enum: LocationConflictStatusEnum, default: LocationConflictStatusEnum.PENDING})
    status!: LocationConflictStatusEnum;

    @prop({required: false, enum: LocationConflictActionEnum})
    resolvedAction?: LocationConflictActionEnum;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    gbpAccountId!: string;

    @prop({required: false, ref: "Location"})
    venuexLocation?: Ref<Location>;

    @prop({_id: false, type: () => ConflictSnapshots})
    snapshots?: ConflictSnapshots;

    @prop({required: true, default: "google"})
    platform!: string;

    @prop({required: false})
    cooldownUntil?: Date;
}
```


**File:** `libs/database/src/mongoose/schemas/location-review/location-review.schema.ts`

```typescript
export class AnalysisResult {
    @prop({type: () => Object, _id: false})
    category_scores?: Record<string, number>;

    @prop()
    category?: string;

    @prop()
    anomaly?: boolean;

    @prop()
    review_analysis?: string;

    @prop()
    safety_issue?: boolean;

    @prop()
    product_group?: string;

    @prop()
    product?: string;

    @prop()
    overall_emotion?: string;
}

export class LocationReview extends TypegooseBase {
    @prop({required: true, ref: "Location"})
    location!: Ref<Location>;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    reviewId!: string;

    @prop({required: true})
    name!: string;

    @prop({required: true, type: Reviewer, _id: false})
    reviewer!: Reviewer;

    @prop({required: true})
    starRating!: number;

    @prop({required: false})
    comment?: string;

    @prop({required: true})
    createTime!: Date;

    @prop({required: true})
    updateTime!: Date;

    @prop({required: true, enum: ReviewSourceEnum, default: ReviewSourceEnum.GOOGLE})
    source!: ReviewSourceEnum;

    @prop({required: true, enum: ReviewStatusEnum, default: ReviewStatusEnum.UNANSWERED})
    status!: ReviewStatusEnum;

    @prop({required: false, ref: "LocationMediaItem"})
    media_items?: Ref<LocationMediaItem>[];

    @prop({required: false})
    is_checked_for_media_items?: boolean;

    @prop({required: false, default: false})
    is_new?: boolean;

    @prop({required: false})
    analyzedAt?: Date;

    @prop({required: false, type: AnalysisResult, _id: false})
    analyzeResult?: AnalysisResult;
}
```


**File:** `libs/database/src/mongoose/schemas/location-media-item/location-media-item.schema.ts`

```typescript
export class LocationMediaItem extends TypegooseBase {
    @prop({required: true, ref: "Location"})
    location!: Ref<Location>;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    uploadedBy!: UploadedByEnum;

    @prop({required: true})
    name!: string;

    @prop({required: false})
    mediaFormat?: MediaFormatEnum;

    @prop({required: false})
    locationAssociation?: MediaLocationAssociation;

    @prop({required: true})
    googleUrl!: string;

    @prop({required: false})
    thumbnailUrl?: string;

    @prop({required: true})
    createTime!: string;

    @prop({required: false})
    updateTime?: string;

    @prop({required: false})
    dimensions?: MediaDimensions;

    @prop({required: false})
    insights?: MediaInsights;

    @prop({required: false})
    attribution?: MediaAttribution;

    @prop({required: false})
    description?: string;

    @prop({required: false})
    venuexCdnUrl?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/location-metric/location-metric.schema.ts`

```typescript
export class LocationMetric extends TypegooseBase {
    @prop({required: true, ref: "Location"})
    location!: Ref<Location>;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true, enum: DailyMetricEnum})
    metric!: DailyMetricEnum;

    @prop({required: true})
    value!: string;

    @prop({required: true})
    date!: InsightDate;
}
```


**File:** `libs/database/src/mongoose/schemas/location-amenity/location-amenity.schema.ts`

```typescript
export class LocationAmenity extends TypegooseBase {
    @prop({required: true, validate: [...]})
    group_name!: LocalizedTextTypeWithDefaultEn;

    @prop({required: true})
    venuex_name!: LocalizedTextTypeWithDefaultEn;

    @prop({required: false, enum: MetaPickupOptionsEnum})
    meta_amenity_id?: MetaPickupOptionsEnum;

    @prop({required: false, type: GoogleAmenity, _id: false})
    google_amenity?: GoogleAmenity;

    @prop({required: false, type: YandexAmenity, _id: false})
    yandex_amenity?: YandexAmenity;

    @prop({required: false, type: AppleAmenity, _id: false})
    apple_amenity?: AppleAmenity;
}

export class LocationAmenityValue extends TypegooseWithoutId {
    @prop({required: true, ref: "LocationAmenity"})
    amenity!: Ref<LocationAmenity>;

    @prop({enum: AmenityValueEnum, required: true})
    value!: AmenityValueEnum;
}
```


**File:** `libs/database/src/mongoose/schemas/import/smart-import-location.schema.ts`

```typescript
export class SmartImportLocation extends TypegooseBase {
    @prop({required: true})
    store_code!: string;

    @prop({required: false})
    name?: string;

    @prop({default: false})
    is_pushed_to_google?: boolean;

    @prop({default: false})
    is_checked_from_google?: boolean;

    @prop({default: false})
    is_pushed_to_meta?: boolean;

    @prop({default: false})
    is_checked_from_meta?: boolean;

    @prop({default: false})
    is_pushed_to_apple?: boolean;

    @prop({default: false})
    is_checked_from_apple?: boolean;

    @prop({required: false})
    gbp_account_id?: string;

    @prop({required: false})
    meta_page_id?: string;

    @prop({required: false})
    apple_brand_id?: string;

    @prop({required: false})
    pushed_location_result_error_reason?: string;

    @prop({required: false})
    pushed_location_result_error_field?: string;

    @prop({default: false})
    is_address_corrected?: boolean;

    @prop({default: LocationDiffStatusEnum.CREATED})
    diff_status!: LocationDiffStatusEnum;

    @prop({...})
    meta_diff_status!: LocationDiffStatusEnum;

    @prop({...})
    apple_diff_status!: LocationDiffStatusEnum;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: false, ref: "SmartImportAddressCorrection"})
    address_correction?: Ref<SmartImportAddressCorrection>;

    @prop({default: false})
    is_address_changed?: boolean;

    @prop({default: false})
    is_phone_changed?: boolean;

    @prop({required: false, ref: "Location"})
    public location?: Ref<Location>;
}
```


```typescript
export class Phone extends TypegooseWithoutId {
    @prop({required: false})
    label?: string;

    @prop({required: true})
    number!: string;
}
```


```typescript
export class RegularHours extends TypegooseWithoutId {
    @prop({required: true, enum: DaysEnum})
    openDay!: DaysEnum;

    @prop({required: true, default: () => Hours.OPEN_TIME})
    openTime!: string;

    @prop({required: true, default: () => Hours.CLOSE_TIME})
    closeTime!: string;

    @prop({required: true, enum: DaysEnum})
    closeDay!: DaysEnum;

    @prop({required: true, default: false})
    active!: boolean;
}
```


```typescript
export class GoogleBusinessMetadata extends TypegooseWithoutId {
    @prop({required: false})
    google_place_id?: string;

    @prop({required: false})
    google_maps_uri?: string;
}
```


```typescript
export class LocationReviewOverview extends TypegooseBase {
    @prop({required: true, ref: "Location"})
    location!: Ref<Location>;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    gmb_location_code!: string;

    @prop({required: true})
    averageRating!: number;

    @prop({required: true})
    totalReviewCount!: number;

    @prop({required: true, default: 0})
    oneStarCount!: number;

    @prop({required: true, default: 0})
    twoStarsCount!: number;

    @prop({required: true, default: 0})
    threeStarsCount!: number;

    @prop({required: true, default: 0})
    fourStarsCount!: number;

    @prop({required: true, default: 0})
    fiveStarsCount!: number;

    @prop({required: true, default: 0})
    createTime!: Date;
}
```


### DTOs

**File:** `libs/dto/src/location/location.dto.ts`

```typescript
export class GoogleBusinessMetadataDto {
    @ApiProperty({description: "Google Place ID", required: false})
    @IsOptional()
    @IsString()
    google_place_id?: string;

    @ApiProperty({description: "Google Maps URI", required: false})
    @IsOptional()
    @IsUrl({}, {message: "Google Maps URI must be a valid URL"})
    google_maps_uri?: string;
}

export class LocationDto {
    @ApiProperty({description: "id", required: false, example: "5ef1e9a1afd745cddc851449"})
    @IsOptional()
    @IsMongoId()
    _id?: string;

    @ApiProperty({description: "Location Name"})
    @IsString()
    @MinLength(2)
    location_name!: string;

    @ApiProperty({description: "Brand Id", example: "5ef1e98f03060c6e92d4f26f"})
    @IsMongoId()
    brand!: string;

    @ApiProperty({description: "Venue Id", required: false, example: "5ef1e9a1afd745cddc851449"})
    @IsMongoId()
    @IsOptional()
    venue?: string;

    @ApiProperty({description: "Your unique store code", minLength: 1, example: "VENUEX-12"})
    @IsString()
    @MinLength(1)
    store_code!: string;

    @ApiProperty({description: "Descriptor or label of the location to differentiate from other locations", required: false})
    @IsString()
    @IsOptional()
    descriptor?: string;

    @ApiProperty({description: "Description of the location in your own voice", required: false})
    @IsString()
    @IsOptional()
    profile_description?: string;

    @ApiProperty({description: "ID of the address object for your location", example: "5ef1e9e9aabc0a03678de7d0"})
    @Allow()
    address!: string | AddressDto;

    @ApiProperty({description: "Location's web site url", example: "http://www.mystore.example", required: false})
    @IsOptional()
    @IsUrl()
    website?: Maybe<string>;

    @ApiProperty({description: "Location's email address", example: "shop1@mystore.example", required: false})
    @IsOptional()
    @IsEmail({}, {message: "Email must be in a valid email format"})
    email?: Maybe<string>;

    @ApiProperty({description: "Primary phone number", required: false})
    @ValidateIf((location) => !location.source)
    @IsOptional()
    @IsPhoneNumber(undefined, {message: "Primary phone must be a valid phone number"})
    primary_phone?: Maybe<string>;

    @ApiProperty({description: "Additional phones numbers", required: false, type: () => [PhoneDto]})
    @IsOptional()
    @IsArray()
    @ValidateNested()
    @Type(() => PhoneDto)
    additional_phones?: PhoneDto[];

    @ApiProperty({description: "ID list of the official contacts for your location", example: ["5ef1ea0ea1349db142b55e9e"], required: false})
    @IsOptional()
    @IsMongoId({each: true})
    @IsArray()
    contacts?: string[];

    @ApiProperty({description: "Status of the location if closed or open", example: "open", required: false})
    @IsOptional()
    @IsString()
    @IsIn(LocationStatusValues)
    location_status?: string;

    @ApiProperty({description: "Regular working hours of the location", required: false, type: () => [RegularHoursDto]})
    @IsOptional()
    @IsArray()
    @ValidateNested()
    @Type(() => RegularHoursDto)
    regular_hours?: RegularHoursDto[];

    @ApiProperty({description: "Labels of the location", required: false, example: ["sportswear", "diamond"]})
    @IsOptional()
    @IsArray()
    labels?: string[];

    @ApiProperty({description: "The date on which the location first opened", required: false, type: () => OpeningDateDto})
    @IsOptional()
    @ValidateNested()
    @Type(() => OpeningDateDto)
    opening_date?: Maybe<OpeningDateDto>;

    @ApiProperty({description: "Special working or non-working hours of the location", required: false, type: () => [SpecialHourPeriodDto]})
    @IsOptional()
    @ValidateNested()
    @Type(() => SpecialHourPeriodDto)
    special_hours?: SpecialHourPeriodDto[];

    @ApiProperty({description: "Category id of the location (Google)", example: "5ef1e98f03060c6e92d4f26f", required: false})
    @IsOptional()
    @IsMongoId({message: "Location must have a category"})
    primary_category?: string;

    @ApiProperty({description: "Additional category IDs of the location (Google)", required: false, example: ["5ef1e98f03060c6e92d4f26f"]})
    @IsOptional()
    @IsArray()
    @IsMongoId({each: true})
    additional_categories?: string[];

    @ApiProperty({description: "Attributes of the location", required: false, type: () => AttributesDto})
    @IsOptional()
    @ValidateNested()
    @Type(() => AttributesDto)
    attributes?: AttributesDto;

    @ApiProperty({description: "More working hours of the location", required: false, type: () => [MoreHoursDto]})
    @IsOptional()
    @IsArray()
    @ValidateNested()
    @Type(() => MoreHoursDto)
    more_hours?: MoreHoursDto[];

    @IsEnum(LocationProviderEnum)
    @IsOptional()
    source?: LocationProviderEnum;

    @ApiProperty({description: "IANA time zone", example: "Europe/Istanbul", required: false})
    @IsOptional()
    @IsString()
    time_zone?: string;

    @ApiProperty({description: "Time zone offset of the location in UTC format", example: "+03:00", required: false})
    @IsOptional()
    @IsString()
    time_zone_offset?: string;

    @ApiProperty({name: "social", type: () => SocialDto, required: false})
    @IsOptional()
    @ValidateNested()
    @Type(() => SocialDto)
    social?: SocialDto;

    @ApiProperty({description: "Meta page location store number", required: false})
    @IsOptional()
    meta_store_incremental_number?: string;

    @ApiProperty({description: "Meta page categories", required: true})
    @IsOptional()
    @IsString({each: true})
    @ArrayMaxSize(3)
    meta_categories?: string[];

    @ApiProperty({description: "Google Business Profile metadata (place ID and maps URI)", required: false, type: GoogleBusinessMetadataDto})
    @IsOptional()
    @ValidateNested()
    @Type(() => GoogleBusinessMetadataDto)
    gbp_metadata?: GoogleBusinessMetadataDto;

    @ApiProperty({description: "Category id of the location (Apple)", example: "5ef1e98f03060c6e92d4f26f", required: false})
    @IsOptional()
    @IsMongoId({each: true})
    apple_business_categories?: string[];

    @ApiProperty({description: "Category id of the location (Yandex)", example: "5ef1e98f03060c6e92d4f26f", required: false})
    @IsOptional()
    @IsMongoId({each: true})
    yandex_rubrics?: string[];

    @IsOptional()
    @IsUrl()
    yandex_photos_gallery_url?: string;

    @ApiProperty({description: "Amenity mappings of the location", required: false})
    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => LocationAmenityValueDto)
    @IsArray()
    amenities?: LocationAmenityValueDto[];

    @ApiProperty({description: "Google destination account ID for this location", required: false})
    @IsOptional()
    @IsString()
    gbp_account_id?: string;

    @ApiProperty({description: "Meta destination page ID for this location", required: false})
    @IsOptional()
    @IsString()
    meta_page_id?: string;

    @ApiProperty({description: "Apple destination brand ID for this location", required: false})
    @IsOptional()
    @IsString()
    apple_brand_id?: string;
}

export class LocationFormDto extends LocationDto {
    @ApiProperty({name: "address", description: "Address details", type: () => AddressDto, required: true})
    @ValidateNested()
    @Type(() => AddressDto)
    declare address: AddressDto;

    @ApiProperty({description: "Regular working hours of the location", required: false, type: () => [RegularHoursFormDto]})
    @IsOptional()
    @IsArray()
    @ValidateNested()
    @Type(() => RegularHoursFormDto)
    declare regular_hours?: RegularHoursFormDto[];
}

export class LocationCreateOrUpdateDto extends PartialType(LocationDto) {
    @ApiProperty({description: "Set true to immediately sync location listing platforms for this update", required: false, default: false})
    @IsOptional()
    @IsBoolean()
    @Transform(({value}) => value === "true" || value === true)
    @Expose()
    @Default(false)
    triggerSync?: boolean;

    @ApiProperty({description: "When false, keep existing special hours for days that already contain an entry", required: false, default: true})
    @IsOptional()
    @IsBoolean()
    override_special_hours?: boolean;
}

export class LocationBatchUpdateDto extends LocationCreateOrUpdateDto {
    @ApiProperty({description: "Id list of locations to update", required: true})
    @IsArray()
    @ArrayMaxSize(MAX_LOCATION_SIZE)
    ids!: string[];

    @ApiProperty({description: "If value is true, ignore ids array and apply same changes to all filtered locations", required: false})
    @IsOptional()
    @IsBoolean()
    applyToAllFiltered?: boolean;
}

export class LocationSyncResponseDto {
    @ApiProperty({description: "Indicates if sync was successful", example: true})
    @IsBoolean()
    success!: boolean;

    @ApiProperty({description: "Response message", example: "Google sync queued successfully"})
    @IsString()
    message!: string;

    @ApiProperty({description: "List of platforms that were successfully synced", required: false, example: ["google", "meta", "apple"]})
    @IsOptional()
    @IsArray()
    @IsString({each: true})
    platforms?: string[];

    @ApiPropertyOptional({description: "Errors encountered during sync per platform", type: "object", additionalProperties: {type: "string"}})
    @IsOptional()
    @IsObject()
    errors?: Record<string, string>;
}
```


**File:** `libs/dto/src/address/address.dto.ts`

```typescript
export class AddressDto {
    @ApiProperty({name: "lat", description: "latitude", example: "30.01"})
    @IsLatitude()
    @IsLatLngAcceptable("lng", {...})
    lat!: number;

    @ApiProperty({name: "lng", description: "longitude", example: "30.01"})
    @IsLongitude()
    @IsLatLngAcceptable("lat", {...})
    lng!: number;

    @ApiProperty({name: "country", description: "Country code in ISO 3166-1 alpha-2 format", example: "TR"})
    @IsString()
    @IsISO31661Alpha2Extended()
    countryCode!: string;

    @ApiProperty({name: "administrativeArea", description: "Name of the administrative area (e.g. province, state)", example: "İstanbul", required: false})
    @IsString()
    administrativeArea?: string;

    @ApiProperty({name: "locality", description: "Official locality (e.g. city, town)", example: "Beşiktaş", required: false})
    @IsString()
    @IsOptional()
    locality?: string;

    @ApiProperty({name: "sublocality", description: "Sublocality of the address (e.g. neighborhoods, boroughs, districts)", example: "Levent", required: false})
    @IsString()
    @IsOptional()
    sublocality?: string;

    @ApiProperty({name: "fullAddress", example: "Ace3le Sok."})
    @IsString()
    @IsNotEmpty()
    fullAddress!: string;

    @ApiProperty({name: "addressLines"})
    @IsArray()
    @ArrayNotContains([""])
    addressLines!: string[];

    @ApiProperty({name: "postalCode", example: "07888"})
    @IsOptional()
    @IsString()
    postalCode?: string;
}

export class AddressUpdateDto extends PartialType(AddressDto) {}
```


**File:** `libs/dto/src/venue/venue.dto.ts`

```typescript
export class VenueDto {
    @IsString()
    @ApiProperty({description: "Venue management system name", example: "US Polo, Mado, Starbucks, Boyner etc."})
    vmsName!: string;

    @IsOptional()
    @ApiProperty({description: "Imdf identifier (UUID v4)", example: "8f21e898-0f23-44ad-8006-62eacbd61121", required: false})
    @IsUUID("4")
    imdfId?: string;

    @ApiProperty({description: "Names", example: `{"en": "Land Of Legends Shopping Center", "tr": "Land Of Legends Shopping AVM"}`})
    @IsNotEmptyObject()
    @IsLocalizedTextDecorator([], true)
    names!: LocalizedTextType;

    @IsUrl()
    @ApiProperty({description: "Logo url", example: "https://www.venuex.io/assets/images/logo.svg"})
    logo!: string;

    @IsOptional()
    @ApiProperty({description: "Alternative names", example: `{"tr": "LoL", "en": "LoLEN"}`, required: false})
    @IsLocalizedTextDecorator([], true)
    altNames?: LocalizedTextType;

    @IsOptional()
    @ApiProperty({description: "Restriction type", example: RestrictionCategory.employeesonly, enum: RestrictionCategories, required: false})
    @IsIn(RestrictionCategories)
    restriction?: RestrictionCategory;

    @IsIn(VenueCategories)
    @ApiProperty({description: "Category", example: VenueCategory.airport})
    category!: VenueCategory;

    @IsMongoId()
    @ApiProperty({description: "Address document id (MongoDB Object ID)", example: "5ed03ae0dc4d5e77f9084c7b"})
    address!: string;

    @IsOptional()
    @IsMongoId()
    @ApiProperty({description: "Organization document id (MongoDB Object ID)", example: "5ed02d1ffece0f6b85ebe7e5"})
    organization?: string;

    @IsMongoId()
    @ApiProperty({description: "VenueGroup document id (MongoDB Object ID)", example: "5ed02d1ffece0f6b85ebe7e5"})
    venueGroup!: string;

    @IsOptional()
    @ApiProperty({description: "Email", example: "info@mall.com", required: false})
    @IsEmail()
    email?: string;

    @IsOptional()
    @ApiProperty({description: "Website", example: "http://mall.com", required: false})
    @IsUrl()
    website?: string;

    @IsOptional()
    @ApiProperty({description: "LandlinePhone", example: "+902165555555", required: false})
    @IsPhoneNumber()
    landlinePhone?: string;

    @IsMongoId()
    @ApiProperty({description: "File document id (MongoDB Object ID)", example: "5ed02d1ffece0f6b85ebe7e5"})
    logo_file!: string;

    @IsOptional()
    @IsIn(LocaleKeys)
    language?: string;
}
```


**File:** `libs/dto/src/location/store-set.dto.ts`

```typescript
export class StoreSetDto {
    @ApiProperty({description: "Brand Id", example: "5ef1e98f03060c6e92d4f26f"})
    @IsMongoId()
    brand!: string;

    @ApiProperty({description: "Store set name", example: "Marmara region stores"})
    @IsString()
    name!: string;

    @ApiProperty({description: "Ids of the locations included in the store set", required: false, example: ["5ef1e98f03060c6e92d4f26f", "91abe98f03060c6e92d4f26f"]})
    @IsArray()
    @IsMongoId({each: true})
    @ArrayMinSize(1)
    location_ids!: string[];
}
```


**File:** `libs/dto/src/location/meta-location.dto.ts`

```typescript
export class MetaLocationDto {
    @IsMongoId()
    @IsString()
    _id!: string;

    @IsMongoId()
    @IsString()
    brand!: string;

    @IsString()
    main_page_id!: string;

    @IsNumber()
    store_number!: number;

    @IsNumber()
    @IsOptional()
    old_store_number?: number;

    @IsOptional()
    @IsString()
    location_page_id?: string;

    @IsMongoId({each: true})
    @IsString({each: true})
    @IsOptional()
    category_list?: string[];

    @IsOptional()
    @IsString()
    store_location_descriptor?: string;

    @IsOptional()
    @IsBoolean()
    is_deleted?: boolean;

    @IsString()
    @IsOptional()
    store_code?: string;

    @ValidateNested()
    @Type(() => IMetaLocationAddress)
    address?: IMetaLocationAddress;
}
```


**File:** `libs/dto/src/import/location-conflict.dto.ts`

```typescript
export class ConflictLocationSnapshotDto {
    locationName?: string;
    locationId?: string;
    storeCode?: string;
    displayName?: string;
    phone?: string;
    website?: string;
    address?: string;
}

export class ConflictSnapshotsDto {
    google?: ConflictLocationSnapshotDto;
    duplicateGoogle?: ConflictLocationSnapshotDto;
    venuex?: ConflictLocationSnapshotDto;
}

export class LocationConflictDto {
    id!: string;
    conflictType!: LocationConflictTypeEnum;
    status!: LocationConflictStatusEnum;
    brand!: string;
    gbpAccountId!: string;
    venuexLocationId?: string;
    snapshots!: ConflictSnapshotsDto;
    createdAt!: Date;
}

export class ResolveConflictActionDto {
    @IsMongoId()
    @IsNotEmpty()
    conflictId!: string;

    @IsEnum(LocationConflictActionEnum)
    action!: LocationConflictActionEnum;
}

export class ResolveConflictsDto {
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => ResolveConflictActionDto)
    actions!: ResolveConflictActionDto[];
}
```


**File:** `libs/dto/src/location-reviews/location-review.dto.ts`

```typescript
export class LocationReviewDto {
    @ApiProperty({description: "Location Id", example: "5ef1e98f03060c6e92d4f26f"})
    @IsMongoId()
    name!: string;

    @ApiProperty({description: "A review for the location", required: false, type: () => ReviewDto})
    @ValidateNested()
    @Type(() => ReviewDto)
    review!: ReviewDto;
}

export class GoogleLocationReviewDto {
    @ApiProperty({description: "A review for the location", required: false, type: () => [ReviewDto]})
    @ValidateNested()
    @Type(() => ReviewDto)
    reviews!: ReviewDto[];

    @ApiProperty({description: "Avrage rating number for the location", required: false})
    @IsNumber()
    @Min(1)
    @Max(5)
    averageRating!: number;

    @ApiProperty({description: "Total review count", required: false})
    @IsNumber()
    totalReviewCount!: number;
}
```


**File:** `libs/dto/src/location/phone.dto.ts`

```typescript
export class PhoneDto {
    @ApiProperty({description: "Label", example: "Mobile", required: false})
    @IsOptional()
    @IsString()
    @MinLength(2)
    label?: Maybe<string>;

    @ApiProperty({description: "number", example: "+905331234567"})
    @IsPhoneNumber(undefined, {message: "Phone must be a valid phone number"})
    number!: string;
}
```


**File:** `libs/dto/src/location/regular-hours.dto.ts`

```typescript
export class RegularHoursDto {
    @IsEnum(DaysEnum)
    openDay!: DaysEnum;

    @IsString()
    @Matches(HH_MM_TIME_REGEX)
    openTime!: string;

    @IsString()
    @Matches(HH_MM_CLOSE_TIME_REGEX)
    closeTime!: string;

    @IsEnum(DaysEnum)
    closeDay!: DaysEnum;

    @IsBoolean()
    active!: boolean;
}

export class RegularHoursFormDto {
    @IsEnum(DaysEnum)
    openDay!: DaysEnum;

    @IsString()
    @IsDateString()
    openTime!: string;

    @IsString()
    @IsDateString()
    closeTime!: string;

    @IsEnum(DaysEnum)
    closeDay!: DaysEnum;

    @IsBoolean()
    active!: boolean;
}
```


### Enums & Constants

**File:** `libs/constants/src/location/location-status.ts`

```typescript
export enum LocationStatusEnum {
    OPEN = "open",
    CLOSED_TEMPORARILY = "closed_temporarily",
    CLOSED_PERMANENTLY = "closed_permanently",
}

export const LocationStatusValues = Object.values(LocationStatusEnum) as LocationStatusEnum[];
```


**File:** `libs/constants/src/location-source-enum.ts`

```typescript
enum LocationSourceVenuexApi {
    venuex_api = "venuex-api",
}

export const LocationSource = {...LocationProviderEnum, ...LocationSourceVenuexApi};
export type LocationSource = LocationProviderEnum | LocationSourceVenuexApi;
export const LocationSources = Object.values(LocationSource) as LocationSource[];
```


**File:** `libs/constants/src/import/location-conflict.enum.ts`

```typescript
export enum LocationConflictTypeEnum {
    ONLY_IN_VX = "only_in_vx",
    ONLY_IN_GOOGLE = "only_in_google",
    ID_MISMATCH = "id_mismatch",
    DUPLICATE_LOCATION = "duplicate_location",
    ACCOUNT_MISMATCH = "account_mismatch",
}

export enum LocationConflictStatusEnum {
    PENDING = "pending",
    RESOLVED = "resolved",
    SKIPPED = "skipped",
}

export enum LocationConflictActionEnum {
    ADD_TO_GOOGLE = "add_to_google",
    DELETE_VX = "delete_vx",
    DELETE_GOOGLE = "delete_google",
    ADD_TO_VX = "add_to_vx",
    USE_GOOGLE_ID = "use_google_id",
    USE_ORIGINAL_GOOGLE_ID = "use_original_google_id",
    USE_DUPLICATE_GOOGLE_ID = "use_duplicate_google_id",
    ADD_ORIGINAL_TO_VX = "add_original_to_vx",
    ADD_DUPLICATE_TO_VX = "add_duplicate_to_vx",
    DELETE_BOTH_GOOGLE = "delete_both_google",
    SKIP = "skip",
}
```


**File:** `libs/constants/src/import/location-diff-status.enum.ts`

```typescript
export enum LocationDiffStatusEnum {
    CREATED = "CREATED",
    UPDATED = "UPDATED",
    DELETED = "DELETED",
    TEMPORARILY_CLOSED = "TEMPORARILY_CLOSED",
}
```


**File:** `libs/constants/src/location/store-status.ts`

```typescript
export const SupportedStorePlatforms = {
    google: "google",
    meta: "meta",
    apple: "apple",
    yandex: "yandex",
    togg: "togg",
} as const;

export enum StoreVerificationStatus {
    VERIFIED = "VERIFIED",
    UNVERIFIED = "UNVERIFIED",
    DUPLICATED = "DUPLICATED",
    SUSPENDED = "SUSPENDED",
    DISABLED = "DISABLED",
    UNKNOWN = "UNKNOWN",
}

export type StoreVerificationPlatformType = keyof typeof SupportedStorePlatforms;
export type StoreVerificationStatusPlatformMap = {
    [key in StoreVerificationPlatformType]?: StoreVerificationStatus;
};

export enum StoreListingStatus {
    LISTED = "LISTED",
    UNLISTED = "UNLISTED",
    UPDATE_REQUEST_IN_QUEUE = "UPDATE_REQUEST_IN_QUEUE",
    UPDATE_REQUEST_SENT_TO_PLATFORM = "UPDATE_REQUEST_SENT_TO_PLATFORM",
}

export type StoreListingStatusPlatformMap = {
    [key in StoreListingPlatformsType]?: StoreListingStatus;
};
```


### Interfaces & Types

_No definitions found in this category._

### Validation Schemas

_No definitions found in this category._

---

## Campaigns & Marketing

### Database Models

**File:** `libs/google-ads-api/src/schemas/user-data/user-data-schema.ts`

```typescript
export class Schema$UserData {
    userIdentifiers?: Schema$UserData$UserIdentifier[];
    transactionAttribute?: Schema$UserData$TransactionAttribute;
    userAttribute?: Schema$UserData$UserAttribute;
    consent?: Schema$UserData$Consent;
}
```


**File:** `libs/google-ads-api/src/schemas/user-data/user-identifiers-schema.ts`

```typescript
export class Schema$UserData$UserIdentifier {
    userIdentifierSource?: UserIdentifierSourceEnum;
    hashedEmail?: string;
    hashedPhoneNumber?: string;
    mobileId?: string;
    thirdPartyUserId?: string;
    addressInfo?: Schema$UserData$UserIdentifier$OfflineUserAddressInfo;
}
```


**File:** `libs/google-ads-api/src/schemas/user-data/offline-user-address-info-schema.ts`

```typescript
export class Schema$UserData$UserIdentifier$OfflineUserAddressInfo {
    hashedFirstName?: string;
    hashedLastName?: string;
    city?: string;
    state?: string;
    countryCode?: string;
    postalCode?: string;
    hashedStreetAddress?: string;
}
```


**File:** `libs/google-ads-api/src/schemas/user-data/transaction-attribute-schema.ts`

```typescript
export class Schema$UserData$TransactionAttribute$StoreAttribute {
    storeCode?: string;
}

export class Schema$UserData$TransactionAttribute$ItemAttribute {
    itemId?: string;
    countryCode?: string;
    languageCode?: string;
    quantity?: string;
    merchantId?: string;
}

export class Schema$UserData$TransactionAttribute {
    storeAttribute?: Schema$UserData$TransactionAttribute$StoreAttribute;
    itemAttribute?: Schema$UserData$TransactionAttribute$ItemAttribute;
    transactionDateTime!: string;
    transactionAmountMicros!: number;
    currencyCode!: string;
    conversionAction!: string;
    orderId?: string;
    customValue?: string;
}
```


**File:** `libs/google-ads-api/src/schemas/user-data/consent-schema.ts`

```typescript
export class Schema$UserData$Consent {
    adUserData?: ConsentStatusEnum;
    adPersonalization?: ConsentStatusEnum;
}
```


**File:** `libs/google-ads-api/src/schemas/user-data/user-attribute-schema.ts`

```typescript
export class Schema$UserData$UserAttribute$EventItemAttribute {
    itemId?: string;
}

export class Schema$UserData$UserAttribute$EventAttribute {
    event?: string;
    eventDateTime?: string;
    itemAttribute?: Schema$UserData$UserAttribute$EventItemAttribute[];
}

export class Schema$UserData$UserAttribute$ShoppingLoyalty {
    loyaltyTier?: string;
}

export class Schema$UserData$UserAttribute {
    lastPurchaseDateTime?: string;
    averagePurchaseCount?: number;
    averagePurchaseValueMicros?: string;
    acquisitionDateTime?: string;
    lifecycleStage?: string;
    firstPurchaseDateTime?: string;
    eventAttribute?: Schema$UserData$UserAttribute$EventAttribute[];
    lifetimeValueMicros?: string;
    lifetimeValueBucket?: number;
    shoppingLoyalty?: Schema$UserData$UserAttribute$ShoppingLoyalty;
}
```


**File:** `libs/google-ads-api/src/schemas/store-sales/store-sales-metadata-schema.ts`

```typescript
export class Schema$StoreSalesMetadata {
    thirdPartyMetadata?: Schema$StoreSalesThirdPartyMetadata;
    loyaltyFraction?: number;
    transactionUploadFraction?: number;
    customKey?: string;
}
```


**File:** `libs/google-ads-api/src/schemas/store-sales/store-sales-third-party-metadata-schema.ts`

```typescript
export interface Schema$StoreSalesThirdPartyMetadata {
    advertiserUploadDateTime?: string;
    validTransactionFraction?: number;
    partnerMatchFraction?: number;
    partnerUploadFraction?: number;
    bridgeMapVersionId?: string;
    partnerId?: string;
}
```


**File:** `libs/google-ads-api/src/schemas/customer-offline-user-job-operation/offline-user-job-operation-schema.ts`

```typescript
export class Schema$OfflineUserDataJobOperation {
    create?: Schema$UserData;
    remove?: Schema$UserData;
    removeAll?: boolean;
}
```


**File:** `libs/google-ads-api/src/schemas/offline-user-data-job/offline-user-data-job-schema.ts`

```typescript
export class Schema$OfflineUserDataJob {
    resourceName?: string;
    type?: OfflineUserDataJobTypeEnum;
    status?: OfflineUserDataJobStatusEnum;
    failureReason?: OfflineUserDataJobFailureReasonEnum;
    operationMetadata?: Schema$OfflineUserDataJobMetadata;
    id?: string;
    externalId?: string;
    customerMatchUserListMetadata?: Schema$CustomerMatchUserListMetadata;
    storeSalesMetadata?: Schema$StoreSalesMetadata;
}
```


**File:** `libs/google-ads-api/src/schemas/offline-user-data-job/offline-user-data-job-metadata-schema.ts`

```typescript
export class Schema$OfflineUserDataJobMetadata {
    matchRateRange?: OfflineUserDataJobMatchRateRangeEnum;
}
```


**File:** `libs/database/src/mongoose/schemas/location-local-post/offer.schema.ts`

```typescript
export class Offer extends TypegooseWithoutId {
    @prop({required: false})
    couponCode?: string;

    @prop({required: false})
    redeemOnlineUrl?: string;

    @prop({required: false})
    termsConditions?: string;
}
```


### DTOs

**File:** `libs/dto/src/conversion/campaign-search.dto.ts`

```typescript
export class CampaignTypesFetchQueryDto {
    @IsArray()
    @IsString({each: true})
    campaignTypes!: string[];
}

export class PerProviderCampaignTypesFetchQueryDto {
    @IsArray()
    @IsString({each: true})
    campaignTypes!: string[];

    @IsEnum(Provider)
    provider!: Provider;
}
```


**File:** `libs/dto/src/conversion/conversion-type.dto.ts`

```typescript
export class SalesAndRevenueDto {
    @IsNumber()
    conversions!: number;

    @IsNumber()
    allConversionsValue!: number;

    @IsNumber()
    allConversions!: number;
}

export class ClickAndCostDto {
    @IsNumber()
    clicks!: number;

    @IsNumber()
    costMicros!: number;
}

export class StoreVisit {
    @IsNumber()
    allConversions!: number;
}

export class MetricsFetchQueryDto {
    @IsString({each: true})
    @IsOptional()
    customerIds?: string[];

    @IsDateString()
    startDate!: string;

    @IsDateString()
    endDate!: string;

    @IsString()
    @IsOptional()
    campaign?: string;

    @IsArray()
    @IsString({each: true})
    @IsOptional()
    campaigns?: string[];

    @IsArray()
    @IsString({each: true})
    campaignTypes!: string[];
}

export class PerProviderMetricsFetchQueryDto extends MetricsFetchQueryDto {
    @IsEnum(Provider)
    provider!: Provider;
}
```


**File:** `libs/dto/src/conversion/offline-user-data-job/add-offline-user-data-job-operation.dto.ts`

```typescript
const OPTIMAL_PROCESSING_SIZE = 10000;

export class AddOfflineUserDataJobOperationDto extends RunOfflineUserDataJobDto {
    @ApiProperty({description: "Operations with user & transaction data", required: false, type: () => [UserDataDto]})
    @IsArray()
    @Type(() => UserDataDto)
    @ValidateNested({each: true})
    @IsOptional()
    @ArrayMaxSize(OPTIMAL_PROCESSING_SIZE)
    operations?: UserDataDto[];
}
```


**File:** `libs/dto/src/conversion/offline-user-data-job/user-identifier.dto.ts`

```typescript
export class OfflineUserAddressInfoDto {
    @IsString()
    @IsOptional()
    @IsHash("sha256")
    hashedFirstName?: string;

    @IsString()
    @IsOptional()
    @IsHash("sha256")
    hashedLastName?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsString()
    @IsOptional()
    countryCode?: string;

    @IsString()
    @IsOptional()
    postalCode?: string;

    @IsString()
    @IsOptional()
    @IsHash("sha256")
    hashedStreetAddress?: string;
}

export class UserIdentifierDto {
    @IsString()
    @IsOptional()
    @IsHash("sha256")
    hashedEmail?: string;

    @IsString()
    @IsOptional()
    @IsHash("sha256")
    hashedPhoneNumber?: string;

    @IsString()
    @IsOptional()
    mobileId?: string;

    @IsString()
    @IsOptional()
    thirdPartyUserId?: string;

    @ValidateNested()
    @IsOptional()
    @Type(() => OfflineUserAddressInfoDto)
    addressInfo?: OfflineUserAddressInfoDto;
}
```


**File:** `libs/dto/src/conversion/offline-user-data-job/transaction-attribute.dto.ts`

```typescript
export class TransactionAttributeDto {
    @ApiProperty({
        examples: ["2024-08-30 07:01:14", "2024-08-30 07:01:14-05:00"],
    })
    @IsString()
    transactionDateTime!: string;

    @IsNumber()
    @IsPositive()
    transactionAmountMicros!: number;

    @IsString()
    currencyCode!: string;

    @ApiProperty({
        description: "only id of the conversion action",
        example: "12345678",
    })
    @IsString()
    conversionAction!: string;
}
```


**File:** `libs/dto/src/conversion/offline-user-data-job/consent.dto.ts`

```typescript
export class ConsentDto {
    @IsString()
    @IsEnum(ConsentStatusEnum)
    adUserData?: ConsentStatusEnum;

    @IsString()
    @IsEnum(ConsentStatusEnum)
    adPersonalization?: ConsentStatusEnum;
}
```


**File:** `libs/dto/src/conversion/offline-user-data-job/run-offline-user-data-job.dto.ts`

```typescript
export class RunOfflineUserDataJobDto {
    @ApiProperty({
        description: "Offline user data job id",
    })
    @IsString()
    offlineUserDataJobId!: string;
}
```


**File:** `libs/dto/src/conversion/offline-user-data-job/user-data.dto.ts`

```typescript
export class UserDataDto {
    @ApiProperty({
        description: "User identifier information",
        type: () => [UserIdentifierDto],
    })
    @ValidateNested({each: true})
    @IsOptional()
    @Type(() => UserIdentifierDto)
    userIdentifiers?: UserIdentifierDto[];

    @ApiProperty({
        description: "Transaction related information",
    })
    @ValidateNested()
    @Type(() => TransactionAttributeDto)
    @IsOptional()
    transactionAttribute?: TransactionAttributeDto;

    @ApiProperty({
        description: "User consent",
    })
    @ValidateNested()
    @Type(() => ConsentDto)
    @IsOptional()
    consent?: ConsentDto;
}
```


**File:** `libs/dto/src/conversion/google-ads-accessible-customers-response.dto.ts`

```typescript
export class GoogleAdsAccessibleCustomersResponseDto {
    @IsString()
    id!: string;

    @IsString()
    descriptiveName!: string;

    @IsString()
    resourceName!: string;
}
```


**File:** `libs/dto/src/conversion/top-campaigns-response.dto.ts`

```typescript
export class PaginationInfo {
    @ApiProperty({description: "Whether there is a next page available", required: false})
    hasNextPage?: boolean;

    @ApiProperty({description: "Whether there is a previous page available", required: false})
    hasPreviousPage?: boolean;

    @ApiProperty({description: "Cursor for the next page (Meta API)", required: false})
    nextCursor?: string;

    @ApiProperty({description: "Cursor for the previous page (Meta API)", required: false})
    previousCursor?: string;
}

export class TopCampaignsResponseDto {
    @ApiProperty({description: "List of top performing campaigns", type: [TopCampaignResultDto]})
    data!: TopCampaignResultDto[];

    @ApiProperty({description: "Pagination information", type: PaginationInfo, required: false})
    pagination?: PaginationInfo;
}
```


**File:** `libs/dto/src/conversion/google-ads-metrics.dto.ts`

```typescript
export class MetricDto {
    @IsNumber()
    @Min(0)
    value!: number;

    @IsNumber()
    change!: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    past_value?: number;
}

export class GoogleAdsMetricsDto {
    @ValidateNested()
    @Type(() => MetricDto)
    cost!: MetricDto;

    @ValidateNested()
    @Type(() => MetricDto)
    clicks!: MetricDto;

    @ValidateNested()
    @Type(() => MetricDto)
    store_visit!: MetricDto;

    @ValidateNested()
    @Type(() => MetricDto)
    online_orders!: MetricDto;

    @ValidateNested()
    @Type(() => MetricDto)
    online_revenue!: MetricDto;

    @ValidateNested()
    @Type(() => MetricDto)
    offline_orders!: MetricDto;

    @ValidateNested()
    @Type(() => MetricDto)
    offline_revenue!: MetricDto;

    @ValidateNested()
    @Type(() => MetricDto)
    store_sale_purchase_rate!: MetricDto;

    @ValidateNested()
    @Type(() => MetricDto)
    store_sales_roas!: MetricDto;

    @ValidateNested()
    @Type(() => MetricDto)
    store_sales_cpa!: MetricDto;

    @ValidateNested()
    @Type(() => MetricDto)
    store_sales_avg_conversion_value!: MetricDto;

    @ValidateNested()
    @Type(() => MetricDto)
    online_roi!: MetricDto;

    @ValidateNested()
    @Type(() => MetricDto)
    online_aov!: MetricDto;

    @ValidateNested()
    @Type(() => MetricDto)
    cost_of_visit!: MetricDto;

    @ValidateNested()
    @Type(() => MetricDto)
    cost_of_offline_order!: MetricDto;

    @ValidateNested()
    @Type(() => MetricDto)
    click_to_visit_rate!: MetricDto;

    @ValidateNested()
    @Type(() => MetricDto)
    click_to_purchase_rate!: MetricDto;
}

export class GoogleAdsMetricsResponseDto extends GoogleAdsMetricsDto {
    @IsString({each: true})
    accountNames!: string[];

    @ValidateNested()
    @Type(() => MetricDto)
    offline_revenue_share!: MetricDto;
}

export class GoogleAdsSingleCustomerMetricsDto extends GoogleAdsMetricsDto {
    @IsString()
    accountName!: string;
}
```


**File:** `libs/dto/src/conversion/google-ads-search.dto.ts`

```typescript
class GoogleAdsSearchSettings {
    @IsBoolean()
    @IsOptional()
    returnTotalResultsCount?: boolean;

    @IsEnum(SummaryRowSettingEnum)
    @IsOptional()
    summaryRowSetting?: SummaryRowSettingEnum;
}

export class GoogleAdsSearchDto {
    @ApiProperty({description: "Customer id to get hierarchy of"})
    @IsString()
    @IsOptional()
    customerId?: string;

    @ApiProperty({
        description: "Search query",
        example: "SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = 'Store sales'",
    })
    @IsString()
    @IsNotEmpty()
    query!: string;

    @IsNumber()
    @IsOptional()
    pageSize?: number;

    @IsString()
    @IsOptional()
    pageToken?: string;

    @IsBoolean()
    @IsOptional()
    validateOnly?: boolean;

    @IsOptional()
    @Type(() => GoogleAdsSearchSettings)
    @ValidateNested()
    searchSettings?: GoogleAdsSearchSettings;
}

export class GoogleAdsSearchDefaultQueryDto extends OmitType(GoogleAdsSearchDto, ["query"]) {}
```


**File:** `libs/dto/src/conversion/meta-ads-metrics.dto.ts`

```typescript
export class MetaAdsMetricsDto {
    @ValidateNested()
    @Type(() => MetricDto)
    cost!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    clicks!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    onlineOrders!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    onlineRevenue!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    onlineROI!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    onlineAOV!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    offlineOrders!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    offlineRevenue!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    offlineROAS!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    offlineAOV!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    offlineRevenueShare!: MetricValue;
}

export class MetaAdsMetricsResponseDto extends MetaAdsMetricsDto {
    @IsString({each: true})
    accountNames!: string[];
}
```


**File:** `libs/dto/src/conversion/offline-conversion-issue.dto.ts`

```typescript
export class OfflineConversionIssueDto {
    @IsEnum(OfflineUserDataJobPlatform)
    platform!: string;

    @IsDate()
    date!: Date;

    @IsEnum(OfflineUserDataJobFailureReasonEnum)
    failureReason!: OfflineUserDataJobFailureReasonEnum;
}
```


**File:** `libs/dto/src/conversion/geographic-metrics-query.dto.ts`

```typescript
export class GeographicMetricsQueryDto extends OverviewDateQueryDto {
    @ApiProperty({description: "Level of geographic breakdown", required: true, enum: ["WORLD", "TURKEY"]})
    @IsIn(["WORLD", "TURKEY"])
    level!: "WORLD" | "TURKEY";

    @ApiProperty({description: "Sort using which field?", required: false})
    @IsOptional()
    @IsString()
    sortField?: string;

    @ApiProperty({description: "Sort ascending or descending?", required: false, enum: ["asc", "desc"]})
    @IsOptional()
    @IsIn(["asc", "desc"])
    sort?: "asc" | "desc";

    @ApiProperty({description: "Number of items per page", required: false})
    @IsOptional()
    @IsNumber()
    pageSize?: number;

    @ApiProperty({description: "Page number (1-based) (Google Ads API)", required: false})
    @IsOptional()
    @IsNumber()
    pageCount?: number;

    @ApiProperty({description: "Cursor for pagination (Meta API)", required: false})
    @IsOptional()
    @IsString()
    cursor?: string;

    @ApiProperty({description: "Pagination direction (Meta API)", required: false, enum: ["next", "previous"]})
    @IsOptional()
    @IsIn(["next", "previous"])
    direction?: "next" | "previous";

    @ApiProperty({description: "Campaign IDs to filter by", required: false})
    @IsArray()
    @IsString({each: true})
    @IsOptional()
    campaigns?: string[];

    @ApiProperty({description: "Campaign types to filter by (not available for Meta API)", required: false})
    @IsArray()
    @IsString({each: true})
    @IsOptional()
    campaignTypes?: string[];
}
```


**File:** `libs/dto/src/conversion/geographic-metrics-response.dto.ts`

```typescript
export class GeographicMetricsResponseDto {
    @ApiProperty({description: "List of geographic metrics", type: [GeographicMetricsResultDto]})
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => GeographicMetricsResultDto)
    data!: GeographicMetricsResultDto[];

    @ApiProperty({description: "Pagination information", type: PaginationInfo, required: false})
    @IsOptional()
    @ValidateNested()
    @Type(() => PaginationInfo)
    pagination?: PaginationInfo;
}
```


**File:** `libs/dto/src/conversion/geographic-metrics-result.dto.ts`

```typescript
export class GeographicMetricsResultDto {
    @IsString()
    level!: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    iso!: string;

    @IsInt()
    @Min(0)
    impressions!: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    clickToVisitRate?: number;

    @IsNumber()
    @Min(0)
    spend!: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    visits?: number;

    @IsInt()
    @Min(0)
    clicks!: number;

    @IsNumber()
    @Min(0)
    offlinePurchases!: number;

    @IsNumber()
    @Min(0)
    offlineRevenue!: number;

    @IsNumber()
    @Min(0)
    offlineRoas!: number;
}
```


**File:** `libs/dto/src/conversion/store-sales-metadata.dto.ts`

```typescript
export class StoreSalesMetadataDto {
    @IsOptional()
    @ValidateNested()
    @Type(() => StoreSalesMetadataDto)
    thirdPartyMetadata?: StoreSalesThirdPartyMetadataDto;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    loyaltyFraction?: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    transactionUploadFraction?: number;

    @IsOptional()
    @IsString()
    customKey?: string;
}
```


**File:** `libs/dto/src/conversion/store-sales-third-party-metadata.dto.ts`

```typescript
export class StoreSalesThirdPartyMetadataDto {
    @IsString()
    @IsOptional()
    advertiserUploadDateTime?: string;

    @IsNumber()
    @IsOptional()
    validTransactionFraction?: number;

    @IsNumber()
    @IsOptional()
    partnerMatchFraction?: number;

    @IsNumber()
    @IsOptional()
    partnerUploadFraction?: number;

    @IsString()
    @IsOptional()
    bridgeMapVersionId?: string;

    @IsString()
    @IsOptional()
    partnerId?: string;
}
```


**File:** `libs/dto/src/conversion/google-ads-setup-selection-response.dto.ts`

```typescript
export class ConversionResultsDto {
    @IsString()
    id!: string;

    @IsString()
    type!: string;

    @IsString()
    name!: string;
}

export class GoogleAdsSetupSelectionResponseDto {
    @ValidateNested({each: true})
    @IsArray()
    @Type(() => ConversionResultsDto)
    onlineConversionResults!: ConversionResultsDto[];

    @ValidateNested({each: true})
    @IsArray()
    @Type(() => ConversionResultsDto)
    offlineConversionResults!: ConversionResultsDto[];

    @ValidateNested({each: true})
    @IsArray()
    @Type(() => GoogleAdsAccessibleCustomersResponseDto)
    subAccountResults!: GoogleAdsAccessibleCustomersResponseDto[];
}
```


**File:** `libs/dto/src/conversion/coversions-overview.dto.ts`

```typescript
export class ConversionsOverview {
    @IsNumber()
    aov!: number;

    @IsNumber()
    total!: number;

    @IsNumber()
    totalTransactions!: number;
}
```


**File:** `libs/dto/src/conversion/create-offline-user-data-job.dto.ts`

```typescript
export class CreateOfflineUserDataJobDto {
    @ApiProperty({description: "Customer id to get hierarchy of"})
    @IsString()
    customerId!: string;

    @ApiProperty({description: "Job with input fields only"})
    @IsOptional()
    @ValidateNested()
    @Type(() => OfflineUserDataJobDto)
    job?: OfflineUserDataJobDto;
}
```


**File:** `libs/dto/src/conversion/offline-user-data-job.dto.ts`

```typescript
export class OfflineUserDataJobDto {
    @IsEnum(OfflineUserDataJobTypeEnum)
    type!: OfflineUserDataJobTypeEnum;

    @IsOptional()
    @IsString()
    externalId?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => StoreSalesMetadataDto)
    storeSalesMetadata?: StoreSalesMetadataDto;
}
```


**File:** `libs/dto/src/conversion/google-ads-campaign.dto.ts`

```typescript
export class GoogleAdsCampaignResponseDto {
    @IsArray()
    @IsString({each: true})
    conversionActions!: string[];

    @IsString()
    resourceName!: string;

    @IsString()
    name!: string;

    @IsArray()
    @IsString({each: true})
    labels!: string[];
}
```


**File:** `libs/dto/src/conversion/meta-ads-campaign.dto.ts`

```typescript
export class MetaAdsCampaignResponseDto {
    @IsString()
    id!: string;

    @IsString()
    name!: string;
}
```


**File:** `libs/dto/src/conversion/top-campaign-result.dto.ts`

```typescript
export class TopCampaignResultDto {
    @IsString()
    name!: string;

    @IsInt()
    @Min(0)
    impressions!: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    clickToVisitRate?: number;

    @IsInt()
    @Min(0)
    spend!: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    visits?: number;

    @IsInt()
    @Min(0)
    clicks!: number;

    @IsInt()
    @Min(0)
    offlinePurchases!: number;

    @IsNumber()
    @Min(0)
    offlineRevenue!: number;

    @IsNumber()
    @Min(0)
    offlineRoas!: number;
}
```


**File:** `libs/dto/src/conversion/top-campaigns-query.dto.ts`

```typescript
export class TopCampaignsQueryDto extends OverviewDateQueryDto {
    @ApiProperty({description: "Sort using which field?", required: false})
    @IsOptional()
    @IsString()
    sortField?: string;

    @ApiProperty({description: "Sort ascending or descending?", required: false, enum: ["asc", "desc"]})
    @IsOptional()
    @IsIn(["asc", "desc"])
    sort?: "asc" | "desc";

    @ApiProperty({description: "Number of items per page", required: false})
    @IsOptional()
    @IsNumber()
    pageSize?: number;

    @ApiProperty({description: "Page number (1-based) (Google Ads API)", required: false})
    @IsOptional()
    @IsNumber()
    pageCount?: number;

    @ApiProperty({description: "Cursor for pagination (Meta API)", required: false})
    @IsOptional()
    @IsString()
    cursor?: string;

    @ApiProperty({description: "Pagination direction (Meta API)", required: false, enum: ["next", "previous"]})
    @IsOptional()
    @IsIn(["next", "previous"])
    direction?: "next" | "previous";

    @ApiProperty({description: "Filter by specific campaign IDs", required: false, type: [String]})
    @IsOptional()
    @IsString({each: true})
    campaigns?: string[];

    @ApiProperty({description: "Filter by campaign types (e.g., SEARCH, DISPLAY)", required: false, type: [String]})
    @IsOptional()
    @IsString({each: true})
    campaignTypes?: string[];
}
```


**File:** `libs/dto/src/tiktok/tiktok-campaign.dto.ts`

```typescript
export class FilteringParamsDto {
    @IsOptional()
    @IsArray()
    @IsString({each: true})
    campaign_ids?: string[];

    @IsOptional()
    @IsString()
    campaign_name?: string;

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    campaign_system_origins?: string[];

    @IsOptional()
    @IsString()
    primary_status?: string;

    @IsOptional()
    @IsString()
    secondary_status?: string;

    @IsOptional()
    @IsString()
    objective_type?: string;

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    buying_types?: string[];

    @IsOptional()
    @IsBoolean()
    is_smart_performance_campaign?: boolean;

    @IsOptional()
    @IsBoolean()
    split_test_enabled?: boolean;

    @IsOptional()
    @IsString()
    campaign_product_source?: string;

    @IsOptional()
    @IsString()
    optimization_goal?: string;

    @IsOptional()
    @IsString()
    campaign_type?: string;

    @IsOptional()
    @IsString()
    creation_filter_start_time?: string;

    @IsOptional()
    @IsString()
    creation_filter_end_time?: string;
}

export class TiktokCampaignParamsDto {
    @IsOptional()
    @IsString()
    advertiser_id?: string;

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    fields?: string[];

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    exclude_field_types_in_response?: string[];

    @IsOptional()
    @ValidateNested()
    @Type(() => FilteringParamsDto)
    filtering?: FilteringParamsDto;

    @IsOptional()
    @IsNumber()
    page?: number;

    @IsOptional()
    @IsNumber()
    page_size?: number;
}
```


**File:** `libs/dto/src/tiktok/tiktok-test-event.dto.ts`

```typescript
export class TiktokTestEventDto {
    @IsString()
    event_code!: string;
}
```


**File:** `libs/dto/src/tiktok/tiktok-conversion.dto.ts`

```typescript
export class TiktokConversionUserDto {
    @IsOptional()
    @IsString()
    ttclid?: string;

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    email?: string[];

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    phone?: string[];

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    external_id?: string[];

    @IsOptional()
    @IsString()
    ttp?: string;

    @IsOptional()
    @IsIP()
    ip?: string;

    @IsOptional()
    @IsString()
    user_agent?: string;

    @IsOptional()
    @IsString()
    first_name?: string;

    @IsOptional()
    @IsString()
    last_name?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsISO31661Alpha2Extended()
    country?: string;

    @IsOptional()
    @IsString()
    zip_code?: string;

    @IsOptional()
    @IsString()
    idfa?: string;

    @IsOptional()
    @IsString()
    idfv?: string;

    @IsOptional()
    @IsString()
    gaid?: string;

    @IsOptional()
    @IsString()
    locale?: string;

    @IsOptional()
    @IsEnum(TiktokAttStatusEnum)
    att_status?: TiktokAttStatusEnum;
}

export class TiktokConversionContentDto {
    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsInt()
    quantity?: number;

    @IsOptional()
    @IsString()
    content_id?: string;

    @IsOptional()
    @IsString()
    content_category?: string;

    @IsOptional()
    @IsString()
    content_name?: string;

    @IsOptional()
    @IsString()
    brand?: string;
}

export class TiktokConversionPropertiesDto {
    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => TiktokConversionContentDto)
    contents?: TiktokConversionContentDto[];

    @IsOptional()
    @IsEnum(TiktokContentTypeEnum)
    content_type?: TiktokContentTypeEnum;

    @IsOptional()
    @IsISO4217CurrencyCode()
    currency?: string;

    @IsOptional()
    @IsNumber()
    value?: number;

    @IsOptional()
    @IsString()
    query?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    order_id?: string;

    @IsOptional()
    @IsString()
    shop_id?: string;
}

export class TiktokConversionPageDto {
    @IsUrl()
    url!: string;

    @IsOptional()
    @IsUrl()
    referrer?: string;
}

export class TiktokConversionAppDto {
    @IsString()
    app_id!: string;

    @IsOptional()
    @IsString()
    app_name?: string;

    @IsOptional()
    @IsString()
    app_version?: string;
}

export class TiktokConversionAdDto {
    @IsOptional()
    @IsString()
    callback?: string;

    @IsOptional()
    @IsString()
    campaign_id?: string;

    @IsOptional()
    @IsString()
    ad_id?: string;

    @IsOptional()
    @IsString()
    creative_id?: string;

    @IsOptional()
    @IsBoolean()
    is_retargeting?: boolean;

    @IsOptional()
    @IsBoolean()
    attributed?: boolean;

    @IsOptional()
    @IsString()
    attribution_type?: string;

    @IsOptional()
    @IsString()
    attribution_provider?: string;
}

export class TiktokConversionLeadDto {
    @IsString()
    lead_id!: string;

    @IsOptional()
    @IsString()
    lead_event_source?: string;
}

export class TiktokMetricsResponseDto {
    @IsArray()
    @IsString({each: true})
    accountNames!: string[];

    @ValidateNested()
    @Type(() => MetricDto)
    spend!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    clicks!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    online_orders!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    online_revenue!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    online_roi!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    online_aov!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    offline_orders!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    offline_revenue!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    offline_roas!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    offline_aov!: MetricValue;

    @ValidateNested()
    @Type(() => MetricDto)
    offline_revenue_share!: MetricValue;
}

export class TiktokConversionDataDto {
    @IsEnum(TiktokStandartEventEnum)
    event!: TiktokStandartEventEnum;

    @IsNumber()
    event_time!: number;

    @IsOptional()
    @IsString()
    event_id?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => TiktokConversionUserDto)
    user?: TiktokConversionUserDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => TiktokConversionPropertiesDto)
    properties?: TiktokConversionPropertiesDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => TiktokConversionPageDto)
    page?: TiktokConversionPageDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => TiktokConversionAppDto)
    app?: TiktokConversionAppDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => TiktokConversionAdDto)
    ad?: TiktokConversionAdDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => TiktokConversionLeadDto)
    lead?: TiktokConversionLeadDto;

    @IsOptional()
    @IsBoolean()
    limited_data_use?: boolean;
}

export class TiktokConversionDto {
    @IsEnum(TiktokEventSourceEnum)
    event_source!: TiktokEventSourceEnum;

    @IsString()
    event_source_id!: string;

    @IsArray()
    @ArrayMaxSize(1000)
    @ValidateNested({each: true})
    @Type(() => TiktokConversionDataDto)
    data!: TiktokConversionDataDto[];

    @IsOptional()
    @IsString()
    test_event_code?: string;
}
```


**File:** `libs/dto/src/setup-status/meta-pixel.dto.ts`

```typescript
export class MetaPixelDto {
    @ApiProperty({required: true})
    @IsString()
    id!: string;

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    name?: string;
}

export class MetaSelectPixelDto extends PickType(MetaPixelDto, ["id", "name"]) {}
```


**File:** `libs/dto/src/setup-status/meta-ad-account.dto.ts`

```typescript
export class MetaAdAccountDto {
    @ApiProperty({required: true})
    @IsString()
    id!: string;

    @ApiProperty({required: false})
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({required: false})
    @IsOptional()
    @IsISO4217CurrencyCode()
    currency?: string;
}

export class MetaSelectAdAccountDto extends PickType(MetaAdAccountDto, ["id", "name"]) {}
```


**File:** `libs/dto/src/setup-status/meta-select-pages.dto.ts`

```typescript
class MetaPageSelectionDto {
    @ApiProperty({required: true})
    @IsString()
    id!: string;

    @ApiProperty({required: true})
    @IsString()
    name!: string;
}

export class MetaSelectPagesDto {
    @ApiProperty({
        required: true,
        type: () => [MetaPageSelectionDto],
        description: "Array of selected page IDs and names. Backend will determine which is primary based on location count.",
    })
    @IsArray()
    @ValidateNested({each: true})
    @ArrayMinSize(1)
    @Type(() => MetaPageSelectionDto)
    pages!: MetaPageSelectionDto[];
}
```


### Enums & Constants

**File:** `libs/constants/src/tiktok/campaign-objectives.ts`

```typescript
export enum TiktokCampaignObjectiveEnum {
    ALL = "ALL",
    REACH = "REACH",
    VIDEO_VIEWS = "VIDEO_VIEWS",
    TRAFFIC = "TRAFFIC",
    APP_INSTALL = "APP_INSTALL",
    LEAD_GENERATION = "LEAD_GENERATION",
    CONVERSIONS = "CONVERSIONS",
    APP_PROMOTION = "APP_PROMOTION",
    CATALOG_SALES = "CATALOG_SALES",
    PRODUCT_SALES = "PRODUCT_SALES",
    SHOP_PURCHASES = "SHOP_PURCHASES",
    ENGAGEMENT = "ENGAGEMENT",
}

export const TiktokCampaignObjectiveLabels = { /* labels mapping */ }
```


**File:** `libs/constants/src/tiktok/conversion.ts`

```typescript
export enum TiktokEventSourceEnum {
    web = "web",
    app = "app",
    offline = "offline",
    crm = "crm",
}

export enum TiktokAttStatusEnum {
    AUTHORIZED = "AUTHORIZED",
    DENIED = "DENIED",
    NOT_DETERMINED = "NOT_DETERMINED",
    RESTRICTED = "RESTRICTED",
    NOT_APPLICABLE = "NOT_APPLICABLE",
}

export enum TiktokContentTypeEnum {
    product = "product",
    product_group = "product_group",
}

export enum TiktokWebStandartEventEnum {
    AddPaymentInfo = "AddPaymentInfo",
    AddToCart = "AddToCart",
    AddToWishlist = "AddToWishlist",
    CompleteRegistration = "CompleteRegistration",
    Contact = "Contact",
    CustomizeProduct = "CustomizeProduct",
    Download = "Download",
    FindLocation = "FindLocation",
    InitiateCheckout = "InitiateCheckout",
    Lead = "Lead",
    Purchase = "Purchase",
    Schedule = "Schedule",
    Search = "Search",
    Subscribe = "Subscribe",
    ViewContent = "ViewContent",
}

export enum TiktokOfflineStandartEventEnum {
    /* Same as Web */
}

export enum TiktokAppStandartEventEnum {
    AchieveLevel = "AchieveLevel",
    AddPaymentInfo = "AddPaymentInfo",
    AddToCart = "AddToCart",
    /* ... many more */
    ViewContent = "ViewContent",
}

export const TiktokStandartEventEnum = {
    ...TiktokOfflineStandartEventEnum,
    ...TiktokWebStandartEventEnum,
    ...TiktokAppStandartEventEnum,
};
export type TiktokStandartEventEnum = 
    | TiktokOfflineStandartEventEnum
    | TiktokWebStandartEventEnum
    | TiktokAppStandartEventEnum;
```


**File:** `libs/constants/src/google-ads-api/offline-user-data-job/offline-user-data-job-match-rate-range.ts`

```typescript
export enum OfflineUserDataJobMatchRateRangeEnum {
    UNSPECIFIED = "UNSPECIFIED",
    UNKNOWN = "UNKNOWN",
    MATCH_RANGE_LESS_THAN_20 = "MATCH_RANGE_LESS_THAN_20",
    MATCH_RANGE_20_TO_30 = "MATCH_RANGE_20_TO_30",
    MATCH_RANGE_31_TO_40 = "MATCH_RANGE_31_TO_40",
    MATCH_RANGE_41_TO_50 = "MATCH_RANGE_41_TO_50",
    MATCH_RANGE_51_TO_60 = "MATCH_RANGE_51_TO_60",
    MATCH_RANGE_61_TO_70 = "MATCH_RANGE_61_TO_70",
    MATCH_RANGE_71_TO_80 = "MATCH_RANGE_71_TO_80",
    MATCH_RANGE_81_TO_90 = "MATCH_RANGE_81_TO_90",
    MATCH_RANGE_91_TO_100 = "MATCH_RANGE_91_TO_100",
}
```


**File:** `libs/constants/src/google-ads-api/offline-user-data-job/offline-user-data-job-status.ts`

```typescript
export enum OfflineUserDataJobStatusEnum {
    UNSPECIFIED = "UNSPECIFIED",
    UNKNOWN = "UNKNOWN",
    PENDING = "PENDING",
    RUNNING = "RUNNING",
    PARTIAL_SUCCESS = "PARTIAL_SUCCESS",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
}
```


**File:** `libs/constants/src/google-ads-api/offline-user-data-job/offline-user-data-job-type.ts`

```typescript
export enum OfflineUserDataJobTypeEnum {
    UNSPECIFIED = "UNSPECIFIED",
    UNKNOWN = "UNKNOWN",
    STORE_SALES_UPLOAD_FIRST_PARTY = "STORE_SALES_UPLOAD_FIRST_PARTY",
    STORE_SALES_UPLOAD_THIRD_PARTY = "STORE_SALES_UPLOAD_THIRD_PARTY",
    CUSTOMER_MATCH_USER_LIST = "CUSTOMER_MATCH_USER_LIST",
    CUSTOMER_MATCH_WITH_ATTRIBUTES = "CUSTOMER_MATCH_WITH_ATTRIBUTES",
}

export enum OfflineUserDataJobLogType {
    CREATE_JOB = "CREATE_JOB",
    PUSH_DATA = "PUSH_DATA",
    RUN_JOB = "RUN_JOB",
    CHECK_STATUS = "CHECK_STATUS",
}

export enum OfflineUserDataJobPlatform {
    META = "META",
    GOOGLE = "GOOGLE",
    TIKTOK = "TIKTOK",
}
```


**File:** `libs/constants/src/google-ads-api/offline-user-data-job/offline-user-data-job-failure-reason.ts`

```typescript
export enum OfflineUserDataJobFailureReasonEnum {
    UNSPECIFIED = "UNSPECIFIED",
    UNKNOWN = "UNKNOWN",
    INSUFFICIENT_MATCHED_TRANSACTIONS = "INSUFFICIENT_MATCHED_TRANSACTIONS",
    INSUFFICIENT_TRANSACTIONS = "INSUFFICIENT_TRANSACTIONS",
    HIGH_AVERAGE_TRANSACTION_VALUE = "HIGH_AVERAGE_TRANSACTION_VALUE",
    LOW_AVERAGE_TRANSACTION_VALUE = "LOW_AVERAGE_TRANSACTION_VALUE",
    NEWLY_OBSERVED_CURRENCY_CODE = "NEWLY_OBSERVED_CURRENCY_CODE",
}
```


**File:** `libs/constants/src/google-ads-api/consent-status.ts`

```typescript
export enum ConsentStatusEnum {
    UNSPECIFIED = "UNSPECIFIED",
    UNKNOWN = "UNKNOWN",
    GRANTED = "GRANTED",
    DENIED = "DENIED",
}
```


**File:** `libs/constants/src/google-ads-api/user-identifier-source.ts`

```typescript
export enum UserIdentifierSourceEnum {
    UNSPECIFIED = "UNSPECIFIED",
    UNKNOWN = "UNKNOWN",
    FIRST_PARTY = "FIRST_PARTY",
    THIRD_PARTY = "THIRD_PARTY",
}
```


**File:** `libs/constants/src/google-ads-api/summary-row-setting.ts`

```typescript
export enum SummaryRowSettingEnum {
    UNSPECIFIED = "UNSPECIFIED",
    UNKNOWN = "UNKNOWN",
    NO_SUMMARY_ROW = "NO_SUMMARY_ROW",
    SUMMARY_ROW_WITH_RESULTS = "SUMMARY_ROW_WITH_RESULTS",
    SUMMARY_ROW_ONLY = "UNSUMMARY_ROW_ONLYSPECIFIED",
}
```


**File:** `libs/constants/src/provider.ts`

```typescript
export enum Provider {
    Google = "google",
    Meta = "meta",
    TikTok = "tiktok",
    Apple = "apple",
    Yandex = "yandex",
}

export const ProviderList = Object.values(Provider) as Provider[];
```


**File:** `libs/constants/src/insights/ads-insight.ts`

```typescript
export const ALL_CAMPAIGNS_ID = "all";

export enum InsightLevel {
    ACCOUNT = "account",
    CAMPAIGN = "campaign",
}
```


**File:** `libs/constants/src/post-campaign.ts`

```typescript
export enum PostCampaignTargetingType {
    STORE_SET = "STORE_SET",
    SELECTED = "SELECTED",
    ALL = "ALL",
}

export enum PostCampaignStatus {
    DRAFT = "DRAFT",
    SENT = "SENT",
    LIVE = "LIVE",
    SCHEDULED = "SCHEDULED",
    ENDED = "ENDED",
    PARTIAL_FAIL = "PARTIAL_FAIL",
    FAILED = "FAILED",
    WARNING = "WARNING",
}

export enum PostActionType {
    DRAFT = "draft",
    PUBLISH = "publish",
}
```


**File:** `libs/interfaces/src/post-campaign-form.ts`

```typescript
export interface PostCampaignFormState {
    common: {
        locale: string;
        title: string;
        description: string;
        media: string | null;
        startDate: Date | null;
        endDate: Date | null;
    };
    google: {
        enabled: boolean;
        type: LocalPostTopicType;
        actionType: LocalPostActionType;
        actionUrl: string;
        offer: {
            couponCode: string;
            redeemUrl: string;
            terms: string;
        };
    };
    apple: {
        enabled: boolean;
        actionType: AppleShowcaseActionType;
        appIds: string[];
    };
    targeting: PostCampaignTargeting;
}

export interface PostCampaignTargeting {
    type: PostCampaignTargetingType;
    storeSetId?: string;
    locationIds?: string[];
}

export enum PostDeliveryStatus {
    SUCCESS = "success",
    FAILED = "failed",
    WARNING = "warning",
}

export type PostDeliveryPlatform = Provider.Google | Provider.Apple;

export interface PostDeliveryEntry {
    platform: PostDeliveryPlatform;
    status: PostDeliveryStatus;
    locationId: string;
    reason?: string;
    postId?: string;
}
```


### Interfaces & Types

**File:** `libs/interfaces/src/conversion/conversion.interfaces.ts`

```typescript
export interface MetricValue {
    value: number;
    change: number;
    past_value: number;
}

export interface NormalizedAdMetricsResponse {
    accountNames: string[];
    cost: MetricValue;
    clicks: MetricValue;
    onlineOrders: MetricValue;
    onlineRevenue: MetricValue;
    onlineROI: MetricValue;
    onlineAOV: MetricValue;
    storeVisit: MetricValue;
    offlineOrders: MetricValue;
    offlineRevenue: MetricValue;
    offlineROAS: MetricValue;
    offlineAOV: MetricValue;
    offlineRevenueShare: MetricValue;
}

export interface NormalizedCampaignResponse {
    resourceName: string;
    name: string;
    labels: string[];
    conversionActions: string[];
    provider: string;
}
```


**File:** `libs/atomic-components/src/types/conversions/index.ts`

```typescript
export type GetGoogleAdsMetricsPayload = {
    brandId: string;
    payload: MetricsFetchQueryDto;
    enabled?: boolean;
};

export interface ProviderMetricsPayload {
    brandId: string;
    provider: string;
    payload: MetricsFetchQueryDto;
    enabled?: boolean;
}

export interface ProviderCampaignsPayload {
    brandId: string;
    provider: string;
    campaignTypes: string[];
    enabled?: boolean;
}
```


**File:** `libs/atomic-components/src/types/meta-conversions-api/index.ts`

```typescript
export type MetaConversionsApiSelectPixelPayload = {
    brandId: string;
    payload: MetaSelectPixelDto;
};

export type MetaConversionsApiSelectAdAccountPayload = {
    brandId: string;
    payload: MetaSelectAdAccountDto;
};
```


**File:** `libs/tiktok-business-api/src/class/tiktok-campaigns-params.ts`

```typescript
export class FilteringParams {
    campaign_ids?: string[];
    campaign_name?: string;
    campaign_system_origins?: string[];
    primary_status?: string;
    secondary_status?: string;
    objective_type?: string;
    buying_types?: string[];
    is_smart_performance_campaign?: boolean;
    split_test_enabled?: boolean;
    campaign_product_source?: string;
    optimization_goal?: string;
    campaign_type?: string;
    creation_filter_start_time?: string;
    creation_filter_end_time?: string;
}

export class TiktokCampaignParams {
    advertiser_id!: string;
    fields?: string[];
    exclude_field_types_in_response?: string[];
    filtering?: FilteringParams;
    page?: number;
    page_size?: number;
}
```


### Validation Schemas

_No definitions found in this category._

---

## Integrations & Platforms

### Database Models

**File:** `libs/database/src/mongoose/schemas/provider-auth/provider-auth.schema.ts`

```typescript
export class ProviderAuth extends TypegooseBase {
    @prop({ required: true, ref: "Provider" })
    provider!: Ref<Provider>;

    @prop({ required: false, ref: "Brand" })
    brand?: Ref<Brand>;

    @prop({ required: false, ref: "Location" })
    location?: Ref<Location>;

    @prop({ required: false, ref: "User" })
    user?: Ref<User>;

    @prop({ _id: false })
    google_merchant_center?: AuthGoogleMerchantCenterSchema | AuthGoogleMerchantCenterNewSchema;

    @prop({ _id: false })
    google_my_business?: AuthGoogleMyBusinessSchema;

    @prop({ _id: false })
    google_ads?: AuthGoogleAdsSchema;

    @prop({ _id: false })
    shopify?: ShopifyCredentialsSchema;

    @prop({ _id: false })
    meta_graph_api_credentials?: MetaGraphApiCredentialsSchema;

    @prop({ _id: false })
    meta_conversions?: MetaConversionsAuthSchema;

    @prop({ _id: false })
    meta_ad_account?: MetaAdAccountSchema;

    @prop({ _id: false })
    apple_business_connect?: AppleAuthSchema;

    @prop({ _id: false })
    tiktok_business_api?: TiktokAuthSchema;

    @prop({ required: false, _id: false, type: TiktokEventsApiSchema })
    tiktok_events_api?: TiktokEventsApiSchema;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/auth.google.schema.ts`

```typescript
export class AuthGoogleSchema extends TypegooseWithoutId {
    @prop({ trim: true, required: true })
    email_address!: string;

    @prop({ _id: false, required: true })
    credentials!: AuthGoogleCredentialsSchema;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/auth-google-my-business.schema.ts`

```typescript
export class AuthGoogleMyBusinessSchema extends AuthGoogleSchema {
    @prop({ _id: false, required: true })
    declare credentials: AuthGoogleMyBusinessCredentialsSchema;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/auth-google-merchant-center.schema.ts`

```typescript
export class AuthGoogleMerchantCenterSchema extends TypegooseWithoutId {
    @prop()
    merchant_id!: string;

    @prop({ _id: false })
    credentials!: AuthGoogleMerchantCenterCredentialsSchema;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/auth-google-ads.schema.ts`

```typescript
export class AuthGoogleAdsSchema extends AuthGoogleSchema {
    @prop({ _id: false, required: true })
    declare credentials: AuthGoogleAdsCredentialsSchema;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/apple-auth.schema.ts`

```typescript
export class AppleAuthSchema {
    @prop({ required: true })
    access_token!: string;

    @prop({ required: true })
    refresh_token!: string;

    @prop({ required: true })
    company_id!: string;

    @prop({ required: true })
    name!: string;

    @prop({ required: true })
    surname!: string;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/meta-graph-api-credentials.schema.ts`

```typescript
export class MetaGraphApiCredentialsSchema extends TypegooseWithoutId {
    @prop({ required: true })
    user_id!: string;

    @prop({ required: false })
    display_name?: string;

    @prop({ required: false })
    email?: string;

    @prop({ required: true, _id: false, type: MetaGraphApiUserAccessTokenSchema })
    user_access_token!: MetaGraphApiUserAccessTokenSchema;

    @prop({ required: false, _id: false, type: MetaGraphApiPageAccessTokenSchema, default: [] }, PropType.ARRAY)
    permitted_page_access_tokens?: MetaGraphApiPageAccessTokenSchema[];

    @prop({ required: false, _id: false, type: MetaGraphApiPageAccessTokenSchema })
    page_access_token?: MetaGraphApiUserAccessTokenSchema;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/meta-graph-api-user-token.schema.ts`

```typescript
export class MetaGraphApiUserAccessTokenSchema extends TypegooseWithoutId {
    @prop({ required: true })
    access_token!: string;

    @prop()
    expires_in?: number;

    @prop()
    data_access_expires_at?: Date;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/meta-graph-api-page-token.schema.ts`

```typescript
export class MetaGraphApiPageAccessTokenSchema extends TypegooseWithoutId {
    @prop()
    access_token!: string;

    @prop()
    name!: string;

    @prop()
    id!: string;

    @prop()
    permissions!: string[];
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/meta-conversion.schema.ts`

```typescript
export class MetaConversionsAuthSchema extends TypegooseWithoutId {
    @prop({ required: true })
    access_token!: string;

    @prop({ required: true })
    pixel_id!: string;

    @prop({ required: false })
    pixel_name?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/meta-ad-account.schema.ts`

```typescript
export class MetaAdAccountSchema extends TypegooseWithoutId {
    @prop({ required: true })
    access_token!: string;

    @prop({ required: true })
    account_id!: string;

    @prop({ required: false })
    name?: string;

    @prop({ required: false })
    currency?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/shopify-credentials.schema.ts`

```typescript
export class ShopifyCredentialsSchema extends TypegooseWithoutId {
    @prop({ required: true })
    shop!: string;

    @prop({ required: true })
    accessToken!: string;

    @prop({ required: true })
    email!: string;

    @prop({ required: true })
    scope!: string;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/tiktok-auth.schema.ts`

```typescript
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class TiktokAuthSchema {
    @prop({ required: true })
    advertiser_id!: string[];

    @prop({ required: true })
    access_token!: string;

    @prop({ required: true })
    email!: string;

    @prop({ required: true })
    tiktok_core_user_id!: string;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/credentials/auth-google-credentials.schema.ts`

```typescript
@modelOptions({ schemaOptions: { strict: false } })
export class AuthGoogleCredentialsSchema extends TypegooseWithoutId {
    @prop({ enum: SharedAuthTypeEnum })
    __type!: SharedAuthTypeEnum;

    @prop()
    scope!: string[];

    @prop({ trim: true })
    client_email?: string;

    @prop({ required: true })
    client_id!: string;

    @prop({ required: true })
    refresh_token!: string;

    @prop({ required: true })
    access_token!: string;

    @prop({ required: true })
    access_token_expires_at!: Date;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/credentials/auth-google-my-business-credentials.schema.ts`

```typescript
@modelOptions({ schemaOptions: { strict: false } })
export class AuthGoogleMyBusinessCredentialsSchema extends AuthGoogleCredentialsSchema {
    @prop({ enum: SharedAuthTypeEnum })
    declare __type: SharedAuthTypeEnum.GoogleMyBusiness;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/credentials/auth-google-ads-credentials.schema.ts`

```typescript
@modelOptions({ schemaOptions: { strict: false } })
export class AuthGoogleAdsCredentialsSchema extends AuthGoogleCredentialsSchema {
    @prop({ enum: SharedAuthTypeEnum })
    declare __type: SharedAuthTypeEnum.GoogleAds;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/credentials/auth-google-merchant-center-credentials.schema.ts`

```typescript
@modelOptions({ schemaOptions: { strict: false } })
export class AuthGoogleMerchantCenterCredentialsSchema extends TypegooseWithoutId {
    @prop({ enum: SharedAuthTypeEnum })
    __type!: SharedAuthTypeEnum.GoogleMerchantCenter;

    @prop()
    type?: string;

    @prop()
    client_email?: string;

    @prop()
    private_key?: string;

    @prop()
    private_key_id?: string;

    @prop()
    project_id?: string;

    @prop()
    client_id?: string;

    @prop()
    refresh_token?: string;

    @prop()
    quota_project_id?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/setup-status/brand-setup-status.schema.ts`

```typescript
export class BrandSetupStatus extends TypegooseBase {
    @prop({ required: true, unique: true, ref: "Brand" })
    brand!: Ref<Brand>;

    @prop({ required: false, type: BrandGoogleSetupStatus, _id: false }, PropType.NONE)
    google_setup_status?: BrandGoogleSetupStatus;

    @prop({ required: false, type: PartnerSetup, _id: false }, PropType.NONE)
    togg_setup_status?: PartnerSetup;

    @prop({ required: false, type: MetaSetup, _id: false }, PropType.NONE)
    meta_setup_status?: MetaSetup;

    @prop({ required: false, type: AppleSetup, _id: false }, PropType.NONE)
    apple_setup_status?: AppleSetup;

    @prop({ required: false, type: TiktokSetup, _id: false }, PropType.NONE)
    tiktok_setup_status?: TiktokSetup;

    @prop({ required: false, type: YandexSetup, _id: false }, PropType.NONE)
    yandex_setup_status?: YandexSetup;

    @prop({ required: false, enum: SetupStatus, default: SetupStatus.PENDING })
    create_team?: SetupStatus;

    @prop({ required: false, enum: SetupStatus, default: SetupStatus.PENDING })
    brand_details_filled?: SetupStatus;

    @prop({ required: false, enum: SetupStatus, default: SetupStatus.PENDING })
    location_excel_import_step?: SetupStatus;

    @prop({ default: false })
    complete_mail_sent!: boolean;

    @prop({ default: false })
    uncomplete_mail_sent!: boolean;

    @prop({ required: false, enum: AssistantTone, default: AssistantTone.PROFESSIONAL })
    ai_assistant_tone?: AssistantTone;

    @prop({ required: false, type: String, maxlength: 10000 })
    ai_brand_guidelines?: string;

    @prop({ required: false, enum: SetupStatus, default: SetupStatus.PENDING })
    ai_assistant_setup?: SetupStatus;

    @prop({ required: false, default: false })
    ai_assistant_enabled?: boolean;
}
```


**File:** `libs/database/src/mongoose/schemas/setup-status/brand-google-setup-status.schema.ts`

```typescript
export class BrandGoogleSetupStatus extends TypegooseWithoutId {
    @prop({ required: false, _id: false, type: BrandGbpSetup })
    gbp_setup?: BrandGbpSetup;

    @prop({ required: false, type: GoogleBusinessProfileDestination, _id: false }, PropType.NONE)
    primary_destination?: GoogleBusinessProfileDestination;

    @prop({ required: false, type: GoogleBusinessProfileDestination, _id: false }, PropType.ARRAY)
    additional_destinations?: GoogleBusinessProfileDestination[];

    @prop({ required: false, _id: false, type: BrandGmcSetup })
    gmc_setup?: BrandGmcSetup;

    @prop({ required: false, _id: false, type: BrandGoogleAdsSetup })
    google_ads_setup?: BrandGoogleAdsSetup;

    @prop({ required: false, default: false })
    is_review_enabled?: boolean;

    @prop({ required: false, default: false })
    is_gmc_enabled?: boolean;

    @prop({ required: false, default: false })
    is_gbp_enabled?: boolean;

    @prop({ required: false, default: false })
    is_google_ads_enabled?: boolean;

    @prop({ required: false, default: false })
    is_offline_sales_enabled?: boolean;

    @prop({ required: false, default: false })
    is_pubsub_reviews_enabled?: boolean;

    @prop({ required: false, default: false })
    is_pubsub_google_updates_enabled?: boolean;

    @prop({ required: false, enum: SetupStatus, default: SetupStatus.PENDING })
    location_import_status?: SetupStatus;

    @prop({ required: false, default: 0 })
    location_imported_count?: number;

    @prop({ required: false, enum: SetupStatus, default: SetupStatus.PENDING })
    product_import_status?: SetupStatus;

    @prop({ required: false, enum: SetupStatus, default: SetupStatus.PENDING })
    review_import_status?: SetupStatus;

    @prop({ required: false, enum: SetupStatus, default: SetupStatus.PENDING })
    google_ads_status?: SetupStatus;

    @prop({ required: false, default: false })
    cloud_pubsub_subscription_name?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/setup-status/google-platform-setups.schema.ts`

```typescript
class GooglePlatformSetup {
    @prop({ required: true })
    connectedEmail!: string;

    @prop({ required: false })
    accountId?: string;

    @prop({ required: false })
    accountName?: string;
}

export class BrandGbpSetup extends GooglePlatformSetup {
    @prop({ required: false })
    locationCount?: number;
}

export class GoogleBusinessProfileDestination {
    @prop({ required: true })
    accountId!: string;

    @prop({ required: false })
    accountName?: string;

    @prop({ required: true })
    connectedEmail!: string;

    @prop({ required: false })
    locationCount?: number;

    @prop({ required: false, default: false })
    isEnabled?: boolean;
}

export class BrandGmcSetup extends GooglePlatformSetup {
    @prop({ required: false })
    productCount?: number;

    @prop({ required: false })
    selectedDataSourceName?: string;

    @prop({ required: false })
    selectedPrimaryDataSourceName?: string;

    @prop({ required: false })
    selectedLocalInventoryDataSourceName?: string;

    @prop({ required: false })
    selectedSupplementalDataSourceName?: string;

    @prop({ required: false, default: false })
    gmc_data_source_updated?: boolean;

    @prop({ required: false })
    plannedFetchUriLia?: string;

    @prop({ required: false })
    plannedFetchUriSupplemental?: string;

    @prop({ required: false, type: mongoose.Schema.Types.Mixed })
    plannedScheduleLia?: any;

    @prop({ required: false, type: mongoose.Schema.Types.Mixed })
    plannedScheduleSupplemental?: any;
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class BrandGoogleAdsSetup extends GooglePlatformSetup {
    @prop({ required: false })
    online_metric_conversion_action_ids?: string[];

    @prop({ required: false })
    offline_metric_conversion_action_id?: string;

    @prop({ required: false })
    metric_search_customer_ids?: string[];
}
```


**File:** `libs/database/src/mongoose/schemas/setup-status/apple-setup.schema.ts`

```typescript
export class AppleSetup {
    @prop({ required: false, default: false })
    is_business_connect_enabled?: boolean;

    @prop({ required: false, type: AppleBusinessConnectDestination, _id: false }, PropType.NONE)
    primary_destination?: AppleBusinessConnectDestination;

    @prop({ required: false, type: AppleBusinessConnectDestination, _id: false }, PropType.ARRAY)
    additional_destinations?: AppleBusinessConnectDestination[];

    @prop({ required: false, default: false })
    does_store_codes_differ?: boolean;

    @prop({ required: false, enum: SetupStatus, default: SetupStatus.PENDING })
    location_import_status?: SetupStatus;

    @prop({ required: false, enum: SetupStatus, default: SetupStatus.PENDING })
    location_code_match_status?: SetupStatus;

    @prop({ required: false, _id: false, type: AppleBusinessConnectSetup })
    business_connect_setup?: AppleBusinessConnectSetup;

    @prop({ required: false, _id: false, type: LocationMatchingProgress })
    location_matching_progress?: LocationMatchingProgress;
}
```


**File:** `libs/database/src/mongoose/schemas/setup-status/apple-business-connect-setup.ts`

```typescript
export class AppleBusinessConnectSetup {
    @prop({ required: true })
    company_id!: string;

    @prop({ required: true })
    brand_id!: string;

    @prop({ required: false })
    brand_name?: string;

    @prop({ required: false })
    total_count?: number;

    @prop({ required: false })
    imported_count?: number;
}

export class AppleBusinessConnectDestination {
    @prop({ required: true })
    brandId!: string;

    @prop({ required: false })
    brandDisplayName?: string;

    @prop({ required: true })
    companyId!: string;

    @prop({ required: false })
    locationCount?: number;

    @prop({ required: false })
    locationImportedCount?: number;

    @prop({ required: false, default: false })
    isEnabled?: boolean;
}
```


**File:** `libs/database/src/mongoose/schemas/setup-status/meta-setup.schema.ts`

```typescript
export class MetaSetup {
    @prop({ required: false, default: false })
    is_location_enabled?: boolean;

    @prop({ required: false, type: MetaPageDestination, _id: false }, PropType.NONE)
    primary_destination?: MetaPageDestination;

    @prop({ required: false, type: MetaPageDestination, _id: false }, PropType.ARRAY)
    additional_destinations?: MetaPageDestination[];

    @prop({ required: false, default: false })
    is_catalog_enabled?: boolean;

    @prop({ required: false, default: false })
    does_store_codes_differ?: boolean;

    @prop({ required: false, default: false })
    is_conversions_enabled?: boolean;

    @prop({ required: false, default: false })
    is_ad_account_enabled?: boolean;

    @prop({ required: false, enum: SetupStatus, default: SetupStatus.PENDING })
    location_import_status?: SetupStatus;

    @prop({ required: false, enum: SetupStatus, default: SetupStatus.PENDING })
    location_code_match_status?: SetupStatus;

    @prop({ required: false, _id: false, type: MetaPagesSetup })
    pages_setup?: MetaPagesSetup;

    @prop({ required: false, _id: false, type: MetaConversionsSetup })
    conversions_setup?: MetaConversionsSetup;

    @prop({ required: false, _id: false, type: MetaAdAccountSetup })
    ad_account_setup?: MetaAdAccountSetup;

    @prop({ required: false, _id: false, type: LocationMatchingProgress })
    location_matching_progress?: LocationMatchingProgress;
}
```


**File:** `libs/database/src/mongoose/schemas/setup-status/meta-platform-setups.schema.ts`

```typescript
export class MetaPagesSetup {
    @prop({ required: true })
    page_id!: string;

    @prop({ required: false })
    page_name?: string;

    @prop({ required: false })
    location_count?: number;

    @prop({ required: false })
    location_imported_count?: number;
}

export class MetaPageDestination {
    @prop({ required: true })
    pageId!: string;

    @prop({ required: false })
    pageName?: string;

    @prop({ required: false })
    locationCount?: number;

    @prop({ required: false })
    locationImportedCount?: number;

    @prop({ required: false, default: false })
    isEnabled?: boolean;
}

export class MetaConversionsSetup {
    @prop({ required: true })
    pixel_id!: string;

    @prop({ required: false })
    pixel_name?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/setup-status/tiktok-setup.schema.ts`

```typescript
export class TiktokSetup {
    @prop({ default: false })
    is_business_enabled!: boolean;

    @prop({ required: false, _id: false, type: TiktokBusinessSetup })
    business_setup?: TiktokBusinessSetup;

    @prop({ default: false })
    is_events_enabled!: boolean;

    @prop({ required: false, _id: false, type: TiktokEventsSetup })
    events_setup?: TiktokEventsSetup;
}
```


**File:** `libs/database/src/mongoose/schemas/meta/meta-location.schema.ts`

```typescript
export class MetaLocationCategory {
    @prop({ required: true })
    id!: string;

    @prop({ required: true })
    name!: string;
}

export class MetaLocationAddress implements IMetaLocationAddress {
    @prop({ required: false })
    latitude?: number;

    @prop({ required: false })
    longitude?: number;

    @prop({ required: false })
    country?: string;

    @prop({ required: false })
    countryCode?: string;

    @prop({ required: false })
    city?: string;

    @prop({ required: false })
    street?: string;

    @prop({ required: false })
    zip?: string;

    @prop({ required: false })
    single_line_address?: string;
}

@index({ location_page_id: 1, main_page_id: 1 })
@index({ brand: 1, location_page_id: 1, main_page_id: 1 })
export class MetaLocation extends TypegooseBase {
    @prop({ required: true, ref: "Brand" })
    brand!: Ref<Brand>;

    @prop({ required: true })
    main_page_id!: string;

    @prop({ required: true })
    store_number!: number;

    @prop({ required: false })
    old_store_number?: number;

    @prop({ required: false })
    location_page_id?: string;

    @prop({ required: false, _id: false })
    category_list?: MetaLocationCategory[];

    @prop({ required: false })
    store_location_descriptor?: string;

    @prop({ required: false })
    is_deleted?: boolean;

    @prop({ required: false })
    store_code?: string;

    @prop({ required: false, _id: false })
    address?: MetaLocationAddress;

    @prop({
        required: false,
        ref: () => "Location",
        foreignField: "meta_location",
        localField: "_id",
        justOne: true,
    })
    public location?: Ref<Location>;
}
```


**File:** `libs/database/src/mongoose/schemas/apple/apple-location.schema.ts`

```typescript
@index({ brand: 1 })
@index({ brand: 1, appleId: 1 })
@index({ "locationDetails.storeCode": 1 })
export class AppleLocation extends TypegooseBase {
    @prop({ required: true, unique: true })
    appleId!: string;

    @prop({ required: true })
    appleCompanyId!: string;

    @prop({ required: true })
    appleBrandId!: string;

    @prop({ required: true, ref: "Brand" })
    brand!: Ref<Brand>;

    @prop({ required: true })
    etag!: string;

    @prop({ required: true, enum: LocationState })
    state!: LocationState;

    @prop({ required: true, _id: false, type: AppleTimestamp })
    appleTimestamps!: AppleTimestamp;

    @prop({ required: false, _id: false, type: AppleLocationDetails })
    oldLocationDetails?: AppleLocationDetails;

    @prop({ required: true, _id: false, type: AppleLocationDetails })
    locationDetails!: AppleLocationDetails;

    @prop({ required: false, default: false })
    isMarkedDeleted?: boolean;

    @prop({ required: false })
    pushedForLaunchDate?: Date;

    @prop({ required: false, default: false })
    pushedForLaunch?: boolean;

    @prop({ required: false, default: false })
    bannedForPushed?: boolean;

    @prop({
        required: false,
        ref: () => "Location",
        foreignField: "apple_location",
        localField: "_id",
        justOne: true,
    })
    public location?: Ref<Location>;
}
```


**File:** `libs/database/src/mongoose/schemas/import/location-conflict.schema.ts`

```typescript
export class ConflictLocationSnapshot {
    @prop()
    locationName?: string;

    @prop()
    locationId?: string;

    @prop()
    storeCode?: string;

    @prop()
    displayName?: string;

    @prop()
    phone?: string;

    @prop()
    website?: string;

    @prop()
    address?: string;
}

export class ConflictSnapshots {
    @prop({ _id: false, type: () => ConflictLocationSnapshot })
    google?: ConflictLocationSnapshot;

    @prop({ _id: false, type: () => ConflictLocationSnapshot })
    duplicateGoogle?: ConflictLocationSnapshot;

    @prop({ _id: false, type: () => ConflictLocationSnapshot })
    venuex?: ConflictLocationSnapshot;
}

@index({ brand: 1, status: 1 })
@index({ brand: 1, conflictType: 1, status: 1 })
@index({ brand: 1, gbpAccountId: 1, status: 1 })
@index(
    { brand: 1, venuexLocation: 1, conflictType: 1, status: 1 },
    { unique: true, partialFilterExpression: { venuexLocation: { $type: "objectId" } } }
)
@index(
    { brand: 1, "snapshots.google.locationId": 1, conflictType: 1, status: 1 },
    { unique: true, partialFilterExpression: { "snapshots.google.locationId": { $type: "string" } } }
)
export class LocationConflict extends TypegooseBase {
    @prop({ required: true, enum: LocationConflictTypeEnum })
    conflictType!: LocationConflictTypeEnum;

    @prop({ required: true, enum: LocationConflictStatusEnum, default: LocationConflictStatusEnum.PENDING })
    status!: LocationConflictStatusEnum;

    @prop({ required: false, enum: LocationConflictActionEnum })
    resolvedAction?: LocationConflictActionEnum;

    @prop({ required: true, ref: "Brand" })
    brand!: Ref<Brand>;

    @prop({ required: true })
    gbpAccountId!: string;

    @prop({ required: false, ref: "Location" })
    venuexLocation?: Ref<Location>;

    @prop({ _id: false, type: () => ConflictSnapshots })
    snapshots?: ConflictSnapshots;

    @prop({ required: true, default: "google" })
    platform!: string;

    @prop({ required: false })
    cooldownUntil?: Date;
}
```


**File:** `libs/database/src/mongoose/schemas/data-source/data-source-sync-status.schema.ts`

```typescript
@index({ brand: 1, platform: 1, dataSourceType: 1 }, { unique: true })
export class DataSourceSyncStatus extends TypegooseBase {
    @prop({ required: true, ref: "Brand" })
    brand!: Ref<Brand>;

    @prop({ required: true, enum: ProviderEnum })
    platform!: ProviderEnum;

    @prop({ required: true, enum: DataSourceType })
    dataSourceType!: DataSourceType;

    @prop({ required: false, type: String })
    dataSourceId?: string;

    @prop({ required: true, enum: DataSourceSyncStatusType, default: DataSourceSyncStatusType.UNKNOWN })
    status!: DataSourceSyncStatusType;

    @prop({ required: false, type: Number })
    issueCount?: number;

    @prop({ required: false, type: Number })
    itemsTotal?: number;

    @prop({ required: false, type: Number })
    itemsProcessed?: number;

    @prop({ required: false, type: Date })
    lastCheckAt?: Date;

    @prop({ required: false, type: Object }, PropType.NONE)
    latestUpload?: any;
}
```


### DTOs

**File:** `libs/dto/src/platform-setup/google-destination.dto.ts`

```typescript
export class GoogleBusinessProfileDestinationDto {
    @ApiProperty({ description: "Google Business Profile account ID", example: "123456789" })
    @IsString()
    accountId!: string;

    @ApiProperty({ description: "Google Business Profile account name", required: false, example: "Brand XYZ" })
    @IsOptional()
    @IsString()
    accountName?: string;

    @ApiProperty({ description: "Connected email address", example: "user@example.com" })
    @IsString()
    connectedEmail!: string;

    @ApiProperty({ description: "Whether this destination is enabled", required: false, default: false })
    @IsOptional()
    @IsBoolean()
    isEnabled?: boolean;
}
```


**File:** `libs/dto/src/platform-setup/apple-destination.dto.ts`

```typescript
export class AppleBusinessConnectDestinationDto {
    @ApiProperty({ description: "Apple Business Connect brand ID", example: "abc-brand-id-123" })
    @IsString()
    brandId!: string;

    @ApiProperty({ description: "Apple Business Connect brand display name", required: false, example: "Brand XYZ" })
    @IsOptional()
    @IsString()
    brandDisplayName?: string;

    @ApiProperty({ description: "Apple Business Connect company ID", example: "abc-company-id-456" })
    @IsString()
    companyId!: string;

    @ApiProperty({ description: "Whether this destination is enabled", required: false, default: true })
    @IsOptional()
    @IsBoolean()
    isEnabled?: boolean;
}
```


**File:** `libs/dto/src/platform-setup/meta-destination.dto.ts`

```typescript
export class MetaPageDestinationDto {
    @ApiProperty({ description: "Meta/Facebook Page ID", example: "123456789012345" })
    @IsString()
    pageId!: string;

    @ApiProperty({ description: "Meta/Facebook Page name", required: false, example: "Brand XYZ Page" })
    @IsOptional()
    @IsString()
    pageName?: string;

    @ApiProperty({ description: "Whether this destination is enabled", required: false, default: false })
    @IsOptional()
    @IsBoolean()
    isEnabled?: boolean;
}
```


**File:** `libs/dto/src/setup-status/google-ads-setup.dto.ts`

```typescript
export class GoogleAdsSetupDto {
    @IsString()
    root_account_id!: string;

    @IsString()
    root_account_name!: string;

    @IsString({ each: true })
    metric_search_customer_ids!: string[];

    @IsString()
    offline_metric_conversion_action_id!: string;

    @IsString({ each: true })
    online_metric_conversion_action_ids!: string[];
}
```


**File:** `libs/dto/src/setup-status/meta-ad-account.dto.ts`

```typescript
export class MetaAdAccountDto {
    @ApiProperty({ required: true })
    @IsString()
    id!: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsISO4217CurrencyCode()
    currency?: string;
}

export class MetaSelectAdAccountDto extends PickType(MetaAdAccountDto, ["id", "name"]) {}
```


**File:** `libs/dto/src/setup-status/apple-business-connect-brand.dto.ts`

```typescript
export class AppleBusinessConnectSelectBrandDto {
    @ApiProperty({ required: true })
    @IsString()
    appleId!: string;

    @ApiProperty({ required: true })
    @IsString()
    displayName!: string;
}

export class AppleSelectMultipleBrandsDto {
    @ApiProperty({
        required: true,
        type: () => [AppleBusinessConnectSelectBrandDto],
        description: "Array of selected brand IDs and names. Backend determines primary based on location count.",
    })
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => AppleBusinessConnectSelectBrandDto)
    brands!: AppleBusinessConnectSelectBrandDto[];
}
```


**File:** `libs/dto/src/setup-status/meta-page.dto.ts`

```typescript
class MetaPageCategoryDto {
    @ApiProperty({ required: true })
    @IsString()
    id!: string;

    @ApiProperty({ required: true })
    @IsString()
    name!: string;
}

export class MetaPageDto {
    @ApiProperty({ required: true })
    @IsString()
    id!: string;

    @ApiProperty({ required: true })
    @IsString()
    name!: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    global_brand_page_name?: string;

    @ApiProperty({ required: true, type: () => [MetaPageCategoryDto] })
    @IsArray()
    @ValidateNested()
    @IsOptional()
    @Type(() => MetaPageCategoryDto)
    category_list?: MetaPageCategoryDto[];

    @ApiProperty({ required: true })
    @IsString()
    category!: string;

    @ApiProperty({ required: true })
    @IsString({ each: true })
    @IsOptional()
    @IsArray()
    tasks?: string[];

    @ApiProperty({ required: false, description: "Number of locations under this page from the Meta Graph API" })
    @IsOptional()
    @IsNumber()
    location_count?: number;
}

export class MetaPageResultDto extends MetaPageDto {
    @ApiProperty({ required: true })
    @IsString()
    access_token!: string;
}

export class MetaSelectPageDto extends OmitType(MetaPageDto, ["category", "category_list", "tasks"]) {}
```


**File:** `libs/dto/src/location/meta-location.dto.ts`

```typescript
export class MetaLocationDto {
    @IsMongoId()
    @IsString()
    _id!: string;

    @IsMongoId()
    @IsString()
    brand!: string;

    @IsString()
    main_page_id!: string;

    @IsNumber()
    store_number!: number;

    @IsNumber()
    @IsOptional()
    old_store_number?: number;

    @IsOptional()
    @IsString()
    location_page_id?: string;

    @IsMongoId({ each: true })
    @IsString({ each: true })
    @IsOptional()
    category_list?: string[];

    @IsOptional()
    @IsString()
    store_location_descriptor?: string;

    @IsOptional()
    @IsBoolean()
    is_deleted?: boolean;

    @IsString()
    @IsOptional()
    store_code?: string;

    @ValidateNested()
    @Type(() => IMetaLocationAddress)
    address?: IMetaLocationAddress;
}
```


**File:** `libs/dto/src/apple/apple-business-connect.dto.ts`

```typescript
export class AppleBusinessConnectDto {
    @IsString()
    company_id!: string;

    @IsString()
    name!: string;

    @IsString()
    surname!: string;

    @IsString()
    access_token!: string;

    @IsString()
    refresh_token!: string;
}

export class AppleBusinessConnectPartialDto extends PartialType(AppleBusinessConnectDto) {}

export class AppleBusinessConnectBrandsResponseDto {
    @Type(() => AppleBrandImportDto)
    @ValidateNested()
    @IsArray()
    available_brands!: AppleBrandImportDto[];
}

export class AppleBusinessConnectBrandFetchResponseDto {
    @IsArray()
    available_brands!: Schema$Brand[];

    @ApiPropertyOptional({
        description: "Map of brand IDs to their respective location counts",
        type: "object",
        additionalProperties: { type: "number" },
        example: { "brand-123": 45, "brand-456": 12 },
    })
    @IsOptional()
    @IsObject()
    location_counts?: Record<string, number>;
}
```


**File:** `libs/dto/src/import/location-conflict.dto.ts`

```typescript
export class ConflictLocationSnapshotDto {
    locationName?: string;
    locationId?: string;
    storeCode?: string;
    displayName?: string;
    phone?: string;
    website?: string;
    address?: string;
}

export class ConflictSnapshotsDto {
    google?: ConflictLocationSnapshotDto;
    duplicateGoogle?: ConflictLocationSnapshotDto;
    venuex?: ConflictLocationSnapshotDto;
}

export class LocationConflictDto {
    id!: string;
    conflictType!: LocationConflictTypeEnum;
    status!: LocationConflictStatusEnum;
    brand!: string;
    gbpAccountId!: string;
    venuexLocationId?: string;
    snapshots!: ConflictSnapshotsDto;
    createdAt!: Date;
}

export class ResolveConflictActionDto {
    @IsMongoId()
    @IsNotEmpty()
    conflictId!: string;

    @IsEnum(LocationConflictActionEnum)
    action!: LocationConflictActionEnum;
}

export class ResolveConflictsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ResolveConflictActionDto)
    actions!: ResolveConflictActionDto[];
}

export class ResolveConflictsResponseDto {
    applied!: number;
    errors!: string[];
}
```


**File:** `libs/dto/src/location/mismatch.dto.ts`

```typescript
export abstract class PlatformLocationMismatchDto {
    @IsArray()
    @ValidateNested()
    @Type(() => LocationDto)
    all_vx_locations!: LocationDto[];

    @IsArray()
    @ValidateNested()
    @Type(() => LocationDto)
    unmatched_vx_locations!: LocationDto[];

    @IsArray()
    @ValidateNested()
    @Type(() => MatchedPlatformVxPairDto)
    matched_pairs!: MatchedPlatformVxPairDto[];
}

export class MatchedPlatformVxPairDto {
    @IsMongoId()
    @IsString()
    platform_location_id!: string;

    @IsOptional()
    @IsString()
    platform_store_code?: string;

    @IsMongoId()
    @IsString()
    vx_location_id!: string;

    @IsOptional()
    @IsString()
    vx_store_code?: string;
}

export class MatchPlatformVxLocationDto {
    @IsOptional()
    @IsMongoId()
    @IsString()
    platform_location_id?: string;

    @IsOptional()
    @IsMongoId()
    @IsString()
    vx_location_id?: string;

    @IsOptional()
    @IsBoolean()
    marked_deleted?: boolean;

    @IsOptional()
    @IsBoolean()
    skip?: boolean;
}

export class MatchPlatformVxLocationListDto {
    @IsArray()
    @ValidateNested()
    @Type(() => MatchPlatformVxLocationDto)
    match_list!: MatchPlatformVxLocationDto[];

    @IsBoolean()
    update_platform_location_data!: boolean;

    @IsArray()
    @ValidateNested()
    @Type(() => MatchPlatformVxLocationDto)
    auto_match_list!: MatchPlatformVxLocationDto[];
}

export class MatchPlatformVxLocationResponseDto {
    @IsNumber()
    matchCount!: number;

    @IsNumber()
    failCount!: number;

    @IsNumber()
    createCount!: number;

    @IsNumber()
    deleteCount!: number;

    @IsNumber()
    skipCount!: number;

    @IsArray()
    @IsString({ each: true })
    failedVxLocations!: string[];

    @IsArray()
    @IsString({ each: true })
    failedPlatformLocations!: string[];
}

export class LocationProcessedMatchDto {
    @IsOptional()
    @IsString()
    platform_location_id?: string;

    @IsOptional()
    @IsString()
    vx_location_id?: string;

    @IsEnum(LocationMatchStatus)
    status!: LocationMatchStatus;

    @IsOptional()
    @IsString()
    reason?: string;
}
```


**File:** `libs/queue/src/types/auth/google-ads-auth.dto.ts`

```typescript
export class GoogleAdsAuthDto {
    @ApiProperty({ name: "provider", required: true, description: "Provider Id", example: "5ef1e98f03060c6e92d4f26f" })
    @IsMongoId()
    provider!: string;

    @ApiProperty({ name: "brand", required: true, description: "Brand Id", example: "5ef1e98f03060c6e92d4f26f" })
    @IsMongoId()
    brand!: string;

    @ApiProperty({
        name: "auth",
        required: true,
        type: GoogleAdsAuthLinkingDto,
        description: "Auth token details that will be used for Google Ads API calls",
    })
    @ValidateNested()
    @Type(() => GoogleAdsAuthLinkingDto)
    auth!: GoogleAdsAuthLinkingDto;
}
```


**File:** `libs/queue/src/types/auth/google-my-business-auth.dto.ts`

```typescript
export class GoogleMyBusinessAuthDto {
    @ApiProperty({ name: "provider", required: true, description: "Provider Id", example: "5ef1e98f03060c6e92d4f26f" })
    @IsMongoId()
    provider!: string;

    @ApiProperty({ name: "brand", required: true, description: "Brand Id", example: "5ef1e98f03060c6e92d4f26f" })
    @IsMongoId()
    brand!: string;

    @ApiProperty({
        name: "auth",
        required: true,
        type: GoogleMyBusinessAuthLinkingDto,
        description: "Auth token details that will be used for Google My Business API calls",
    })
    @ValidateNested()
    @Type(() => GoogleMyBusinessAuthLinkingDto)
    auth!: GoogleMyBusinessAuthLinkingDto;
}
```


**File:** `libs/queue/src/types/auth/google-merchant-center-auth.dto.ts`

```typescript
export class GoogleMerchantCenterAuthDto {
    @ApiProperty({ name: "provider", required: true, description: "Provider Id", example: "5ef1e98f03060c6e92d4f26f" })
    @IsMongoId()
    provider!: string;

    @ApiProperty({ name: "brand", required: true, description: "Brand Id", example: "5ef1e98f03060c6e92d4f26f" })
    @IsMongoId()
    brand!: string;

    @ApiProperty({
        name: "auth",
        required: true,
        type: GoogleMerchantCenterAuthLinkingDto,
        description: "Auth token details that will be used for Google Merchant Center API calls",
    })
    @ValidateNested()
    @Type(() => GoogleMerchantCenterAuthLinkingDto)
    auth!: GoogleMerchantCenterAuthLinkingDto;
}
```


**File:** `libs/queue/src/types/auth/shopify-auth-dto.ts`

```typescript
class ShopifyCredentialsDto {
    @IsString()
    @IsNotEmpty()
    access_token!: string;

    @IsString()
    @IsNotEmpty()
    shop!: string;

    @IsString()
    @IsNotEmpty()
    scope!: string;
}

export class ShopifyAuthDto {
    @IsEmail()
    email_address!: string;

    @ValidateNested()
    @Type(() => ShopifyCredentialsDto)
    auth!: ShopifyCredentialsDto;
}
```


### Enums & Constants

**File:** `libs/constants/src/provider.ts`

```typescript
export enum Provider {
    Google = "google",
    Meta = "meta",
    TikTok = "tiktok",
    Apple = "apple",
    Yandex = "yandex",
}
```


**File:** `libs/constants/src/providers.ts`

```typescript
export enum ProviderServiceCategory {
    product = "Product",
    listing = "Listing",
}

export enum LocationProviderEnum {
    google_my_business = "google-my-business",
    shopify = "shopify",
    togg_location = "togg-location",
    meta_graph_api_pages = "meta-graph-api-pages",
    yandex_business = "yandex-business",
    apple_business_connect = "apple-business-connect",
}

export enum ProductProviderEnum {
    google_content_api_product = "google-content-api-product",
    google_content_api_inventory = "google-content-api-inventory",
    google_content_api = "google-content-api",
    shopify = "shopify",
    nebim = "nebim",
    togg_product = "togg-product",
    meta_graph_api_catalog = "meta-graph-api-catalog",
}

export enum ConversionProviderEnum {
    google_ads = "google-ads",
    tiktok_business = "tiktok-business",
    meta_conversions = "meta-conversions",
}

export const ProviderEnum = {...LocationProviderEnum, ...ProductProviderEnum, ...ConversionProviderEnum};
export type ProviderEnum = LocationProviderEnum | ProductProviderEnum | ConversionProviderEnum;
```


**File:** `libs/constants/src/import/location-conflict.enum.ts`

```typescript
export enum LocationConflictTypeEnum {
    ONLY_IN_VX = "only_in_vx",
    ONLY_IN_GOOGLE = "only_in_google",
    ID_MISMATCH = "id_mismatch",
    DUPLICATE_LOCATION = "duplicate_location",
    ACCOUNT_MISMATCH = "account_mismatch",
}

export enum LocationConflictStatusEnum {
    PENDING = "pending",
    RESOLVED = "resolved",
    SKIPPED = "skipped",
}

export enum LocationConflictActionEnum {
    ADD_TO_GOOGLE = "add_to_google",
    DELETE_VX = "delete_vx",
    DELETE_GOOGLE = "delete_google",
    ADD_TO_VX = "add_to_vx",
    USE_GOOGLE_ID = "use_google_id",
    USE_ORIGINAL_GOOGLE_ID = "use_original_google_id",
    USE_DUPLICATE_GOOGLE_ID = "use_duplicate_google_id",
    ADD_ORIGINAL_TO_VX = "add_original_to_vx",
    ADD_DUPLICATE_TO_VX = "add_duplicate_to_vx",
    DELETE_BOTH_GOOGLE = "delete_both_google",
    SKIP = "skip",
}
```


**File:** `libs/constants/src/location-sync.ts`

```typescript
export enum LocationSyncStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}

export enum LocationMatchStatus {
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
}

export enum LocationSyncPlatform {
    META = "meta",
    APPLE = "apple",
}
```


### Interfaces & Types

**File:** `libs/interfaces/src/meta/meta-location-address.ts`

```typescript
export class IMetaLocationAddress {
    city?: string;
    country?: string;
    country_code?: string;
    latitude?: number;
    longitude?: number;
    street?: string;
    zip?: string;
}
```


**File:** `libs/interfaces/src/meta/meta-catalog.ts`

```typescript
export interface MetaProductCatalogDataSource {
    id: string;
    ingestion_source_type: string;
    name: string;
    upload_type: string;
    app_id?: string;
}

export interface MetaProductCatalog {
    id: string;
    name: string;
    business?: { id: string; name: string };
    feed_count?: number;
    is_local_catalog?: boolean;
    is_catalog_segment?: boolean;
    product_count?: number;
    data_sources?: { data: MetaProductCatalogDataSource[] };
}

export interface MetaFeedUpload {
    id: string;
    start_time: string;
    end_time: string;
}

export interface MetaFeedUploadError {
    id: string;
    error_type: string;
    description: string;
    severity: string;
    summary: string;
    total_count: number;
    affected_surfaces?: string[];
}

export interface MetaFeedUploadErrorsResponse {
    data: MetaFeedUploadError[];
    paging?: { cursors: { before: string; after: string }; next?: string; previous?: string };
}

export interface MetaFeedUploadStatus {
    id: string;
    start_time?: string;
    end_time?: string;
    error_count?: number;
    warning_count?: number;
    num_detected_items?: number;
    num_persisted_items?: number;
    num_invalid_items?: number;
    num_deleted_items?: number;
    errors?: MetaFeedUploadErrorsResponse;
}

export interface MetaFeedSchedule {
    id: string;
    hour: number;
    minute: number;
    interval: MetaFeedIntervalEnum;
    interval_count: number;
    timezone: string;
    url: string;
    day_of_week?: MetaFeedDayOfWeekEnum;
    day_of_month?: number;
    username?: string;
    password?: string;
}

export interface MetaProductFeed {
    id: string;
    name: string;
    ingestion_source_type: MetaFeedIngestionSourceType;
    product_count: number;
    country: string;
    default_currency: string;
    override_type?: string;
    primary_feeds?: string[];
    uploads?: { data: MetaFeedUpload[] };
    schedule?: MetaFeedSchedule;
    upload_schedules?: { data: MetaFeedSchedule[] };
    latest_upload?: MetaFeedUploadStatus;
}

export interface CreateProductFeedError {
    error_subcode: string;
    invalid_attribute: string;
    error_message: string;
}

export interface CreateProductFeedResponse extends MetaProductFeed {
    errors?: CreateProductFeedError[];
}

export interface ListMetaProductCatalogsResponse {
    data: MetaProductCatalog[];
    paging?: { cursors: { before: string; after: string }; next?: string; previous?: string };
}

export interface ListMetaProductFeedsResponse {
    data: MetaProductFeed[];
    paging?: { cursors: { before: string; after: string }; next?: string; previous?: string };
}

export interface MetaProductFeedScheduleParam {
    interval: MetaFeedIntervalEnum;
    url: string;
    hour?: number;
    minute?: number;
    day_of_week?: MetaFeedDayOfWeekEnum;
    day_of_month?: number;
    interval_count?: number;
    timezone?: string;
    username?: string;
    password?: string;
}

export interface CreateMetaProductFeed {
    name: string;
    schedule?: string;
    country?: string;
    default_currency?: string;
    deletion_enabled?: boolean;
    delimiter?: MetaProductFeedDelimiterEnum;
    encoding?: MetaProductFeedEncodingEnum;
    feed_type?: MetaProductFeedTypeEnum;
    ingestion_source_type?: MetaFeedIngestionSourceType;
    quoted_fields_mode?: MetaFeedQuotedFieldsMode;
}
```


### Validation Schemas

_No definitions found in this category._

---

## Users & Auth

### Database Models

**File:** `libs/database/src/mongoose/schemas/user/user.schema.ts`

```typescript
@pre<User>("save", async function hashPassword() {
    if (!this.isModified("password")) {
        return;
    }
    this.password = await hash(this.password, SALT_ROUND);
})
@pre<User>("validate", async function onPreSave(next) {
    // Validation logic
})
export class User extends TypegooseBase {
    @prop({required: true, unique: true})
    email!: string;

    @prop({required: true})
    password!: string;

    @prop({required: true, trim: true})
    name!: string;

    @prop({required: true, trim: true})
    surname!: string;

    @prop()
    photo?: string;

    @prop({required: false, default: false})
    pending?: boolean;

    @prop({ref: "Role", default: []}, PropType.ARRAY)
    roles!: Ref<Role>[];

    @prop({ref: "RoleMember", localField: "_id", foreignField: "owner", default: []}, PropType.ARRAY)
    roleMembers!: Ref<RoleMember>[];

    @prop({ref: "Organization", default: []}, PropType.ARRAY)
    favoriteOrganizations!: Ref<Organization>[];

    @prop({ref: "Venue", default: []}, PropType.ARRAY)
    favoriteVenues!: Ref<Venue>[];

    @prop({required: false})
    lastLoginAt?: number;

    @prop({required: false, default: false})
    is_demo?: boolean;

    @prop({required: false, default: false})
    is_two_fa_enabled?: boolean;

    @prop({required: false})
    two_fa_auth_secret?: string;

    @prop({required: false})
    two_fa_backup_code?: string;

    @prop({required: false})
    is_meta_tester?: boolean;

    @prop({required: false})
    is_google_tester?: boolean;

    hasGlobalRole(this: DocumentType<User>, ...expectedRoles: RoleEnum[]): boolean;
    hasBrandRole(this: DocumentType<User>, ...expectedRoles: RoleEnum[]): boolean;
    hasSpecificBrandRole(this: DocumentType<User>, brandId: string, ...expectedRoles: RoleEnum[]): Promise<boolean>;
    static findOneByCaseInsensitiveEmail<T extends typeof User>(this: ReturnModelType<T>, email: string);
}

export type PasswordlessUser = Omit<User, "password">;
```


**File:** `libs/database/src/mongoose/schemas/user/role.schema.ts`

```typescript
@pre<Role>("deleteOne", async function onPreSave(this: DocumentType<Role>) {
    // Validation logic for role removal
})
export class Role extends TypegoosePathMaterializedBase {
    @prop({required: true, unique: true, enum: RoleEnum})
    identifier!: RoleEnum;

    @prop({required: true})
    name!: string;

    @prop({required: true})
    description!: string;

    @prop({required: true, enum: Possession})
    possession!: Possession;

    @prop({enum: Attachable})
    attachedTo?: Attachable;

    @prop({required: true})
    is_active!: boolean;

    @prop({required: false})
    is_hidden?: boolean;

    @prop({required: false})
    precedence?: number;

    declare parent?: Ref<Role>;
}
```


**File:** `libs/database/src/mongoose/schemas/user/role-member.schema.ts`

```typescript
@pre<RoleMember>("validate", async function onPreSave(next) {
    // Validation logic
})
@index({ownerType: 1, owner: 1})
@index({attachedType: 1, attachedTo: 1})
export class RoleMember extends TypegooseBase {
    @prop({required: true, enum: RoleOwner})
    ownerType!: RoleOwner;

    @prop({required: true, refPath: "ownerType"})
    owner!: Ref<User | ApiKey>;

    @prop({required: true, enum: Attachable})
    attachedType!: Attachable;

    @prop({required: true, refPath: "attachedType"})
    attachedTo!: Ref<Brand | Location | Organization | Venue | VenueGroup>;

    @prop({required: true, ref: "Role"})
    role!: Ref<Role>;

    @prop({required: false, default: false})
    pending?: boolean;
}
```


**File:** `libs/database/src/mongoose/schemas/user/user.invite.schema.ts`

```typescript
@pre<UserInvite>("validate", async function onPreSave(next) {
    // Validation logic
})
export class UserInvite extends TypegooseBase {
    @prop({required: true})
    email!: string;

    @prop({trim: true})
    name?: string;

    @prop({trim: true})
    surname?: string;

    @prop({required: true, default: () => uuidV4()})
    token!: string;

    @prop({required: true, default: () => Date.now(), expires: USER_INVITE.expiresIn})
    tokenCreatedAt!: Date;

    @prop({required: true, ref: "User"})
    invitedBy!: Ref<User>;

    @prop({ref: "Role", default: []}, PropType.ARRAY)
    roles!: Ref<Role>[];

    @prop({required: false, type: InviteRoleMember}, PropType.ARRAY)
    members?: InviteRoleMember[];

    @prop({required: true, enum: Platforms, default: Platforms.STOREFRONT})
    platform!: Platforms;

    @prop({required: true, default: false})
    setup_authority!: boolean;
}
```


**File:** `libs/database/src/mongoose/schemas/user/invite-role-member.schema.ts`

```typescript
export class InviteRoleMember extends TypegooseBase {
    @prop({required: true})
    resourceId!: string;

    @prop({required: true, enum: Attachable, default: Attachable.Location})
    resourceType!: Attachable;

    @prop({required: true})
    role!: string;
}
```


**File:** `libs/database/src/mongoose/schemas/user/refresh-token.schema.ts`

```typescript
export class RefreshToken extends TypegooseBase {
    @prop({required: true, default: () => uuidV4()})
    value!: string;

    @prop({required: true, default: () => Date.now(), expires: JWT.refreshExpiresIn})
    tokenCreatedAt!: Date;

    @prop({required: true, ref: "User"})
    requestedBy!: Ref<User>;
}
```


**File:** `libs/database/src/mongoose/schemas/user/user-candidate.schema.ts`

```typescript
@pre<UserCandidate>("validate", async function onPreSave(next) {
    // Validation logic
})
export class UserCandidate extends User {
    @prop({required: true, ref: "BrandCandidate"})
    relatedBrandId!: Ref<BrandCandidate>;

    @prop({required: true, type: Boolean, default: false})
    isApproved!: boolean;
}

export type PasswordlessUserCandidate = Omit<UserCandidate, "password">;
```


**File:** `libs/database/src/mongoose/schemas/user/social-user.schema.ts`

```typescript
export class SocialUser extends TypegooseBase {
    @prop({required: true})
    email!: string;

    @prop({required: false, trim: true})
    name?: string;

    @prop({required: false, trim: true})
    surname?: string;

    @prop()
    photo?: string;

    @prop({required: true, enum: AllSocialEnum})
    provider!: AllSocialEnum;
}
```


**File:** `libs/database/src/mongoose/schemas/user/forget.password.schema.ts`

```typescript
export class ForgetPassword extends TypegooseBase {
    @prop({required: true, unique: true})
    email!: string;

    @prop({required: true, default: () => uuidV4()})
    token!: string;

    @prop({required: true, default: () => Date.now(), expires: FORGET_PASSWORD.expiresIn})
    tokenCreatedAt!: Date;
}
```


**File:** `libs/database/src/mongoose/schemas/api-keys/api-key.schema.ts`

```typescript
@pre<ApiKey>("validate", async function onPreSave(next) {
    // Validation logic
})
export class ApiKey extends TypegooseBase {
    @prop({required: true})
    name!: string;

    @prop({required: true, unique: true, default: () => uuidV4()})
    value!: string;

    @prop({required: true, unique: true})
    token!: string;

    @prop({required: true, ref: "User"})
    user!: Ref<User>;

    @prop({ref: "Role", default: []}, PropType.ARRAY)
    roles?: Ref<Role>[];

    @prop({required: true, validate: {validator(v: string): boolean {...}}})
    expiresAt!: string;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/provider-auth.schema.ts`

```typescript
@pre<ProviderAuth>("validate", async function validate(next) {
    // Validation logic
})
@pre<ProviderAuth>("deleteOne", async function onPreRemove(this: DocumentType<ProviderAuth>) {
    // Pre-removal cleanup
})
@index({location: 1, brand: 1})
@index({user: 1, provider: 1})
@index({brand: 1, google_my_business: 1})
@index({brand: 1, google_merchant_center: 1})
export class ProviderAuth extends TypegooseBase {
    @prop({required: true, ref: "Provider"})
    provider!: Ref<Provider>;

    @prop({required: false, ref: "Brand"})
    brand?: Ref<Brand>;

    @prop({required: false, ref: "Location"})
    location?: Ref<Location>;

    @prop({required: false, ref: "User"})
    user?: Ref<User>;

    @prop({_id: false})
    google_merchant_center?: AuthGoogleMerchantCenterSchema | AuthGoogleMerchantCenterNewSchema;

    @prop({_id: false})
    google_my_business?: AuthGoogleMyBusinessSchema;

    @prop({_id: false})
    google_ads?: AuthGoogleAdsSchema;

    @prop({_id: false})
    shopify?: ShopifyCredentialsSchema;

    @prop({_id: false})
    meta_graph_api_credentials?: MetaGraphApiCredentialsSchema;

    @prop({_id: false})
    meta_conversions?: MetaConversionsAuthSchema;

    @prop({_id: false})
    meta_ad_account?: MetaAdAccountSchema;

    @prop({_id: false})
    apple_business_connect?: AppleAuthSchema;

    @prop({_id: false})
    tiktok_business_api?: TiktokAuthSchema;

    @prop({required: false, _id: false, type: TiktokEventsApiSchema})
    tiktok_events_api?: TiktokEventsApiSchema;

    getProviderCode(): ProviderEnum | null;
    getProviderCategory(): ProviderServiceCategory | null;
    
    // Multiple static methods for finding provider auth by various criteria
    static findGbpAuthForUser(...): Promise<ProviderAuth | null>;
    static findListingAuthForUser(...): Promise<ProviderAuth | null>;
    static findInventoryAuthForLIAProgram(...): Promise<ProviderAuth | null>;
    // ... many more static methods
}
```


**File:** `libs/acl/src/schemas.ts`

```typescript
export class Schemas {
    private static instance: Schemas;
    
    userModel!: ModelType<User, unknown>;
    apiKeyModel!: ModelType<ApiKey, unknown>;
    roleModel!: ModelType<Role, unknown>;
    levelModel!: ModelType<Level, unknown>;
    organizationModel!: ModelType<Organization, unknown>;
    venueGroupModel!: ModelType<VenueGroup, unknown>;
    locationModel!: ModelType<Location, unknown>;
    companyModel!: ModelType<Company, unknown>;
    brandModel!: ModelType<Brand, unknown>;
    venueModel!: ModelType<Venue, unknown>;
    roleMemberModel!: ModelType<RoleMember, unknown>;
    
    static getInstance(): Schemas;
}
```


### DTOs

**File:** `libs/dto/src/user/user.dto.ts`

```typescript
export class UserDto {
    _id!: string;
    email!: string;
    name!: string;
    surname!: string;
    displayName!: string;
    photo?: string;
    favoriteOrganizations!: Types.ObjectId[];
    favoriteVenues!: Types.ObjectId[];
    roles?: RoleEnum[];
    lastLoginAt?: number;
    pending?: boolean;
    is_meta_tester?: boolean;
    is_google_tester?: boolean;
}

export class UserResponseDto extends UserDto {
    defaultBrand?: string;
    isResponsibleForSetup?: boolean;
    brands?: string[];
}

export class ProfileResponseUserDto extends UserResponseDto {
    rules?: unknown[];
}
```


**File:** `libs/dto/src/user/create.user.dto.ts`

```typescript
export class CreateUserBaseDto {
    email!: string;
    password!: string;
    name!: string;
    surname!: string;
}

export class CreateUserDto extends CreateUserBaseDto {
    roles!: string[];
}

export class CreateUserWithOptionalPasswordAndRoleDto extends OmitType(CreateUserBaseDto, ["password"]) {
    roles?: string[];
    password?: string;
}

export class CreateUserCandidateDto extends CreateUserWithOptionalPasswordAndRoleDto {
    relatedBrandId!: string;
    isApproved!: boolean;
}

export class CreateVenueAdminDto {
    venueId!: string;
    user!: CreateUserBaseDto;
}

export class CreateBrandAdminDto {
    brandId!: string;
    user!: CreateUserBaseDto;
}
```


**File:** `libs/dto/src/user/register.user.dto.ts`

```typescript
export class RegisterUserDto {
    password!: string;
    passwordAgain!: string;
    name!: string;
    surname!: string;
    inviteToken!: string;
}
```


**File:** `libs/dto/src/user/login.user.dto.ts`

```typescript
export class LoginUserDto {
    email!: string;
    password!: string;
}
```


**File:** `libs/dto/src/user/user.invite.dto.ts`

```typescript
class UserInviteContactDto {
    email!: string;
    name?: string;
    surname?: string;
}

export class UserInviteDto extends UserInviteContactDto {
    roles!: string[];
    members?: UserInviteRoleMemberDto[];
    platform!: Platforms;
    setup_authority!: boolean;
}

export class UserInviteResponseDto extends UserInviteContactDto {
    _id!: string;
    roles!: string[];
    members?: UserInviteRoleMemberResponseDto[];
    token!: string;
    platform!: Platforms;
    setup_authority!: boolean;
    createdAt?: Date;
}

export class UserInviteCheckResultDto extends UserInviteContactDto {
    company?: string;
    role?: string;
}

export class BulkUserInviteDto {
    invites!: UserInviteDto[];
}
```


**File:** `libs/dto/src/user/user.invite.confirm.dto.ts`

```typescript
export class UserInviteConfirmDto {
    token!: string;
}
```


**File:** `libs/dto/src/user/user.role.dto.ts`

```typescript
export class UserRoleDto {
    identifier!: RoleEnum;
    name!: string;
    description!: string;
    possession!: Possession;
    attachedTo?: Attachable;
    parent?: string;
}

export class UserRoleUpdateDto extends PartialType(UserRoleDto) {}
```


**File:** `libs/dto/src/user/update.user.dto.ts`

```typescript
export class UpdateUserDto {
    name!: string;
    surname!: string;
    photo?: string;
    oldPassword?: string;
    newPassword?: string;
    newPasswordAgain?: string;
    changePassword?: boolean;
}
```


**File:** `libs/dto/src/user/update.user.roles.dto.ts`

```typescript
export class UpdateUserRolesDto {
    roles!: Types.ObjectId[];
}
```


**File:** `libs/dto/src/user/update.user.pending.dto.ts`

```typescript
export class UpdateUserPendingDto {
    pending!: boolean;
}
```


**File:** `libs/dto/src/user/user-team-member.dto.ts`

```typescript
export class UserTeamMemberDto {
    team_member_id!: string;
    email!: string;
    name!: string;
    surname!: string;
    displayName!: string;
    photo?: string;
    role!: RoleEnum;
    pending?: boolean;
    createdAt?: Date;
}
```


**File:** `libs/dto/src/user/user-invite-role-member.dto.ts`

```typescript
export class UserInviteRoleMemberDto {
    resourceId!: string;
    resourceType!: Attachable;
    role!: string;
}

class PopulatedRoleDto extends OmitType(UserRoleDto, ["parent", "description", "possession"]) {
    _id!: string;
}

export class UserInviteRoleMemberResponseDto {
    resourceId!: string;
    resourceType!: Attachable;
    role!: PopulatedRoleDto;
}
```


**File:** `libs/dto/src/user/social-user.dto.ts`

```typescript
export class SocialUserDto {
    email!: string;
    name?: string;
    surname?: string;
    photo?: string;
    provider!: SocialAccountLinking;
}
```


**File:** `libs/dto/src/user/renew.token.dto.ts`

```typescript
export class RenewTokenDto {
    userId!: string;
    refresh!: string;
}
```


**File:** `libs/dto/src/user/reset.password.dto.ts`

```typescript
export class ResetPasswordDto {
    token!: string;
    email!: string;
    password!: string;
}
```


**File:** `libs/dto/src/user/recover-two-factor-auth.dto.ts`

```typescript
export class RecoverTwoFactorAuthDto {
    email!: string;
    password!: string;
    backupCode!: string;
}
```


**File:** `libs/dto/src/user/notification-settings.dto.ts`

```typescript
export class BulkNotificationSettingsDto {
    scheduled_rate!: NotificationScheduledRateEnum;
    scheduled_rate_enabled!: boolean;
    bulk_review_count!: NotificationBulkReviewCountEnum;
    bulk_review_count_enabled!: boolean;
}

export class NotificationSettingsCreateDto {
    brand!: string;
    notifications_enabled!: boolean;
    rating_notifications!: StarRatingNotificationEnum[];
    location_notifications!: string[];
    notification_pattern!: NotificationPatternEnum;
    bulk_notification_settings!: BulkNotificationSettingsDto;
}

export class NotificationSettingsDto extends NotificationSettingsCreateDto {
    user!: string;
}

export class NotificationSettingsUpdateDto extends PartialType(OmitType(NotificationSettingsCreateDto, ["brand"])) {}
```


**File:** `libs/dto/src/user/company-business-primary-owner.dto.ts`

```typescript
export class BusinessPrimaryOwnerDto {
    business_name!: string;
    website!: string;
    email!: string;
    primary_category!: string;
    additional_categories?: string[];
    first_name!: string;
    last_name!: string;
}

export class CompanyBusinessPrimaryOwnerDto extends BusinessPrimaryOwnerDto {
    company!: CompanyDto;
    logo?: string;
}
```


**File:** `libs/dto/src/auth/jwt.dto.ts`

```typescript
export class JwtDto {
    user!: UserDto;
    token!: TokenDto;
    refreshToken!: TokenDto;
}
```


**File:** `libs/dto/src/auth/token.dto.ts`

```typescript
export class TokenDto {
    value!: string;
    expiresAt!: number;
}
```


**File:** `libs/dto/src/auth/two-fa-auth.dto.ts`

```typescript
export class TwoFaAuthDto {
    code!: string;
}

export class IsTwoFaEnabledDto {
    isTwoFaEnabled!: boolean;
}

export class Jwt2FaDto {
    user!: IsTwoFaEnabledDto;
    token!: TokenDto;
}

export class TwoFaQrResponse {
    qrUri!: string;
    qrSecret!: string;
    backupCode!: string;
}
```


**File:** `libs/dto/src/role-member/role-membership-owner.dto.ts`

```typescript
export class RoleMembershipOwnerDto {
    ownerType!: RoleOwner;
    owner!: string;
    role!: string;
}
```


**File:** `libs/dto/src/role-member/role-member.dto.ts`

```typescript
export class RoleMemberDto extends RoleMembershipOwnerDto {
    attachedType!: Attachable;
    attachedTo!: string;
    pending?: boolean;
}

export class UpdateRoleMemberDto extends MakeFieldsOptionalExcept(RoleMemberDto, ["role"]) {}
```


**File:** `libs/dto/src/api-key/api.key.token.dto.ts`

```typescript
export class ApiKeyTokenDto {
    value!: string;
    expiresAt!: string;
}
```


**File:** `libs/dto/src/api-key/api.key.dto.ts`

```typescript
export class ApiKeyDto {
    apiKeyToken!: ApiKeyTokenDto;
}
```


**File:** `libs/dto/src/api-key/create.api.key.dto.ts`

```typescript
export class CreateApiKeyDto {
    name!: string;
    roles!: string[];
    expiresAt!: string;
}
```


**File:** `libs/dto/src/organization/organization.create.user.dto.ts`

```typescript
export class CreateOrganizationMemberDto extends CreateUserBaseDto {
    role!: string;
}
```


### Enums & Constants

**File:** `libs/constants/src/acl/role-enum.ts`

```typescript
export enum LegacyRoleEnum {
    VENUEX_SUPER_USER = "VENUEX_SUPER_USER",
    OWNER = "OWNER",
    MEMBER = "MEMBER",
    BRAND_ADMIN = "BRAND_ADMIN",
    ORGANIZATION_ADMIN = "ORGANIZATION_ADMIN",
    VENUE_GROUP_ADMIN = "VENUE_GROUP_ADMIN",
    VENUE_ADMIN = "VENUE_ADMIN",
    MAP_ADMIN = "MAP_ADMIN",
    LOCATION_ADMIN = "LOCATION_ADMIN",
    LOCATION_TEAM_MEMBER = "LOCATION_TEAM_MEMBER",
    STORE_ADMIN = "STORE_ADMIN",
    LISTING_MANAGER = "LISTING_MANAGER",
    MAP_VIEWER = "MAP_VIEWER",
    STORE_WIDGET_VIEWER = "STORE_WIDGET_VIEWER",
}

export enum UserRoleEnum {
    VENUEX_SUPER_USER = "VENUEX_SUPER_USER",
    COMPANY_OWNER = "COMPANY_OWNER",
    BRAND_OWNER = "BRAND_OWNER",
    BRAND_MANAGER = "BRAND_MANAGER",
    BRAND_MEMBER = "BRAND_MEMBER",
    STORE_WIDGET_VIEWER = "STORE_WIDGET_VIEWER",
    DEMO_USER = "DEMO_USER",
    CUSTOMER_RELATIONS = "CUSTOMER_RELATIONS",
}

export enum ApiRoleEnum {
    LOCAL_INVENTORY_MANAGER = "LOCAL_INVENTORY_MANAGER",
}

export const RoleEnum = {...LegacyRoleEnum, ...UserRoleEnum, ...ApiRoleEnum};
export type RoleEnum = LegacyRoleEnum | UserRoleEnum | ApiRoleEnum;
```


**File:** `libs/constants/src/acl/models/role-owner.enum.ts`

```typescript
export enum RoleOwner {
    User = "User",
    ApiKey = "ApiKey",
}

export const RoleOwnerTypes = Object.values(RoleOwner) as RoleOwner[];
```


**File:** `libs/constants/src/acl/models/attachable.enum.ts`

```typescript
export enum Attachable {
    Brand = "Brand",
    Organization = "Organization",
    Venue = "Venue",
    VenueGroup = "VenueGroup",
    Location = "Location",
    Company = "Company",
}

export const AttachableTypes = Object.values(Attachable) as Attachable[];
```


**File:** `libs/constants/src/acl/models/possession.enum.ts`

```typescript
export enum Possession {
    own = "own",
    all = "all",
}

export const PossessionTypes = Object.values(Possession) as Possession[];
```


**File:** `libs/constants/src/acl/models/permission.enum.ts`

```typescript
export enum Permission {
    create = "create",
    read = "read",
    update = "update",
    delete = "delete",
    manage = "manage",
}
```


**File:** `libs/constants/src/auth/index.ts`

```typescript
export enum SharedAuthTypeEnum {
    GoogleMyBusiness = "GoogleMyBusiness",
    GoogleMerchantCenter = "GoogleMerchantCenter",
    GoogleMerchantCenterNew = "GoogleMerchantCenterNew",
    MetaGraphApiPages = "MetaGraphApiPages",
    GoogleAds = "GoogleAds",
    TiktokBusiness = "TiktokBusiness",
    AppleBusinessConnect = "AppleBusinessConnect",
}
```


### Interfaces & Types

**File:** `libs/acl/src/types.ts`

```typescript
export type CachedRule = RawRuleFrom<AbilityTuple, MongoQuery>;
export type UnpackedUserRule = SubjectRawRule<string, ExtractSubjectType<Subject>, MongoQuery<AnyObject>>;
export type UserRule = PackRule<UnpackedUserRule>;
export type BasicSubject = InferSubjects<any> | "all";
export type Actions = "read";
export type BasicAbility = PureAbility<[Actions, BasicSubject]>;
export type MongoAbilityWithQuery = MongoAbility<AbilityTuple, MongoQuery>;
export type AppAbility = BasicAbility | MongoAbilityWithQuery;
export type AppAbilityBuilder = AbilityBuilder<AppAbility>;
```


**File:** `libs/acl/src/decorators/define-access.decorator.ts`

```typescript
export interface CustomAbility {
    action: Action;
    permission: Permission;
    resource: string;
}

export const DefineAccess = (...abilities: CustomAbility[]): CustomDecorator<"abilities"> =>
    SetMetadata("abilities", abilities);
```


**File:** `libs/acl/src/ability-builder.ts`

```typescript
interface AbilityQuery {
    documents?: {brand?: DocumentType<Brand>};
    brand?: Ref<Brand, ObjectId> | undefined;
    organizations?: Ref<Organization, ObjectId | undefined>[] | [];
    venueGroups?: Ref<VenueGroup, ObjectId | undefined>[] | [];
    locations?: Ref<Location, ObjectId | undefined>[] | [];
    venues?: Ref<Venue, ObjectId | undefined>[] | [];
    levels?: Ref<Level, ObjectId | undefined>[] | [];
    user?: Ref<User, ObjectId>;
    company?: Ref<Company, ObjectId>;
}

class AbilityBuilder {
    private static instance: AbilityBuilder;
    private schemas: Schemas;
    
    static getInstance(): AbilityBuilder;
    build(abilityBuilder: AppAbilityBuilder, role?: Role, query: AbilityQuery = {}): void;
    
    // Role-specific builders
    buildVenuexSuperUser(abilityBuilder: AppAbilityBuilder): void;
    buildBrandOwner(sourceRole: ModelType<any, unknown>, query: AbilityQuery, abilityBuilder: AppAbilityBuilder): void;
    buildBrandManager(sourceRole: ModelType<any, unknown>, query: AbilityQuery, abilityBuilder: AppAbilityBuilder): void;
    buildBrandMember(sourceRole: ModelType<any, unknown>, query: AbilityQuery, abilityBuilder: AppAbilityBuilder): void;
    buildCompanyOwner(sourceRole: ModelType<any, unknown>, query: AbilityQuery, abilityBuilder: AppAbilityBuilder): void;
    buildDemoUser(sourceRole: ModelType<any, unknown>, query: AbilityQuery, abilityBuilder: AppAbilityBuilder): void;
    buildCustomerRelations(brandModel: ModelType<Brand, unknown>, query: AbilityQuery, abilityBuilder: AppAbilityBuilder): void;
    buildLocalInventoryManager(sourceRole: ModelType<any, unknown>, query: AbilityQuery, abilityBuilder: AppAbilityBuilder): void;
    // ... and many more
}
```


**File:** `libs/acl/src/ability-check.ts`

```typescript
export const isAbleToUpdate = (ability: Ability, Subject: ReturnModelType<any> | DocumentType<any>, dto?: unknown): void;
export const isAbleToCreate = (ability: Ability, Model: ReturnModelType<any>, dto?: unknown): void;
export const isAbleToRead = (ability: Ability, Subject: ReturnModelType<any> | DocumentType<any>, dto?: unknown): void;
export const isAbleToDelete = (ability: Ability, Subject: ReturnModelType<any> | DocumentType<any>, dto?: unknown): void;
export const isAbleToManage = (ability: Ability, Model: ReturnModelType<any>, dto?: unknown): void;
export const isAbleToManageAll = (ability: Ability): void;
export const isVenuexSuperUser = (ability: Ability): boolean;
export const getAbilityRules = (ability: Ability): any[];
export const packRules = packRulesCasl;
export const ensureVenuexSuperUser = isAbleToManageAll;
export const isResponsibleForSetup = async (ability: Ability, {brandId}: {userId?: string; brandId: string}): Promise<boolean>;
```


**File:** `libs/acl/src/acl.helper.ts`

```typescript
export class AclHelper {
    roleCollector: RoleCollector;
    private schemaBuilder: AbilityBuilder;
    private user!: DocumentType<User>;
    private schemas!: Schemas;
    
    // Role collections
    private companyRoles!: DocumentType<RoleMember>[];
    private brandRoles!: DocumentType<RoleMember>[];
    private venueRoles!: DocumentType<RoleMember>[];
    private venueGroupRoles!: DocumentType<RoleMember>[];
    private organizationRoles!: DocumentType<RoleMember>[];
    private locationRoles!: DocumentType<RoleMember>[];
    private globalRoles!: DocumentType<Role>[];
    private abilityBuilder: AppAbilityBuilder;
    
    constructor();
    async arrangeBelongingsForOrganizations(organizationIds: ObjectId[]): Promise<...>;
    async arrangeBelongingsForVenueGroups(venueGroupIds: ObjectId[]): Promise<...>;
    async arrangeBelongingsForVenues(venueIds: ObjectId[]): Promise<...>;
    async buildAbilities(): Promise<PureAbility>;
    buildAbilitiesFromRules(rules: CachedRule[]): PureAbility;
    overwriteAbilities(roles: RoleEnum[], user: User): void;
    async buildRules(userId: mongoose.Types.ObjectId): Promise<PureAbility>;
    async buildApiKeyRules(apiKey: string): Promise<PureAbility>;
    async getRoles(userId: mongoose.Types.ObjectId): Promise<...>;
    async getApiKeyRoles(apiKey: string): Promise<...>;
}
```


**File:** `libs/acl/src/role-collector.ts`

```typescript
export class RoleCollector {
    private static instance: RoleCollector;
    private schemas: Schemas;
    
    static getInstance(): RoleCollector;
    async getRolesByIdentifiers(identifiers: mongoose.Types.ObjectId[]): Promise<Role[]>;
    async getUserRoles(userId: mongoose.Types.ObjectId): Promise<{
        user: User;
        companyRoles: DocumentType<RoleMember>[];
        brandRoles: DocumentType<RoleMember>[];
        organizationRoles: DocumentType<RoleMember>[];
        locationRoles: DocumentType<RoleMember>[];
        venueGroupRoles: DocumentType<RoleMember>[];
        venueRoles: DocumentType<RoleMember>[];
        globalRoles: DocumentType<Role>[];
    }>;
    async getApiKeyRoles(apiKey: string): Promise<similar structure>;
    async getMembershipsForOwner(ownerQuery: {owner?: mongoose.Types.ObjectId | string; ownerType: RoleOwner}): Promise<...>;
}
```


### Validation Schemas

_No definitions found in this category._

---

## Analytics & Segments

### Database Models

**File:** `libs/database/src/mongoose/schemas/analytic/location-analytics.schema.ts`

```typescript
@index({brandId: 1})
export class LocationAnalytics extends TypegooseBase {
    @prop({required: true, ref: "Brand"})
    brandId!: Ref<Brand>;

    @prop({required: true, type: Number, default: 0})
    locationCount!: number;

    @prop({required: true, type: Number, default: 0})
    verifiedLocationCount!: number;

    @prop({required: true, type: Number, default: 0})
    duplicatedLocationCount!: number;

    @prop({required: true, type: Number, default: 0})
    suspendedLocationCount!: number;

    @prop({required: true, type: Number, default: 0})
    unverifiedLocationCount!: number;

    @prop({required: true, type: Number, default: 0})
    unknownLocationCount!: number;
}
```


**File:** `libs/database/src/mongoose/schemas/analytic/product-and-product-variant-analytics.schema.ts`

```typescript
export class ProductAndProductVariantAnaytics extends TypegooseBase {
    @prop({required: true, ref: "Brand"})
    brandId!: Ref<Brand>;

    @prop({required: true, type: Number, default: 0})
    productCount!: number;

    @prop({required: true, type: Number, default: 0})
    productVariantCount!: number;

    @prop({required: true, type: Number, default: 0})
    percentageStoreInStock!: number;
}
```


**File:** `libs/database/src/mongoose/schemas/analytic/stock-analytics.schema.ts`

```typescript
@index({brandId: 1})
@index({locationId: 1})
export class StockAnalytics extends TypegooseBase {
    @prop({required: true, ref: "Brand"})
    brandId!: Ref<Brand>;

    @prop({required: true, ref: "Location"})
    locationId!: Ref<Location>;

    @prop({required: true, type: Number, default: 0})
    stockCount!: number;
}
```


**File:** `libs/database/src/mongoose/schemas/location-metric/location-metric.schema.ts`

```typescript
@index({brand: 1, location: 1, metric: 1, "date.year": 1, "date.month": 1, "date.day": 1}, {unique: true})
@index({"date.dateYYYYMMDD": 1})
@index({brand: 1, "date.dateYYYYMMDD": 1})
@index({brand: 1, location: 1, metric: 1, "date.dateYYYYMMDD": 1})
@index({brand: 1, location: 1, "date.year": 1, "date.month": 1, "date.day": 1})
@index({brand: 1, metric: 1, "date.year": 1, "date.month": 1, "date.day": 1})
@index({location: 1, metric: 1, "date.year": 1, "date.month": 1, "date.day": 1})
@index({updatedAt: -1})
@index({brand: 1, updatedAt: -1})
@index({location: 1})
export class LocationMetric extends TypegooseBase {
    @prop({required: true, ref: "Location"})
    location!: Ref<Location>;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true, enum: DailyMetricEnum})
    metric!: DailyMetricEnum;

    @prop({required: true})
    value!: string;

    @prop({required: true})
    date!: InsightDate;
}
```


**File:** `libs/database/src/mongoose/schemas/location-metric/location-monthly-metric.schema.ts`

```typescript
@index({brand: 1, location: 1})
@index({brand: 1, location: 1, metric: 1, "date.year": 1, "date.month": 1, "date.day": 1})
export class LocationMonthlyMetric extends TypegooseBase {
    @prop({required: true, ref: "Location"})
    location!: Ref<Location>;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true, enum: DailyMetricEnum})
    metric!: DailyMetricEnum;

    @prop({required: true})
    value!: string;

    @prop({required: true})
    date!: InsightDate;
}
```


**File:** `libs/database/src/mongoose/schemas/location-metric/insight-date.schema.ts`

```typescript
@modelOptions({schemaOptions: {_id: false}})
export class InsightDate extends TypegooseWithoutId {
    @prop({required: true})
    year!: number;

    @prop({required: true})
    month!: number;

    @prop({required: true, default: 1})
    day!: number;

    @prop({required: true, default: 0})
    dateYYYYMMDD!: number;
}
```


**File:** `libs/database/src/mongoose/schemas/location-metric/location-search-keyword.schema.ts`

```typescript
@index({brandId: 1, locationId: 1})
@index({brandId: 1, locationId: 1, "date.year": 1, "date.month": 1, "date.day": 1}, {unique: true})
export class SearchKeywordInsight extends TypegooseBase {
    @prop({required: true, ref: "Location"})
    locationId!: Ref<Location>;

    @prop({required: true, ref: "Brand"})
    brandId!: Ref<Brand>;

    @prop({required: false})
    gmbAccountCode?: string;

    @prop({required: false})
    gbpAccountId?: string;

    @prop({required: true})
    gmbLocationCode!: string;

    @prop({required: true})
    date!: InsightDate;

    @prop({required: true})
    searchKeywordsCounts!: businessprofileperformance_v1.Schema$SearchKeywordCount[];
}
```


**File:** `libs/database/src/mongoose/schemas/apple/apple-metric.schema.ts`

```typescript
@index({brand: 1, dateYYYYMMDD: 1})
@index({companyId: 1, dateYYYYMMDD: 1})
@index({location: 1, dateYYYYMMDD: 1}, {unique: true})
@index({resourceId: 1, dateYYYYMMDD: 1}, {unique: true})
@index({brand: 1, location: 1, dateYYYYMMDD: 1})
export class AppleMetric extends TypegooseBase {
    @prop({required: true, enum: AppleInsightResourceType})
    resourceType!: AppleInsightResourceType;

    @prop({required: true})
    resourceId!: string;

    @prop({required: true})
    companyId!: string;

    @prop({required: true, ref: "Location"})
    location!: Ref<Location>;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    date!: string; // YYYY-MM-DD

    @prop({required: true})
    dateYYYYMMDD!: number;

    @prop({required: true, type: Object, _id: false}, PropType.MAP)
    metrics!: Partial<Record<AppleMetricName, any>>;

    @prop({required: true, type: Object, _id: false}, PropType.MAP)
    rawMetrics!: Partial<Record<AppleMetricName, any>>;

    @prop({required: true})
    useLocalTime!: boolean;

    @prop({required: true})
    timezone!: string;

    @prop({required: true, enum: AppleInsightTimeGranularity})
    timeGranularity!: AppleInsightTimeGranularity;
}
```


**File:** `libs/database/src/mongoose/schemas/meta-page-metric/meta-metric.schema.ts`

```typescript
@index({updatedAt: -1})
@index({endTime: -1})
@index({brand: 1, endTime: -1})
@index({pageId: 1, endTime: -1})
@index({brand: 1, insightId: 1, endTime: 1}, {unique: true})
@index({brand: 1, period: 1, name: 1, endTime: 1}, {unique: true})
export class MetaMetric extends TypegooseBase {
    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    insightId!: string;

    @prop({required: true})
    pageId!: string;

    @prop({required: true})
    name!: string;

    @prop({required: true, enum: MetaMetricPeriod})
    period!: MetaMetricPeriod;

    @prop({required: true})
    endTime!: Date;

    @prop({required: true})
    value!: number | Record<string, number>;
}
```


**File:** `libs/database/src/mongoose/schemas/meta-page-metric/meta-metric-metadata.schema.ts`

```typescript
@index({name: 1, period: 1}, {unique: true})
export class MetaMetricMetadata {
    @prop({required: true})
    name!: string;

    @prop({required: true})
    period!: string;

    @prop({required: true})
    title!: string;

    @prop({required: true})
    description!: string;

    @prop({enum: ["number", "object"], type: String})
    valueType?: "number" | "object";

    @prop({type: () => [String]})
    expectedKeys?: string[];
}
```


**File:** `libs/database/src/mongoose/schemas/performance-report/performance-report.schema.ts`

```typescript
@index({brand: 1, report_month: 1, report_year: 1}, {unique: true})
export class PerformanceReport extends TypegooseBase {
    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    report_s3_url!: string;

    @prop({required: true, max: 12, min: 1})
    report_month!: number;

    @prop({required: true})
    report_year!: number;

    @prop({required: true, type: Schema.Types.Mixed, validate: {validator: (val: any): boolean => IsLocalizedText(val, ["en"]), message: "`names` validation failed."}, default: {}})
    description!: LocalizedTextType;

    @prop({required: false})
    thumbnail_image_url?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/location-review/location-review.schema.ts`

```typescript
export class AnalysisResult {
    @prop({type: () => Object, _id: false})
    category_scores?: Record<string, number>;

    @prop()
    category?: string;

    @prop()
    anomaly?: boolean;

    @prop()
    review_analysis?: string;

    @prop()
    safety_issue?: boolean;

    @prop()
    product_group?: string;

    @prop()
    product?: string;

    @prop()
    overall_emotion?: string;
}

@index({locationId: 1})
@index({location: 1, analyzeResult: 1, createTime: 1})
@index({brand: 1, analyzedAt: 1, comment: 1})
@index({brand: 1, updatedAt: 1})
@index({status: 1, updateTime: 1})
@index({location: 1, reviewId: 1, gmb_location_code: 1})
@index({is_checked_for_media_items: 1, media_items: 1})
@index({updateTime: 1})
@index({brand: 1, is_new: 1, updateTime: 1})
@index({brand: 1, source: 1, location: 1})
@index({brand: 1, source: 1, updateTime: 1, location: 1})
export class LocationReview extends TypegooseBase {
    @prop({required: true, ref: "Location"})
    location!: Ref<Location>;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    reviewId!: string;

    @prop({required: true})
    name!: string;

    @prop({required: true, type: Reviewer, _id: false})
    reviewer!: Reviewer;

    @prop({required: true})
    starRating!: number;

    @prop({required: false})
    comment?: string;

    @prop({required: true})
    createTime!: Date;

    @prop({required: true})
    updateTime!: Date;

    @prop({required: true, enum: ReviewSourceEnum, default: ReviewSourceEnum.GOOGLE})
    source!: ReviewSourceEnum;

    @prop({required: true, enum: ReviewStatusEnum, default: ReviewStatusEnum.UNANSWERED})
    status!: ReviewStatusEnum;

    @prop({required: false, ref: "LocationMediaItem"})
    media_items?: Ref<LocationMediaItem>[];

    @prop({required: false})
    is_checked_for_media_items?: boolean;

    @prop({required: false, default: false})
    is_new?: boolean;

    @prop({required: false})
    analyzedAt?: Date;

    @prop({required: false, type: AnalysisResult, _id: false})
    analyzeResult?: AnalysisResult;
}
```


**File:** `libs/database/src/mongoose/schemas/location-review-analysis/location-review-analysis.ts`

```typescript
class ReviewAnalysisResult extends TypegooseWithoutId {
    @prop({required: true})
    category_averages!: {[key: string]: number};

    @prop({required: true})
    category_counts!: {[key: string]: number};

    @prop({required: false})
    dominant_aspects?: string;
}

@index({brand: 1})
export class ReviewAnalysis extends TypegooseBase {
    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    file_name!: string;

    @prop({required: true})
    row_count!: number;

    @prop({required: true})
    status!: ReviewAnalysisLogStatus;

    @prop({required: false})
    cloud_file_id?: string;

    @prop({required: false, _id: false})
    result?: ReviewAnalysisResult;

    @prop({required: true})
    type!: ReviewAnalysisType;
}
```


**File:** `libs/database/src/mongoose/schemas/location-review/location-review-overview.schema.ts`

```typescript
@index({location: 1, gmb_location_code: 1})
@index({brand: 1, updatedAt: -1})
export class LocationReviewOverview extends TypegooseBase {
    @prop({required: true, ref: "Location"})
    location!: Ref<Location>;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    gmb_location_code!: string;

    @prop({required: true})
    averageRating!: number;

    @prop({required: true})
    totalReviewCount!: number;

    @prop({required: true, default: 0})
    oneStarCount!: number;

    @prop({required: true, default: 0})
    twoStarsCount!: number;

    @prop({required: true, default: 0})
    threeStarsCount!: number;

    @prop({required: true, default: 0})
    fourStarsCount!: number;

    @prop({required: true, default: 0})
    fiveStarsCount!: number;

    @prop({required: true, default: 0})
    createTime!: Date;
}
```


**File:** `libs/database/src/mongoose/schemas/location-review/review-status-time-series.schema.ts`

```typescript
export class LocationReviewStatusTimeSeries extends TypegooseBase {
    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    answered_count!: number;

    @prop({required: true})
    unanswered_count!: number;

    @prop({required: true})
    total_average!: number;

    @prop({required: true})
    year!: number;

    @prop({required: true})
    month!: number;

    @prop({required: true})
    day!: number;
}
```


### DTOs

**File:** `libs/dto/src/insights/location-metric.dto.ts`

```typescript
export class InsightDateDto {
    @ApiProperty({name: "year", description: "year", example: 2025})
    @IsNumber()
    @Min(2020)
    year!: number;

    @ApiProperty({name: "month", description: "month", example: 11})
    @IsNumber()
    @Min(1)
    @Max(12)
    month!: number;

    @ApiProperty({name: "day", description: "day", example: 4})
    @IsNumber()
    @Min(0)
    @Max(31)
    day!: number;

    @ApiProperty({name: "combined year, month, day in YYYYMMDD format", description: "day", example: 20251104})
    @IsNumber()
    @IsOptional()
    dateYYYYMMDD?: number;
}
```


**File:** `libs/dto/src/insights/location-metric.dto.ts`

```typescript
export class LocationMetricDto {
    @ApiProperty({name: "locations", description: "location ids", example: ["5ed0f90e0ea9f407aeff03ae"]})
    @IsMongoId({each: true})
    @IsOptional()
    locations?: string[];

    @ApiProperty({name: "brandId", description: "brand id", example: "5ed0f90e0ea9f407aeff03ae"})
    @IsMongoId()
    @IsOptional()
    brand?: string;

    @ApiProperty({name: "metric", description: "daily metric", example: DailyMetricEnum.CALL_CLICKS})
    @IsEnum(DailyMetricVenueX)
    metric!: DailyMetricVenueX;

    @ApiProperty({name: "start_time", description: "insight start time", example: "2021-05-04T18:00:00Z"})
    @IsDateString()
    start_time!: string;

    @ApiProperty({name: "end_time", description: "insight end time", example: "2021-05-05T18:00:00Z"})
    @IsDateString()
    end_time!: string;

    @ApiProperty({name: "only_accumulated", description: "identifier for accumulated data", example: true})
    @IsBoolean()
    only_accumulated!: boolean;

    @ApiProperty({name: "date_range", description: "date range for insights", example: "WEEKLY, DAILY, MONTHLY"})
    @IsEnum(InsightDateRange)
    date_range!: InsightDateRange;

    @ApiProperty({name: "calculate_series", description: "identifier for calculating chart series data", example: true})
    @IsBoolean()
    calculate_series!: boolean;
}

export class LocationMonthlyMetricDto {
    @ApiProperty({name: "locations", description: "location id", example: "5ed0f90e0ea9f407aeff03ae"})
    @IsMongoId()
    location!: string | Types.ObjectId;

    @ApiProperty({name: "brandId", description: "brand id", example: "5ed0f90e0ea9f407aeff03ae"})
    @IsMongoId()
    brand!: string | Types.ObjectId;

    @ApiProperty({name: "metric", description: "daily metric", example: DailyMetricEnum.CALL_CLICKS, enum: DailyMetricEnum})
    @IsEnum(DailyMetricEnum)
    metric!: DailyMetricEnum;

    @ApiProperty({name: "metric", description: "insight metric value", example: "100"})
    value!: string;

    @ApiProperty({name: "start_time", description: "insight start time", example: "2021-05-04T18:00:00Z"})
    @IsDateString()
    startTime!: string;

    @ApiProperty({name: "end_time", description: "insight end time", example: "2021-05-05T18:00:00Z"})
    @IsDateString()
    endTime!: string;

    @ValidateNested()
    @Type(() => InsightDateDto)
    date!: InsightDateDto;
}
```


**File:** `libs/dto/src/insights/apple-metric.dto.ts`

```typescript
export class GetAppleMetricRequestDto {
    @ApiProperty({name: "brand", description: "brand id", example: "5ed0f90e0ea9f407aeff03ae"})
    @IsMongoId()
    brand!: string;

    @ApiProperty({name: "location", description: "location id", example: "5ed0f90e0ea9f407aeff03ae"})
    @IsMongoId()
    @IsOptional()
    location?: string;

    @ApiProperty({name: "startDate", description: "start date", example: {year: 2023, month: 1, day: 1}})
    @ValidateNested()
    @Type(() => InsightDateDto)
    startDate!: InsightDateDto;

    @ApiProperty({name: "endDate", description: "end date", example: {year: 2023, month: 1, day: 7}})
    @ValidateNested()
    @Type(() => InsightDateDto)
    endDate!: InsightDateDto;

    @ApiProperty({name: "search", description: "search query for locations", required: false})
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({name: "storeSetId", description: "store set id for filtering locations", required: false})
    @IsOptional()
    @IsMongoId()
    storeSetId?: string;
}

export class AppleMetricResponseDto {
    @ApiProperty({name: "impressions", description: "number of impressions", example: 150})
    impressions!: number;

    @ApiProperty({name: "calls", description: "number of calls", example: 30})
    calls!: number;

    @ApiProperty({name: "directions", description: "number of directions", example: 20})
    directions!: number;

    @ApiProperty({name: "websiteVisits", description: "number of website visits", example: 100})
    websiteVisits!: number;

    @ApiProperty({name: "mapViews", description: "number of map views", example: 80})
    mapViews!: number;
}

export class AppleMetricTimeSeriesDto {
    @ApiProperty({name: "dateYYYYMMDD", description: "metric date in YYYYMMDD format", example: 20250115})
    dateYYYYMMDD!: number;

    @ApiProperty({name: "impressions", description: "number of impressions", example: 150})
    impressions!: number;

    @ApiProperty({name: "calls", description: "number of calls", example: 30})
    calls!: number;

    @ApiProperty({name: "directions", description: "number of directions", example: 20})
    directions!: number;

    @ApiProperty({name: "websiteVisits", description: "number of website visits", example: 100})
    websiteVisits!: number;

    @ApiProperty({name: "mapViews", description: "number of map views", example: 80})
    mapViews!: number;
}

export class GetTopPerformingLocationsByAppleMetricRequestDto extends GetAppleMetricRequestDto {
    @ApiProperty({description: "Sort ascending or descending?", required: false, enum: ["asc", "desc"]})
    @IsOptional()
    @IsIn(["asc", "desc"])
    sort?: string;

    @ApiProperty({description: "Sort using which field?", required: false, enum: AppleMetricsSortFieldEnum})
    @IsIn(Object.values(AppleMetricsSortFieldEnum))
    @IsOptional()
    sortField?: string;
}

export class TopPerformingAppleMetricResponseDto {
    @ApiProperty({name: "location", description: "location details"})
    location!: TopLocationDetailsDto;

    @ApiProperty({name: "metrics", description: "apple metrics", type: AppleMetricResponseDto})
    metrics!: AppleMetricResponseDto;
}
```


**File:** `libs/dto/src/insights/meta-metric.dto.ts`

```typescript
export class MetaMetricValueDto {
    @IsISO8601()
    end_time!: string;

    @ValidateIf((obj) => typeof obj.value === "number" || (typeof obj.value === "object" && obj.value !== null))
    value!: number | Record<string, number>;
}

export class MetaMetricDto {
    @IsString()
    name!: string;

    @IsEnum(MetaMetricPeriod)
    period!: MetaMetricPeriod;

    @IsString()
    title!: string;

    @IsString()
    description!: string;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => MetaMetricValueDto)
    values!: MetaMetricValueDto[];

    @IsString()
    id!: string;
}
```


**File:** `libs/dto/src/insights/search-keyword-summary.dto.ts`

```typescript
export class SearchKeywordSummaryDto {
    @ApiProperty({name: "count", description: "search keyword insight count"})
    count!: number;

    @ApiProperty({name: "searchKeyword", description: "search keyword"})
    searchKeyword!: string;
}
```


**File:** `libs/dto/src/insights/search-keyword-count.dto.ts`

```typescript
export class SearchKeywordCountDto {
    @ApiProperty({name: "insightsValue", description: "search keyword insights value"})
    @IsOptional()
    insightsValue?: InsightsValueDto;

    @ApiProperty({name: "searchKeyword", description: "search keyword"})
    @IsOptional()
    searchKeyword?: string | null;
}
```


**File:** `libs/dto/src/insights/insigt-value.dto.ts`

```typescript
export class InsightsValueDto {
    @ApiProperty({name: "threshold", description: "search keyword threshold"})
    @IsOptional()
    threshold?: string | null;

    @ApiProperty({name: "threshold", description: "search keyword value"})
    @IsOptional()
    value?: string | null;
}
```


**File:** `libs/dto/src/insights/search-keyword-insight-filter.dto.ts`

```typescript
export class SearchKeywordInsightFilterDto {
    @ApiProperty({name: "locations", description: "location ids", example: ["5ed0f90e0ea9f407aeff03ae"]})
    @IsMongoId({each: true})
    @IsOptional()
    locations?: string[];

    @ApiProperty({name: "brand", description: "brand id", example: ["5ed0f90e0ea9f407aeff03ae"]})
    @IsMongoId()
    @IsOptional()
    brand?: string;

    @ApiProperty({name: "startTime", description: "search keyword insight start time", example: "2021-05-04T18:00:00Z"})
    @IsDateString()
    startTime!: string;

    @ApiProperty({name: "endTime", description: "search keyword insight end time", example: "2021-05-05T18:00:00Z"})
    @IsDateString()
    endTime!: string;
}
```


**File:** `libs/dto/src/insights/search-keyword-insight-brand-report.dto.ts`

```typescript
export class SearchKeywordInsightBrandReportDto {
    @ApiProperty({name: "brandId", description: "brand id", example: "63a2c81886e536f6ffe9f0f9"})
    @IsMongoId()
    brandId!: string;

    @ApiProperty({name: "SearchKeywordSummaries", description: "search keyword count summaries"})
    searchKeywordSummaries!: SearchKeywordSummaryDto[];
}
```


**File:** `libs/dto/src/insights/search-keyword-insight-location-report.dto.ts`

```typescript
export class SearchKeywordInsightLocationReportDto {
    @ApiProperty({name: "locationId", description: "location id", example: "63a2c85b5675c080e61d2e79"})
    @IsMongoId()
    locationId!: string;

    @ApiProperty({name: "brandId", description: "brand id", example: "63a2c81886e536f6ffe9f0f9"})
    @IsMongoId()
    brandId!: string;

    @ApiProperty({name: "gbpAccountId", description: "GBP account ID", example: "104575624334406335767"})
    @IsOptional()
    gbpAccountId?: string;

    @ApiProperty({name: "gmbLocationCode", description: "GBP location code", example: "10661629727079350154"})
    gmbLocationCode!: string;

    @ApiProperty({name: "searchKeywordsCounts", description: "search keyword counts"})
    searchKeywordsCounts!: SearchKeywordCountDto[];
}
```


**File:** `libs/dto/src/insights/location-insight-trigger.dto.ts`

```typescript
export class LocationInsightTriggerDto {
    @ApiProperty({name: "brandId", description: "brand id", example: ["5ed0f90e0ea9f407aeff03ae"]})
    @IsMongoId()
    brandId!: string;

    @ApiProperty({name: "startTime", description: "insight start time", example: "2021-05-04T18:00:00Z"})
    @IsDateString()
    @IsOptional()
    startTime?: string;

    @ApiProperty({name: "endTime", description: "insight end time", example: "2021-05-05T18:00:00Z"})
    @IsDateString()
    @IsOptional()
    endTime?: string;
}
```


**File:** `libs/dto/src/insights/location-metric-summary-request.dto.ts`

```typescript
export class LocationMetricSummaryRequestDto {
    @ApiProperty({name: "brandId", description: "brand id", example: ["5ed0f90e0ea9f407aeff03ae"]})
    @IsMongoId()
    brandId!: string;

    @ApiProperty({name: "startTime", description: "insight start time", example: "2021-05-04T18:00:00Z"})
    @IsDateString()
    startTime!: string;

    @ApiProperty({name: "endTime", description: "insight end time", example: "2021-05-05T18:00:00Z"})
    @IsDateString()
    endTime!: string;
}
```


**File:** `libs/dto/src/insights/location-metric-summary-response.dto.ts`

```typescript
export class LocationMetricSummaryResponseDto {
    @ApiProperty({name: "metric", description: "daily metric", example: DailyMetricEnum})
    @IsEnum(DailyMetricEnum)
    metric!: DailyMetricEnum;

    @ApiProperty({name: "percentage", description: "percentage in data", example: 14})
    @IsNumber()
    percentage!: number;

    @ApiProperty({name: "times", description: "how many times is the data", example: 123})
    @IsNumber()
    times!: number;
}
```


**File:** `libs/dto/src/performance-report/performance-report.dto.ts`

```typescript
export class PerformanceReportDto {
    @ApiProperty({description: "Brand Id", example: "5ef1e98f03060c6e92d4f26f"})
    @IsMongoId()
    brand!: string;

    @ApiProperty({description: "S3 url of the report"})
    @IsUrl()
    report_s3_url!: string;

    @ApiProperty({description: "Month that the report covers"})
    @IsNumber()
    @Min(1)
    @Max(12)
    report_month!: number;

    @ApiProperty({description: "Year that the report covers"})
    @IsNumber()
    report_year!: number;

    @ApiProperty({name: "description", example: `{"en": "desc in english", "tr": "tr açıklama"}`})
    @IsLocalizedTextDecorator(["en"])
    description!: LocalizedTextType;

    @ApiProperty({description: "URL of the thumbnail image for the report"})
    @IsUrl()
    @IsOptional()
    thumbnail_image_url?: string;
}

export class PerformanceReportCreateDto extends OmitType(PerformanceReportDto, ["brand"]) {}
```


**File:** `libs/dto/src/query/performance-report.query.ts`

```typescript
export class PerformanceReportFilterQuery {
    @ApiProperty({description: "Year of the report", required: false, example: 2023})
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    year?: number;

    @ApiProperty({description: "Sort ascending or descending?", required: false, enum: ["asc", "desc"]})
    @IsOptional()
    @IsIn(["asc", "desc"])
    sort?: string;
}
```


**File:** `libs/dto/src/location/location-monthly-performance.dto.ts`

```typescript
class LocationReviewsResultsDto {
    @IsNumber()
    @Min(1)
    @Max(5)
    averageRating!: number;
}

export class LocationMonthlyPerformanceDto {
    @ValidateNested()
    @Type(() => SearchKeywordsResultsDto)
    searchKeywordsResults!: SearchKeywordsResultsDto;

    @ValidateNested()
    @Type(() => LocationMetricResultsDto)
    locationMetricsResults!: LocationMetricResultsDto;

    @ValidateNested()
    @Type(() => LocationReviewsResultsDto)
    locationReviewsResults!: LocationReviewsResultsDto;
}
```


**File:** `libs/dto/src/location-metric/location-metric-result.dto.ts`

```typescript
export class LocationMetricResultsDto {
    @IsInt()
    @Min(0)
    totalBusinessProfileInteractions!: number;

    @IsInt()
    @Min(0)
    totalProfileViews!: number;

    @IsInt()
    @Min(0)
    callClicks!: number;

    @IsInt()
    @Min(0)
    websiteClicks!: number;

    @IsInt()
    @Min(0)
    businessDirectionRequests!: number;

    @IsInt()
    @Min(0)
    businessImpressionsDesktopMaps!: number;

    @IsInt()
    @Min(0)
    businessImpressionsMobileMaps!: number;

    @IsInt()
    @Min(0)
    businessImpressionsDesktopSearch!: number;

    @IsInt()
    @Min(0)
    businessImpressionsMobileSearch!: number;

    @IsNumber()
    totalInteractionsChangePercentage!: number;

    @IsNumber()
    callClicksChangePercentage!: number;

    @IsNumber()
    websiteClicksChangePercentage!: number;

    @IsNumber()
    businessDirectionRequestsChangePercentage!: number;
}
```


**File:** `libs/dto/src/location-metric/top-location-metric-result.dto.ts`

```typescript
export class TopLocationMetricResultsDto extends OmitType(LocationMetricResultsDto, [...]) {
    @ApiProperty({description: "Location identifier", example: "5ef1e9a1afd745cddc851449"})
    @IsMongoId()
    locationId!: string | Types.ObjectId;

    @ApiProperty({description: "Location details", type: TopLocationDetailsDto})
    @ValidateNested()
    @Type(() => TopLocationDetailsDto)
    location!: TopLocationDetailsDto;

    @IsInt()
    @Min(0)
    visits!: number;

    @IsNumber()
    visitsChangePercentage!: number;

    @IsInt()
    @Min(0)
    totalConversions!: number;

    @IsNumber()
    totalConversionsChangePercentage!: number;

    @IsInt()
    @Min(0)
    purchases!: number;

    @IsNumber()
    purchasesChangePercentage!: number;

    @IsInt()
    @Min(0)
    visitsPerPurchase!: number;

    @IsNumber()
    visitsPerPurchaseChangePercentage!: number;
}
```


**File:** `libs/dto/src/location-metric/top-location-query.dto.ts`

```typescript
export class TopLocationsQueryDto extends OverviewDateQueryDto {
    @ApiProperty({description: "Sort using which field?", required: false})
    @IsOptional()
    @IsString()
    sortField?: string;

    @ApiProperty({description: "Sort ascending or descending?", required: false, enum: ["asc", "desc"]})
    @IsOptional()
    @IsIn(["asc", "desc"])
    sort?: string;
}
```


**File:** `libs/dto/src/location-reviews/review-stats-response.dto.ts`

```typescript
export class MetricWithChange {
    @ApiProperty({description: "Current metric value", required: true})
    @IsNumber()
    current!: number;

    @ApiProperty({description: "Change metric value", required: true})
    @IsNumber()
    change?: number;

    @ApiProperty({description: "Change percentage metric value", required: true})
    @IsNumber()
    changePercentage?: number;
}

export class SentimentPercentageDto {
    @ApiProperty({description: "Positive sentiment percentage", required: true, type: MetricWithChange})
    @ValidateNested()
    @Type(() => MetricWithChange)
    positive!: MetricWithChange;

    @ApiProperty({description: "Neutral sentiment percentage", required: true, type: MetricWithChange})
    @ValidateNested()
    @Type(() => MetricWithChange)
    neutral!: MetricWithChange;

    @ApiProperty({description: "Negative sentiment percentage", required: true, type: MetricWithChange})
    @ValidateNested()
    @Type(() => MetricWithChange)
    negative!: MetricWithChange;
}

export class RatingBreakdownDto {
    @ApiProperty({description: "By 1 star rating", required: true, type: MetricWithChange})
    @ValidateNested()
    @Type(() => MetricWithChange)
    one!: MetricWithChange;

    @ApiProperty({description: "By 2 star rating", required: true, type: MetricWithChange})
    @ValidateNested()
    @Type(() => MetricWithChange)
    two!: MetricWithChange;

    @ApiProperty({description: "By 3 star rating", required: true, type: MetricWithChange})
    @ValidateNested()
    @Type(() => MetricWithChange)
    three!: MetricWithChange;

    @ApiProperty({description: "By 4 star rating", required: true, type: MetricWithChange})
    @ValidateNested()
    @Type(() => MetricWithChange)
    four!: MetricWithChange;

    @ApiProperty({description: "By 5 star rating", required: true, type: MetricWithChange})
    @ValidateNested()
    @Type(() => MetricWithChange)
    five!: MetricWithChange;

    @ApiProperty({description: "By all rating", required: true, type: MetricWithChange})
    @ValidateNested()
    @Type(() => MetricWithChange)
    all!: MetricWithChange;
}

export class LocationReviewStatsResponseDto {
    @ApiProperty({description: "Total number of reviews for all locations", required: true})
    @IsNumber()
    totalReviews!: number;

    @ApiProperty({description: "Average Rating of all reviews", required: true})
    @IsNumber()
    averageRating!: number;

    @ApiProperty({description: "Total one star ratings count.", required: true, default: 0})
    @IsNumber()
    oneStarCount!: number;

    @ApiProperty({description: "Total two stars ratings count.", required: true, default: 0})
    @IsNumber()
    twoStarsCount!: number;

    @ApiProperty({description: "Total three stars ratings count.", required: true, default: 0})
    @IsNumber()
    threeStarsCount!: number;

    @ApiProperty({description: "Total four stars ratings count.", required: true, default: 0})
    @IsNumber()
    fourStarsCount!: number;

    @ApiProperty({description: "Total five stars ratings count.", required: true, default: 0})
    @IsNumber()
    fiveStarsCount!: number;

    @ApiProperty({description: "Ai sentiment.", required: true, default: "no_data"})
    @IsString()
    sentiment!: ReviewSentimentEnum;

    @ApiProperty({description: "Locations", required: true, type: () => [LocationReviewOverviewDto]})
    @IsArray()
    @ValidateNested()
    @Type(() => LocationReviewOverviewDto)
    locationReviewOverviews!: LocationReviewOverviewDto[];

    @ApiProperty({description: "Pagination metadata", required: false, type: PaginationMetadata})
    @IsOptional()
    @ValidateNested()
    @Type(() => PaginationMetadata)
    pagination?: PaginationMetadata;
}

export class OverallReviewStatsResponseDto {
    @ApiProperty({description: "Average Rating of all reviews", required: true, type: MetricWithChange})
    @ValidateNested()
    @Type(() => MetricWithChange)
    averageRating!: MetricWithChange;

    @ApiProperty({description: "Review counts by rating.", required: true, type: RatingBreakdownDto})
    @ValidateNested()
    @Type(() => RatingBreakdownDto)
    reviewCounts!: RatingBreakdownDto;

    @ApiProperty({description: "Unanswered reviews count.", required: true, type: RatingBreakdownDto})
    @ValidateNested()
    @Type(() => RatingBreakdownDto)
    unansweredReviewCounts!: RatingBreakdownDto;

    @ApiProperty({description: "Reply rate of reviews.", required: true, type: RatingBreakdownDto})
    @ValidateNested()
    @Type(() => RatingBreakdownDto)
    replyRates!: RatingBreakdownDto;

    @ApiProperty({description: "Ai sentiment.", required: true, type: SentimentPercentageDto})
    @ValidateNested()
    @Type(() => SentimentPercentageDto)
    sentimentPercentages!: SentimentPercentageDto;
}
```


**File:** `libs/dto/src/location-reviews/location-review-overview.dto.ts`

```typescript
export class TopThemeDto {
    @ApiProperty({description: "The category name of the theme", example: "service"})
    @IsString()
    category!: string;

    @ApiProperty({description: "Number of times this theme appears in reviews", example: 25})
    @IsNumber()
    @Min(1)
    count!: number;

    @ApiProperty({description: "Sentiment classification of the theme", enum: ["positive", "negative"], example: "positive"})
    @IsString()
    @IsIn(["positive", "negative"])
    sentiment!: "positive" | "negative";
}

export class LocationOverviewForMapDto {
    @ApiProperty({description: "Location Id", example: "5ef1e98f03060c6e92d4f26f"})
    @IsMongoId()
    _id!: string;

    @ApiProperty({description: "Name of the location", required: true})
    @IsString()
    location_name!: string;

    @ApiProperty({description: "Store code of the location", required: true})
    @IsString()
    store_code!: string;

    @ApiProperty({description: "Address of the location", required: true, type: () => AddressDto})
    @ValidateNested()
    @Type(() => AddressDto)
    address!: AddressDto;
}

export class LocationReviewOverviewDto {
    @ApiProperty({description: "Location overview info", required: true, type: () => LocationOverviewForMapDto})
    @ValidateNested()
    @Type(() => LocationOverviewForMapDto)
    location!: LocationOverviewForMapDto;

    @ApiProperty({description: "Average rating number for the location.", required: false})
    @IsNumber()
    @Min(1)
    @Max(5)
    averageRating!: number;

    @ApiProperty({description: "Total review count.", required: false})
    @IsNumber()
    totalReviewCount!: number;

    @ApiProperty({description: "Total one star ratings count.", required: true, default: 0})
    @IsNumber()
    oneStarCount!: number;

    @ApiProperty({description: "Total two stars ratings count.", required: true, default: 0})
    @IsNumber()
    twoStarsCount!: number;

    @ApiProperty({description: "Total three stars ratings count.", required: true, default: 0})
    @IsNumber()
    threeStarsCount!: number;

    @ApiProperty({description: "Total four stars ratings count.", required: true, default: 0})
    @IsNumber()
    fourStarsCount!: number;

    @ApiProperty({description: "Total five stars ratings count.", required: true, default: 0})
    @IsNumber()
    fiveStarsCount!: number;

    @ApiProperty({description: "Reply rate of location.", required: true, default: 0})
    @IsNumber()
    replyRate!: number;

    @ApiProperty({description: "Ai sentiment.", required: true, default: "no_data"})
    @IsString()
    sentiment!: ReviewSentimentEnum;

    @ApiProperty({description: "Top themes from review analysis with Bayesian scoring.", required: false, type: () => [TopThemeDto]})
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => TopThemeDto)
    topThemes?: TopThemeDto[];
}

export class LocationReviewOverviewGraphDto {
    @ApiProperty({description: "Total one star ratings count.", required: true, default: 0})
    @IsNumber()
    oneStarCount!: number;

    @ApiProperty({description: "Total two stars ratings count.", required: true, default: 0})
    @IsNumber()
    twoStarsCount!: number;

    @ApiProperty({description: "Total three stars ratings count.", required: true, default: 0})
    @IsNumber()
    threeStarsCount!: number;

    @ApiProperty({description: "Total four stars ratings count.", required: true, default: 0})
    @IsNumber()
    fourStarsCount!: number;

    @ApiProperty({description: "Total five stars ratings count.", required: true, default: 0})
    @IsNumber()
    fiveStarsCount!: number;

    @ApiProperty({description: "Total review count.", required: false})
    @IsNumber()
    totalReviewCount!: number;

    @ApiProperty({description: "Avrage rating number for the location.", required: false})
    @IsNumber()
    @Min(1)
    @Max(5)
    averageRating!: number;

    @ApiProperty({description: "Reply rate.", required: false})
    @IsNumber()
    replyRate!: number;

    @ApiProperty({description: "Negative reviews' reply rate.", required: false})
    @IsNumber()
    replyRateNegative!: number;

    @ApiProperty({description: "Positive reviews' reply rate.", required: false})
    @IsNumber()
    replyRatePositive!: number;

    @ApiProperty({description: "Neutral reviews' reply rate.", required: false})
    @IsNumber()
    replyRateNeutral!: number;

    @IsDateString()
    createTime!: string;
}

export class LocationReviewAnalysisDto {
    @IsArray()
    data!: LocationReviewOverviewGraphDto[];

    @IsObject()
    summary?: {
        averageRating: number;
        totalReviewCount: number;
        oneStarCount: number;
        twoStarsCount: number;
        threeStarsCount: number;
        fourStarsCount: number;
        fiveStarsCount: number;
        replyRateAvg?: number;
    };
}

export class LocationReviewAnalyticsDto {
    @ApiProperty({description: "The ID of the brand this data belongs to.", required: true})
    @IsMongoId()
    brandId!: string;

    @ApiProperty({description: "The ID of the location this data is specific to.", required: true})
    @IsMongoId()
    locationId!: string;

    @ApiProperty({description: "Average reply time for the location.", required: false})
    @IsNumber()
    @Min(0)
    averageReplyTime!: number;

    @ApiProperty({description: "Reply rate for the location.", required: false})
    @IsNumber()
    @Min(0)
    @Max(100)
    replyRate!: number;

    @ApiProperty({description: "The timestamp when this data was last updated.", required: true})
    @IsDate()
    @Type(() => Date)
    updatedAt!: Date;
}
```


**File:** `libs/dto/src/location-reviews/location-review-leaderboard-response.dto.ts`

```typescript
export class LocationReviewLeaderboardResponseDto {
    @ApiProperty({description: "Top performing locations based on review metrics", required: true, type: () => [LocationReviewOverviewDto]})
    @IsArray()
    @ValidateNested()
    @Type(() => LocationReviewOverviewDto)
    @IsOptional()
    top?: LocationReviewOverviewDto[];

    @ApiProperty({description: "Bottom performing locations based on review metrics", required: true, type: () => [LocationReviewOverviewDto]})
    @IsArray()
    @ValidateNested()
    @Type(() => LocationReviewOverviewDto)
    @IsOptional()
    bottom?: LocationReviewOverviewDto[];
}
```


**File:** `libs/dto/src/location-reviews/review-status-time-series.dto.ts`

```typescript
export class ReviewStatusTimeSeriesDto {
    @ApiProperty({description: "Brand Id", example: "5ef1e98f03060c6e92d4f26f"})
    @IsMongoId()
    brand!: string;

    @ApiProperty({description: "Average rating number for the brand.", required: true})
    @IsNumber()
    @Min(1)
    @Max(5)
    averageRating!: number;

    @ApiProperty({description: "Total answered reviews.", required: true})
    @IsNumber()
    @Min(0)
    answeredCount!: number;

    @ApiProperty({description: "Total answered reviews.", required: true})
    @IsNumber()
    @Min(0)
    unansweredCount!: number;

    @ApiProperty({description: "year", required: true})
    @IsNumber()
    @Min(0)
    year!: number;

    @ApiProperty({description: "month", required: true})
    @IsNumber()
    @Min(1)
    @Max(12)
    month!: number;

    @ApiProperty({description: "day", required: true})
    @IsNumber()
    @Min(1)
    @Max(31)
    day!: number;
}
```


**File:** `libs/dto/src/brand/brand-monthly-performance.dto.ts`

```typescript
export class BrandMonthlyPerformanceDto {
    businessProfileInteractions!: BusinessProfileInteractionsDto;
    peopleViewedYourBusinessProfile!: PeopleViewedYourBusinessProfileDto;
    searchKeywords!: SearchKeywordsDto;
}
```


**File:** `libs/dto/src/conversion/geographic-metrics-query.dto.ts`

```typescript
export class GeographicMetricsQueryDto extends OverviewDateQueryDto {
    @ApiProperty({description: "Level of geographic breakdown", required: true, enum: ["WORLD", "TURKEY"]})
    @IsIn(["WORLD", "TURKEY"])
    level!: "WORLD" | "TURKEY";

    @ApiProperty({description: "Sort using which field?", required: false})
    @IsOptional()
    @IsString()
    sortField?: string;

    @ApiProperty({description: "Sort ascending or descending?", required: false, enum: ["asc", "desc"]})
    @IsOptional()
    @IsIn(["asc", "desc"])
    sort?: "asc" | "desc";

    @ApiProperty({description: "Number of items per page", required: false})
    @IsOptional()
    @IsNumber()
    pageSize?: number;

    @ApiProperty({description: "Page number (1-based) (Google Ads API)", required: false})
    @IsOptional()
    @IsNumber()
    pageCount?: number;

    @ApiProperty({description: "Cursor for pagination (Meta API)", required: false})
    @IsOptional()
    @IsString()
    cursor?: string;

    @ApiProperty({description: "Pagination direction (Meta API)", required: false, enum: ["next", "previous"]})
    @IsOptional()
    @IsIn(["next", "previous"])
    direction?: "next" | "previous";

    @ApiProperty({description: "Campaign IDs to filter by", required: false})
    @IsArray()
    @IsString({each: true})
    @IsOptional()
    campaigns?: string[];

    @ApiProperty({description: "Campaign types to filter by (not available for Meta API)", required: false})
    @IsArray()
    @IsString({each: true})
    @IsOptional()
    campaignTypes?: string[];
}
```


**File:** `libs/dto/src/conversion/geographic-metrics-response.dto.ts`

```typescript
export class GeographicMetricsResponseDto {
    @ApiProperty({description: "List of geographic metrics", type: [GeographicMetricsResultDto]})
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => GeographicMetricsResultDto)
    data!: GeographicMetricsResultDto[];

    @ApiProperty({description: "Pagination information", type: PaginationInfo, required: false})
    @IsOptional()
    @ValidateNested()
    @Type(() => PaginationInfo)
    pagination?: PaginationInfo;
}
```


**File:** `libs/dto/src/conversion/geographic-metrics-result.dto.ts`

```typescript
export class GeographicMetricsResultDto {
    @IsString()
    level!: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    iso!: string;

    @IsInt()
    @Min(0)
    impressions!: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    clickToVisitRate?: number;

    @IsNumber()
    @Min(0)
    spend!: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    visits?: number;

    @IsInt()
    @Min(0)
    clicks!: number;

    @IsNumber()
    @Min(0)
    offlinePurchases!: number;

    @IsNumber()
    @Min(0)
    offlineRevenue!: number;

    @IsNumber()
    @Min(0)
    offlineRoas!: number;
}
```


**File:** `libs/dto/src/conversion/coversions-overview.dto.ts`

```typescript
export class ConversionsOverview {
    @IsNumber()
    aov!: number;

    @IsNumber()
    total!: number;

    @IsNumber()
    totalTransactions!: number;
}
```


**File:** `libs/dto/src/sales-data/store-sale-statistic.dto.ts`

```typescript
export class StoreSaleBrandStatisticDto {
    @ApiProperty({name: "aov", description: "Brand average order value amount"})
    @IsNumber()
    @IsInt()
    @IsPositive()
    aov!: number;

    @ApiProperty({name: "totalValue", description: "Brand total value amount"})
    @IsNumber()
    @IsInt()
    @IsPositive()
    totalValue!: number;

    @ApiProperty({name: "totalTransaction", description: "Brand total transaction amount"})
    @IsNumber()
    @IsInt()
    @IsPositive()
    totalTransactions!: number;

    @ApiProperty({name: "totalFile", description: "Brand total file count"})
    @IsNumber()
    @IsInt()
    @IsPositive()
    totalFile!: number;

    @ApiProperty({description: "File store sale statistic", required: true, type: () => [StoreSaleFileStatisticDto]})
    @IsArray()
    @ValidateNested()
    @Type(() => StoreSaleFileStatisticDto)
    fileStatistic!: StoreSaleFileStatisticDto[];
}
```


### Enums & Constants

**File:** `libs/constants/src/business-listing-api/daily-metrics.ts`

```typescript
export enum DailyMetricEnum {
    BUSINESS_IMPRESSIONS_DESKTOP_MAPS = "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
    BUSINESS_IMPRESSIONS_DESKTOP_SEARCH = "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
    BUSINESS_IMPRESSIONS_MOBILE_MAPS = "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
    BUSINESS_IMPRESSIONS_MOBILE_SEARCH = "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
    BUSINESS_CONVERSATIONS = "BUSINESS_CONVERSATIONS",
    BUSINESS_DIRECTION_REQUESTS = "BUSINESS_DIRECTION_REQUESTS",
    CALL_CLICKS = "CALL_CLICKS",
    WEBSITE_CLICKS = "WEBSITE_CLICKS",
    BUSINESS_BOOKINGS = "BUSINESS_BOOKINGS",
    BUSINESS_FOOD_ORDERS = "BUSINESS_FOOD_ORDERS",
    BUSINESS_FOOD_MENU_CLICKS = "BUSINESS_FOOD_MENU_CLICKS",
}

export enum DailyMetricMultipleEnum {
    BUSINESS_INTERACTIONS = "BUSINESS_INTERACTIONS",
}

export const DailyMetricVenueX = {
    ...DailyMetricEnum,
    ...DailyMetricMultipleEnum,
};
export type DailyMetricVenueX = DailyMetricEnum | DailyMetricMultipleEnum;

export const DailyMetricValues = Object.values(DailyMetricEnum) as DailyMetricEnum[];
export const DailyMetricVenueXValues = Object.values(DailyMetricVenueX) as DailyMetricVenueX[];
```


**File:** `libs/constants/src/insights/insight-date-range.ts`

```typescript
export enum InsightDateRange {
    Daily = "DAILY",
    Weekly = "WEEKLY",
    Monthly = "MONTHLY",
}
```


**File:** `libs/constants/src/insights/apple-metrics.ts`

```typescript
export enum AppleInsightResourceType {
    LOCATION = "LOCATION",
    SHOWCASE = "SHOWCASE",
}

export enum AppleInsightTimeGranularity {
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
}

export enum AppleInsightReportState {
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    PROCESSING = "PROCESSING",
}

export const AppleMetricNames = {
    // 80+ metric names including PLACECARD_*, SEARCH_*, SHOWCASE_*, SIMILAR_*, SPATIAL_*
}

export const AppleSpecialReportNames = {
    SIMILAR_COMBINED: "SIMILAR_COMBINED",
    PLACECARD_COMBINED: "PLACECARD_COMBINED",
    SEARCH_LOCATION_TAP_COMBINED: "SEARCH_LOCATION_TAP_COMBINED",
    PLACECARD_SEARCH_COMBINED: "PLACECARD_SEARCH_COMBINED",
}

export const AppleReportNames = {
    ...AppleMetricNames,
    ...AppleSpecialReportNames,
}

export type AppleMetricName = keyof typeof AppleMetricNames;
export type AppleReportName = keyof typeof AppleReportNames;
```


**File:** `libs/constants/src/insights/meta-parameters.ts`

```typescript
export enum MetaMetricPeriod {
    Day = "day",
    Week = "week",
    Days28 = "days_28",
    Month = "month",
    Lifetime = "lifetime",
}

export enum MetaMetricDatePreset {
    Today = "today",
    Yesterday = "yesterday",
    ThisMonth = "this_month",
    LastMonth = "last_month",
    ThisQuarter = "this_quarter",
    Maximum = "maximum",
    DataMaximum = "data_maximum",
    Last3d = "last_3d",
    Last7d = "last_7d",
    Last14d = "last_14d",
    Last28d = "last_28d",
    Last30d = "last_30d",
    Last90d = "last_90d",
    LastWeekMonSun = "last_week_mon_sun",
    LastWeekSunSat = "last_week_sun_sat",
    LastQuarter = "last_quarter",
    LastYear = "last_year",
    ThisWeekMonToday = "this_week_mon_today",
    ThisWeekSunToday = "this_week_sun_today",
    ThisYear = "this_year",
}

export enum MetaMetricCategory {
    PageContent = "Page Content",
    PageCtaClicks = "Page Cta Clicks",
    PageEngagement = "Page Engagement",
    PageImpressions = "Page Impressions",
    PagePosts = "Page Posts",
    PagePostEngagement = "Page Post Engagement",
    PagePostImpressions = "Page Post Impressions",
    PagePostReactions = "Page Post Reactions",
    PageReactions = "Page Reactions",
    PageUserDemographics = "Page User Demographics",
    PageVideoViews = "Page Video Views",
    PageViews = "Page Views",
    PageVideoPosts = "Page Video Posts",
    Stories = "Stories",
    VideoAdBreaks = "Video Ad Breaks",
    ContentMonetization = "Content Monetization",
    MonetizationApproximateEarnings = "Monetization Approximate Earnings",
}
```


**File:** `libs/constants/src/location/location-review.ts`

```typescript
export enum ReviewSourceEnum {
    GOOGLE = "Google",
    APPLE = "Apple",
    META = "Meta",
    TIKTOK = "Tiktok",
}
```


**File:** `libs/constants/src/location/location-review.ts`

```typescript
export enum ReviewStatusEnum {
    ANSWERED = "ANSWERED",
    UNANSWERED = "UNANSWERED",
}
```


**File:** `libs/constants/src/location/location-review.ts`

```typescript
export enum ReviewSentimentEnum {
    NO_DATA = "no_sentiment_data",
    ALL = "all_sentiments",
    POSITIVE = "positive_sentiment",
    NEGATIVE = "negative_sentiment",
    NEUTRAL = "neutral_sentiment",
}
```


**File:** `libs/constants/src/location-review-analysis/location-review-analysis-status.ts`

```typescript
export enum ReviewAnalysisLogStatus {
    INITIAL = "INITIAL",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
}

export enum ReviewAnalysisType {
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    THREE_MONTHLY = "3_MONTHLY",
    ALL_TIME = "ALL_TIME",
    CUSTOM = "CUSTOM",
}
```


**File:** `libs/constants/src/location/location-review.ts`

```typescript
export enum StarRatingEnum {
    unspecified = "STAR_RATING_UNSPECIFIED",
    one = "ONE",
    two = "TWO",
    three = "THREE",
    four = "FOUR",
    five = "FIVE",
}
```


**File:** `libs/constants/src/dashboard.ts`

```typescript
export enum DashboardDateSelectionEnum {
    LAST_SEVEN_DAYS = "last_7_days",
    LAST_THIRTY_DAYS = "last_30_days",
    LAST_NINETY_DAYS = "last_90_days",
    LAST_TWELVE_MONTHS = "last_12_months",
}
```


**File:** `libs/constants/src/location/location-review.ts`

```typescript
export enum ReviewDateRangeSelectionEnum {
    ONE_DAY = "One Day",
    ONE_WEEK = "One Week",
    TWO_WEEKS = "Two Weeks",
    ONE_MONTH = "One Month",
    THREE_MONTHS = "Three Months",
    LAST_MONTH = "Last Month",
    LAST_THREE_MONTHS = "Last 3 Months",
    CUSTOM = "Custom",
}
```


**File:** `libs/constants/src/location/location-review.ts`

```typescript
export type ReviewAnalysisPeriod = "daily" | "weekly" | "bi-weekly" | "monthly" | "quarterly" | "all-time" | "custom";
```


### Interfaces & Types

**File:** `libs/interfaces/src/insights/insight-metric-result.ts`

```typescript
export interface InsightMetricResult {
    seriesData: InsightChartSeriesData[];
}
```


**File:** `libs/interfaces/src/insights/daily-metric-time-series.ts`

```typescript
export interface IDailyMetricTimeSeries {
    location: string;
    metric: DailyMetricEnum;
    timeSeries: ITimeSeries;
    startDate: IInsightDate;
    endDate: IInsightDate;
}
```


**File:** `libs/interfaces/src/insights/monthly-metric-time-series.ts`

```typescript
export interface IMonthlyMetricTimeSeries {
    location: string;
    metric: DailyMetricEnum;
    timeSeries: IIMonthlyInsightValues;
    startDate: IMonthlyInsightDate;
    endDate: IMonthlyInsightDate;
}
```


**File:** `libs/interfaces/src/insights/apple-metric.types.ts`

```typescript
export interface AppleInsightGetAsyncReportResponse {
    companyId: string;
    id: string;
    createdDate: string;
    expiryDate: string;
    state: AppleInsightReportState;
    request: AppleInsightReportRequestWithTimezone;
}

export interface AppleInsightGetAsyncReportResponseList {
    data: AppleInsightGetAsyncReportResponse[];
}

export interface AppleInsightGetAsyncReportByIdResponse {
    companyId: string;
    id: string;
    createdDate: string;
    expiryDate: string;
    state: AppleInsightReportState;
    request: AppleInsightReportRequestWithTimezone;
    meta: AppleInsightReportMeta;
    data: {tuples: AppleInsightReportDataTuple[]};
}

export interface AppleInsightGetReportQueryParams {
    id?: string;
    state?: AppleInsightReportState;
    createdDate?: string;
}

export interface AppleInsightQuickReportResponse {
    companyId: string;
    request: AppleInsightReportRequestWithTimezone;
    meta: AppleInsightReportMeta;
    data: {tuples: AppleInsightReportDataTuple[]};
}

export interface AppleInsightReportRequest {
    resourceType: AppleInsightResourceType;
    resourceId: string;
    reportName: AppleReportName;
    startDate: string;
    endDate: string;
    useLocalTime: boolean;
    timeGranularity: AppleInsightTimeGranularity;
}

export interface AppleInsightReportRequestWithTimezone extends AppleInsightReportRequest {
    timezone: string;
}

export interface AppleInsightReportMeta {
    dimensions: {
        name: string;
        attributes: {name: string; type: AppleMetricValueType}[];
    }[];
    metrics: {name: AppleMetricName; type: AppleMetricValueType}[];
}

export interface AppleInsightReportDataTuple {
    dimensions: string[];
    metrics: string[];
}
```


**File:** `libs/interfaces/src/insights/meta-metric.types.ts`

```typescript
export type MetaMetricValue = number | Record<string, number>;

export interface MetaMetricDataPoint {
    end_time: string;
    value: MetaMetricValue;
}

export interface MetaMetricBlockRaw {
    id: string;
    name: string;
    title: string;
    description: string;
    period: MetaMetricPeriod;
    values: MetaMetricDataPoint[];
}

export interface MetaMetricBlockFlattened {
    id: string;
    name: string;
    period: MetaMetricPeriod;
    end_time: Date;
    value: MetaMetricValue;
}

export interface MetaMetricMetadata {
    name: string;
    period: MetaMetricPeriod;
    title: string;
    description: string;
    valueType?: "number" | "object";
    expectedKeys?: string[];
}

export interface MetaInsightsRequestParams {
    metric: string;
    access_token: string;
    period?: MetaMetricPeriod;
    date_preset?: MetaMetricDatePreset;
    since?: string;
    until?: string;
}
```


### Validation Schemas

_No definitions found in this category._

---

## Shared Enums & Constants

### Database Models

_No definitions found in this category._

### DTOs

_No definitions found in this category._

### Enums & Constants

**File:** `libs/constants/src/acl/role-enum.ts`

```typescript
export enum LegacyRoleEnum {
    VENUEX_SUPER_USER = "VENUEX_SUPER_USER",
    OWNER = "OWNER",
    MEMBER = "MEMBER",
    BRAND_ADMIN = "BRAND_ADMIN",
    ORGANIZATION_ADMIN = "ORGANIZATION_ADMIN",
    VENUE_GROUP_ADMIN = "VENUE_GROUP_ADMIN",
    VENUE_ADMIN = "VENUE_ADMIN",
    MAP_ADMIN = "MAP_ADMIN",
    LOCATION_ADMIN = "LOCATION_ADMIN",
    LOCATION_TEAM_MEMBER = "LOCATION_TEAM_MEMBER",
    STORE_ADMIN = "STORE_ADMIN",
    LISTING_MANAGER = "LISTING_MANAGER",
    MAP_VIEWER = "MAP_VIEWER",
    STORE_WIDGET_VIEWER = "STORE_WIDGET_VIEWER",
}

export enum UserRoleEnum {
    VENUEX_SUPER_USER = "VENUEX_SUPER_USER",
    COMPANY_OWNER = "COMPANY_OWNER",
    BRAND_OWNER = "BRAND_OWNER",
    BRAND_MANAGER = "BRAND_MANAGER",
    BRAND_MEMBER = "BRAND_MEMBER",
    STORE_WIDGET_VIEWER = "STORE_WIDGET_VIEWER",
    DEMO_USER = "DEMO_USER",
    CUSTOMER_RELATIONS = "CUSTOMER_RELATIONS",
}

export enum ApiRoleEnum {
    LOCAL_INVENTORY_MANAGER = "LOCAL_INVENTORY_MANAGER",
}

export const RoleEnum = {...LegacyRoleEnum, ...UserRoleEnum, ...ApiRoleEnum};
export type RoleEnum = LegacyRoleEnum | UserRoleEnum | ApiRoleEnum;
export const Roles = Object.values(RoleEnum) as RoleEnum[];
```


**File:** `libs/constants/src/acl/models/action.enum.ts`

```typescript
export enum Action {
    can = "can",
    cannot = "cannot",
}
```


**File:** `libs/constants/src/acl/models/permission.enum.ts`

```typescript
export enum Permission {
    create = "create",
    read = "read",
    update = "update",
    delete = "delete",
    manage = "manage",
}
```


**File:** `libs/constants/src/acl/models/attachable.enum.ts`

```typescript
export enum Attachable {
    Brand = "Brand",
    Organization = "Organization",
    Venue = "Venue",
    VenueGroup = "VenueGroup",
    Location = "Location",
    Company = "Company",
}

export const AttachableTypes = Object.values(Attachable) as Attachable[];
```


**File:** `libs/constants/src/acl/models/possession.enum.ts`

```typescript
export enum Possession {
    own = "own",
    all = "all",
}

export const PossessionTypes = Object.values(Possession) as Possession[];
```


**File:** `libs/constants/src/acl/models/status-attachable.enum.ts`

```typescript
export enum StatusAttachable {
    ProductVariant = "ProductVariant",
    Inventory = "Inventory",
}
```


**File:** `libs/constants/src/acl/models/role-owner.enum.ts`

```typescript
export enum RoleOwner {
    User = "User",
    ApiKey = "ApiKey",
}

export const RoleOwnerTypes = Object.values(RoleOwner) as RoleOwner[];
```


**File:** `libs/constants/src/provider.ts`

```typescript
export enum Provider {
    Google = "google",
    Meta = "meta",
    TikTok = "tiktok",
    Apple = "apple",
    Yandex = "yandex",
}

export const ProviderList = Object.values(Provider) as Provider[];
```


**File:** `libs/constants/src/providers.ts`

```typescript
export enum ProviderServiceCategory {
    product = "Product",
    listing = "Listing",
}

export enum LocationProviderEnum {
    google_my_business = "google-my-business",
    shopify = "shopify",
    togg_location = "togg-location",
    meta_graph_api_pages = "meta-graph-api-pages",
    yandex_business = "yandex-business",
    apple_business_connect = "apple-business-connect",
}

export enum ProductProviderEnum {
    google_content_api_product = "google-content-api-product",
    google_content_api_inventory = "google-content-api-inventory",
    google_content_api = "google-content-api",
    shopify = "shopify",
    nebim = "nebim",
    togg_product = "togg-product",
    meta_graph_api_catalog = "meta-graph-api-catalog",
}

export enum ConversionProviderEnum {
    google_ads = "google-ads",
    tiktok_business = "tiktok-business",
    meta_conversions = "meta-conversions",
}

export enum ItemStatusProviderEnum {
    VENUEX = "VENUEX",
    GOOGLE = "GOOGLE",
    TOGG = "TOGG",
}

export const ProviderEnum = {...LocationProviderEnum, ...ProductProviderEnum, ...ConversionProviderEnum};
export type ProviderEnum = LocationProviderEnum | ProductProviderEnum | ConversionProviderEnum;
export const Providers = Object.values(ProviderEnum) as ProviderEnum[];
```


**File:** `libs/constants/src/platforms.ts`

```typescript
export enum Platforms {
    STOREFRONT = "STOREFRONT",
    VMS = "VMS",
}
```


**File:** `libs/constants/src/location/location-status.ts`

```typescript
export enum LocationStatusEnum {
    OPEN = "open",
    CLOSED_TEMPORARILY = "closed_temporarily",
    CLOSED_PERMANENTLY = "closed_permanently",
}

export const LocationStatusValues = Object.values(LocationStatusEnum) as LocationStatusEnum[];
```


**File:** `libs/constants/src/location/store-status.ts`

```typescript
export enum GmbLocationStateEnum {
    VERIFIED = "VERIFIED",
    DUPLICATED = "DUPLICATED",
    OTHER = "OTHER",
    AUTO_METHOD_NOT_EXIST = "AUTO_METHOD_NOT_EXIST",
    HAS_VERIFICATION_STARTED = "HAS_VERIFICATION_STARTED",
    HAS_NOT_GMB_LOCATION_CODE = "HAS_NOT_GMB_LOCATION_CODE",
    SUSPENDED = "SUSPENDED",
    VERIFICATION_REQUIRED = "VERIFICATION_REQUIRED",
}

export enum StoreVerificationStatus {
    VERIFIED = "VERIFIED",
    UNVERIFIED = "UNVERIFIED",
    DUPLICATED = "DUPLICATED",
    SUSPENDED = "SUSPENDED",
    DISABLED = "DISABLED",
    UNKNOWN = "UNKNOWN",
}

export enum StoreListingStatus {
    LISTED = "LISTED",
    UNLISTED = "UNLISTED",
    UPDATE_REQUEST_IN_QUEUE = "UPDATE_REQUEST_IN_QUEUE",
    UPDATE_REQUEST_SENT_TO_PLATFORM = "UPDATE_REQUEST_SENT_TO_PLATFORM",
}

export const SupportedStorePlatforms = {
    google: "google",
    meta: "meta",
    apple: "apple",
    yandex: "yandex",
    togg: "togg",
} as const;
```


**File:** `libs/constants/src/location-sync.ts`

```typescript
export enum LocationSyncStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}

export enum LocationMatchStatus {
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
}

export enum LocationSyncPlatform {
    META = "meta",
    APPLE = "apple",
}
```


**File:** `libs/constants/src/location-source-enum.ts`

```typescript
enum LocationSourceVenuexApi {
    venuex_api = "venuex-api",
}

export const LocationSource = {...LocationProviderEnum, ...LocationSourceVenuexApi};
export type LocationSource = LocationProviderEnum | LocationSourceVenuexApi;
export const LocationSources = Object.values(LocationSource) as LocationSource[];
```


**File:** `libs/constants/src/import/location-conflict.enum.ts`

```typescript
export enum LocationConflictTypeEnum {
    ONLY_IN_VX = "only_in_vx",
    ONLY_IN_GOOGLE = "only_in_google",
    ID_MISMATCH = "id_mismatch",
    DUPLICATE_LOCATION = "duplicate_location",
    ACCOUNT_MISMATCH = "account_mismatch",
}

export enum LocationConflictStatusEnum {
    PENDING = "pending",
    RESOLVED = "resolved",
    SKIPPED = "skipped",
}

export enum LocationConflictActionEnum {
    ADD_TO_GOOGLE = "add_to_google",
    DELETE_VX = "delete_vx",
    DELETE_GOOGLE = "delete_google",
    ADD_TO_VX = "add_to_vx",
    USE_GOOGLE_ID = "use_google_id",
    USE_ORIGINAL_GOOGLE_ID = "use_original_google_id",
    USE_DUPLICATE_GOOGLE_ID = "use_duplicate_google_id",
    ADD_ORIGINAL_TO_VX = "add_original_to_vx",
    ADD_DUPLICATE_TO_VX = "add_duplicate_to_vx",
    DELETE_BOTH_GOOGLE = "delete_both_google",
    SKIP = "skip",
}
```


**File:** `libs/constants/src/import/location-diff-status.enum.ts`

```typescript
export enum LocationDiffStatusEnum {
    CREATED = "CREATED",
    UPDATED = "UPDATED",
    DELETED = "DELETED",
    TEMPORARILY_CLOSED = "TEMPORARILY_CLOSED",
}
```


**File:** `libs/constants/src/import/file-import-locations.enum.ts`

```typescript
export enum Decision {
    NOT_DECIDED = "not_decided",
    DELETE_EXISTING = "delete_existing",
    CLOSE_EXISTING = "close_existing",
    KEEP_EXISTING = "keep_existing",
    OVERWRITE_EXISTING = "overwrite_existing",
    CREATE_NEW = "create_new",
}

export enum DecidedBy {
    USER = "user",
    AUTO = "auto",
}

export enum MatchingCriteria {
    NONE = "none",
    AUTO = "auto",
    STORE_CODE = "store_code",
    ADDRESS = "address",
    USER = "user",
}
```


**File:** `libs/constants/src/import/location-file-columns.enum.ts`

```typescript
export enum LocationFileColumns$General { /* ... 30+ columns ... */ }
export enum LocationFileColumns$Social { /* ... Facebook, Instagram, etc. ... */ }
export enum LocationFileColumns$Accessibility { /* ... accessibility features ... */ }
export enum LocationFileColumns$Amenities { /* ... restroom, wi-fi, etc. ... */ }
export enum LocationFileColumns$Payments { /* ... payment methods ... */ }
// ... and many more attribute categories

export const LocationFileColumns$Attributes = { /* combined attributes */ };
export const LocationFileColumns = { /* combined all */ };
export type LocationFileColumns = typeof LocationFileColumns;
export type LocationColumnKey = keyof typeof LocationFileColumns$General;
export type LocationColumnValue = LocationFileColumns$General;
```


**File:** `libs/constants/src/activity-type.ts`

```typescript
export enum ActivityType {
    UserRegistration = "UserRegistration",
    UserDeletion = "UserDeletion",
    UserRoleUpdate = "UserRoleUpdate",
    UserInvitation = "UserInvitation",
    // ... Google integration activities ...
    GoogleLocationAccountLinked = "GoogleLocationAccountLinked",
    GoogleLocationIntegrationComplete = "GoogleLocationIntegrationComplete",
    // ... Meta activities ...
    MetaLocationsAccountLinked = "MetaLocationsAccountLinked",
    // ... TikTok, Apple, Yandex activities ...
    // ... Location, media, review, store set, brand activities ...
    LocationCreate = "LocationCreate",
    LocationUpdate = "LocationUpdate",
    LocationDelete = "LocationDelete",
    LocationMediaItemsUpdate = "LocationMediaItemsUpdate",
    ReviewReplied = "ReviewReplied",
    BrandUpdate = "BrandUpdate",
}
```


**File:** `libs/constants/src/revision/revision-statuses.ts`

```typescript
export enum RevisionStatuses {
    InPreview = "InPreview",
    Applied = "Applied",
    Invalidated = "Invalidated",
    Discarded = "Discarded",
}
```


**File:** `libs/constants/src/revision/revision-operations.ts`

```typescript
export enum RevisionOperations {
    Create = "Create",
    Update = "Update",
    Delete = "Delete",
}
```


**File:** `libs/constants/src/version-operation.ts`

```typescript
export enum VersionOperation {
    CREATE = "Create",
    UPDATE = "Update",
    DELETE = "Delete",
}

export enum VersionedEntities {
    BRAND = "Brand",
    LOCATION = "Location",
}
```


**File:** `libs/product/src/enums/product-enums.ts`

```typescript
export enum ProductChannel {
    local = "local",
    online = "online",
}

export enum Gender {
    male = "male",
    female = "female",
    unisex = "unisex",
}

export enum Condition {
    new = "new",
    used = "used",
    refurbished = "refurbished",
}

export enum AgeGroup {
    newborn = "newborn",
    infant = "infant",
    toddler = "toddler",
    kids = "kids",
    adult = "adult",
}

export enum Measure {
    INCH = "in",
    CENTIMETER = "cm",
    GRAM = "g",
    FOOT = "ft",
    YARD = "yd",
    METER = "m",
    KILOGRAM = "kg",
    OUNCE = "oz",
    POUND = "lb",
    MILIGRAM = "mg",
    FLUIDOUNCE = "floz",
    PINT = "pt",
    QUART = "qt",
    GALLON = "gal",
    MILLILITER = "ml",
    DECILITER = "cl",
    LITER = "l",
    CUBICMETER = "cbm",
    SQUAREFOOT = "sqft",
    SQUAREMETER = "sqm",
    CARAT = "ct",
}

export enum EnergyEfficiencyClass {
    A_PLUS_PLUS_PLUS = "A+++",
    A_PLUS_PLUS = "A++",
    A_PLUS = "A+",
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
    F = "F",
    G = "G",
}

export enum ProductDimensionUnit {
    INCH = "in",
    CENTIMETER = "cm",
}

export enum ProductWeightUnit {
    GRAM = "g",
    KILOGRAM = "kg",
    OUNCE = "oz",
    POUND = "lb",
}

export const Measures = Object.values(Measure);
export const ProductChannels = Object.values(ProductChannel);
export const Genders = Object.values(Gender);
export const Conditions = Object.values(Condition);
export const AgeGroups = Object.values(AgeGroup);
```


**File:** `libs/product/src/enums/product-availability-enum.ts`

```typescript
export enum ProductAvailabilitiesEnum {
    in_stock = "in stock",
    out_of_stock = "out of stock",
    backorder = "backorder",
    preorder = "preorder",
}

export enum ProductAvailabilitiesVXEnum {
    in_stock = "in stock",
    out_of_stock = "out of stock",
}

export const COMMON_PRODUCT_AVAILABILITIES_DIFF = [
    ProductAvailabilitiesEnum.in_stock,
    ProductAvailabilitiesEnum.out_of_stock,
];
export const LOCAL_PRODUCT_AVAILABILITIES_DIFF = [ProductAvailabilitiesEnum.backorder];
export const SHOPPING_PRODUCT_AVAILABILITIES_DIFF = [ProductAvailabilitiesEnum.preorder];
export const LOCAL_PRODUCT_AVAILABILITIES = [...COMMON_PRODUCT_AVAILABILITIES_DIFF, ...LOCAL_PRODUCT_AVAILABILITIES_DIFF];
export const SHOPPING_PRODUCT_AVAILABILITIES = [...COMMON_PRODUCT_AVAILABILITIES_DIFF, ...SHOPPING_PRODUCT_AVAILABILITIES_DIFF];
export const ALL_PRODUCT_AVAILABILITIES = [...COMMON_PRODUCT_AVAILABILITIES_DIFF, ...LOCAL_PRODUCT_AVAILABILITIES_DIFF, ...SHOPPING_PRODUCT_AVAILABILITIES_DIFF];
```


**File:** `libs/product/src/enums/item-status-enums.ts`

```typescript
export enum DiffStatusEnum {
    ADDED = "ADDED",
    REMOVED = "REMOVED",
    UPDATED = "UPDATED",
}

export enum SendStatusEnum {
    PROCESSING = "PROCESSING",
    SUCCESS = "SUCCESS",
    FAIL = "FAIL",
    PROBLEM = "PROBLEM",
}

export const ItemStatusEnum = {...DiffStatusEnum, ...SendStatusEnum};
export type ItemStatusEnum = DiffStatusEnum | SendStatusEnum;
export const ItemStatuses = Object.values(ItemStatusEnum) as ItemStatusEnum[];
export const SendStatuses = Object.values(SendStatusEnum) as SendStatusEnum[];
export const DiffStatuses = Object.values(DiffStatusEnum) as DiffStatusEnum[];
```


**File:** `libs/product/src/enums/pickup-methods-enums.ts`

```typescript
export enum PickupTodayMethodsEnum {
    buy = "buy",
    reserve = "reserve",
}

export enum PickupLaterMethodsEnum {
    ship_to_store = "ship to store",
}

export enum PickupNotSupportedMethodEnum {
    not_supported = "not supported",
}

export const PickupMethodsEnum = {
    ...PickupTodayMethodsEnum,
    ...PickupLaterMethodsEnum,
    ...PickupNotSupportedMethodEnum,
};

export const PickupTodayMethods = Object.values(PickupTodayMethodsEnum) as PickupTodayMethodsEnum[];
export const PickupLaterMethods = Object.values(PickupLaterMethodsEnum) as PickupLaterMethodsEnum[];
export type PickupMethodsEnum = PickupTodayMethodsEnum | PickupLaterMethodsEnum | PickupNotSupportedMethodEnum;
```


**File:** `libs/product/src/enums/lia-program-enums.ts`

```typescript
export enum LIAProgramEnum {
    GHLS = "ghls",
    MHLS_BASIC = "mhls-basic",
    MHLS_FULL = "mhls-full",
}
```


**File:** `libs/product/src/enums/product-source-enum.ts`

```typescript
enum ProductSourceVenuex {
    venuex_api_product = "venuex-api-product",
    venuex_api_express = "venuex-api-express",
    venuex_lake = "venuex-lake",
}

export const ProductSource = {...ProductProviderEnum, ...ProductSourceVenuex};
export type ProductSource = ProductProviderEnum | ProductSourceVenuex;
export const ProductSources = Object.values(ProductSource) as ProductSource[];
```


**File:** `libs/product/src/enums/product-interfaces.ts`

```typescript
export interface IProductDimension {
    value: number;
    unit: ProductDimensionUnit;
}

export interface IProductWeight {
    value: number;
    unit: ProductWeightUnit;
}

export interface IProductDetail {
    sectionName?: string;
    attributeName: string;
    attributeValue: string;
}

export interface IProductMeasure {
    value: number;
    unit: Measure;
}

export interface ISalePriceEffectiveDate {
    start: string | Date;
    end: string | Date;
}

export interface ICustomAttribute {
    name: string;
    value: string;
}
```


**File:** `libs/constants/src/location/location-post.ts`

```typescript
export enum LocalPostState {
    LOCAL_POST_STATE_UNSPECIFIED = "LOCAL_POST_STATE_UNSPECIFIED",
    REJECTED = "REJECTED",
    LIVE = "LIVE",
    PROCESSING = "PROCESSING",
}

export enum LocalPostTopicType {
    LOCAL_POST_TOPIC_TYPE_UNSPECIFIED = "LOCAL_POST_TOPIC_TYPE_UNSPECIFIED",
    OFFER = "OFFER",
    EVENT = "EVENT",
    STANDARD = "STANDARD",
    ALERT = "ALERT",
}

export enum AlertType {
    ALERT_TYPE_UNSPECIFIED = "ALERT_TYPE_UNSPECIFIED",
    COVID_19 = "COVID_19",
}

export enum LocalPostActionType {
    ACTION_TYPE_UNSPECIFIED = "ACTION_TYPE_UNSPECIFIED",
    BOOK = "BOOK",
    ORDER = "ORDER",
    SHOP = "SHOP",
    LEARN_MORE = "LEARN_MORE",
    SIGN_UP = "SIGN_UP",
    CALL = "CALL",
}

export enum AppleShowcaseActionType {
    ADD_PHOTOS = "ADD_PHOTOS",
    ADD_TO_FAVORITES = "ADD_TO_FAVORITES",
    ADD_TO_GUIDE = "ADD_TO_GUIDE",
    CALL = "CALL",
    GET_DIRECTIONS = "GET_DIRECTIONS",
    RATE_US = "RATE_US",
    SAVE_AS_CONTACT = "SAVE_AS_CONTACT",
    SHARE = "SHARE",
    WEBSITE = "WEBSITE",
}

export const LocalPostActionTypeLabels: Record<LocalPostActionType, string> = { /* ... */ };
export const LocalPostTopicTypeLabels: Record<LocalPostTopicType, string> = { /* ... */ };
export const AppleShowcaseActionTypeLabels: Record<AppleShowcaseActionType, string> = { /* ... */ };

export const APPLE_SHOWCASE_LIMITS = {
    HEADLINE_MAX_LENGTH: 38,
    HEADLINE_MIN_LENGTH: 5,
    BODY_MAX_LENGTH: 100,
    BODY_MIN_LENGTH: 5,
    CAPTION_MAX_LENGTH: 255,
    CAPTION_MIN_LENGTH: 5,
} as const;

export const APPLE_SHOWCASE_RETRY = { /* ... retry config ... */ } as const;
```


**File:** `libs/constants/src/location/location-review.ts`

```typescript
export enum StarRatingEnum {
    unspecified = "STAR_RATING_UNSPECIFIED",
    one = "ONE",
    two = "TWO",
    three = "THREE",
    four = "FOUR",
    five = "FIVE",
}

export enum ReviewSourceEnum {
    GOOGLE = "Google",
    APPLE = "Apple",
    META = "Meta",
    TIKTOK = "Tiktok",
}

export enum ReviewStatusEnum {
    ANSWERED = "ANSWERED",
    UNANSWERED = "UNANSWERED",
}

export enum AutoReplyActionEnum {
    CREATE = "Create",
    UPDATE = "Update",
    DELETE = "Delete",
    GET = "Get",
}

export enum StarRatingNotificationEnum {
    ONE = "ONE",
    TWO = "TWO",
    THREE = "THREE",
    FOUR = "FOUR",
    FIVE = "FIVE",
}

export enum ReviewSentimentEnum {
    NO_DATA = "no_sentiment_data",
    ALL = "all_sentiments",
    POSITIVE = "positive_sentiment",
    NEGATIVE = "negative_sentiment",
    NEUTRAL = "neutral_sentiment",
}

export enum ReviewDateRangeSelectionEnum {
    ONE_DAY = "One Day",
    ONE_WEEK = "One Week",
    TWO_WEEKS = "Two Weeks",
    ONE_MONTH = "One Month",
    THREE_MONTHS = "Three Months",
    LAST_MONTH = "Last Month",
    LAST_THREE_MONTHS = "Last 3 Months",
    CUSTOM = "Custom",
}

export type ReviewAnalysisPeriod = "daily" | "weekly" | "bi-weekly" | "monthly" | "quarterly" | "all-time" | "custom";

export interface CategoryAggregate {
    category: string;
    sum: number;
    count: number;
    avg: number;
}

export interface BayesianMetrics {
    adjusted: number;
}

export const BayesianAnalysisConstants = {
    NEUTRAL_SCORE: 3,
    PRIOR_WEIGHT: 50,
} as const;
```


**File:** `libs/constants/src/location/location-media.ts`

```typescript
export enum MediaFormatEnum {
    unspecified = "MEDIA_FORMAT_UNSPECIFIED",
    photo = "PHOTO",
    video = "VIDEO",
}

export enum MediaItemCategoryEnum {
    CATEGORY_UNSPECIFIED = "CATEGORY_UNSPECIFIED",
    COVER = "COVER",
    PROFILE = "PROFILE",
    LOGO = "LOGO",
    EXTERIOR = "EXTERIOR",
    INTERIOR = "INTERIOR",
    PRODUCT = "PRODUCT",
    AT_WORK = "AT_WORK",
    FOOD_AND_DRINK = "FOOD_AND_DRINK",
    MENU = "MENU",
    COMMON_AREA = "COMMON_AREA",
    ROOMS = "ROOMS",
    TEAMS = "TEAMS",
    ADDITIONAL = "ADDITIONAL",
}

export enum UploadedByEnum {
    OWNER = "OWNER",
    CUSTOMER = "CUSTOMER",
}
```


**File:** `libs/constants/src/chat/chat-status.enum.ts`

```typescript
export enum ChatStatusEnum {
    SUCCESS = "success",
    ERROR = "error",
    TIMEOUT = "timeout",
}
```


**File:** `libs/database/src/mongoose/schemas/chat/chat-message.schema.ts`

```typescript
export enum ChatMessageRoleEnum {
    AI = "AI",
    USER = "User",
    SYSTEM = "System",
}

export enum FeedbackTypeEnum {
    POSITIVE = "Positive",
    NEGATIVE = "Negative",
}

export class SuggestedAction {
    @Prop({required: true})
    label!: string;
    
    @Prop({required: true})
    action!: string;
    
    @Prop({type: () => Object})
    payload?: any;
}

export class ActionStat {
    @Prop({required: true})
    type!: string;
    
    @Prop({required: true, default: 0})
    count!: number;
}

export class UserFeedback {
    @Prop({enum: FeedbackTypeEnum, required: true})
    type!: FeedbackTypeEnum;
    
    @Prop()
    comment?: string;
    
    @Prop({default: Date.now})
    createdAt!: Date;
}
```


**File:** `libs/constants/src/catalog/local-inventory-status.ts`

```typescript
export enum LocalInventoryStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}

export enum LocalInventoryStatusFilter {
    ACTIVE = "active",
    INACTIVE = "inactive",
    ALL = "all",
}
```


**File:** `libs/constants/src/payment-methods.ts`

```typescript
export enum ApplePaymentMethodsEnum {
    AMERICAN_EXPRESS = "AMERICAN_EXPRESS",
    BITCOIN = "BITCOIN",
    CASH_PAYMENT = "CASH_PAYMENT",
    CHECK = "CHECK",
    UNION_PAY = "UNION_PAY",
    DEBIT_CARDS = "DEBIT_CARDS",
    DINERS_CLUB = "DINERS_CLUB",
    DISCOVER = "DISCOVER",
    FINANCING = "FINANCING",
    INVOICE = "INVOICE",
    JCB = "JCB",
    MAESTRO = "MAESTRO",
    MASTERCARD = "MASTERCARD",
    MASTERCARD_DEBIT = "MASTERCARD_DEBIT",
    PAYPAL = "PAYPAL",
    RUPAY = "RUPAY",
    STORE_CARD = "STORE_CARD",
    VISA = "VISA",
    VISA_DEBIT = "VISA_DEBIT",
}

export enum MetaPaymentMethodsEnum {
    CASH_ONLY = "cash_only",
    VISA = "visa",
    AMERICAN_EXPRESS = "amex",
    MASTERCARD = "mastercard",
    DISCOVER = "discover",
    CREDIT_CARDS = "credit_cards",
}
```


**File:** `libs/constants/src/more-hours-types.ts`

```typescript
export enum MoreHoursTypesEnum {
    ACCESS = "ACCESS",
    BRUNCH = "BRUNCH",
    DELIVERY = "DELIVERY",
    DRIVE_THROUGH = "DRIVE_THROUGH",
    HAPPY_HOUR = "HAPPY_HOUR",
    KITCHEN = "KITCHEN",
    ONLINE_SERVICE_HOURS = "ONLINE_SERVICE_HOURS",
    PICKUP = "PICKUP",
    TAKEOUT = "TAKEOUT",
    SENIOR_HOURS = "SENIOR_HOURS",
    BREAKFAST = "BREAKFAST",
    DINNER = "DINNER",
}

export type MoreHoursTypes = keyof typeof MoreHoursTypesEnum;
export const MoreHoursTypesForSelect = TransformForSelect(MoreHoursTypesEnum);
export const MoreHoursTypesKeys = Object.keys(MoreHoursTypesEnum) as MoreHoursTypes[];
```


**File:** `libs/constants/src/meta-graph-api/location-temporary-status.ts`

```typescript
export enum MetaLocationTemporaryStatusEnum {
    DIFFERENTLY_OPEN = "differently_open",
    TEMPORARILY_CLOSED = "temporarily_closed",
    OPERATING_AS_USUAL = "operating_as_usual",
    NO_DATA = "no_data",
}
```


**File:** `libs/constants/src/meta-graph-api/price-range.ts`

```typescript
export enum MetaPriceRangeEnum {
    ONE_DOLLAR = "$",
    TWO_DOLLARS = "$$",
    THREE_DOLLARS = "$$$",
    FOUR_DOLLARS = "$$$$",
    NOT_APPLICABLE = "Not Applicable",
}
```


**File:** `libs/constants/src/etl/feed-type.ts`

```typescript
export enum FeedType {
    Product = "PRODUCT",
    Inventory = "INVENTORY",
    Store_Sale = "STORE_SALE",
}

export enum ExecutionFeedType {
    Catalog = "CATALOG",
    Offline_Conversion = "OFFLINE_CONVERSION",
}
```


**File:** `libs/constants/src/etl/pipeline-health-status.ts`

```typescript
export enum EtlProcessErrorCode {
    SOURCE_DATA_MISSING = "SOURCE_DATA_MISSING",
    SOURCE_AUTH_FAILURE = "SOURCE_AUTH_FAILURE",
    SOURCE_UNREACHABLE = "SOURCE_UNREACHABLE",
    PLATFORM_AUTH_FAILURE = "PLATFORM_AUTH_FAILURE",
    INVALID_DATA_FORMAT = "INVALID_DATA_FORMAT",
    INTERNAL_PROCESSING_ERROR = "INTERNAL_PROCESSING_ERROR",
    PIPELINE_START_MISSING = "PIPELINE_START_MISSING",
    EXPECTED_EVENTS_MISSING = "EXPECTED_EVENTS_MISSING",
    PIPELINE_RUNS_FAILED_OR_MISSING = "PIPELINE_RUNS_FAILED_OR_MISSING",
    PIPELINE_NOT_TRIGGERED = "PIPELINE_NOT_TRIGGERED",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export enum EtlEventHealthStatus {
    HEALTHY = "HEALTHY",
    WARNING = "WARNING",
    ERROR = "ERROR",
    STALE = "STALE",
    IN_PROGRESS = "IN_PROGRESS",
}

export enum AlertSeverity {
    CRITICAL = "CRITICAL",
    WARNING = "WARNING",
}

export enum AnomalyDirection {
    INCREASE = "INCREASE",
    DECREASE = "DECREASE",
}

export enum AnomalyType {
    FILE_COUNT = "FILE_COUNT",
    FILE_SIZE = "FILE_SIZE",
    OUTPUT_RECORD_COUNT = "OUTPUT_RECORD_COUNT",
    INPUT_RECORD_COUNT = "INPUT_RECORD_COUNT",
    FILTER_RATIO = "FILTER_RATIO",
    MISSING_EVENT = "MISSING_EVENT",
}

export const ANOMALY_THRESHOLDS = {
    warning: 0.2,
    critical: 0.5,
} as const;
```


**File:** `libs/constants/src/etl/etl-file-log-status.ts`

```typescript
export enum ETLFileLogStatus {
    IN_PROGRESS = "IN_PROGRESS",
    READ = "READ",
    SKIPPED = "SKIPPED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}
```


**File:** `libs/constants/src/etl/feed-execution.ts`

```typescript
export declare const ExecutionStatus: {
    readonly ABORTED: "ABORTED";
    readonly FAILED: "FAILED";
    readonly PENDING_REDRIVE: "PENDING_REDRIVE";
    readonly RUNNING: "RUNNING";
    readonly SUCCEEDED: "SUCCEEDED";
    readonly TIMED_OUT: "TIMED_OUT";
};

export type ExecutionStatus = (typeof ExecutionStatus)[keyof typeof ExecutionStatus];
```


**File:** `libs/constants/src/data-settings/index.ts`

```typescript
export enum DataSettingsSourceTypeEnum {
    HTTP = "HTTP",
    FTP = "FTP",
    SFTP = "SFTP",
    API = "API",
}

export enum DataSettingsAuthTypeEnum {
    BASIC = "basic",
    BEARER = "bearer",
    API_KEY = "api-key",
}

export enum DataSettingsApiMethodEnum {
    GET = "GET",
    POST = "POST",
}

export enum DataSettingsTypeEnum {
    INVENTORY = "INVENTORY",
    OFFLINE = "OFFLINE",
}

export enum DataSettingsUrlTypeEnum {
    FOLDER_PATH = "FOLDER_PATH",
    FILE_PATH = "FILE_PATH",
    API_ENDPOINT = "API_ENDPOINT",
}

export enum DataSettingsInventoryFileDumpTypeEnum {
    DUMP = "DUMP",
    INCREMENTAL = "INCREMENTAL",
}

export enum DataSettingsScheduleTypeEnum {
    DAILY = "DAILY",
    HOURLY = "HOURLY",
}

export enum DataSettingsProductMatchFieldEnum {
    OFFER_ID = "offerId",
    GTIN = "gtin",
    MPN = "mpn",
}

export enum DataSettingsMetaFeedOutputFieldEnum {
    ID = "id",
}

export const DATA_SETTINGS_SOURCE_LAMBDA_NAME = "getDataSource-v1";
export const DATA_SETTINGS_MAPPING_LAMBDA_NAME = "parseDataMapping-v1";
```


**File:** `libs/constants/src/mapping-type.ts`

```typescript
export enum MappingType {
    INVENTORY = "INVENTORY",
    OFFLINE = "OFFLINE",
    EXCEL_LOCATION = "EXCEL_LOCATION",
}

type Mapping<R, T> = {
    fieldName: T;
    fieldValue: R;
    required: boolean;
    isDatetime?: boolean;
};

export type InventoryFieldMapping = Mapping<InventoryColumnKey, InventoryColumnValue>;
export type SalesFieldMapping = Mapping<SalesColumnKey, SalesColumnValue>;
export type LocationFieldMapping = Mapping<LocationColumnKey, LocationColumnValue>;

export type FieldMappings = Readonly<{
    [MappingType.INVENTORY]: InventoryFieldMapping[];
    [MappingType.OFFLINE]: SalesFieldMapping[];
    [MappingType.EXCEL_LOCATION]: LocationFieldMapping[];
}>;

export const FieldMappings: FieldMappings = { /* detailed field mappings */ };
```


**File:** `libs/constants/src/cron-type.ts`

```typescript
export enum CronType {
    CRON_HOURLY = "cron_hourly",
    CRON_MONTHLY = "cron_monthly",
    CRON_MONTHLY_ONE_TIME = "cron_monthly_one_time",
    CRON_DAILY = "cron_daily",
    CRON_REMOTE_STORAGE = "cron_remote_storage",
    CRON_ONE_TIME = "cron_one_time",
    CRON_TIME_ZONE = "cron_time_zone",
    CRON_S3_PRODUCT_BATCH = "cron_s3_product_batch",
    CRON_S3_INVENTORY_BATCH = "cron_s3_inventory_batch",
    CRON_SEARCH_KEYWORDS = "cron_search_keywords",
    CRON_FRESH_PRODUCTS = "cron_fresh_products",
    CRON_FRESH_INVENTORIES = "cron_fresh_inventories",
    CRON_FAILED_PRODUCTS = "cron_failed_products",
    CRON_FAILED_INVENTORIES = "cron_failed_inventories",
    CRON_DAILY_MEDIA_ITEMS = "cron_daily_media_items",
    CRON_DAILY_REVIEWS = "cron_daily_reviews",
    CRON_DAILY_TOGG_DATA = "cron_daily_togg_data",
    CRON_FIRST_TIME_TOGG_DATA = "cron_first_time_togg_data",
    CRON_TOGG_JOB_TRACK = "cron_togg_job_track",
    CRON_PUBSUB_REVIEWS = "cron_pubsub_reviews",
    CRON_REMOVE_DELETED_REVIEWS = "cron_remove_deleted_reviews",
    CRON_STORE_SALES_DATA_FETCH = "cron_store_sales_data_fetch",
    CRON_INVENTORY_DATA_FETCH = "cron_inventory_data_fetch",
    CRON_STORE_SALES_COLUMN_MAPPING = "cron_store_sales_column_mapping",
    CRON_INVENTORY_COLUMN_MAPPING = "cron_inventory_column_mapping",
    CRON_DAILY_META_INSIGHTS = "cron_daily_meta_insights",
    CRON_DAILY_APPLE_LOCATION_INSIGHTS = "cron_daily_apple_location_insights",
}

export const CronTypes = Object.values(CronType);
```


**File:** `libs/constants/src/batch-items.ts`

```typescript
export enum BatchItemEnum {
    batch_product = "batch-product",
    batch_product_variant = "batch-product-variant",
    batch_inventory = "batch-inventory",
}
```


**File:** `libs/constants/src/contact-type.ts`

```typescript
export enum ContactType {
    Organization = "Organization",
    Venue = "Venue",
    VenueGroup = "VenueGroup",
}

export type ContactTypes = keyof typeof ContactType;
export const ContactTypesForSelect = TransformForSelect(ContactType);
export const ContactTypesKeys = Object.keys(ContactType) as ContactTypes[];
```


**File:** `libs/constants/src/request-type.ts`

```typescript
export enum RequestType {
    Organization = "Organization",
    VenueGroup = "VenueGroup",
}

export type RequestTypes = keyof typeof RequestType;
export const RequestTypesForSelect = TransformForSelect(RequestType);
export const RequestTypesKeys = Object.keys(RequestType) as RequestTypes[];
```


**File:** `libs/constants/src/payload-operation.ts`

```typescript
export enum PayloadOperation {
    Create = "create",
    Delete = "delete",
}

export const PAYLOAD_OPERATIONS = Object.values(PayloadOperation);
```


**File:** `libs/constants/src/s3-job-type.ts`

```typescript
export enum S3JobType {
    S3_BATCH = "s3-batch",
    S3_PRODUCT_BATCH = "s3-product-batch",
    S3_INVENTORY_BATCH = "s3-inventory-batch",
}
```


**File:** `libs/constants/src/gbp-account-type.ts`

```typescript
export enum LocationGroupScenario {
    NoLocationAndGroup = "NoLocationAndGroup",
    LocationGroupNoLocations = "LocationGroupNoLocations",
    LocationGroupWithLocations = "LocationGroupWithLocations",
    NoLocationGroupWithLocations = "NoLocationGroupWithLocations",
    MixedAccountTypesWithLocations = "MixedAccountTypesWithLocations",
    PersonalAccountWithLocations = "PersonalAccountWithLocations",
}

export enum GbpAccountType {
    AccountTypeUnspecified = "ACCOUNT_TYPE_UNSPECIFIED",
    Personal = "PERSONAL",
    LocationGroup = "LOCATION_GROUP",
    UserGroup = "USER_GROUP",
    Organization = "ORGANIZATION",
}
```


**File:** `libs/constants/src/database/file/file-status.ts`

```typescript
export enum FileStatus {
    Waiting = "WAITING",
    InUse = "IN_USE",
    Deleted = "DELETED",
}
```


**File:** `libs/constants/src/data-source-status.ts`

```typescript
export enum DataSourceSyncStatusType {
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    WARNING = "WARNING",
    PROCESSING = "PROCESSING",
    UNKNOWN = "UNKNOWN",
}

export enum DataSourceType {
    PRIMARY = "PRIMARY",
    SUPPLEMENTAL = "SUPPLEMENTAL",
    LIA = "LIA",
}
```


**File:** `libs/constants/src/directions/directions-type.ts`

```typescript
export enum DirectionsType {
    Amenity = "amenity",
    Occupant = "occupant",
    Anchor = "anchor",
    Kiosk = "kiosk",
    Unit = "unit",
}
```


**File:** `libs/constants/src/location-attributes/attribute-value-type.ts`

```typescript
export enum AttributeValueTypeEnum {
    ATTRIBUTE_VALUE_TYPE_UNSPECIFIED = "ATTRIBUTE_VALUE_TYPE_UNSPECIFIED",
    BOOL = "BOOL",
    ENUM = "ENUM",
    URL = "URL",
    REPEATED_ENUM = "REPEATED_ENUM",
}
```


**File:** `libs/constants/src/lock-mechanism/index.ts`

```typescript
export enum LockMechanismServiceEnum {
    SCHEDULER = "SCHEDULER",
    S3_IMPORT = "S3_IMPORT",
    ITEM_STATUS_KICKER = "ITEM_STATUS_KICKER",
}

export enum LockMechanismLockerEnum {
    LAMBDA = "LAMBDA",
    BACKEND = "BACKEND",
}
```


**File:** `libs/constants/src/location-review-analysis/location-review-analysis-status.ts`

```typescript
export enum ReviewAnalysisLogStatus {
    INITIAL = "INITIAL",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
}

export enum ReviewAnalysisType {
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    THREE_MONTHLY = "3_MONTHLY",
    ALL_TIME = "ALL_TIME",
    CUSTOM = "CUSTOM",
}
```


**File:** `libs/constants/src/location-push-result-type.ts`

```typescript
export enum LocationPushResultType {
    Location = "LOCATION",
    Attribute = "ATTRIBUTE",
}
```


**File:** `libs/constants/src/import/google-location-creation-error-reason.ts`

```typescript
export enum GoogleLocationCreationErrorReasonEnum {
    INVALID_ADDRESS = "INVALID_ADDRESS",
    LAT_LNG_TOO_FAR_FROM_ADDRESS = "LAT_LNG_TOO_FAR_FROM_ADDRESS",
    MISSING_ADDRESS_COMPONENTS = "MISSING_ADDRESS_COMPONENTS",
}
```


**File:** `libs/constants/src/togg/index.ts`

```typescript
export enum ToggJobTypeEnum {
    LOCATION = "location",
    PRODUCT_VARIANT = "product_variant",
    INVENTORY = "inventory",
    BRAND = "brand",
}

export enum ToggJobStatusEnum {
    SUCCESS = "Succeded",
    FAILED = "Failed",
}
```


**File:** `libs/constants/src/auth/index.ts`

```typescript
export enum SharedAuthTypeEnum {
    GoogleMyBusiness = "GoogleMyBusiness",
    GoogleMerchantCenter = "GoogleMerchantCenter",
    GoogleMerchantCenterNew = "GoogleMerchantCenterNew",
    MetaGraphApiPages = "MetaGraphApiPages",
    GoogleAds = "GoogleAds",
    TiktokBusiness = "TiktokBusiness",
    AppleBusinessConnect = "AppleBusinessConnect",
}
```


**File:** `libs/apple-business-connect-api/src/schemas/common/enums/asset-intent.ts`

```typescript
export enum BrandAssetIntentEnum {
    COVER_PHOTO = "COVER_PHOTO",
    PLACECARD_LOGO = "PLACECARD_LOGO",
}

export enum LocationAssetIntentEnum {
    COVER_PHOTO = "COVER_PHOTO",
    GALLERY = "GALLERY",
}
```


**File:** `libs/apple-business-connect-api/src/schemas/common/enums/location-status.ts`

```typescript
export enum LocationStatusEnum {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    TEMPORARILY_CLOSED = "TEMPORARILY_CLOSED",
}
```


**File:** `libs/apple-business-connect-api/src/schemas/common/enums/business-states.ts`

```typescript
export enum BusinessStatesEnum {
    DELETED = "DELETED",
    FAILED = "FAILED",
    PUBLISHED = "PUBLISHED",
    REJECTED = "REJECTED",
    SUBMITTED = "SUBMITTED",
}
```


**File:** `libs/apple-business-connect-api/src/schemas/common/enums/ownership-type.ts`

```typescript
export enum OwnershipType {
    BRAND_OWNER = "BRAND_OWNER",
    FRANCHISEE = "FRANCHISEE",
}
```


**File:** `libs/apple-business-connect-api/src/schemas/common/enums/phone-types.ts`

```typescript
export enum PhoneTypesEnum {
    FAX = "FAX",
    LANDLINE = "LANDLINE",
    MOBILE = "MOBILE",
    TOLL_FREE = "TOLL_FREE",
    TTY = "TTY",
    VOICE = "VOICE",
}
```


**File:** `libs/database/src/mongoose/schemas/venue/correlation.schema.ts`

```typescript
export enum CorrelationType {
    amenity = "Amenity",
    geofence = "Geofence",
    occupant = "Occupant",
    section = "Section",
}
```


### Interfaces & Types

**File:** `apps/storefront/src/lib/types.ts`

```typescript
export interface KPI {
    value: number | string;
    trend: number | string;
    previousValue: number | string;
}

export interface OverviewData {
    kpis: {
        o2oAttribution: KPI;
        locationListings: KPI;
        localInventory: KPI;
        reviewManagement: KPI;
    };
    platforms: any[];
    locations: any[];
    campaigns: any[];
    alerts: any[];
    lastSync: string;
}

export interface FilterState {
    dateRange: {
        startDate: Date | null;
        endDate: Date | null;
    };
    platform: string;
    compareMode: boolean;
    campaignTypes?: string[];
    campaigns?: string[];
    isAllCampaignsSelected?: boolean;
}

export interface ChartDataPoint {
    date: string;
    google: number;
    meta: number;
    tiktok: number;
    apple: number;
}
```


### Validation Schemas

_No definitions found in this category._

---

## Queues & Events

### Database Models

**File:** `libs/queue/src/schemas/transaction.schema.ts`

```typescript
export enum QueueTransactionTypes {
    API = "API",
    Consumer = "Consumer",
}

export enum QueueTransactionIssuer {
    QUEUE_NAME_KICKING = "kicker",
    QUEUE_NAME_TRANSFORMING = "transformer",
    QUEUE_NAME_PUSHING = "pusher",
    QUEUE_NAME_PUSHING_LI = "pusher",
    QUEUE_NAME_BATCHING = "batch",
    QUEUE_NAME_DELETING = "delete",
    QUEUE_NAME_RETRIEVING = "retrieve",
    QUEUE_NAME_LOCATION_INSIGHTS = "insights",
    QUEUE_NAME_META_PAGE_INSIGHTS = "meta-page-insights",
    QUEUE_NAME_APPLE_INSIGHTS = "apple-insights",
    QUEUE_NAME_LOCATION_MEDIA_ITEMS = "media-items",
    QUEUE_NAME_CLEAN_REMOTE_STORAGE = "clean-remote-storage",
    QUEUE_NAME_GENERATE_GRAPH = "generate-graph",
    QUEUE_NAME_S3_BATCH = "s3-batch",
    API = "api",
    SQS_QUEUE_NAME_REVIEW = "sqs-review",
    SQS_QUEUE_NAME_PARTNER = "sqs-partner-data",
    SQS_QUEUE_NAME_MEDIA_ITEM = "sqs-media-item",
    SQS_QUEUE_NAME_LOCATION_INSIGHT = "sqs-location-insight",
    SQS_QUEUE_NAME_META_PAGE_INSIGHT = "sqs-meta-page-insight",
    SQS_QUEUE_NAME_APPLE_INSIGHT = "sqs-apple-insight",
    SQS_QUEUE_NAME_S3_BATCH = "sqs-s3-batch",
    SQS_QUEUE_NAME_CLEAN_REMOTE_STORAGE = "sqs-clean-remote-storage",
}

export enum QueueTransactionStatus {
    Success = "success",
    Fail = "fail",
    Ongoing = "ongoing",
}

@modelOptions({
    schemaOptions: {
        strict: "throw",
        collection: "transactions",
    },
})
@index({request_id: 1})
@index({issuer: 1, type: 1, jobId: 1})
@index({request_id: 1, sqsMessageId: 1})
export class QueueTransaction extends TypegooseBase {
    @prop({
        validate: {
            validator: (v: string): boolean => isUUID(v, 4),
            message: "request_id should be valid uuid v4",
        },
    })
    request_id!: string;

    @prop({required: true, enum: QueueTransactionTypes, default: QueueTransactionTypes.Consumer})
    type!: QueueTransactionTypes;

    @prop({required: true, enum: QueueTransactionIssuer})
    issuer!: QueueTransactionIssuer;

    @prop({_id: false})
    user!: QueueTransactionUser;

    @prop({required: true, enum: QueueTransactionStatus, default: QueueTransactionStatus.Ongoing})
    status!: QueueTransactionStatus;

    @prop({type: Object}, PropType.MAP)
    payload!: Types.Map<any>;

    @prop({_id: false})
    statuses?: ProductPushStatus[] | LocationPushStatus[] | InventoryPushStatus[];

    @prop({type: Schema.Types.Mixed})
    error?: ErrorObject;

    @prop()
    jobId?: string;

    @prop({type: Object}, PropType.MAP)
    jobResult?: Types.Map<any>;

    @prop({required: true, default: () => Date.now(), expires: TRANSACTION_RETENTION.expiresIn})
    transactionCreatedAt!: Date;

    @prop({required: false})
    sqsMessageId?: string;
}
```


**File:** `libs/queue/src/schemas/transaction-user.schema.ts`

```typescript
export class QueueTransactionUser extends TypegooseWithoutId {
    @prop()
    source_id!: string;
}
```


**File:** `libs/queue/src/schemas/transaction-push-status.schema.ts`

```typescript
export class ProductPushStatus extends TypegooseWithoutId {
    @prop({required: true, enum: MerchandiseCenterPushConsumersEnum})
    consumer!: MerchandiseCenterPushConsumersEnum;

    @prop({required: true})
    product!: GoogleLocalProduct;

    @prop({required: true})
    providerErrors!: Schema$Error[];
}

export class LocationPushStatus extends TypegooseWithoutId {
    @prop({required: true, enum: LocationsPushConsumers})
    consumer!: LocationsPushConsumers;

    @prop({required: true})
    location!: GoogleLocation;

    @prop({required: true})
    providerError!: IGoogleMyBusinessError;
}

export class InventoryPushStatus extends TypegooseWithoutId {
    @prop({required: true, enum: MerchandiseCenterPushConsumersEnum})
    consumer!: MerchandiseCenterPushConsumersEnum;

    @prop({required: true})
    inventory!: GoogleLocalInventory;

    @prop({required: true})
    providerErrors!: Schema$Error[];
}

export class AttributePushStatus extends TypegooseWithoutId {
    @prop({required: true, enum: LocationsPushConsumers})
    consumer!: LocationsPushConsumers;

    @prop({required: true})
    attributes!: GoogleAttributes;

    @prop({required: true})
    providerError!: IGoogleMyBusinessError;
}

export class MetaLocationPushStatus extends TypegooseWithoutId {
    @prop({required: true, enum: MetaLocationsPushConsumers})
    consumer!: MetaLocationsPushConsumers;

    @prop({required: true})
    location!: SharedMetaPageLocation;

    @prop({required: true})
    providerError!: IMetaGraphApiError;
}

export class AppleLocationPushStatus extends TypegooseWithoutId {
    @prop({required: true, enum: AppleLocationsPushConsumers})
    consumer!: AppleLocationsPushConsumers;

    @prop({required: true})
    location!: SharedAppleLocation;

    @prop({required: true})
    providerError!: IAppleBusinessConnectApiError;
}
```


**File:** `libs/database/src/mongoose/schemas/notification-settings/notification-settings.schema.ts`

```typescript
@pre<NotificationSettings>("validate", async function onPreSave(next) {
    await validateFieldExistence({
        field: "brand",
        schema: Brand,
        document: this,
    });

    await validateFieldExistence({
        field: "user",
        schema: User,
        document: this,
    });

    return next();
})
@index({brand: 1, user: 1}, {unique: true})
export class NotificationSettings extends TypegooseBase {
    @prop({
        required: true,
        ref: "Brand",
    })
    brand!: Ref<Brand>;

    @prop({
        required: true,
        ref: "User",
    })
    user!: Ref<User>;

    @prop({required: true, default: true})
    notifications_enabled!: boolean;

    @prop({required: true, enum: StarRatingNotificationEnum, type: String}, PropType.ARRAY)
    rating_notifications!: string[];

    @prop({required: true, type: String}, PropType.ARRAY)
    location_notifications!: string[];

    @prop({required: true, default: NotificationPatternEnum.INSTANT, enum: NotificationPatternEnum})
    notification_pattern!: string;

    @prop({required: false, _id: false, type: BulkNotificationSettings})
    bulk_notification_settings?: BulkNotificationSettings;

    @prop({required: false})
    workflow_id?: string;

    @prop({required: false})
    workflow_group_id?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/notification-settings/bulk-notifications-settings.schema.ts`

```typescript
export class BulkNotificationSettings extends TypegooseWithoutId {
    @prop({required: true, default: NotificationScheduledRateEnum.DAILY, enum: NotificationScheduledRateEnum})
    scheduled_rate?: string;

    @prop({required: true, default: true})
    scheduled_rate_enabled!: boolean;

    @prop({required: true, default: NotificationBulkReviewCountEnum.TEN, enum: NotificationBulkReviewCountEnum})
    bulk_review_count?: number;

    @prop({required: true, default: true})
    bulk_review_count_enabled!: boolean;
}
```


**File:** `libs/database/src/mongoose/schemas/etl/etl-events.schema.ts`

```typescript
export class PipelineStartPayload extends TypegooseWithoutId {
    @prop({required: true, type: () => [EtlEventType], _id: false})
    expected_events!: EtlEventType[];

    @prop({required: false, enum: DataSettingsInventoryFileDumpTypeEnum})
    inventory_file_dump_type?: DataSettingsInventoryFileDumpTypeEnum;
}

export class DownloadedFile extends TypegooseWithoutId {
    @prop({required: true})
    file_name!: string;

    @prop({required: false, default: 0})
    file_size_bytes?: number;

    @prop({required: false, default: false})
    is_valid?: boolean;

    @prop({required: false, enum: FileValidationErrorType})
    validation_error_type?: FileValidationErrorType;

    @prop({required: false})
    row_count?: number;
}

export class FileDownloadPayload extends TypegooseWithoutId {
    @prop({required: true, type: () => [DownloadedFile], _id: false})
    downloaded_files!: DownloadedFile[];

    @prop({required: true})
    s3_bucket!: string;

    @prop({required: true})
    s3_folder!: string;

    @prop({required: false})
    total_file_count?: number;

    @prop({required: false})
    total_file_size_bytes?: number;

    @prop({required: false})
    total_row_count?: number;
}

export class OutputDataQualityMetrics extends TypegooseWithoutId {
    @prop({required: false})
    total_rows?: number;

    @prop({required: false})
    important_column_count?: number;

    @prop({required: false})
    max_affected_rows?: number;

    @prop({required: false, type: () => [String]})
    important_columns_with_issues?: string[];

    @prop({required: false})
    file_size_bytes?: number;

    @prop({required: false})
    processing_duration_ms?: number;
}

export class FeedGenerationPayload extends TypegooseWithoutId {
    @prop({required: false})
    input_record_count?: number;

    @prop({required: false, default: 0})
    output_record_count?: number;

    @prop({required: true})
    file_name!: string;

    @prop({required: true})
    s3_bucket!: string;

    @prop({required: true})
    s3_folder!: string;

    @prop({required: false, type: () => OutputDataQualityMetrics, _id: false})
    data_quality?: OutputDataQualityMetrics;
}

export type EtlEventPayload = PipelineStartPayload | FileDownloadPayload | FeedGenerationPayload;

class AwsTraceDetails extends TypegooseWithoutId {
    @prop({required: true})
    public step_function_execution_id!: string;

    @prop({required: true})
    public step_function_arn!: string;

    @prop({required: true})
    public lambda_arn!: string;

    @prop({required: true})
    public lambda_aws_request_id!: string;

    @prop({required: true})
    public lambda_log_stream_name!: string;

    @prop({required: true})
    public lambda_log_group_name!: string;
}

@modelOptions({
    schemaOptions: {
        discriminatorKey: "event_type",
        timestamps: true,
    },
    options: {
        allowMixed: Severity.ALLOW,
        discriminators: () => [
            {type: PipelineStartEvent, name: "PipelineStartEvent"},
            {type: FileDownloadEvent, name: "FileDownloadEvent"},
            {type: GoogleFeedGenerationEvent, name: "GoogleFeedGenerationEvent"},
            {type: MetaFeedGenerationEvent, name: "MetaFeedGenerationEvent"},
            {type: OfflineConversionFeedGenerationEvent, name: "OfflineConversionFeedGenerationEvent"},
        ],
    },
})
@index({brand: 1, orchestrator_execution_id: 1, createdAt: -1})
@index({brand: 1, process_id: 1, createdAt: -1})
@index({brand: 1, orchestrator_execution_id: 1, process_id: 1})
@index({createdAt: 1}, {expireAfterSeconds: 90 * DAY})
export class EtlEvent extends TypegooseBase {
    @prop({required: true, index: true})
    public execution_id!: string;

    @prop({required: true})
    public process_id!: string;

    @prop({required: true, enum: EtlPlatform})
    public platform!: EtlPlatform;

    @prop({required: true, type: () => AwsTraceDetails, _id: false})
    public platform_details!: AwsTraceDetails;

    @prop({required: true, ref: () => Brand})
    public brand!: Ref<Brand>;

    @prop({required: true, enum: ExecutionFeedType})
    public execution_feed_type!: ExecutionFeedType;

    @prop({required: true, enum: EtlEventStatus})
    public status!: EtlEventStatus;

    @prop({required: false, enum: EtlEventOutcome})
    public outcome?: EtlEventOutcome;

    @prop({required: false, enum: EtlProcessErrorCode})
    public error_code?: EtlProcessErrorCode;

    @prop({required: false})
    public error_name?: string;

    @prop({required: false})
    public error_message?: string;

    @prop({required: true, enum: EtlEventType})
    public event_type!: EtlEventType;
}

export class PipelineStartEvent extends EtlEvent {
    @prop({required: true, type: () => PipelineStartPayload, _id: false})
    declare public payload: PipelineStartPayload;
}

export class FileDownloadEvent extends EtlEvent {
    @prop({required: true, type: () => FileDownloadPayload, _id: false})
    declare public payload: FileDownloadPayload;
}

export class GoogleFeedGenerationEvent extends EtlEvent {
    @prop({required: true, type: () => FeedGenerationPayload, _id: false})
    declare public payload: FeedGenerationPayload;
}

export class MetaFeedGenerationEvent extends EtlEvent {
    @prop({required: true, type: () => FeedGenerationPayload, _id: false})
    declare public payload: FeedGenerationPayload;
}

export class OfflineConversionFeedGenerationEvent extends EtlEvent {
    @prop({required: true, type: () => FeedGenerationPayload, _id: false})
    declare public payload: FeedGenerationPayload;
}
```


**File:** `libs/database/src/mongoose/schemas/activity-log/activity-log.schema.ts`

```typescript
@index({user: 1})
export class ActivityLog extends TypegooseBase {
    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true, enum: ActivityType})
    activityType!: ActivityType;

    @prop({required: true, ref: "User"})
    user!: Ref<User>;

    @prop({required: true})
    subject!: string;

    @prop({required: false})
    object?: string;

    @prop({required: false})
    context?: {
        count?: number;
        roleIdentifier?: string;
    };

    @prop({required: false, ref: "VersionHistory"})
    versionHistory?: Ref<VersionHistory>;
}
```


**File:** `libs/database/src/mongoose/schemas/location-local-post/event.schema.ts`

```typescript
export class TimeInterval extends TypegooseWithoutId {
    @prop({required: true})
    startDate!: mybusinessbusinessinformation_v1.Schema$Date;

    @prop({required: true})
    startTime!: mybusinessbusinessinformation_v1.Schema$TimeOfDay;

    @prop({required: true})
    endDate!: mybusinessbusinessinformation_v1.Schema$Date;

    @prop({required: true})
    endTime!: mybusinessbusinessinformation_v1.Schema$TimeOfDay;
}

export class Event extends TypegooseWithoutId {
    @prop({required: true})
    title!: string;

    @prop({required: true, _id: false})
    schedule!: TimeInterval;
}
```


**File:** `libs/database/src/mongoose/schemas/provider-auth/tiktok-events-api.schema.ts`

```typescript
export class TiktokEventsApiSchema {
    @prop({required: true})
    access_token!: string;

    @prop({required: true})
    event_set_id!: string;

    @prop({required: false})
    event_set_name?: string;

    @prop({required: false})
    advertiser_id?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/setup-status/tiktok-events-setup.schema.ts`

```typescript
export class TiktokEventsSetup {
    @prop({required: true})
    event_set_id!: string;

    @prop({required: false})
    event_set_name?: string;
}
```


### DTOs

**File:** `libs/queue/src/types/queue-job-result.ts`

```typescript
export interface QueueJobResult {
    id: JobId;
    status: QueueTransactionStatus;
    processedAt?: Date;
    finishedAt?: Date;
    error?: string;
    result?: any;
}

export class QueueJobResultDto implements QueueJobResult {
    @ApiProperty({description: "Job identifier", required: true, type: "string"})
    id!: JobId;

    @ApiProperty({
        description: "Status of the job",
        required: true,
        enum: QueueTransactionStatus,
        example: QueueTransactionStatus.Ongoing,
    })
    status!: QueueTransactionStatus;

    @ApiProperty({description: "Date of the job started processing", required: false, example: new Date()})
    @IsOptional()
    processedAt?: Date;

    @ApiProperty({description: "Date of the job finished processing", required: false, example: new Date()})
    @IsOptional()
    finishedAt?: Date;

    @ApiProperty({description: "Error if any", required: false})
    @IsOptional()
    error?: string;

    @ApiProperty({description: "Result of the job", required: false})
    @IsOptional()
    result?: any;
}
```


**File:** `libs/queue/src/types/base-payload.ts`

```typescript
export interface IBasePayload {
    request_id: string;
    user: BaseBasicSharedUserDataPayload;
    distributed_trace_headers: DistributedTraceHeaders;
    auth_providers: SharedAuthProviders;
    provider: ProviderEnum;
    extra?: unknown;
    brand: string;
}

export type IBasePayloadWithoutProviders = Omit<IBasePayload, "auth_providers" | "provider">;

export abstract class BasePayloadWithoutProviders implements IBasePayloadWithoutProviders {
    @IsUUID("4")
    request_id!: string;

    @ValidateNested()
    @Type(() => BaseBasicSharedUserDataPayload)
    user!: BaseBasicSharedUserDataPayload;

    @ValidateDistributedTraceHeaders()
    distributed_trace_headers!: DistributedTraceHeaders;

    @IsMongoId()
    @IsString()
    brand!: string;

    extra?: unknown;

    protected constructor(basePayload: IBasePayloadWithoutProviders) {
        Object.assign(this, basePayload);
    }
}

export abstract class BasePayload extends BasePayloadWithoutProviders implements IBasePayload {
    @ValidateNested()
    @Type(() => SharedAuthProviders)
    auth_providers!: SharedAuthProviders;

    @IsEnum(Providers)
    provider!: ProviderEnum;

    protected constructor(basePayload: IBasePayload) {
        super(basePayload);
        Object.assign(this, basePayload);
    }
}
```


**File:** `libs/queue/src/types/base-basic-shared-payloads/base-basic-shared-user-data-payload.ts`

```typescript
export interface ISharedUserDataPayload {
    source_id: string;
}

export class BaseBasicSharedUserDataPayload implements ISharedUserDataPayload {
    @IsString()
    @IsNotEmpty()
    source_id!: string;
}
```


**File:** `libs/queue/src/types/base-basic-shared-payloads/base-basic-shared-product-data-payload.ts`

```typescript
export interface ISharedProductDataPayload {
    products: SharedProductData[] | ProductBatchEntryDto[] | ProductVariantBatchEntryDto[] | GoogleProduct[] | GoogleLocalProduct[] | ISharedProductData[] | ProductS3Dto;
    operation?: PayloadOperation;
}

export type IBaseBasicSharedProductDataPayload = IBasePayload & ISharedProductDataPayload;

export abstract class BaseBasicSharedProductDataPayload extends BasePayload implements IBaseBasicSharedProductDataPayload {
    @IsEnum(PayloadOperation)
    operation: PayloadOperation = PayloadOperation.Create;

    @ValidateNested()
    @ArrayNotEmpty()
    @Type(() => SharedProductData)
    products!: SharedProductData[];

    protected constructor(basePayload: IBaseBasicSharedProductDataPayload) {
        super(basePayload);
        Object.assign(this, basePayload);
    }
}
```


**File:** `libs/queue/src/types/base-basic-shared-payloads/base-basic-shared-inventory-data-payload.ts`

```typescript
export interface ISharedInventoryDataPayload {
    inventories: SharedInventoryData[] | InventoryBatchEntryDto[] | GoogleLocalInventory[] | ISharedInventoryData[];
    operation?: PayloadOperation;
    quantityModifiers?: InventoryQuantityModifier[];
}

export type IBaseBasicSharedInventoryDataPayload = IBasePayload & ISharedInventoryDataPayload;

export abstract class BaseBasicSharedInventoryDataPayload extends BasePayload implements IBaseBasicSharedInventoryDataPayload {
    @IsEnum(PayloadOperation)
    operation: PayloadOperation = PayloadOperation.Create;

    @ValidateNested()
    @ArrayNotEmpty()
    @Type(() => SharedInventoryData)
    inventories!: SharedInventoryData[];

    protected constructor(basePayload: IBaseBasicSharedInventoryDataPayload) {
        super(basePayload);
        Object.assign(this, basePayload);
    }
}
```


**File:** `libs/queue/src/types/base-basic-shared-payloads/base-basic-shared-partner-data-payload.ts`

```typescript
export interface ISharedPartnerDataPayload {
    is_location_enabled: string;
    is_product_enabled: string;
    brand: string;
    partner: AvailablePartnersEnum;
}

export class BaseBasicSharedPartnerDataPayload implements ISharedPartnerDataPayload {
    @IsBoolean()
    is_location_enabled!: string;

    @IsBoolean()
    is_product_enabled!: string;

    @IsString()
    @IsNotEmpty()
    brand!: string;

    @IsEnum(AvailablePartnersEnum)
    partner!: AvailablePartnersEnum;
}
```


**File:** `libs/queue/src/types/kick-payloads/kick-products-payload.ts`

```typescript
export type IKickProductsPayload = IBasePayloadWithoutProviders & {
    auth_providers: SharedAuthProviders[];
} & ISharedProductDataPayload;

export class KickProductsPayload extends BasePayloadWithoutProviders implements IKickProductsPayload, MaskedData {
    __apply_mask = true;

    @IsEnum(PayloadOperation)
    operation: PayloadOperation = PayloadOperation.Create;

    @ValidateNested({each: true})
    @ArrayNotEmpty()
    @Type(() => SharedProductData)
    products!: SharedProductData[];

    @ValidateNested({each: true})
    @ArrayNotEmpty()
    @Type(() => SharedAuthProviders)
    auth_providers!: SharedAuthProviders[];

    static create(kickPayload: IKickProductsPayload): KickProductsPayload {
        return new KickProductsPayload(kickPayload);
    }

    constructor(kickPayload: IKickProductsPayload) {
        super(kickPayload);
        Object.assign(this, kickPayload);
    }

    mask(): KickProductsPayload[] | KickProductsPayload {
        // masking logic
    }
}
```


**File:** `libs/queue/src/types/kick-payloads/kick-inventories-payload.ts`

```typescript
export type IKickInventoriesPayload = IBasePayloadWithoutProviders & {
    auth_providers: SharedAuthProviders[];
    quantityModifiers?: InventoryQuantityModifier[];
} & ISharedInventoryDataPayload;

export class KickInventoriesPayload extends BasePayloadWithoutProviders implements IKickInventoriesPayload, MaskedData {
    __apply_mask = true;

    @IsEnum(PayloadOperation)
    operation: PayloadOperation = PayloadOperation.Create;

    @ValidateNested({each: true})
    @ArrayNotEmpty()
    @Type(() => SharedInventoryData)
    inventories!: SharedInventoryData[];

    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => InventoryQuantityModifier)
    quantityModifiers?: InventoryQuantityModifier[];

    @ValidateNested({each: true})
    @ArrayNotEmpty()
    @Type(() => SharedAuthProviders)
    auth_providers!: SharedAuthProviders[];

    static create(kickPayload: IKickInventoriesPayload): KickInventoriesPayload {
        return new KickInventoriesPayload(kickPayload);
    }

    constructor(kickPayload: IKickInventoriesPayload) {
        super(kickPayload);
        Object.assign(this, kickPayload);
    }

    mask(): KickInventoriesPayload[] | KickInventoriesPayload {
        // masking logic
    }
}
```


**File:** `libs/queue/src/types/transform-payloads/transform-inventories-payload.ts`

```typescript
export type ITransformInventoriesPayload = IBaseBasicSharedInventoryDataPayload;

export class TransformInventoriesPayload extends BaseBasicSharedInventoryDataPayload implements ITransformInventoriesPayload, MaskedData {
    __apply_mask = true;

    static create(transformPayload: ITransformInventoriesPayload): TransformInventoriesPayload {
        return new TransformInventoriesPayload(transformPayload);
    }

    constructor(transformPayload: ITransformInventoriesPayload) {
        super(transformPayload);
        Object.assign(this, transformPayload);
    }

    mask(): TransformInventoriesPayload {
        return maskInventoryPayload(this);
    }

    @IsOptional()
    @ValidateNested({each: true})
    @Type(() => InventoryQuantityModifier)
    quantityModifiers?: InventoryQuantityModifier[];
}
```


**File:** `libs/queue/src/types/retrieve-payloads/retrieve-products-payload.ts`

```typescript
export interface IRetrieveProductsPayload extends IBasePayload {
    products: GoogleLocalProduct[] | GoogleProduct[];
    statuses: GoogleProductPushStatus[];
}

export interface BatchProductRetPayload {
    entries?: Schema$ProductsCustomBatchRequestEntry[];
    response?: Schema$ProductsCustomBatchResponse;
}

export class RetrieveProductsPayload extends BasePayload implements IRetrieveProductsPayload, MaskedData {
    __apply_mask = true;

    @ValidateNested()
    @ArrayNotEmpty()
    @Type(() => GoogleProduct)
    products!: GoogleProduct[];

    @IsOptional()
    @IsEnum(PayloadOperation)
    operation?: PayloadOperation;

    @ValidateNested()
    @Type(() => GoogleProductPushStatus)
    statuses!: GoogleProductPushStatus[];

    static create(retrievePayload: IRetrieveProductsPayload): RetrieveProductsPayload {
        return new RetrieveProductsPayload(retrievePayload);
    }

    constructor(retrievePayload: IRetrieveProductsPayload) {
        super(retrievePayload);
        Object.assign(this, retrievePayload);
    }

    mask(): RetrieveProductsPayload {
        return maskProductPayload(this);
    }
}
```


**File:** `libs/queue/src/types/retrieve-payloads/retrieve-inventories-payload.ts`

```typescript
export interface IRetrieveInventoriesPayload extends IBasePayload {
    inventories: GoogleLocalInventory[];
    statuses: GoogleInventoryPushStatus[];
}

export interface BatchInventoryRetPayload {
    entries?: Schema$LocalInventoryCustomBatchRequestEntry[];
    response?: Schema$LocalInventoryCustomBatchResponse;
}

export class RetrieveInventoriesPayload extends BasePayload implements IRetrieveInventoriesPayload, MaskedData {
    __apply_mask = true;

    @ValidateNested()
    @ArrayNotEmpty()
    @Type(() => GoogleLocalInventory)
    inventories!: GoogleLocalInventory[];

    @IsOptional()
    @IsEnum(PayloadOperation)
    operation?: PayloadOperation;

    @ValidateNested()
    @Type(() => GoogleInventoryPushStatus)
    statuses!: GoogleInventoryPushStatus[];

    static create(retrievePayload: IRetrieveInventoriesPayload): RetrieveInventoriesPayload {
        return new RetrieveInventoriesPayload(retrievePayload);
    }

    constructor(retrievePayload: IRetrieveInventoriesPayload) {
        super(retrievePayload);
        Object.assign(this, retrievePayload);
    }

    mask(): RetrieveInventoriesPayload {
        return maskInventoryPayload(this);
    }
}
```


**File:** `libs/queue/src/types/location-insights-payload.ts`

```typescript
export interface ISharedLocationInsightDataPayload {
    location: ISharedLocationData | SharedLocationData;
}

export class LocationInsightPayload implements ISharedLocationInsightDataPayload {
    @IsString()
    request_id!: string;

    @ValidateNested()
    @Type(() => SharedLocationData)
    location!: ISharedLocationData | SharedLocationData;

    @IsOptional()
    @ValidateNested()
    @Type(() => BaseBasicSharedUserDataPayload)
    user?: BaseBasicSharedUserDataPayload;

    @ValidateDistributedTraceHeaders()
    distributed_trace_headers!: DistributedTraceHeaders;

    @IsOptional()
    @ValidateNested()
    @Type(() => InsightDate)
    start_date?: InsightDate;

    @IsOptional()
    @ValidateNested()
    @Type(() => InsightDate)
    end_date?: InsightDate;
}
```


**File:** `libs/queue/src/types/location-media-items-payload.ts`

```typescript
export interface ISharedLocationMediaItemDataPayload {
    location: ISharedLocationData | SharedLocationData;
}

export class LocationMediaItemPayload implements ISharedLocationMediaItemDataPayload {
    @IsString()
    request_id!: string;

    @ValidateNested()
    @Type(() => SharedLocationData)
    location!: ISharedLocationData | SharedLocationData;

    @IsOptional()
    @ValidateNested()
    @Type(() => BaseBasicSharedUserDataPayload)
    user?: BaseBasicSharedUserDataPayload;

    @ValidateDistributedTraceHeaders()
    distributed_trace_headers!: DistributedTraceHeaders;
}
```


**File:** `libs/queue/src/types/location-reviews-payload.ts`

```typescript
export interface ISharedLocationReviewDataPayload {
    location: ISharedLocationData | SharedLocationData;
}

export interface ISharedMultipleLocationReviewDataPayload {
    locations: ISharedLocationData[] | SharedLocationData[];
}

export class LocationReviewPayload implements ISharedLocationReviewDataPayload {
    @IsString()
    request_id!: string;

    @ValidateNested()
    @Type(() => SharedLocationData)
    location!: ISharedLocationData | SharedLocationData;

    @IsOptional()
    @ValidateNested()
    @Type(() => BaseBasicSharedUserDataPayload)
    user?: BaseBasicSharedUserDataPayload;

    @ValidateDistributedTraceHeaders()
    distributed_trace_headers!: DistributedTraceHeaders;
}

export class MultipleLocationReviewPayload implements ISharedMultipleLocationReviewDataPayload {
    @IsString()
    request_id!: string;

    @IsString()
    @IsMongoId()
    brand!: string;

    @ValidateNested()
    @Type(() => SharedLocationData)
    locations!: ISharedLocationData[] | SharedLocationData[];

    @IsOptional()
    @ValidateNested()
    @Type(() => BaseBasicSharedUserDataPayload)
    user?: BaseBasicSharedUserDataPayload;

    @ValidateDistributedTraceHeaders()
    distributed_trace_headers!: DistributedTraceHeaders;
}

export class RemoveLocationReviewsPayload extends MultipleLocationReviewPayload {}
```


**File:** `libs/queue/src/types/meta-page-insights-payload.ts`

```typescript
export interface ISharedMetaPageInsightDataPayload {
    brand: ISharedBrandData | SharedBrandData;
    pageId: string;
}

export class MetaPageInsightPayload {
    @IsString()
    request_id!: string;

    @ValidateNested()
    @Type(() => SharedBrandData)
    brand!: ISharedBrandData | SharedBrandData;

    @IsString()
    pageId!: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => BaseBasicSharedUserDataPayload)
    user?: BaseBasicSharedUserDataPayload;

    @ValidateDistributedTraceHeaders()
    distributed_trace_headers!: DistributedTraceHeaders;

    @IsOptional()
    @IsString()
    start_date?: string;

    @IsOptional()
    @IsString()
    end_date?: string;
}
```


**File:** `libs/queue/src/types/apple-insights-payload.ts`

```typescript
export interface ISharedAppleInsightDataPayload {
    resourceType: AppleInsightResourceType;
    resourceId: string;
}

export class AppleInsightPayload implements ISharedAppleInsightDataPayload {
    @IsString()
    request_id!: string;

    @IsEnum(AppleInsightResourceType)
    resourceType!: AppleInsightResourceType;

    @IsString()
    resourceId!: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => BaseBasicSharedUserDataPayload)
    user?: BaseBasicSharedUserDataPayload;

    @ValidateDistributedTraceHeaders()
    distributed_trace_headers!: DistributedTraceHeaders;

    @IsOptional()
    @ValidateNested()
    @Type(() => SharedLocationData)
    location?: ISharedLocationData | SharedLocationData;

    @IsOptional()
    @IsString()
    start_date?: string;

    @IsOptional()
    @IsString()
    end_date?: string;
}
```


**File:** `libs/queue/src/types/generate-graph-payload.ts`

```typescript
export interface ISharedGenerateGraphPayload {
    venue_id: string;
}

export class GenerateGraphPayload implements ISharedGenerateGraphPayload {
    @IsUUID("4")
    request_id!: string;

    @IsMongoId()
    venue_id!: string;

    @ArrayNotEmpty()
    rules!: Record<string, unknown>[];

    @ValidateNested()
    @Type(() => BaseBasicSharedUserDataPayload)
    @IsOptional()
    user?: BaseBasicSharedUserDataPayload;

    @ValidateDistributedTraceHeaders()
    distributed_trace_headers!: DistributedTraceHeaders;
}
```


**File:** `libs/queue/src/types/clean-remote-storage.payload.ts`

```typescript
export interface IBasicFileInfo {
    id: string;
    storageKey: string;
}

export class BasicFileInfo implements IBasicFileInfo {
    @IsMongoId()
    id!: string;

    @IsString()
    storageKey!: string;
}

export interface ISharedCleanRemoteStoragePayload {
    file: BasicFileInfo;
}

export class CleanRemoteStoragePayload implements ISharedCleanRemoteStoragePayload {
    @IsString()
    request_id!: string;

    @ValidateNested()
    @Type(() => BasicFileInfo)
    file!: BasicFileInfo;

    @ValidateNested()
    @Type(() => BaseBasicSharedUserDataPayload)
    @IsOptional()
    user?: BaseBasicSharedUserDataPayload;

    @ValidateDistributedTraceHeaders()
    distributed_trace_headers!: DistributedTraceHeaders;
}
```


**File:** `libs/queue/src/types/s3-batch-payloads/batch-s3-base-payload.ts`

```typescript
export abstract class BatchS3BasePayload {
    @IsString()
    request_id!: string;

    @ValidateNested()
    @Type(() => BaseBasicSharedUserDataPayload)
    @IsOptional()
    user?: BaseBasicSharedUserDataPayload;

    @ValidateDistributedTraceHeaders()
    distributed_trace_headers!: DistributedTraceHeaders;

    @IsMongoId()
    brand_id!: string;

    @IsEnum(LIAProgramEnum)
    @IsString()
    lia_program!: string;
}
```


**File:** `libs/queue/src/types/s3-batch-payloads/batch-s3-products-payload.ts`

```typescript
export class BatchS3ProductPayload extends BatchS3BasePayload implements IBatchS3Payload {
    @ValidateNested({each: true})
    @ArrayNotEmpty()
    @Type(() => ProductS3Dto)
    products!: ProductS3Dto[];

    @IsMongoId()
    etl_file_log_id!: string;
}
```


**File:** `libs/queue/src/types/s3-batch-payloads/batch-s3-inventories-payload.ts`

```typescript
export class BatchS3InventoryPayload extends BatchS3BasePayload implements IBatchS3Payload {
    @ValidateNested({each: true})
    @ArrayNotEmpty()
    @Type(() => InventoryS3Dto)
    inventories!: InventoryS3Dto[];

    @IsMongoId()
    etl_file_log_id!: string;
}
```


**File:** `libs/queue/src/types/s3-batch-payloads/batch-s3-scheduler-payload.ts`

```typescript
export class BatchS3SchedulerPayload {
    @IsString()
    request_id!: string;

    @ValidateNested()
    @Type(() => BaseBasicSharedUserDataPayload)
    @IsOptional()
    user?: BaseBasicSharedUserDataPayload;

    @ValidateDistributedTraceHeaders()
    distributed_trace_headers!: DistributedTraceHeaders;

    @IsString()
    brand_id!: string;

    @IsEnum(FeedType)
    feed_type!: FeedType;

    @IsString()
    batch_s3_bucket_folder!: string;
}
```


**File:** `libs/queue/src/types/partner/partner-data-payload.ts`

```typescript
export class PartnerDataPayload {
    @IsString()
    request_id!: string;

    @IsString()
    @IsMongoId()
    brand!: string;

    @IsBoolean()
    is_product_enabled!: boolean;

    @IsBoolean()
    is_location_enabled!: boolean;

    @IsEnum(AvailablePartnersEnum)
    partner!: AvailablePartnersEnum;

    @IsOptional()
    @ValidateNested()
    @Type(() => BaseBasicSharedUserDataPayload)
    user?: BaseBasicSharedUserDataPayload;

    @ValidateDistributedTraceHeaders()
    distributed_trace_headers!: DistributedTraceHeaders;
}
```


**File:** `libs/queue/src/types/partner/togg-job-tracker-payload.ts`

```typescript
export class ToggJobTrackerPayload {
    @IsString()
    request_id!: string;

    @IsString()
    @IsMongoId()
    brand!: string;

    @IsEnum(AvailablePartnersEnum)
    partner!: AvailablePartnersEnum.TOGG;

    @IsOptional()
    @ValidateNested()
    @Type(() => BaseBasicSharedUserDataPayload)
    user?: BaseBasicSharedUserDataPayload;

    @ValidateDistributedTraceHeaders()
    distributed_trace_headers!: DistributedTraceHeaders;
}
```


**File:** `libs/queue/src/types/google-cloud-pubsub-payload.ts`

```typescript
export interface ISharedGooglePubsubPayload {
    pubsub_subscription_name: string;
}

export class GoogleCloudPubsubPayload implements ISharedGooglePubsubPayload {
    @IsString()
    request_id!: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => BaseBasicSharedUserDataPayload)
    user?: BaseBasicSharedUserDataPayload;

    @ValidateDistributedTraceHeaders()
    distributed_trace_headers!: DistributedTraceHeaders;

    @IsString()
    @IsMongoId()
    brand!: string;

    @IsString()
    pubsub_subscription_name!: string;
}
```


**File:** `libs/queue/src/types/auth/shared-auth-providers.ts`

```typescript
export class SharedAuthProviders {
    constructor(provider: ProviderEnum) {
        this.provider = provider;
    }

    @IsDefined()
    @IsEnum(Providers)
    provider!: ProviderEnum;

    @ValidateIf(
        (o) =>
            o.provider === ProviderEnum.google_content_api_inventory ||
            o.provider === ProviderEnum.google_content_api_product,
    )
    @IsDefined()
    @ValidateNested()
    @Type(() => SharedAuthGoogleMerchantCenter)
    google_merchant_center?: SharedAuthGoogleMerchantCenter;

    @ValidateIf((o) => o.provider === ProviderEnum.google_my_business)
    @IsDefined()
    @ValidateNested()
    @Type(() => SharedAuthGoogleMyBusiness)
    google_my_business?: SharedAuthGoogleMyBusiness;

    @ValidateIf((o) => o.provider === ProviderEnum.meta_graph_api_pages)
    @IsDefined()
    @ValidateNested()
    @Type(() => SharedAuthMetaGraphApiPages)
    meta_graph_api_pages?: SharedAuthMetaGraphApiPages;

    @ValidateIf((o) => o.provider === ProviderEnum.apple_business_connect)
    @IsDefined()
    @ValidateNested()
    @Type(() => SharedAuthAppleBusinessConnect)
    apple_business_connect?: SharedAuthAppleBusinessConnect;
}
```


**File:** `libs/dto/src/user/notification-settings.dto.ts`

```typescript
export class BulkNotificationSettingsDto {
    @ApiProperty({
        name: "Scheduled rate",
        enum: NotificationScheduledRateEnum,
        default: NotificationScheduledRateEnum.DAILY,
    })
    @IsEnum(NotificationScheduledRateEnum)
    scheduled_rate!: NotificationScheduledRateEnum;

    @ApiProperty({name: "Scheduled Rate enabled", default: true})
    @IsBoolean()
    scheduled_rate_enabled!: boolean;

    @ApiProperty({
        name: "Bulk review count",
        enum: NotificationBulkReviewCountEnum,
        default: NotificationBulkReviewCountEnum.FIFTY,
    })
    @IsEnum(NotificationBulkReviewCountEnum)
    bulk_review_count!: NotificationBulkReviewCountEnum;

    @ApiProperty({name: "Bulk review count enabled", default: true})
    @IsBoolean()
    bulk_review_count_enabled!: boolean;
}

export class NotificationSettingsCreateDto {
    @ApiProperty({name: "brand", example: "5e679df9a82ab82c9977cd77"})
    @IsMongoId()
    brand!: string;

    @ApiProperty({name: "Notifications enabled", default: true})
    @IsBoolean()
    notifications_enabled!: boolean;

    @ApiProperty({
        name: "Notifications enabled for ratings",
    })
    @IsArray()
    @IsEnum(StarRatingNotificationEnum, {each: true})
    rating_notifications!: StarRatingNotificationEnum[];

    @ApiProperty({
        name: "Notifications enabled for locations",
        example: ["5e679df9a82ab82c9977cd77"],
    })
    @IsArray()
    @IsMongoId({each: true})
    location_notifications!: string[];

    @ApiProperty({
        name: "Notifications pattern, instant or bulk",
    })
    @IsEnum(NotificationPatternEnum)
    notification_pattern!: NotificationPatternEnum;

    @ApiProperty({
        name: "Bulk notification settings",
    })
    @ValidateNested()
    @Type(() => BulkNotificationSettingsDto)
    bulk_notification_settings!: BulkNotificationSettingsDto;
}

export class NotificationSettingsDto extends NotificationSettingsCreateDto {
    @ApiProperty({name: "user", example: "5e679df9a82ab82c9977cd77"})
    @IsMongoId()
    user!: string;
}

export class NotificationSettingsUpdateDto extends PartialType(OmitType(NotificationSettingsCreateDto, ["brand"])) {}
```


**File:** `libs/dto/src/product/product-batch.dto.ts`

```typescript
export class ProductBatchDto {
    @ApiProperty({
        enum: PayloadOperation,
        description: "Batch operation (create or delete)",
        example: PayloadOperation.Create,
    })
    @IsIn(PAYLOAD_OPERATIONS)
    operation!: PayloadOperation;

    @ApiProperty({
        type: [ProductBatchEntryDto],
        description: "Product list",
    })
    @ValidateNested()
    @ArrayNotEmpty()
    @ArrayMaxSize(MAX_PRODUCT_SIZE)
    @ArrayEvery(["brand"])
    @Type(() => ProductBatchEntryDto)
    products!: ProductBatchEntryDto[];
}

export async function validateBatchForCreate(payload: ProductBatchDto): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];
    for (const p of payload.products) {
        const error = await validate(plainToInstance(ProductBatchCreateDto, classToPlain(p)));
        if (error.length) {
            errors.push(...error);
        }
    }
    return errors;
}
```


**File:** `libs/dto/src/product/inventory-batch.dto.ts`

```typescript
export class InventoryBatchDto {
    @ApiProperty({
        enum: PayloadOperation,
        description: "Batch operation (create or delete)",
        example: PayloadOperation.Create,
    })
    @IsIn(PAYLOAD_OPERATIONS)
    operation!: PayloadOperation;

    @ApiProperty({
        type: [InventoryBatchEntryDto],
        description: "Inventory list",
    })
    @ValidateNested()
    @ArrayNotEmpty()
    @ArrayMaxSize(MAX_PRODUCT_SIZE)
    @ArrayEvery(["variant"])
    @Type(() => InventoryBatchEntryDto)
    inventories!: InventoryBatchEntryDto[];
}

export class InventoryCreateBatchDto {
    @ApiProperty({
        description: "Variant identifier (mongo id or source id)",
        required: true,
        examples: ["5ef1e9a1afd745cddc851449", "source:SKU-1234"],
    })
    @IsValidRefId()
    variant!: string;

    @ApiProperty({
        enum: PayloadOperation,
        description: "Batch operation (create or delete)",
        example: PayloadOperation.Create,
    })
    @IsIn(PAYLOAD_OPERATIONS)
    operation!: PayloadOperation;

    @ApiProperty({
        type: [InventoryCreateBatchEntryDto],
        description: "Inventory list",
    })
    @ValidateNested()
    @ArrayNotEmpty()
    @ArrayMaxSize(MAX_PRODUCT_SIZE)
    @ArrayEvery(["variant"])
    @Type(() => InventoryCreateBatchEntryDto)
    inventories!: InventoryCreateBatchEntryDto[];
}

export async function validateInventoryBatchForCreate(payload: InventoryBatchDto): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];
    for (const p of payload.inventories) {
        const error = await validate(plainToInstance(InventoryBatchCreateDto, classToPlain(p)));
        if (error.length) {
            errors.push(...error);
        }
    }
    return errors;
}
```


**File:** `libs/dto/src/product/product-variant-batch.dto.ts`

```typescript
export class ProductVariantBatchDto {
    @ApiProperty({
        enum: PayloadOperation,
        description: "Batch operation (create or delete)",
        example: PayloadOperation.Create,
    })
    @IsIn(PAYLOAD_OPERATIONS)
    operation!: PayloadOperation;

    @ApiProperty({
        type: [ProductVariantBatchEntryDto],
        description: "Product variant list",
    })
    @ValidateNested()
    @ArrayNotEmpty()
    @ArrayMaxSize(MAX_PRODUCT_SIZE)
    @Type(() => ProductVariantBatchEntryDto)
    productVariants!: ProductVariantBatchEntryDto[];
}

export class ProductVariantCreateBatchDto {
    @ApiProperty({
        enum: PayloadOperation,
        description: "Batch operation (create or delete)",
        example: "create",
    })
    @IsIn(PAYLOAD_OPERATIONS)
    operation!: PayloadOperation;

    @ApiProperty({
        type: [ProductVariantCreateBatchEntryDto],
        description: "Product variant list",
    })
    @ValidateNested()
    @ArrayNotEmpty()
    @ArrayMaxSize(MAX_PRODUCT_SIZE)
    @Type(() => ProductVariantCreateBatchEntryDto)
    productVariants!: ProductVariantCreateBatchEntryDto[];
}

export async function validateVariantBatchForCreate(payload: ProductVariantBatchDto): Promise<ValidationError[]> {
    const errors: ValidationError[] = [];
    for (const p of payload.productVariants) {
        const error = await validate(plainToInstance(ProductVariantBatchCreateDto, classToPlain(p)));
        if (error.length) {
            errors.push(...error);
        }
    }
    return errors;
}
```


### Enums & Constants

**File:** `libs/queue/src/types/queue-names.ts`

```typescript
export const QUEUE_NAMES = [
    "kicking",
    "transforming",
    "pushing",
    "pushing-local-inventory",
    "batching",
    "deleting",
    "retrieving",
    "getting-insight",
    "getting-media-item",
    "getting-review",
    "cleaning-remote-storage",
    "generating-graph",
    "s3-batch",
] as const;

export const [
    QUEUE_NAME_KICKING,
    QUEUE_NAME_TRANSFORMING,
    QUEUE_NAME_PUSHING,
    QUEUE_NAME_PUSHING_LI,
    QUEUE_NAME_BATCHING,
    QUEUE_NAME_DELETING,
    QUEUE_NAME_RETRIEVING,
    QUEUE_NAME_LOCATION_INSIGHTS,
    QUEUE_NAME_LOCATION_MEDIA_ITEMS,
    QUEUE_NAME_LOCATION_REVIEWS,
    QUEUE_NAME_CLEAN_REMOTE_STORAGE,
    QUEUE_NAME_GENERATE_GRAPH,
    QUEUE_NAME_S3_BATCH,
] = QUEUE_NAMES;

export const QUEUE_BY_CONSUMER = {
    [QUEUE_NAME_KICKING]: "kicker",
    [QUEUE_NAME_TRANSFORMING]: "transformer",
    [QUEUE_NAME_PUSHING]: "pusher",
    [QUEUE_NAME_PUSHING_LI]: "pusher",
    [QUEUE_NAME_BATCHING]: "batch",
    [QUEUE_NAME_DELETING]: "delete",
    [QUEUE_NAME_RETRIEVING]: "retrieve",
    [QUEUE_NAME_LOCATION_INSIGHTS]: "insight",
    [QUEUE_NAME_LOCATION_MEDIA_ITEMS]: "media-item",
    [QUEUE_NAME_LOCATION_REVIEWS]: "review",
    [QUEUE_NAME_CLEAN_REMOTE_STORAGE]: "clean-remote-storage",
    [QUEUE_NAME_GENERATE_GRAPH]: "generating-graph",
    [QUEUE_NAME_S3_BATCH]: "s3-batch",
} as const;

export type QueueNames = (typeof QUEUE_NAMES)[number];
export type ConsumerNames = (typeof QUEUE_BY_CONSUMER)[QueueNames];
```


**File:** `libs/queue/src/types/sqs-queue-names.ts`

```typescript
export const SQS_QUEUE_NAMES = [
    "sqs-review",
    "sqs-partner-data",
    "sqs-media-item",
    "sqs-location-insight",
    "sqs-meta-page-insight",
    "sqs-apple-insight",
    "sqs-s3-batch",
    "sqs-clean-remote-storage",
] as const;

export const [
    SQS_QUEUE_NAME_REVIEW,
    SQS_QUEUE_NAME_PARTNER,
    SQS_QUEUE_NAME_MEDIA_ITEM,
    SQS_QUEUE_NAME_LOCATION_INSIGHT,
    SQS_QUEUE_NAME_META_PAGE_INSIGHT,
    SQS_QUEUE_NAME_APPLE_INSIGHT,
    SQS_QUEUE_NAME_S3_BATCH,
    SQS_QUEUE_NAME_CLEAN_REMOTE_STORAGE,
] = SQS_QUEUE_NAMES;

export const SQS_QUEUE_BY_CONSUMER = {
    [SQS_QUEUE_NAME_REVIEW]: "sqs-review",
    [SQS_QUEUE_NAME_PARTNER]: "sqs-partner-data",
    [SQS_QUEUE_NAME_MEDIA_ITEM]: "sqs-media-item",
    [SQS_QUEUE_NAME_LOCATION_INSIGHT]: "sqs-location-insight",
    [SQS_QUEUE_NAME_META_PAGE_INSIGHT]: "sqs-meta-page-insight",
    [SQS_QUEUE_NAME_APPLE_INSIGHT]: "sqs-apple-insight",
    [SQS_QUEUE_NAME_S3_BATCH]: "sqs-s3-batch",
    [SQS_QUEUE_NAME_CLEAN_REMOTE_STORAGE]: "sqs-clean-remote-storage",
} as const;

export type SqsQueueNames = (typeof SQS_QUEUE_NAMES)[number];
export type SqsConsumerNames = (typeof SQS_QUEUE_BY_CONSUMER)[SqsQueueNames];
```


**File:** `libs/queue/src/types/sqs/sqs-events.ts`

```typescript
export enum SqsEvent {
    ERROR = "error",
    MESSAGE_PROCESSED = "message_processed",
    ABORTED = "aborted",
    EMPTY = "empty",
    MESSAGE_RECEIVED = "message_received",
    OPTION_UPDATED = "option_updated",
    PROCESSING_ERROR = "processing_error",
    RESPONSE_PROCESSED = "response_processed",
    STARTED = "started",
    STOPPED = "stopped",
    TIMEOUT_ERROR = "timeout_error",
    WAITING_FOR_POLLING_TO_COMPLETE = "waiting_for_polling_to_complete",
    WAITING_FOR_POLLING_TO_COMPLETE_TIMEOUT_EXCEEDED = "waiting_for_polling_to_complete_timeout_exceeded",
}
```


**File:** `libs/constants/src/notification-settings/notification-frequency.ts`

```typescript
export enum NotificationPatternEnum {
    INSTANT = "instant",
    BULK = "bulk",
}

export enum NotificationScheduledRateEnum {
    DAILY = "daily",
    WEEKLY = "weekly",
    FORTNIGHT = "fortnight",
    MONTHLY = "monthly",
}

export enum NotificationBulkReviewCountEnum {
    FIVE = 5,
    TEN = 10,
    FIFTY = 50,
    HUNDRED = 100,
    TWO_HUNDRED_FIFTY = 250,
    FIVE_HUNDRED = 500,
}

export const NotificationScheduledRates = Object.values(
    NotificationScheduledRateEnum,
) as NotificationScheduledRateEnum[];

export const NotificationBulkReviewCounts = Object.values(NotificationBulkReviewCountEnum).filter(
    (v) => !Number.isNaN(Number(v)),
);
```


**File:** `libs/constants/src/location/location-review.ts`

```typescript
export enum StarRatingEnum {
    unspecified = "STAR_RATING_UNSPECIFIED",
    one = "ONE",
    two = "TWO",
    three = "THREE",
    four = "FOUR",
    five = "FIVE",
}

export enum ReviewSourceEnum {
    GOOGLE = "Google",
    APPLE = "Apple",
    META = "Meta",
    TIKTOK = "Tiktok",
}

export enum ReviewStatusEnum {
    ANSWERED = "ANSWERED",
    UNANSWERED = "UNANSWERED",
}

export enum AutoReplyActionEnum {
    CREATE = "Create",
    UPDATE = "Update",
    DELETE = "Delete",
    GET = "Get",
}

export enum StarRatingNotificationEnum {
    ONE = "ONE",
    TWO = "TWO",
    THREE = "THREE",
    FOUR = "FOUR",
    FIVE = "FIVE",
}

export const StarRatingNotifications = Object.values(StarRatingNotificationEnum) as StarRatingNotificationEnum[];

export enum ReviewSentimentEnum {
    NO_DATA = "no_sentiment_data",
    ALL = "all_sentiments",
    POSITIVE = "positive_sentiment",
    NEGATIVE = "negative_sentiment",
    NEUTRAL = "neutral_sentiment",
}
```


**File:** `libs/constants/src/business-listing-api/notification-types.ts`

```typescript
export enum NotificationTypesEnum {
    NOTIFICATION_TYPE_UNSPECIFIED = "NOTIFICATION_TYPE_UNSPECIFIED",
    GOOGLE_UPDATE = "GOOGLE_UPDATE",
    NEW_REVIEW = "NEW_REVIEW",
    UPDATED_REVIEW = "UPDATED_REVIEW",
    NEW_CUSTOMER_MEDIA = "NEW_CUSTOMER_MEDIA",
    NEW_QUESTION = "NEW_QUESTION",
    UPDATED_QUESTION = "UPDATED_QUESTION",
    NEW_ANSWER = "NEW_ANSWER",
    UPDATED_ANSWER = "UPDATED_ANSWER",
    DUPLICATE_LOCATION = "DUPLICATE_LOCATION",
    VOICE_OF_MERCHANT_UPDATED = "VOICE_OF_MERCHANT_UPDATED",
}
```


**File:** `libs/constants/src/activity-type.ts`

```typescript
export enum ActivityType {
    UserRegistration = "UserRegistration",
    UserDeletion = "UserDeletion",
    UserRoleUpdate = "UserRoleUpdate",
    UserInvitation = "UserInvitation",

    // Integrations - Google
    GoogleLocationAccountLinked = "GoogleLocationAccountLinked",
    GoogleLocationIntegrationComplete = "GoogleLocationIntegrationComplete",
    GoogleLocationIntegrationDisconnected = "GoogleLocationIntegrationDisconnected",
    GoogleMerchantAccountLinked = "GoogleMerchantAccountLinked",
    GoogleMerchantIntegrationComplete = "GoogleMerchantIntegrationComplete",
    GoogleMerchantIntegrationDisconnected = "GoogleMerchantIntegrationDisconnected",
    GoogleAdsAccountLinked = "GoogleAdsAccountLinked",
    GoogleAdsIntegrationComplete = "GoogleAdsIntegrationComplete",
    GoogleAdsIntegrationDisconnected = "GoogleAdsIntegrationDisconnected",

    // Integrations - Meta
    MetaLocationsAccountLinked = "MetaLocationsAccountLinked",
    MetaLocationsStoreCodesMismatchCheck = "MetaLocationsStoreCodesMismatchCheck",
    MetaLocationsStoreCodesUserMatch = "MetaLocationsStoreCodesUserMatch",
    MetaLocationsIntegrationDisconnected = "MetaLocationsIntegrationDisconnected",
    MetaCommerceAccountLinked = "MetaCommerceAccountLinked",
    MetaCommerceIntegrationComplete = "MetaCommerceIntegrationComplete",
    MetaCommerceIntegrationDisconnected = "MetaCommerceIntegrationDisconnected",
    MetaConversionAccountLinked = "MetaConversionAccountLinked",
    MetaConversionIntegrationDisconnected = "MetaConversionIntegrationDisconnected",

    // Integrations - TikTok
    TiktokConversionAccountLinked = "TiktokConversionAccountLinked",
    TiktokConversionIntegrationDisconnected = "TiktokConversionIntegrationDisconnected",

    // Integrations - Apple
    AppleLocationsAccountLinked = "AppleLocationsAccountLinked",
    AppleLocationsStoreCodesUserMatch = "AppleLocationsStoreCodesUserMatch",
    AppleLocationsIntegrationDisconnected = "AppleLocationsIntegrationDisconnected",

    // Integrations - Yandex
    YandexLocationsEnabled = "YandexLocationsEnabled",
    YandexLocationsDisabled = "YandexLocationsDisabled",

    // Location operations
    ExcelLocationsFileImport = "ExcelLocationsFileImport",
    AnalyzeFileLocations = "AnalyzeFileLocations",
    GetFileLocationsMatchingStatuses = "GetFileLocationsMatchingStatuses",
    GetFileLocationDecisions = "GetFileLocationDecisions",
    GetFileLocationDecisionSummary = "GetFileLocationDecisionSummary",
    MakeFileLocationDecisions = "MakeFileLocationDecisions",
    ApplyFileLocationDecisions = "ApplyFileLocationDecisions",

    // Location export service
    LocationsExportXLSX = "LocationsExportXLSX",
    LocationsExportYandexXML = "LocationsExportYandexXML",

    // Location service
    LocationsImport = "LocationsImport",
    LocationCreate = "LocationCreate",
    LocationUpdate = "LocationUpdate",
    LocationDelete = "LocationDelete",

    // Location media item service
    LocationMediaItemsUpdate = "LocationMediaItemsUpdate",
    LocationMediaItemDelete = "LocationMediaItemDelete",

    // Location review service
    ReviewReplied = "ReviewReplied",
    AutoReplyTemplateCreate = "AutoReplyTemplateCreate",
    AutoReplyTemplateUpdate = "AutoReplyTemplateUpdate",
    AutoReplyTemplateDelete = "AutoReplyTemplateDelete",

    // Store set service
    StoreSetCreated = "StoreSetCreated",
    StoreSetUpdate = "StoreSetUpdate",
    StoreSetDelete = "StoreSetDelete",

    // Brand service
    BrandUpdate = "BrandUpdate",
}
```


**File:** `libs/constants/src/etl/etl-events.ts`

```typescript
export enum FileValidationErrorType {
    INVALID_HEADER = "INVALID_HEADER",
    COLUMN_COUNT_MISMATCH = "COLUMN_COUNT_MISMATCH",
    PARSE_ERROR = "PARSE_ERROR",
    EMPTY_FILE = "EMPTY_FILE",
    INSUFFICIENT_ROWS = "INSUFFICIENT_ROWS",
    FILE_READ_ERROR = "FILE_READ_ERROR",
    INVALID_JSON_STRUCTURE = "INVALID_JSON_STRUCTURE",
    INVALID_PARQUET_SIZE = "INVALID_PARQUET_SIZE",
    INVALID_PARQUET_HEADER = "INVALID_PARQUET_HEADER",
    INVALID_PARQUET_FOOTER = "INVALID_PARQUET_FOOTER",
}

export enum EtlEventType {
    PIPELINE_START = "PIPELINE_START",
    FILE_DOWNLOAD = "FILE_DOWNLOAD",
    GOOGLE_FEED_GENERATION = "GOOGLE_FEED_GENERATION",
    META_FEED_GENERATION = "META_FEED_GENERATION",
    OFFLINE_CONVERSION_FEED_GENERATION = "OFFLINE_CONVERSION_FEED_GENERATION",
}

export enum EtlEventStatus {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
}

export enum EtlEventOutcome {
    CLEAN = "CLEAN",
    PARTIAL = "PARTIAL",
    DEGRADED = "DEGRADED",
}

export enum EtlPlatform {
    AWS = "AWS",
    GCP = "GCP",
    WINDMILL = "WINDMILL",
}
```


**File:** `libs/constants/src/etl/pipeline-health-status.ts`

```typescript
export enum EtlProcessErrorCode {
    SOURCE_DATA_MISSING = "SOURCE_DATA_MISSING",
    SOURCE_AUTH_FAILURE = "SOURCE_AUTH_FAILURE",
    SOURCE_UNREACHABLE = "SOURCE_UNREACHABLE",
    PLATFORM_AUTH_FAILURE = "PLATFORM_AUTH_FAILURE",
    INVALID_DATA_FORMAT = "INVALID_DATA_FORMAT",
    INTERNAL_PROCESSING_ERROR = "INTERNAL_PROCESSING_ERROR",
    PIPELINE_START_MISSING = "PIPELINE_START_MISSING",
    EXPECTED_EVENTS_MISSING = "EXPECTED_EVENTS_MISSING",
    PIPELINE_RUNS_FAILED_OR_MISSING = "PIPELINE_RUNS_FAILED_OR_MISSING",
    PIPELINE_NOT_TRIGGERED = "PIPELINE_NOT_TRIGGERED",
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export enum EtlEventHealthStatus {
    HEALTHY = "HEALTHY",
    WARNING = "WARNING",
    ERROR = "ERROR",
    STALE = "STALE",
    IN_PROGRESS = "IN_PROGRESS",
}

export enum AlertSeverity {
    CRITICAL = "CRITICAL",
    WARNING = "WARNING",
}

export enum AnomalyDirection {
    INCREASE = "INCREASE",
    DECREASE = "DECREASE",
}

export enum AnomalyType {
    FILE_COUNT = "FILE_COUNT",
    FILE_SIZE = "FILE_SIZE",
    OUTPUT_RECORD_COUNT = "OUTPUT_RECORD_COUNT",
    INPUT_RECORD_COUNT = "INPUT_RECORD_COUNT",
    FILTER_RATIO = "FILTER_RATIO",
    MISSING_EVENT = "MISSING_EVENT",
}

export const ANOMALY_THRESHOLDS = {
    warning: 0.2,
    critical: 0.5,
} as const;
```


**File:** `libs/constants/src/payload-operation.ts`

```typescript
export enum PayloadOperation {
    Create = "create",
    Delete = "delete",
}

export const PAYLOAD_OPERATIONS = Object.values(PayloadOperation);
```


### Interfaces & Types

**File:** `libs/queue/src/types/base-basic-shared-payloads/base-basic-shared-location-data-payload.ts`

```typescript
export interface SharedLocationWithAuth {
    location: SharedLocationData;
    auth_providers: SharedAuthProviders;
}

export class SharedLocationAuth {
    location!: SharedLocationData;
    auth_providers!: SharedAuthProviders;
}

export interface ISharedLocationDataPayload {
    locations?: ISharedLocationData[] | SharedLocationData[] | GoogleLocation[] | SharedMetaPageLocation[] | SharedAppleLocation[];
    locationsAuth?: SharedLocationWithAuth[];
}

export type IBaseBasicSharedLocationDataPayload = IBasePayload & ISharedLocationDataPayload;

export abstract class BaseBasicSharedLocationDataPayload extends BasePayload implements ISharedLocationDataPayload {
    @ValidateNested()
    @ArrayNotEmpty()
    @Type(() => SharedLocationData)
    locations!: SharedLocationData[];

    protected constructor(basePayload: IBaseBasicSharedLocationDataPayload) {
        super(basePayload);
        Object.assign(this, basePayload);
    }
}
```


**File:** `libs/queue/src/types/base-basic-shared-payloads/base-basic-shared-attribute-data-payload.ts`

```typescript
export interface SharedAttributeWithAuth {
    attribute: SharedAttributeData;
    auth_providers: SharedAuthProviders;
}

export class SharedAttributeAuth {
    attribute!: SharedAttributeData;
    auth_providers!: SharedAuthProviders;
}

export interface ISharedAttributeDataPayload {
    attributes?: ISharedAttributeData[] | SharedAttributeData | GoogleAttributes[];
    attributesAuth?: SharedAttributeWithAuth[];
}

export type IBaseBasicSharedAttributeDataPayload = IBasePayload & ISharedAttributeDataPayload;

export abstract class BaseBasicSharedAttributeDataPayload extends BasePayload implements ISharedAttributeDataPayload {
    @ValidateNested()
    @ArrayNotEmpty()
    @Type(() => SharedAttributeData)
    attributes!: SharedAttributeData[];

    protected constructor(basePayload: IBaseBasicSharedAttributeDataPayload) {
        super(basePayload);
        Object.assign(this, basePayload);
    }
}
```


**File:** `libs/queue/src/types/base-basic-shared-payloads/base-basic-shared-s3-product-data-payload.ts`

```typescript
export interface ISharedS3ProductDataPayload {
    product: ProductS3Dto;
    operation?: PayloadOperation;
}
```


**File:** `libs/queue/src/types/base-basic-shared-payloads/base-basic-shared-s3-inventory-data-payload.ts`

```typescript
export interface ISharedS3InventoryDataPayload {
    inventory: InventoryS3Dto;
    operation?: PayloadOperation;
}
```


**File:** `libs/queue/src/types/kick-payloads/kick-locations-payload.ts`

```typescript
export type IKickLocationsPayload = IBasePayloadWithoutProviders & ISharedLocationDataPayload;

export class KickLocationsPayload extends BasePayloadWithoutProviders implements IKickLocationsPayload, MaskedData {
    __apply_mask = true;

    @ValidateNested({each: true})
    @ArrayNotEmpty()
    @Type(() => SharedLocationData)
    locations!: SharedLocationData[];

    @ValidateNested({each: true})
    @ArrayNotEmpty()
    @Type(() => SharedLocationAuth)
    locationsAuth!: SharedLocationAuth[];

    static create(kickPayload: IKickLocationsPayload): KickLocationsPayload {
        return new KickLocationsPayload(kickPayload);
    }

    constructor(kickPayload: IKickLocationsPayload) {
        super(kickPayload);
        Object.assign(this, kickPayload);
    }

    mask(): KickLocationsPayload[] | KickLocationsPayload {
        // masking logic
    }
}
```


**File:** `libs/queue/src/types/push-payloads/push-locations-payload.ts`

```typescript
export interface IPushLocationsPayload extends Omit<IBasePayload, "extra"> {
    locations: GoogleLocation[] | SharedMetaPageLocation[] | SharedAppleLocation[];
}

export class PushLocationsPayload extends BasePayload implements IPushLocationsPayload, MaskedData {
    __apply_mask = true;

    @ValidateNested()
    @ArrayNotEmpty()
    @Type(() => GoogleLocation || SharedMetaPageLocation || SharedAppleLocation)
    locations!: GoogleLocation[] | SharedMetaPageLocation[] | SharedAppleLocation[];

    static create(pushPayload: IPushLocationsPayload): PushLocationsPayload {
        return new PushLocationsPayload(pushPayload);
    }

    private constructor(pushPayload: IPushLocationsPayload) {
        super(pushPayload as unknown as IBasePayload);
        Object.assign(this, pushPayload);
    }

    mask(): PushLocationsPayload {
        return maskLocationPayload(this);
    }
}
```


**File:** `libs/queue/src/types/push-payloads/push-products-payload.ts`

```typescript
export interface IPushProductsPayload extends Omit<IBasePayload, "extra"> {
    products: GoogleLocalProduct[] | GoogleProduct[];
}

export class PushProductsPayload extends BasePayload implements IPushProductsPayload, MaskedData {
    __apply_mask = true;

    @ValidateNested()
    @ArrayNotEmpty()
    @Type(() => GoogleProduct)
    products!: GoogleLocalProduct[] | GoogleProduct[];

    static create(pushPayload: IPushProductsPayload): PushProductsPayload {
        return new PushProductsPayload(pushPayload);
    }

    constructor(pushPayload: IPushProductsPayload) {
        super(pushPayload as unknown as IBasePayload);
        Object.assign(this, pushPayload);
    }

    mask(): PushProductsPayload {
        return maskProductPayload(this);
    }
}
```


**File:** `libs/queue/src/types/push-payloads/push-inventories-payload.ts`

```typescript
export interface IPushInventoriesPayload extends Omit<IBasePayload, "extra"> {
    inventories: GoogleLocalInventory[];
}

export class PushInventoriesPayload extends BasePayload implements IPushInventoriesPayload, MaskedData {
    __apply_mask = true;

    @ValidateNested()
    @ArrayNotEmpty()
    @Type(() => GoogleLocalInventory)
    inventories!: GoogleLocalInventory[];

    static create(pushPayload: IPushInventoriesPayload): PushInventoriesPayload {
        return new PushInventoriesPayload(pushPayload);
    }

    constructor(pushPayload: IPushInventoriesPayload) {
        super(pushPayload as unknown as IBasePayload);
        Object.assign(this, pushPayload);
    }

    mask(): PushInventoriesPayload {
        return maskInventoryPayload(this);
    }
}
```


**File:** `libs/queue/src/types/transform-payloads/transform-locations-payload.ts`

```typescript
export type ITransformLocationsPayload = IBaseBasicSharedLocationDataPayload;

export class TransformLocationsPayload extends BaseBasicSharedLocationDataPayload implements ITransformLocationsPayload, MaskedData {
    __apply_mask = true;

    static create(transformPayload: ITransformLocationsPayload): TransformLocationsPayload {
        return new TransformLocationsPayload(transformPayload);
    }

    constructor(transformPayload: ITransformLocationsPayload) {
        super(transformPayload);
        Object.assign(this, transformPayload);
    }

    mask(): TransformLocationsPayload {
        return maskLocationPayload(this);
    }
}
```


**File:** `libs/queue/src/types/transform-payloads/transform-products-payload.ts`

```typescript
export type ITransformProductsPayload = IBaseBasicSharedProductDataPayload;

export class TransformProductsPayload extends BaseBasicSharedProductDataPayload implements ITransformProductsPayload, MaskedData {
    __apply_mask = true;

    static create(transformPayload: ITransformProductsPayload): TransformProductsPayload {
        return new TransformProductsPayload(transformPayload);
    }

    constructor(transformPayload: ITransformProductsPayload) {
        super(transformPayload);
        Object.assign(this, transformPayload);
    }

    mask(): TransformProductsPayload {
        return maskProductPayload(this);
    }
}
```


**File:** `libs/queue/src/types/retrieve-payloads/retrieve-locations-payload.ts`

```typescript
export interface IRetrieveLocationsPayload extends IBasePayload {
    locations: GoogleLocation[] | SharedMetaPageLocation[] | SharedAppleLocation[];
    status: LocationPushStatus[] | MetaLocationPushStatus[] | AppleLocationPushStatus[];
}

export class RetrieveLocationsPayload extends BasePayload implements IRetrieveLocationsPayload, MaskedData {
    __apply_mask = true;

    @ValidateNested()
    @ArrayNotEmpty()
    @Type(() => GoogleLocation || SharedMetaPageLocation || SharedAppleLocation)
    locations!: GoogleLocation[] | SharedMetaPageLocation[] | SharedAppleLocation[];

    @ValidateNested()
    @Type(() => LocationPushStatus || MetaLocationPushStatus || AppleLocationPushStatus)
    status!: LocationPushStatus[] | MetaLocationPushStatus[] | AppleLocationPushStatus[];

    static create(retrievePayload: IRetrieveLocationsPayload): RetrieveLocationsPayload {
        return new RetrieveLocationsPayload(retrievePayload);
    }

    constructor(retrievePayload: IRetrieveLocationsPayload) {
        super(retrievePayload);
        Object.assign(this, retrievePayload);
    }

    mask(): RetrieveLocationsPayload {
        return maskLocationPayload(this);
    }
}
```


**File:** `libs/queue/src/types/batch-payloads/batch-product-payload.ts`

```typescript
export interface IBatchProductPayload extends IBasePayloadWithoutProviders {
    operation: PayloadOperation;
    products: ProductBatchEntryDto[];
}

export class BatchProductPayload extends BasePayloadWithoutProviders implements IBatchProductPayload {
    @IsIn(PAYLOAD_OPERATIONS)
    operation!: PayloadOperation;

    @ValidateNested()
    @ArrayNotEmpty()
    @Type(() => ProductBatchEntryDto)
    products!: ProductBatchEntryDto[];

    static create(batchPayload: IBatchProductPayload): BatchProductPayload {
        return new BatchProductPayload(batchPayload);
    }

    private constructor(batchPayload: IBatchProductPayload) {
        super(batchPayload);
        Object.assign(this, batchPayload);
    }
}
```


**File:** `libs/queue/src/types/batch-payloads/batch-inventory-payload.ts`

```typescript
export interface IBatchInventoryPayload extends IBasePayloadWithoutProviders {
    operation: PayloadOperation;
    inventories: InventoryBatchEntryDto[];
}

export class BatchInventoryPayload extends BasePayloadWithoutProviders implements IBatchInventoryPayload {
    @IsIn(PAYLOAD_OPERATIONS as any)
    operation!: PayloadOperation;

    @ValidateNested()
    @ArrayNotEmpty()
    @Type(() => InventoryBatchEntryDto)
    inventories!: InventoryBatchEntryDto[];

    static create(batchInventoryPayload: IBatchInventoryPayload): BatchInventoryPayload {
        return new BatchInventoryPayload(batchInventoryPayload);
    }

    private constructor(batchInventoryPayload: IBatchInventoryPayload) {
        super(batchInventoryPayload);
        Object.assign(this, batchInventoryPayload);
    }
}
```


**File:** `libs/queue/src/types/batch-payloads/batch-product-variant-payload.ts`

```typescript
export interface IBatchVariantPayload extends IBasePayloadWithoutProviders {
    operation: PayloadOperation;
    productVariants: ProductVariantBatchEntryDto[];
}

export class BatchVariantPayload extends BasePayloadWithoutProviders implements IBatchVariantPayload {
    @IsIn(PAYLOAD_OPERATIONS)
    operation!: PayloadOperation;

    @ValidateNested()
    @ArrayNotEmpty()
    @Type(() => ProductVariantBatchEntryDto)
    productVariants!: ProductVariantBatchEntryDto[];

    static create(batchVariantPayload: IBatchVariantPayload): BatchVariantPayload {
        return new BatchVariantPayload(batchVariantPayload);
    }

    private constructor(batchVariantPayload: IBatchVariantPayload) {
        super(batchVariantPayload);
        Object.assign(this, batchVariantPayload);
    }
}
```


**File:** `libs/queue/src/types/delete-payload.ts`

```typescript
export interface IDeletePayload extends IBasePayload {
    products: GoogleLocalProduct[] | GoogleProduct[];
}

export class DeletePayload extends BasePayload implements IDeletePayload, MaskedData {
    __apply_mask = true;

    @ValidateNested()
    @ArrayNotEmpty()
    @Type(() => GoogleProduct)
    products!: GoogleProduct[];

    static create(deletePayload: IDeletePayload): DeletePayload {
        return new DeletePayload(deletePayload);
    }

    private constructor(deletePayload: IDeletePayload) {
        super(deletePayload);
        Object.assign(this, deletePayload);
    }

    mask(): DeletePayload {
        return maskProductPayload(this);
    }
}
```


**File:** `libs/queue/src/types/s3-batch-payloads/batch-s3-payload-interface.ts`

```typescript
export interface IBatchS3Payload {
    products?: ProductS3Dto[];
    inventories?: InventoryS3Dto[];
}
```


**File:** `libs/queue/src/types/location-gbp-import.ts`

```typescript
export interface ImportLocation {
    accountName: string;
    accountId: string;
    locationCount: number | string;
    accountType: string;
}

export interface ImportLocationGbp {
    importLocations: ImportLocation[];
    importScenario: string;
}
```


**File:** `libs/queue/src/safe-queue.ts`

```typescript
export class SafeQueue<T = any> {
    constructor(private readonly queue: Queue) {}

    add(data: T, opts?: JobOptions): Promise<Job<T>>;
    add(name: string, data: T, opts?: JobOptions): Promise<Job<T>>;

    async add(name: T | string, data?: T | JobOptions, opts?: JobOptions): Promise<Job<T>> {
        if (typeof name !== "string") {
            opts = data as JobOptions | undefined;
            data = name;
            name = undefined as any;
        }

        if (data) {
            const validationErrors = await validate(data as unknown as object, {
                forbidUnknownValues: false,
            });
            if (validationErrors.length) {
                throw new QueuePayloadValidationException(validationErrors);
            }
        }

        if (name) {
            return this.queue.add(name as string, data, opts);
        }

        return this.queue.add(data, opts);
    }

    getJob(jobId: JobId): Promise<Job<T> | null> {
        return this.queue.getJob(jobId);
    }
}
```


**File:** `libs/queue/src/base.consumer.ts`

```typescript
type BaseConsumerPayload = Pick<IBasePayload, "request_id" | "distributed_trace_headers">;

export class BaseConsumer<T extends BaseConsumerPayload> {
    constructor(
        protected readonly newrelicService: NewrelicService,
        protected readonly logger: Logger,
    ) {
        newrelicService.initialize();
    }

    protected getLoggerForJob(job: Job<T>, queueName?: QueueNames, consumerName?: ConsumerNames, brandId?: string) {
        const {request_id} = job.data;
        const {name: jobName} = job;

        const loggerMeta = WinstonLoggerHelper.meta({
            request_id,
            job: jobName,
            ...(queueName && {queue: queueName}),
            ...(consumerName && {consumer: consumerName}),
            ...(brandId && {brand: brandId}),
        });

        return this.logger.child(loggerMeta);
    }
}
```


**File:** `libs/queue/src/base-sqs.consumer.ts`

```typescript
export class BaseSqsConsumer {
    constructor(
        protected readonly newrelicService: NewrelicService,
        protected readonly logger: Logger,
    ) {
        newrelicService.initialize();
    }

    protected getLoggerForJob(
        message: Message,
        requestId: string,
        queueName?: SqsQueueNames,
        consumerName?: SqsConsumerNames,
        brandId?: string,
    ) {
        const {MessageId, MessageAttributes} = message;
        const jobName = MessageAttributes?.jobType.StringValue || "undefined_job_type";

        const loggerMeta = WinstonLoggerHelper.meta({
            request_id: requestId,
            sqs_message_id: MessageId,
            job: jobName,
            ...(queueName && {queue: queueName}),
            ...(consumerName && {consumer: consumerName}),
            ...(brandId && {brand: brandId}),
        });

        return this.logger.child(loggerMeta);
    }
}
```


### Validation Schemas

_No definitions found in this category._

---

## Media & Content

### Database Models

**File:** `libs/database/src/mongoose/schemas/location-media-item/location-media-item.schema.ts`

```typescript
@index({location: 1, name: 1})
@index({location: 1, "attribution.profileName": 1})
@index({brand: 1, location: 1, mediaFormat: 1, uploadedBy: 1})
export class LocationMediaItem extends TypegooseBase {
    @prop({required: true, ref: "Location"})
    location!: Ref<Location>;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    uploadedBy!: UploadedByEnum;

    @prop({required: true})
    name!: string;

    @prop({required: false})
    mediaFormat?: MediaFormatEnum;

    @prop({required: false})
    locationAssociation?: MediaLocationAssociation;

    @prop({required: true})
    googleUrl!: string;

    @prop({required: false})
    thumbnailUrl?: string;

    @prop({required: true})
    createTime!: string;

    @prop({required: false})
    updateTime?: string;

    @prop({required: false})
    dimensions?: MediaDimensions;

    @prop({required: false})
    insights?: MediaInsights;

    @prop({required: false})
    attribution?: MediaAttribution;

    @prop({required: false})
    description?: string;

    @prop({required: false})
    venuexCdnUrl?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/location-media-item/media-dimensions.schema.ts`

```typescript
export class MediaDimensions extends TypegooseWithoutId {
    @prop({required: false})
    widthPixels?: number;

    @prop({required: false})
    heightPixels?: number;
}
```


**File:** `libs/database/src/mongoose/schemas/location-media-item/media-insights.schema.ts`

```typescript
export class MediaInsights extends TypegooseWithoutId {
    @prop({required: false})
    viewCount?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/location-media-item/media-attribution.schema.ts`

```typescript
export class MediaAttribution extends TypegooseWithoutId {
    @prop({required: false})
    profileName?: string;

    @prop({required: false})
    profilePhotoUrl?: string;

    @prop({required: false})
    takedownUrl?: string;

    @prop({required: false})
    profileUrl?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/location-media-item/media-location-association.schema.ts`

```typescript
export class MediaLocationAssociation extends TypegooseWithoutId {
    @prop({required: false, enum: MediaItemCategoryEnum})
    category?: MediaItemCategoryEnum;

    @prop({required: false})
    priceListItemId?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/location-media-item/media-item-data-ref.schema.ts`

```typescript
export class MediaItemDataRef extends TypegooseWithoutId {
    @prop({required: false})
    resourceName?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/location-local-post/local-post.schema.ts`

```typescript
@index({localPostId: 1})
export class LocalPost extends TypegooseBase {
    @prop({required: true})
    location!: Ref<Location>;

    @prop({required: true})
    brand!: Ref<Brand>;

    @prop({required: true})
    localPostId!: string;

    @prop({required: false})
    name?: string;

    @prop({required: false})
    localName?: string;

    @prop({required: false})
    group?: string;

    @prop({required: false, ref: () => PostCampaign})
    postCampaign?: Ref<PostCampaign>;

    @prop({required: false})
    languageCode?: string;

    @prop({required: false})
    summary?: string;

    @prop({required: false})
    callToAction?: CallToAction;

    @prop({required: false})
    createTime?: string;

    @prop({required: false})
    updateTime?: string;

    @prop({required: false, enum: LocalPostState})
    state?: LocalPostState;

    @prop({required: false})
    media?: LocationMediaItem[];

    @prop({required: false})
    searchUrl?: string;

    @prop({required: true, enum: LocalPostTopicType})
    topicType!: LocalPostTopicType;

    @prop({required: false, enum: AlertType})
    alertType?: AlertType;

    @prop({required: false})
    offer?: Offer;

    @prop({required(this: LocalPost) {
        return this.topicType === LocalPostTopicType.EVENT || this.topicType === LocalPostTopicType.OFFER;
    }, _id: false})
    event?: Event;
}
```


```typescript
export class CallToAction extends TypegooseWithoutId {
    @prop({required: true, enum: LocalPostActionType})
    actionType!: LocalPostActionType;

    @prop({required: true})
    url!: string;
}
```


**File:** `libs/database/src/mongoose/schemas/location-local-post/offer.schema.ts`

```typescript
export class Offer extends TypegooseWithoutId {
    @prop({required: false})
    couponCode?: string;

    @prop({required: false})
    redeemOnlineUrl?: string;

    @prop({required: false})
    termsConditions?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/location-local-post/event.schema.ts`

```typescript
export class TimeInterval extends TypegooseWithoutId {
    @prop({required: true})
    startDate!: mybusinessbusinessinformation_v1.Schema$Date;

    @prop({required: true})
    startTime!: mybusinessbusinessinformation_v1.Schema$TimeOfDay;

    @prop({required: true})
    endDate!: mybusinessbusinessinformation_v1.Schema$Date;

    @prop({required: true})
    endTime!: mybusinessbusinessinformation_v1.Schema$TimeOfDay;
}

export class Event extends TypegooseWithoutId {
    @prop({required: true})
    title!: string;

    @prop({required: true, _id: false})
    schedule!: TimeInterval;
}
```


**File:** `libs/database/src/mongoose/schemas/location-post-campaign/post-campaign.schema.ts`

```typescript
class PostMedia {
    @prop({required: true})
    sourceUrl!: string;

    @prop({required: true})
    mediaFormat!: string;
}

class GoogleLocalPostConfig {
    @prop()
    type?: string;

    @prop()
    actionType?: string;

    @prop()
    actionUrl?: string;

    @prop({type: () => Object})
    offer?: {
        couponCode?: string;
        redeemUrl?: string;
        terms?: string;
    };
}

class AppleShowcaseConfig {
    @prop()
    actionType?: string;

    @prop({type: () => [String]})
    appIds?: string[];
}

class PostCampaignSuccessItem {
    @prop({required: true})
    locationId!: string;

    @prop()
    postId?: string;

    @prop()
    platformName?: string;
}

class PostCampaignResultItem {
    @prop({required: true})
    locationId!: string;

    @prop()
    reason?: string;
}

class PostCampaignPlatformResult {
    @prop()
    successCount?: number;

    @prop()
    rejectCount?: number;

    @prop({type: () => [PostCampaignSuccessItem], default: []})
    succeeded?: PostCampaignSuccessItem[];

    @prop({type: () => [PostCampaignResultItem], default: []})
    failed?: PostCampaignResultItem[];
}

class PostCampaignResults {
    @prop({type: () => PostCampaignPlatformResult})
    google?: PostCampaignPlatformResult;

    @prop({type: () => PostCampaignPlatformResult})
    apple?: PostCampaignPlatformResult;
}

@index({brand: 1, createdAt: -1})
export class PostCampaign extends TypegooseBase {
    @prop({required: true, ref: () => Brand})
    brand!: Ref<Brand>;

    @prop()
    title?: string;

    @prop()
    googleDescription?: string;

    @prop()
    appleDescription?: string;

    @prop({default: "tr-TR"})
    locale?: string;

    @prop({required: true, enum: PostCampaignTargetingType})
    targetingType!: PostCampaignTargetingType;

    @prop({ref: () => StoreSet})
    storeSetId?: Ref<StoreSet>;

    @prop({ref: () => Location, default: []})
    locationIds!: Ref<Location>[];

    @prop({type: () => [String], default: []})
    platforms!: string[];

    @prop({type: () => GoogleLocalPostConfig})
    googleLocalPost?: GoogleLocalPostConfig;

    @prop({type: () => AppleShowcaseConfig})
    appleShowcase?: AppleShowcaseConfig;

    @prop({type: () => [PostMedia]})
    media?: PostMedia[];

    @prop()
    startDate?: Date;

    @prop()
    endDate?: Date;

    @prop({required: true, enum: PostCampaignStatus, default: PostCampaignStatus.DRAFT})
    status!: PostCampaignStatus;

    @prop()
    dispatchGroup?: string;

    @prop({type: () => PostCampaignResults})
    results?: PostCampaignResults;
}
```


**File:** `libs/database/src/mongoose/schemas/apple/apple-showcase.schema.ts`

```typescript
export class AppleShowcaseResourceDetails extends TypegooseWithoutId {
    @prop({required: true})
    resourceType!: string;

    @prop({required: true})
    resourceId!: string;
}

export class AppleShowcaseDetails extends TypegooseWithoutId {
    @prop({required: true, validate: {validator(this: AppleShowcaseDetails, v: Date) {
        return !this.endDate || v <= this.endDate;
    }, message: "startDate must be before or equal to endDate"}})
    startDate!: Date;

    @prop({required: true, validate: {validator(this: AppleShowcaseDetails, v: Date) {
        return !this.startDate || v >= this.startDate;
    }, message: "endDate must be after or equal to startDate"}})
    endDate!: Date;

    @prop({required: true, _id: false, type: AppleShowcaseResourceDetails})
    resourceDetails!: AppleShowcaseResourceDetails;

    @prop({required: true})
    creativeId!: string;
}

@index({brand: 1, appleId: 1}, {unique: true})
export class AppleShowcase extends TypegooseBase {
    @prop({required: true})
    appleId!: string;

    @prop({required: true})
    appleCompanyId!: string;

    @prop({required: true})
    appleBrandId!: string;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    etag!: string;

    @prop({required: true})
    state!: string;

    @prop({required: true, _id: false, type: AppleTimestamp})
    appleTimestamps!: AppleTimestamp;

    @prop({required: true, _id: false, type: AppleShowcaseDetails})
    showcaseDetails!: AppleShowcaseDetails;

    @prop({required: false, default: false})
    isMarkedDeleted?: boolean;

    @prop({required: false})
    lastSyncedAt?: Date;

    @prop({required: false})
    source?: string;

    @prop({required: false, ref: () => PostCampaign})
    postCampaign?: Ref<PostCampaign>;
}
```


**File:** `libs/database/src/mongoose/schemas/apple/apple-showcase-creative.schema.ts`

```typescript
export class AppleShowcaseDescription extends TypegooseWithoutId {
    @prop({required: true})
    locale!: string;

    @prop({required: true})
    text!: string;
}

export class AppleShowcaseContent extends TypegooseWithoutId {
    @prop({required: true})
    placement!: string;

    @prop({required: true, _id: false, type: AppleShowcaseDescription}, PropType.ARRAY)
    descriptions!: AppleShowcaseDescription[];
}

export class AppleShowcaseCaption extends TypegooseWithoutId {
    @prop({required: true})
    altText!: string;

    @prop({required: true})
    locale!: string;
}

export class AppleShowcasePhoto extends TypegooseWithoutId {
    @prop({required: true})
    id!: string;

    @prop({required: false, _id: false, type: AppleShowcaseCaption}, PropType.ARRAY)
    captions?: AppleShowcaseCaption[];
}

export class AppleShowcaseCreativeDetails extends TypegooseWithoutId {
    @prop({required: true, _id: false, type: AppleShowcaseContent}, PropType.ARRAY)
    contents!: AppleShowcaseContent[];

    @prop({required: true, _id: false, type: AppleShowcasePhoto})
    photo!: AppleShowcasePhoto;

    @prop({required: true})
    callToAction!: string;

    @prop({required: false, type: String}, PropType.ARRAY)
    appIds?: string[];
}

@index({brand: 1, appleId: 1}, {unique: true})
export class AppleShowcaseCreative extends TypegooseBase {
    @prop({required: true})
    appleId!: string;

    @prop({required: true})
    appleCompanyId!: string;

    @prop({required: true})
    appleBrandId!: string;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true})
    etag!: string;

    @prop({required: true})
    state!: string;

    @prop({required: true, _id: false, type: AppleTimestamp})
    appleTimestamps!: AppleTimestamp;

    @prop({required: true, _id: false, type: AppleShowcaseCreativeDetails})
    showcaseCreativeDetails!: AppleShowcaseCreativeDetails;

    @prop({required: false, default: false})
    isMarkedDeleted?: boolean;

    @prop({required: false})
    lastSyncedAt?: Date;

    @prop({required: false})
    source?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/apple/apple-media.schema.ts`

```typescript
export class AppleMedia extends TypegooseBase {
    @prop({required: true, unique: true})
    appleId!: string;

    @prop({required: true})
    appleCompanyId!: string;

    @prop({required: true, ref: "Brand"})
    brand!: Ref<Brand>;

    @prop({required: true, ref: "Location"})
    location!: Ref<Location>;

    @prop({required: true, ref: "LocationMediaItem"})
    mediaItem!: Ref<LocationMediaItem>;

    @prop({required: true})
    state!: string;

    @prop({required: true, _id: false, type: AppleTimestamp})
    appleTimestamps!: AppleTimestamp;

    @prop({required: true})
    filename!: string;

    @prop({required: true})
    width!: number;

    @prop({required: true})
    height!: number;

    @prop({required: true})
    fileSize!: number;

    @prop({required: true})
    contentType!: string;
}
```


**File:** `libs/database/src/mongoose/schemas/apple/apple-photos.schema.ts`

```typescript
export class ApplePhotoProperties extends TypegooseWithoutId {
    @prop({required: true})
    url!: string;

    @prop({required: true})
    pixelWidth!: number;

    @prop({required: true})
    pixelHeight!: number;
}

export class ApplePhotos extends TypegooseWithoutId {
    @prop({required: false, _id: false, type: ApplePhotoProperties})
    thumbnail?: ApplePhotoProperties;

    @prop({required: false, _id: false, type: ApplePhotoProperties})
    small?: ApplePhotoProperties;

    @prop({required: false, _id: false, type: ApplePhotoProperties})
    medium?: ApplePhotoProperties;

    @prop({required: false, _id: false, type: ApplePhotoProperties})
    large?: ApplePhotoProperties;

    @prop({required: false, _id: false, type: ApplePhotoProperties})
    xlarge?: ApplePhotoProperties;

    @prop({required: false, _id: false, type: ApplePhotoProperties})
    xxlarge?: ApplePhotoProperties;

    @prop({required: false, _id: false, type: ApplePhotoProperties})
    original?: ApplePhotoProperties;
}
```


**File:** `libs/database/src/mongoose/schemas/misc/social.schema.ts`

```typescript
export class Social extends TypegooseWithoutId {
    @prop()
    facebook?: string;

    @prop()
    twitter?: string;

    @prop()
    instagram?: string;

    @prop()
    youtube?: string;

    @prop()
    yelp?: string;

    @prop()
    linkedin?: string;

    @prop()
    tiktok?: string;

    @prop()
    pinterest?: string;
}
```


**File:** `libs/database/src/mongoose/schemas/draft/draft.schema.ts`

```typescript
export class Draft extends TypegooseBase {
    @prop({required: true, enum: DraftEntities})
    draft_entity!: DraftEntities;

    @prop({refPath: "draft_entity"})
    draft_entity_id?: Ref<DraftEntity>;

    @prop({required: false, ref: "User"})
    user?: Ref<User>;

    @prop({required: false, ref: "Brand"})
    brand?: Ref<Brand>;

    @prop({required: false})
    draft?: unknown;

    @prop({required: false, ref: "Revision"})
    revision?: Ref<Revision>;
}
```


### DTOs

**File:** `libs/dto/src/location-media-items/location-media-item.dto.ts`

```typescript
export class LocationMediaItemDto {
    @ApiProperty({name: "name", description: "Media item id", required: true})
    @IsString()
    name!: string;

    @ApiProperty({name: "uploadedBy", description: "User type that uploaded the media item. Can be OWNER or CUSTOMER", enum: UploadedByEnum, required: true})
    @IsString()
    @IsEnum(UploadedByEnum)
    uploadedBy!: UploadedByEnum;

    @ApiProperty({name: "attribution", description: "The format of this media item", enum: MediaFormatEnum, required: false})
    @IsOptional()
    @IsString()
    @IsEnum(MediaFormatEnum)
    mediaFormat?: MediaFormatEnum;

    @ApiProperty({name: "attribution", description: "Describes how this media item is connected to its location", type: () => MediaItemAssociationDto, required: false})
    @IsOptional()
    @Type(() => MediaItemAssociationDto)
    @ValidateNested()
    locationAssociation?: MediaItemAssociationDto;

    @ApiProperty({name: "googleUrl", description: "Google url of the media item", required: true})
    @IsString()
    googleUrl!: string;

    @ApiProperty({name: "thumbnailUrl", description: "thumbnail url of the media item", required: false})
    @IsString()
    @IsOptional()
    thumbnailUrl?: string;

    @ApiProperty({name: "createTime", description: "creation time of the media item", required: false})
    @IsString()
    @IsOptional()
    createTime?: string;

    @ApiProperty({name: "updateTime", description: "update time of the media item", required: false})
    @IsString()
    @IsOptional()
    updateTime?: string;

    @ApiProperty({name: "attribution", description: "Dimensions in pixel", type: () => MediaDimensionsDto, required: false})
    @IsOptional()
    @Type(() => MediaDimensionsDto)
    @ValidateNested()
    dimensions?: MediaDimensionsDto;

    @ApiProperty({name: "attribution", description: "Statistics for this media item", type: () => MediaDimensionsDto, required: false})
    @IsOptional()
    @Type(() => MediaInsightsDto)
    @ValidateNested()
    insights?: MediaInsightsDto;

    @ApiProperty({name: "attribution", description: "Attribution information for customer media items", type: () => MediaDimensionsDto, required: false})
    @IsOptional()
    @Type(() => MediaAttributionDto)
    @ValidateNested()
    attribution?: MediaAttributionDto;

    @ApiProperty({name: "description", description: "description of the media item", required: false})
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({name: "sourceUrl", description: "source url of the media item", required: false})
    @IsString()
    @IsOptional()
    sourceUrl?: string;

    @ApiProperty({type: () => MediaDimensionsDto, required: false})
    @IsOptional()
    @Type(() => MediaDataRefDto)
    @ValidateNested()
    dataRef?: MediaDataRefDto;
}

export class LocationPhotoBatchDto {
    @IsArray()
    @Type(() => LocationPhotoDto)
    @ValidateNested({each: true})
    photos!: LocationPhotoDto[];
}

export class LocationPhotoBatchResultDto {
    @ApiProperty({description: "Number of total location photo"})
    @IsNumber()
    total!: number;

    @ApiProperty({description: "Number of rejected location photo"})
    @IsNumber()
    rejectedCount!: number;

    @ApiProperty({description: "Number of fulfilled location photo"})
    @IsNumber()
    fulfilledCount!: number;
}

export class LocationPhotoDto {
    @IsUrl()
    url!: string;

    @IsEnum(MediaItemCategoryEnum)
    @IsOptional()
    @Default(MediaItemCategoryEnum.CATEGORY_UNSPECIFIED)
    category?: MediaItemCategoryEnum;
}

export class LocationBatchPhotoDto extends LocationPhotoDto {
    @ApiProperty({description: "Id list of locations to upload photo"})
    @IsArray()
    @ArrayMaxSize(1000)
    ids!: string[];

    @ApiProperty({description: "If value is true, ignore ids array and upload same images to all filtered locations.", required: false})
    @IsOptional()
    @IsBoolean()
    applyToAllFiltered?: boolean;
}

export class LocationBatchPhotoResultDto {
    @ApiProperty({description: "Result list of every update operation", type: () => [LocationBatchPromiseResultDto]})
    @IsArray()
    @Type(() => LocationBatchPromiseResultDto)
    update_results!: LocationBatchPromiseResultDto[];

    @ApiProperty({description: "Number of rejected location updates"})
    @IsNumber()
    rejected_promises!: number;

    @ApiProperty({description: "Number of fulfilled location updates"})
    @IsNumber()
    fulfilled_promises!: number;
}
```


**File:** `libs/dto/src/location-media-items/media-dimensions.dto.ts`

```typescript
export class MediaDimensionsDto {
    @IsNumber()
    @IsOptional()
    widthPixels?: number;

    @IsNumber()
    @IsOptional()
    heightPixels?: number;
}
```


**File:** `libs/dto/src/location-media-items/media-insights.dto.ts`

```typescript
export class MediaInsightsDto {
    @IsString()
    @IsOptional()
    viewCount?: string;
}
```


**File:** `libs/dto/src/location-media-items/media-attribution.dto.ts`

```typescript
export class MediaAttributionDto {
    @IsString()
    @IsOptional()
    profileName?: string;

    @IsString()
    @IsOptional()
    profilePhotoUrl?: string;

    @IsString()
    @IsOptional()
    takedownUrl?: string;

    @IsString()
    @IsOptional()
    profileUrl?: string;
}
```


**File:** `libs/dto/src/location-media-items/media-location-association.dto.ts`

```typescript
export class MediaItemAssociationDto {
    @IsString()
    @IsOptional()
    @IsEnum(MediaItemCategoryEnum)
    category?: MediaItemCategoryEnum;

    @IsString()
    @IsOptional()
    priceListItemId?: string;
}
```


**File:** `libs/dto/src/location-media-items/media-data-ref.dto.ts`

```typescript
export class MediaDataRefDto {
    @IsString()
    @IsOptional()
    resourceName?: string;
}
```


**File:** `libs/dto/src/location-media-items/google-media-item-response.dto.ts`

```typescript
export class GoogleMediaItemResponseDto {
    @IsOptional()
    @IsArray()
    @Type(() => LocationMediaItemDto)
    @ValidateNested()
    mediaItems?: LocationMediaItemDto[];

    @IsNumber()
    @IsOptional()
    totalMediaItemCount?: number;
}
```


**File:** `libs/dto/src/location/location-local-posts.dto.ts`

```typescript
export class CallToActionDto {
    @ApiProperty({description: "The label of the call-to-action button.", required: true})
    @IsEnum(LocalPostActionType)
    actionType!: LocalPostActionType;

    @ApiProperty({description: "The URL of the webpage that the call-to-action button directs to.", required: false})
    @ValidateIf((o) => o.actionType !== LocalPostActionType.CALL)
    @IsNotEmpty()
    url?: string;
}

export class OfferDto {
    @ApiProperty({description: "The coupon code of the offer.", required: false})
    couponCode?: string;

    @ApiProperty({description: "The redemption link of the offer.", required: false})
    redeemOnlineUrl?: string;

    @ApiProperty({description: "The terms of the offer.", required: false})
    termsConditions?: string;
}

export class EventDto {
    @ApiProperty({description: "The title of the event.", required: true})
    title!: string;

    @ApiProperty({description: "The schedule of the event.", required: true})
    schedule!: SpecialHourPeriodForGooglePostsDto;
}

export class PostImageDto {
    @ApiProperty({description: "Image url for location post.", required: true})
    sourceUrl!: string;

    @ApiProperty({name: "attribution", description: "The format of this media item", enum: MediaFormatEnum, required: false})
    @IsOptional()
    @IsString()
    @IsEnum(MediaFormatEnum)
    mediaFormat?: MediaFormatEnum;
}

export class LocalPostDto {
    @ApiProperty({description: "Name of post", required: false})
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({description: "Name of post", required: false})
    @IsOptional()
    @IsString()
    postName?: string;

    @ApiProperty({description: "Group name", required: false})
    @IsOptional()
    @IsUUID()
    group?: string;

    @ApiProperty({description: "Post campaign ID", required: false})
    @IsOptional()
    @IsMongoId()
    postCampaignId?: string;

    @ApiProperty({description: "Location ID", required: false})
    @IsOptional()
    @IsString()
    languageCode?: string;

    @ApiProperty({description: "The summary of the local post.", required: false})
    @IsOptional()
    @IsString()
    summary?: string;

    @ApiProperty({description: "The call-to-action button label on the local post.", required: false})
    @IsOptional()
    callToAction?: CallToActionDto;

    @ApiProperty({description: "The timestamp for when the local post was created.", required: false})
    @IsOptional()
    @IsString()
    createTime?: string;

    @ApiProperty({description: "The timestamp for when the local post was last modified.", required: false})
    @IsOptional()
    @IsString()
    updateTime?: string;

    @ApiProperty({description: "The event of the local post.", required: false})
    @ValidateIf((o) => o.topicType === LocalPostTopicType.EVENT || o.topicType === LocalPostTopicType.OFFER)
    @IsNotEmpty()
    @Type(() => EventDto)
    event?: EventDto;

    @ApiProperty({description: "The state of the local post.", enum: LocalPostState, required: false})
    @IsOptional()
    @IsEnum(LocalPostState)
    state?: LocalPostState;

    @ApiProperty({description: "The media item associated with the local post.", required: false})
    @IsOptional()
    media?: PostImageDto[];

    @ApiProperty({description: "The search URL on the local post.", required: false})
    @IsOptional()
    @IsString()
    searchUrl?: string;

    @ApiProperty({description: "The Topic type of the local post. Possible values are: OFFER, EVENT, STANDARD, ALERT.", enum: LocalPostTopicType, required: true})
    @IsEnum(LocalPostTopicType)
    topicType!: LocalPostTopicType;

    @ApiProperty({description: "The Alert type of the local post.", enum: AlertType, required: false})
    @IsOptional()
    @IsEnum(AlertType)
    alertType?: AlertType;

    @ApiProperty({description: "The Offer type of the local post.", required: false})
    @IsOptional()
    offer?: OfferDto;
}

export class LocalPostPatchBodyDto extends PartialType(LocalPostDto) {}

export class LocalPostCreateDto {
    @ApiProperty({description: "Location ID", required: true})
    @IsMongoId()
    locationId!: string;

    @ApiProperty({description: "Post data", required: true})
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => LocalPostDto)
    localPost!: LocalPostDto;
}

export class LocalPostCreateBulkDto {
    @ApiProperty({description: "Brand id", required: true})
    @IsMongoId()
    brandId!: string;

    @ApiProperty({description: "Location IDs", required: true})
    @IsString({each: true})
    locationIds!: string[];

    @ApiProperty({description: "Post Dto", required: true})
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => LocalPostDto)
    localPost!: LocalPostDto;

    @ApiProperty({description: "Select all locations", required: false})
    @IsOptional()
    @IsBoolean()
    selectAllLocations?: boolean;
}

export class LocalPostListDto {
    @ApiProperty({description: "Location ID", required: true})
    @IsString()
    locationId!: string;

    @ApiProperty({description: "Page Token", required: false})
    @IsOptional()
    pageToken?: string;

    @ApiProperty({description: "Page Size", required: false})
    @IsOptional()
    pageSize?: number;
}

export class LocalPostDeleteDto {
    @ApiProperty({description: "Location ID", required: true})
    @IsMongoId()
    locationId!: string;

    @ApiProperty({description: "Post ID", required: true})
    @IsString()
    localPostId!: string;
}

export class LocalPostPatchDto {
    @ApiProperty({description: "Location ID", required: true})
    @IsMongoId()
    locationId!: string;

    @ApiProperty({description: "Post ID", required: true})
    @IsString()
    localPostId!: string;

    @ApiProperty({description: "Fields to update. Comma-separated list, e.g. summary,callToAction,media", required: false})
    @IsOptional()
    @IsString()
    updateMask?: string;

    @ApiProperty({description: "Post Data", required: true})
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => LocalPostPatchBodyDto)
    localPost!: LocalPostPatchBodyDto;
}

export class BulkPostResponseDto {
    @ApiProperty({description: "Success count", required: true})
    @IsNumber()
    successCount!: number;

    @ApiProperty({description: "Reject count", required: true})
    @IsNumber()
    rejectCount!: number;
}
```


**File:** `libs/dto/src/location/location-multi-provider-post.dto.ts`

```typescript
export class PostMediaDto {
    @ApiProperty({description: "Media URL"})
    @IsString()
    sourceUrl!: string;

    @ApiProperty({description: "Media format", enum: MediaFormatEnum, required: false})
    @IsOptional()
    @IsEnum(MediaFormatEnum)
    mediaFormat?: MediaFormatEnum;
}

export class AppleShowcaseCtaDto {
    @ApiProperty({description: "CTA type"})
    @IsString()
    type!: string;
}

export class AppleShowcasePayloadDto {
    @ApiProperty({description: "Creative ID", required: false})
    @IsOptional()
    @IsString()
    creativeId?: string;

    @ApiProperty({description: "Call To Action", required: true, type: AppleShowcaseCtaDto})
    @ValidateNested()
    @Type(() => AppleShowcaseCtaDto)
    cta!: AppleShowcaseCtaDto;

    @ApiProperty({description: "Resource type", required: false})
    @IsOptional()
    @IsString()
    resourceType?: string;

    @ApiProperty({description: "Apple Application Identifiers", required: false, type: [String]})
    @IsOptional()
    @IsArray()
    @IsString({each: true})
    appIds?: string[];
}

export class MultiProviderResultItemDto {
    @ApiProperty({description: "VenueX location id"})
    @IsMongoId()
    locationId!: string;

    @ApiProperty({description: "Failure reason", required: false})
    @IsOptional()
    @IsString()
    reason?: string;
}

export class MultiProviderSuccessItemDto {
    @ApiProperty({description: "VenueX location id"})
    @IsMongoId()
    locationId!: string;

    @ApiProperty({description: "Post ID", required: false})
    @IsOptional()
    @IsString()
    postId?: string;

    @ApiProperty({description: "Platform name", required: false})
    @IsOptional()
    @IsString()
    platformName?: string;
}

export class MultiProviderResultDto {
    @ApiProperty({description: "Success count"})
    @IsNumber()
    successCount!: number;

    @ApiProperty({description: "Failed count"})
    @IsNumber()
    rejectCount!: number;

    @ApiProperty({description: "Successfully created posts with their IDs", type: [MultiProviderSuccessItemDto], required: false})
    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => MultiProviderSuccessItemDto)
    succeeded?: MultiProviderSuccessItemDto[];

    @ApiProperty({description: "Failed locations with reasons", type: [MultiProviderResultItemDto]})
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => MultiProviderResultItemDto)
    failed!: MultiProviderResultItemDto[];
}

export class MultiProviderPostRequestDto {
    @ApiProperty({description: "Brand id"})
    @IsMongoId()
    brandId!: string;

    @ApiProperty({description: "Post campaign id (optional, for tracking)", required: false})
    @IsOptional()
    @IsMongoId()
    campaignId?: string;

    @ApiProperty({description: "Language/locale code (applies to both platforms)", required: false, default: "en-US"})
    @IsOptional()
    @IsString()
    locale?: string;

    @ApiProperty({description: "Media items. Apple: JPEG/PNG, 492-4864px, 1:1. Google: JPG/PNG/GIF/WEBP, 250px+.", required: false, type: [PostMediaDto], example: [{sourceUrl: "https://cdn.example.com/image.jpg", mediaFormat: "PHOTO"}]})
    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => PostMediaDto)
    media?: PostMediaDto[];

    @ApiProperty({description: "Post title", example: "Summer Sale Started!", required: false})
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({description: "Google post description (max 1500 characters)", example: "Discover our new summer collection with exclusive offers...", required: false, maxLength: 1500})
    @IsOptional()
    @IsString()
    @MaxLength(1500)
    googleDescription?: string;

    @ApiProperty({description: "Apple post description (max 100 characters)", example: "Summer Sale - Get 20% off!", required: false, maxLength: 100})
    @IsOptional()
    @IsString()
    @MaxLength(100)
    appleDescription?: string;

    @ApiProperty({description: "Start date (ISO8601). Google: EVENT/OFFER only. Apple: required.", example: "2024-01-01T00:00:00Z", required: false})
    @IsOptional()
    @IsISO8601()
    startDate?: string;

    @ApiProperty({description: "End date (ISO8601). Google: EVENT/OFFER only. Apple: required.", required: false})
    @IsOptional()
    @IsISO8601()
    endDate?: string;

    @ApiProperty({description: "Location ids", required: false})
    @IsOptional()
    @IsArray()
    @IsString({each: true})
    locationIds?: string[];

    @ApiProperty({description: "Select all locations under the brand", required: false})
    @IsOptional()
    @IsBoolean()
    selectAllLocations?: boolean;

    @ApiProperty({description: "Google Business Profile settings", required: false, type: LocalPostDto})
    @IsOptional()
    @ValidateNested()
    @Type(() => LocalPostDto)
    googleLocalPost?: LocalPostDto;

    @ApiProperty({description: "Apple showcase settings", required: false, type: AppleShowcasePayloadDto})
    @IsOptional()
    @ValidateNested()
    @Type(() => AppleShowcasePayloadDto)
    appleShowcase?: AppleShowcasePayloadDto;
}

export class MultiProviderPostResponseDto {
    @ApiProperty({description: "Google posting result", required: false, type: MultiProviderResultDto})
    @IsOptional()
    @ValidateNested()
    @Type(() => MultiProviderResultDto)
    google?: MultiProviderResultDto;

    @ApiProperty({description: "Apple showcase posting result", required: false, type: MultiProviderResultDto})
    @IsOptional()
    @ValidateNested()
    @Type(() => MultiProviderResultDto)
    apple?: MultiProviderResultDto;
}
```


**File:** `libs/dto/src/location/post-campaign.dto.ts`

```typescript
export class PostCampaignTargetingDto {
    @ApiProperty({enum: PostCampaignTargetingType})
    @IsEnum(PostCampaignTargetingType)
    type!: PostCampaignTargetingType;

    @ApiProperty({required: false, description: "Store set ID"})
    @IsOptional()
    @IsMongoId()
    storeSetId?: string;

    @ApiProperty({required: false, description: "Location IDs"})
    @IsOptional()
    @IsArray()
    @IsString({each: true})
    locationIds?: string[];
}

export class PostCampaignCreateDto extends MultiProviderPostRequestDto {
    @ApiProperty({description: "Campaign targeting configuration", type: PostCampaignTargetingDto})
    @ValidateNested()
    @Type(() => PostCampaignTargetingDto)
    targeting!: PostCampaignTargetingDto;

    @ApiProperty({description: "Campaign status", enum: PostCampaignStatus, required: false})
    @IsOptional()
    @IsEnum(PostCampaignStatus)
    status?: PostCampaignStatus;
}

export class PostCampaignUpdateDto extends PostCampaignCreateDto {
    @ApiProperty({description: "Optional Google post patch payloads", required: false, type: [GooglePostUpdateDto]})
    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => GooglePostUpdateDto)
    googlePostUpdates?: GooglePostUpdateDto[];

    @ApiProperty({description: "Apple showcase update payloads", required: false, type: [AppleShowcaseUpdateDto]})
    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AppleShowcaseUpdateDto)
    appleShowcaseUpdates?: AppleShowcaseUpdateDto[];

    @ApiProperty({description: "Apple showcase creative update payloads", required: false, type: [AppleShowcaseCreativeUpdateDto]})
    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AppleShowcaseCreativeUpdateDto)
    appleShowcaseCreativeUpdates?: AppleShowcaseCreativeUpdateDto[];
}

export class PostCampaignResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    title!: string;

    @ApiProperty({required: false})
    googleDescription?: string;

    @ApiProperty({required: false})
    appleDescription?: string;

    @IsIso6391Language()
    @ApiProperty({required: false, default: "tr"})
    locale?: string;

    @ApiProperty()
    brandId!: string;

    @ApiProperty({enum: PostCampaignStatus})
    status!: PostCampaignStatus;

    @ApiProperty({type: () => [String]})
    platforms!: string[];

    @ApiProperty({required: false, type: LocalPostDto})
    googleLocalPost?: LocalPostDto;

    @ApiProperty({required: false, type: AppleShowcaseResponseDto})
    appleShowcase?: AppleShowcaseResponseDto;

    @ApiProperty({required: false})
    startDate?: string;

    @ApiProperty({required: false})
    endDate?: string;

    @ApiProperty({required: false, type: () => [PostMediaDto]})
    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => PostMediaDto)
    media?: PostMediaDto[];

    @ApiProperty({type: PostCampaignTargetingDto})
    targeting!: PostCampaignTargetingDto;

    @ApiProperty({type: MultiProviderPostResponseDto})
    results?: MultiProviderPostResponseDto;

    @ApiProperty({required: false})
    createdAt?: Date;
}

export class GooglePostUpdateDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    locationId!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    postId!: string;

    @ApiProperty({description: "Fields to patch for the Google post", type: LocalPostPatchBodyDto})
    @ValidateNested()
    @Type(() => LocalPostPatchBodyDto)
    localPost!: LocalPostPatchBodyDto;
}

export class AppleShowcaseUpdateDto {
    @ApiProperty({description: "Apple showcase id"})
    @IsString()
    showcaseId!: string;

    @ApiProperty({description: "ETag for Apple showcase update"})
    @IsString()
    etag!: string;

    @ApiProperty({description: "Full showcase details payload", type: UpdateShowcaseDto})
    @ValidateNested()
    @Type(() => UpdateShowcaseDto)
    showcaseDetails!: UpdateShowcaseDto;
}

export class AppleShowcaseCreativeUpdateDto {
    @ApiProperty({description: "Apple showcase creative id"})
    @IsString()
    showcaseCreativeId!: string;

    @ApiProperty({description: "ETag for Apple showcase creative update"})
    @IsString()
    etag!: string;

    @ApiProperty({description: "Full showcase creative details payload", type: UpdateShowcaseCreativeDto})
    @ValidateNested()
    @Type(() => UpdateShowcaseCreativeDto)
    showcaseCreativeDetails!: UpdateShowcaseCreativeDto;
}

export class AppleShowcaseMetaDto {
    @ApiProperty({description: "Apple showcase id"})
    @IsString()
    showcaseId!: string;

    @ApiProperty({description: "ETag for Apple showcase", required: false})
    @IsOptional()
    @IsString()
    etag?: string;

    @ApiProperty({description: "Apple showcase creative id", required: false})
    @IsOptional()
    @IsString()
    creativeId?: string;
}

export class AppleShowcaseCreativeMetaDto {
    @ApiProperty({description: "Apple showcase creative id"})
    @IsString()
    creativeId!: string;

    @ApiProperty({description: "ETag for Apple showcase creative", required: false})
    @IsOptional()
    @IsString()
    etag?: string;

    @ApiProperty({description: "Full showcase creative details", required: false})
    @IsOptional()
    showcaseCreativeDetails?: ShowcaseCreativeDetails;
}

export class AppleShowcaseResponseDto extends AppleShowcasePayloadDto {
    @ApiProperty({description: "Showcase metadata", required: false, type: [AppleShowcaseMetaDto]})
    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AppleShowcaseMetaDto)
    meta?: AppleShowcaseMetaDto[];

    @ApiProperty({description: "Showcase creative metadata", required: false, type: [AppleShowcaseCreativeMetaDto]})
    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => AppleShowcaseCreativeMetaDto)
    creativeMeta?: AppleShowcaseCreativeMetaDto[];
}
```


**File:** `libs/dto/src/apple/showcase.dto.ts`

```typescript
export class ShowcaseResourceDetailsDto implements ShowcaseResourceDetails {
    @IsString()
    resourceType!: ShowcaseResourceDetails["resourceType"];

    @IsString()
    resourceId!: string;
}

export class CreateShowcaseDto implements ShowcaseDetails {
    @IsISO8601()
    startDate!: string;

    @IsISO8601()
    endDate!: string;

    @ValidateNested()
    @Type(() => ShowcaseResourceDetailsDto)
    resourceDetails!: ShowcaseResourceDetailsDto;

    @IsString()
    creativeId!: string;
}

export class UpdateShowcaseDto extends PartialType(CreateShowcaseDto) {
    @IsString()
    id!: string;
}

export class ShowcaseDescriptionDto implements ShowcaseDescription {
    @IsString()
    locale!: string;

    @IsString()
    text!: string;
}

export class ShowcaseContentDto implements ShowcaseContent {
    @IsString()
    placement!: ShowcaseContent["placement"];

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type(() => ShowcaseDescriptionDto)
    descriptions!: ShowcaseDescriptionDto[];
}

export class ShowcaseCaptionDto implements ShowcaseCaption {
    @IsString()
    altText!: string;

    @IsString()
    locale!: string;
}

export class ShowcasePhotoDto implements ShowcasePhoto {
    @IsString()
    id!: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => ShowcaseCaptionDto)
    captions?: ShowcaseCaptionDto[];
}

export class ShowcaseCreativeDetailsDto implements ShowcaseCreativeDetails {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({each: true})
    @Type(() => ShowcaseContentDto)
    contents!: ShowcaseContentDto[];

    @ValidateNested()
    @Type(() => ShowcasePhotoDto)
    photo!: ShowcasePhotoDto;

    @IsString()
    callToAction!: ShowcaseCreativeDetails["callToAction"];

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(1)
    @IsString({each: true})
    appIds?: string[];
}

export class CreateShowcaseCreativeDto extends ShowcaseCreativeDetailsDto implements CreateShowcaseCreativeDetails {}

export class UpdateShowcaseCreativeDto extends ShowcaseCreativeDetailsDto implements UpdateShowcaseCreativeDetails {
    @IsString()
    id!: string;
}
```


**File:** `libs/dto/src/apple/apple-photos.dto.ts`

```typescript
export class ApplePhotoPropertiesDto implements PhotoDimensions {
    @ApiProperty({required: true})
    @IsString()
    @IsUrl()
    url!: string;

    @ApiProperty({required: true})
    @IsNumber()
    @IsInt()
    pixelWidth?: number;

    @ApiProperty({required: true})
    @IsNumber()
    @IsInt()
    pixelHeight?: number;
}

export class ApplePhotosDto implements Photos {
    @ApiProperty({required: false, type: () => ApplePhotoPropertiesDto})
    @ValidateNested()
    @IsOptional()
    @Type(() => ApplePhotoPropertiesDto)
    thumbnail?: ApplePhotoPropertiesDto;

    @ApiProperty({required: false, type: () => ApplePhotoPropertiesDto})
    @ValidateNested()
    @IsOptional()
    @Type(() => ApplePhotoPropertiesDto)
    small?: ApplePhotoPropertiesDto;

    @ApiProperty({required: false, type: () => ApplePhotoPropertiesDto})
    @ValidateNested()
    @IsOptional()
    @Type(() => ApplePhotoPropertiesDto)
    medium?: ApplePhotoPropertiesDto;

    @ApiProperty({required: false, type: () => ApplePhotoPropertiesDto})
    @ValidateNested()
    @IsOptional()
    @Type(() => ApplePhotoPropertiesDto)
    large?: ApplePhotoPropertiesDto;

    @ApiProperty({required: false, type: () => ApplePhotoPropertiesDto})
    @ValidateNested()
    @IsOptional()
    @Type(() => ApplePhotoPropertiesDto)
    xlarge?: ApplePhotoPropertiesDto;

    @ApiProperty({required: false, type: () => ApplePhotoPropertiesDto})
    @ValidateNested()
    @IsOptional()
    @Type(() => ApplePhotoPropertiesDto)
    xxlarge?: ApplePhotoPropertiesDto;

    @ApiProperty({required: false, type: () => ApplePhotoPropertiesDto})
    @ValidateNested()
    @IsOptional()
    @Type(() => ApplePhotoPropertiesDto)
    original?: ApplePhotoPropertiesDto;
}
```


**File:** `libs/dto/src/apple/apple-media.dto.ts`

```typescript
export class AppleMediaUploadDto {
    @ApiProperty({required: true, example: "PBV01"})
    @IsString()
    partnersBrandVersion!: string;
}
```


**File:** `libs/dto/src/misc/social.dto.ts`

```typescript
export class SocialDto {
    @ApiProperty({name: "facebook", description: "Facebook profile page url", required: false})
    @IsOptional()
    @IsUrl()
    facebook?: Maybe<string>;

    @ApiProperty({name: "twitter", description: "Twitter profile page url", required: false})
    @IsOptional()
    @IsUrl()
    twitter?: Maybe<string>;

    @ApiProperty({name: "instagram", description: "Instagram profile page url", required: false})
    @IsOptional()
    @IsUrl()
    instagram?: Maybe<string>;

    @ApiProperty({name: "youtube", description: "Youtube page url", required: false})
    @IsOptional()
    @IsUrl()
    youtube?: Maybe<string>;

    @ApiProperty({name: "yelp", description: "Yelp page url", required: false})
    @IsOptional()
    @IsUrl()
    yelp?: Maybe<string>;

    @ApiProperty({name: "linkedin", description: "Linkedin page url", required: false})
    @IsOptional()
    @IsUrl()
    linkedin?: Maybe<string>;

    @ApiProperty({name: "tiktok", description: "Tiktok page url", required: false})
    @IsOptional()
    @IsUrl()
    tiktok?: Maybe<string>;

    @ApiProperty({name: "pinterest", description: "Pinterest page url", required: false})
    @IsOptional()
    @IsUrl()
    pinterest?: Maybe<string>;
}
```


**File:** `libs/dto/src/user/social-user.dto.ts`

```typescript
export class SocialUserDto {
    constructor({email, name, surname, photo, provider}: {email: string; provider: SocialAccountLinking; name?: string; surname?: string; photo?: string;}) {
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.photo = photo;
        this.provider = provider;
    }

    @ApiProperty({name: "email", example: "janedoe@email.com"})
    @IsEmail()
    email!: string;

    @ApiProperty({name: "name", example: "Jane", required: false})
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({name: "surname", example: "Doe", required: false})
    @IsOptional()
    @IsString()
    surname?: string;

    @ApiProperty({name: "photo", example: "https://venuex-storage.s3.eu-central-1.amazonaws.com/images/user/default-profile.png", required: false})
    @IsOptional()
    @IsString()
    photo?: string;

    @ApiProperty({name: "provider", example: SocialAccountLinking.googleGbp})
    @IsEnum(SocialAccountLinking)
    provider!: SocialAccountLinking;
}
```


**File:** `libs/dto/src/upload/file-upload.dto.ts`

```typescript
export class FileUploadDto implements Pick<IUploadedFile, "fileExpiration"> {
    @ApiProperty({description: "File to be uploaded", format: "binary"})
    @Allow()
    file!: File;

    @ApiProperty({description: "Expiration time of the file", required: false, type: "number"})
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    fileExpiration?: number;
}
```


**File:** `libs/dto/src/upload/image-upload.dto.ts`

```typescript
export class ImageUploadDto implements Pick<IUploadedFile, "fileExpiration" | "width" | "height"> {
    @ApiProperty({description: "Image to be uploaded", format: "binary"})
    @Allow()
    image!: File;

    @ApiProperty({description: "Expiration time of the file", required: false, type: "number"})
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    fileExpiration?: number;

    @ApiProperty({description: "Desired width of the image for resize operation", required: false, type: "number"})
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    width?: number;

    @ApiProperty({description: "Desired height of the image for resize operation", required: false, type: "number"})
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    height?: number;
}
```


**File:** `libs/dto/src/feed-health/feed-health.dto.ts`

```typescript
export class FeedHealthDto {
    @IsString()
    stateMachineName!: string;

    @ApiProperty({description: "Execution result list for the given state machine.", type: () => [ExecutionListItemDto], required: true})
    @Type(() => ExecutionListItemDto)
    @ValidateNested({each: true})
    @IsArray()
    executions!: ExecutionListItemDto[];
}

export class ExecutionListItemDto {
    @IsOptional()
    @IsString()
    executionId?: string;

    @IsOptional()
    error?: string;

    @IsDateString()
    startDate!: string;

    @IsOptional()
    @IsDateString()
    stopDate?: string;

    @IsString()
    status!: ExecutionStatus;
}
```


**File:** `libs/dto/src/meta-graph-api/product-feed.dto.ts`

```typescript
export class MetaProductFeedScheduleDto {
    @IsEnum(MetaFeedIntervalEnum)
    interval!: MetaFeedIntervalEnum;

    @IsString()
    url!: string;

    @IsOptional()
    @IsNumber()
    hour?: number;

    @IsOptional()
    @IsNumber()
    minute?: number;

    @IsOptional()
    @IsNumber()
    interval_count?: number;

    @IsOptional()
    @IsNumber()
    day_of_month?: number;

    @IsOptional()
    @IsEnum(MetaFeedDayOfWeekEnum)
    day_of_week?: MetaFeedDayOfWeekEnum;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    timezone?: string;
}

export class CreateMetaProductFeedDto {
    @IsString()
    name!: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => MetaProductFeedScheduleDto)
    schedule?: MetaProductFeedScheduleDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => MetaProductFeedScheduleDto)
    update_schedule?: MetaProductFeedScheduleDto;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    default_currency?: string;

    @IsOptional()
    @IsBoolean()
    deletion_enabled?: boolean;

    @IsOptional()
    @IsEnum(MetaProductFeedDelimiterEnum)
    delimiter?: MetaProductFeedDelimiterEnum;

    @IsOptional()
    @IsEnum(MetaProductFeedEncodingEnum)
    encoding?: MetaProductFeedEncodingEnum;

    @IsOptional()
    @IsEnum(MetaProductFeedTypeEnum)
    feed_type?: MetaProductFeedTypeEnum;

    @IsOptional()
    @IsString()
    file_name?: string;

    @IsOptional()
    @IsEnum(MetaFeedIngestionSourceType)
    ingestion_source_type?: MetaFeedIngestionSourceType;

    @IsOptional()
    @IsEnum(MetaFeedQuotedFieldsMode)
    quoted_fields_mode?: MetaFeedQuotedFieldsMode;
}
```


### Enums & Constants

**File:** `libs/constants/src/location/location-media.ts`

```typescript
export enum MediaFormatEnum {
    unspecified = "MEDIA_FORMAT_UNSPECIFIED",
    photo = "PHOTO",
    video = "VIDEO",
}

export enum MediaItemCategoryEnum {
    CATEGORY_UNSPECIFIED = "CATEGORY_UNSPECIFIED",
    COVER = "COVER",
    PROFILE = "PROFILE",
    LOGO = "LOGO",
    EXTERIOR = "EXTERIOR",
    INTERIOR = "INTERIOR",
    PRODUCT = "PRODUCT",
    AT_WORK = "AT_WORK",
    FOOD_AND_DRINK = "FOOD_AND_DRINK",
    MENU = "MENU",
    COMMON_AREA = "COMMON_AREA",
    ROOMS = "ROOMS",
    TEAMS = "TEAMS",
    ADDITIONAL = "ADDITIONAL",
}

export enum UploadedByEnum {
    OWNER = "OWNER",
    CUSTOMER = "CUSTOMER",
}
```


**File:** `libs/constants/src/location/location-post.ts`

```typescript
export enum LocalPostState {
    LOCAL_POST_STATE_UNSPECIFIED = "LOCAL_POST_STATE_UNSPECIFIED",
    REJECTED = "REJECTED",
    LIVE = "LIVE",
    PROCESSING = "PROCESSING",
}

export enum LocalPostTopicType {
    LOCAL_POST_TOPIC_TYPE_UNSPECIFIED = "LOCAL_POST_TOPIC_TYPE_UNSPECIFIED",
    OFFER = "OFFER",
    EVENT = "EVENT",
    STANDARD = "STANDARD",
    ALERT = "ALERT",
}

export enum AlertType {
    ALERT_TYPE_UNSPECIFIED = "ALERT_TYPE_UNSPECIFIED",
    COVID_19 = "COVID_19",
}

export enum LocalPostActionType {
    ACTION_TYPE_UNSPECIFIED = "ACTION_TYPE_UNSPECIFIED",
    BOOK = "BOOK",
    ORDER = "ORDER",
    SHOP = "SHOP",
    LEARN_MORE = "LEARN_MORE",
    SIGN_UP = "SIGN_UP",
    CALL = "CALL",
}

export enum AppleShowcaseActionType {
    ADD_PHOTOS = "ADD_PHOTOS",
    ADD_TO_FAVORITES = "ADD_TO_FAVORITES",
    ADD_TO_GUIDE = "ADD_TO_GUIDE",
    CALL = "CALL",
    GET_DIRECTIONS = "GET_DIRECTIONS",
    RATE_US = "RATE_US",
    SAVE_AS_CONTACT = "SAVE_AS_CONTACT",
    SHARE = "SHARE",
    WEBSITE = "WEBSITE",
}

export const LocalPostActionTypeLabels: Record<LocalPostActionType, string> = {
    [LocalPostActionType.ACTION_TYPE_UNSPECIFIED]: "None",
    [LocalPostActionType.BOOK]: "Book",
    [LocalPostActionType.ORDER]: "Order Online",
    [LocalPostActionType.SHOP]: "Shop",
    [LocalPostActionType.LEARN_MORE]: "Learn More",
    [LocalPostActionType.SIGN_UP]: "Sign Up",
    [LocalPostActionType.CALL]: "Call",
};

export const LocalPostTopicTypeLabels: Record<LocalPostTopicType, string> = {
    [LocalPostTopicType.LOCAL_POST_TOPIC_TYPE_UNSPECIFIED]: "None",
    [LocalPostTopicType.STANDARD]: "Standard Update",
    [LocalPostTopicType.EVENT]: "Event",
    [LocalPostTopicType.OFFER]: "Offer (Coupon)",
    [LocalPostTopicType.ALERT]: "Alert",
};

export const AppleShowcaseActionTypeLabels: Record<AppleShowcaseActionType, string> = {
    [AppleShowcaseActionType.ADD_PHOTOS]: "Add Photos",
    [AppleShowcaseActionType.ADD_TO_FAVORITES]: "Add to Favorites",
    [AppleShowcaseActionType.ADD_TO_GUIDE]: "Add to Guide",
    [AppleShowcaseActionType.CALL]: "Call Now",
    [AppleShowcaseActionType.GET_DIRECTIONS]: "Get Directions",
    [AppleShowcaseActionType.RATE_US]: "Rate Us",
    [AppleShowcaseActionType.SAVE_AS_CONTACT]: "Save as Contact",
    [AppleShowcaseActionType.SHARE]: "Share this Place",
    [AppleShowcaseActionType.WEBSITE]: "Website",
};

export const APPLE_SHOWCASE_LIMITS = {
    HEADLINE_MAX_LENGTH: 38,
    HEADLINE_MIN_LENGTH: 5,
    BODY_MAX_LENGTH: 100,
    BODY_MIN_LENGTH: 5,
    CAPTION_MAX_LENGTH: 255,
    CAPTION_MIN_LENGTH: 5,
} as const;

export const APPLE_SHOWCASE_RETRY = {
    MAX_RETRIES: 3,
    BASE_DELAY_MS: 30000,
    DELETE_PROPAGATION_DELAY_MS: 25000,
    DEACTIVATE_PROPAGATION_DELAY_MS: 5000,
    RETRYABLE_ERROR_CODES: ["ShowcaseHasConflictOnScheduledTimePeriod", "VALIDATION__ShowcaseHasConflictOnScheduledTimePeriod"] as const,
    RETRYABLE_ERROR_MESSAGES: ["PARSING_ERROR", "Invalid request"] as const,
    ALREADY_DELETED_MESSAGES: ["SHOWCASE__MARKED_DELETED", "Resource marked deleted"] as const,
} as const;
```


**File:** `libs/constants/src/post-campaign.ts`

```typescript
export enum PostCampaignTargetingType {
    STORE_SET = "STORE_SET",
    SELECTED = "SELECTED",
    ALL = "ALL",
}

export enum PostCampaignStatus {
    DRAFT = "DRAFT",
    SENT = "SENT",
    LIVE = "LIVE",
    SCHEDULED = "SCHEDULED",
    ENDED = "ENDED",
    PARTIAL_FAIL = "PARTIAL_FAIL",
    FAILED = "FAILED",
    WARNING = "WARNING",
}

export enum PostActionType {
    DRAFT = "draft",
    PUBLISH = "publish",
}
```


**File:** `libs/constants/src/etl/feed-type.ts`

```typescript
export enum FeedType {
    Product = "PRODUCT",
    Inventory = "INVENTORY",
    Store_Sale = "STORE_SALE",
}

export enum ExecutionFeedType {
    Catalog = "CATALOG",
    Offline_Conversion = "OFFLINE_CONVERSION",
}
```


**File:** `libs/constants/src/meta-graph-api/catalog.ts`

```typescript
export enum MetaFeedIntervalEnum {
    HOURLY = "HOURLY",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
}

export enum MetaFeedDayOfWeekEnum {
    SUNDAY = "SUNDAY",
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
    SATURDAY = "SATURDAY",
}

export enum MetaFeedIngestionSourceType {
    PRIMARY_FEED = "PRIMARY_FEED",
    SUPPLEMENTARY_FEED = "SUPPLEMENTARY_FEED",
}

export enum MetaFeedIngestionSourceTypeReadOnly {
    PRIMARY_FEED = "primary_feed",
    SUPPLEMENTARY_FEED = "supplementary_feed",
}

export enum MetaFeedQuotedFieldsMode {
    AUTODETECT = "AUTODETECT",
    ON = "ON",
    OFF = "OFF",
}

export enum MetaProductFeedDelimiterEnum {
    AUTODETECT = "AUTODETECT",
    BAR = "BAR",
    COMMA = "COMMA",
    TAB = "TAB",
    TILDE = "TILDE",
    SEMICOLON = "SEMICOLON",
}

export enum MetaProductFeedEncodingEnum {
    AUTODETECT = "AUTODETECT",
    LATIN1 = "LATIN1",
    UTF8 = "UTF8",
    UTF16LE = "UTF16LE",
    UTF16BE = "UTF16BE",
    UTF32LE = "UTF32LE",
    UTF32BE = "UTF32BE",
}

export enum MetaProductFeedTypeEnum {
    PRODUCTS = "PRODUCTS",
    LOCAL_INVENTORY = "LOCAL_INVENTORY",
    OFFER = "OFFER",
    MEDIA_TITLE = "MEDIA_TITLE",
    VEHICLES = "VEHICLES",
    VEHICLE_OFFER = "VEHICLE_OFFER",
    HOTEL = "HOTEL",
    HOTEL_ROOM = "HOTEL_ROOM",
    FLIGHT = "FLIGHT",
    DESTINATION = "DESTINATION",
    HOME_LISTING = "HOME_LISTING",
    AUTOMOTIVE_MODEL = "AUTOMOTIVE_MODEL",
    COLLECTION = "COLLECTION",
    PRODUCT_RATINGS_AND_REVIEWS = "PRODUCT_RATINGS_AND_REVIEWS",
    TRANSACTABLE_ITEMS = "TRANSACTABLE_ITEMS",
}
```


### Interfaces & Types

_No definitions found in this category._

### Validation Schemas

_No definitions found in this category._

---
