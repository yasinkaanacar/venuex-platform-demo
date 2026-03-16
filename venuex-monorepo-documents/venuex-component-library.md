# VenueX Reusable UI Component Library

> Auto-generated catalog of all shared/reusable UI components across the VenueX monorepo.
> Last updated: 2026-03-11

---

## Table of Contents

1. [Storefront UI Primitives (`apps/storefront/src/components/ui/`)](#1-storefront-ui-primitives)
2. [Storefront Custom Components (`apps/storefront/src/components/custom/`)](#2-storefront-custom-components)
3. [Storefront Common Components (`apps/storefront/src/components/common/`)](#3-storefront-common-components)
4. [Storefront Hook Form Fields (`apps/storefront/src/components/hook-form/`)](#4-storefront-hook-form-fields)
5. [Atomic Components Library (`libs/atomic-components/`)](#5-atomic-components-library)
6. [VMS Legacy Components (`apps/vms/src/components/`)](#6-vms-legacy-components)
7. [Summary](#7-summary)

---

## 1. Storefront UI Primitives

**Location:** `apps/storefront/src/components/ui/`
**Pattern:** Shadcn-style API backed by MUI and Radix primitives, styled with Tailwind.

### Tables

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` | `ui/table.tsx` | Standard HTML table attributes + `className` | Tailwind `cn` utility | Full HTML table primitives with Tailwind classes |
| `TableSkeletonRow` | `ui/table-states.tsx` | `{columns?: number}` | `Skeleton` | Single skeleton loading row |
| `TableSkeletonRows` | `ui/table-states.tsx` | `{rows?: number; columns?: number}` | `Skeleton` | Multiple skeleton rows |
| `TableEmptyState` | `ui/table-states.tsx` | `{title?, description?, icon?, action?, columns?}` | `lucide-react` | Empty table placeholder |
| `TableNoSearchResults` | `ui/table-states.tsx` | `{searchTerm?, onClearSearch?, columns?}` | `lucide-react` | No search results message |
| `TableErrorState` | `ui/table-states.tsx` | `{title?, description?, onRetry?, columns?}` | `lucide-react` | Table error with retry button |
| `TableLoadingEmptyRows` | `ui/table-states.tsx` | `{count: number; columns?}` | `Skeleton` | Loading placeholder rows |

### Buttons

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Button` | `ui/button.tsx` | `{variant?: "default"\|"destructive"\|"outline"\|"secondary"\|"ghost"\|"link"; size?: "default"\|"sm"\|"lg"\|"icon"; asChild?: boolean}` + MUI ButtonProps | MUI `Button`, `styled` | Unified button with shadcn variant/size API over MUI |

### Modals / Dialogs

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Dialog`, `DialogContent`, `DialogTitle`, `DialogDescription`, `DialogHeader`, `DialogFooter`, `DialogClose`, `DialogTrigger`, `DialogPortal`, `DialogOverlay` | `ui/dialog.tsx` | `Dialog: {open?, onOpenChange?, children, maxWidth?}` | MUI `Dialog`, `lucide-react` | Full dialog system wrapping MUI with shadcn API |
| `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription` | `ui/sheet.tsx` | `Sheet: {open?, onOpenChange?, children}`; `SheetContent: {side?: "left"\|"right"\|"top"\|"bottom"}` | MUI `Drawer` | Side-panel/drawer on MUI Drawer |

### Dropdowns / Select

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`, `SelectGroup`, `SelectLabel`, `SelectSeparator` | `ui/select.tsx` | `{placeholder?, onValueChange?, value?, renderValue?}` + MUI SelectProps | MUI `Select`, `MenuItem`, `lucide-react` | MUI Select with shadcn API |
| `DropdownMenu` (+ Trigger, Content, Item, CheckboxItem, RadioItem, Label, Separator, Shortcut, Group, Sub, SubContent, SubTrigger, RadioGroup) | `ui/dropdown-menu.tsx` | Radix primitive props; items accept `inset?: boolean` | `@radix-ui/react-dropdown-menu`, `lucide-react` | Full Radix dropdown menu system |
| `AutocompleteSelect` | `ui/autocomplete-select.tsx` | `{placeholder: string; options: AutocompleteOption[]; onValueChange: (value: string) => void; onSearch?; emptyMessage?; maxResults?}` | `lucide-react`, internal `Input`, `Button`, `Card` | Searchable autocomplete with keyboard nav, badges, suggested items |
| `SingleSelectCombobox` | `ui/single-select-combobox.tsx` | `{options: SingleSelectOption[]; value: string\|null; onValueChange; placeholder; onSearchChange?; forceOpen?; emptyMessage?; maxResults?}` | `lucide-react`, internal `Button`, `Card`, `Input` | Single-value searchable combobox with clear |

### Forms / Inputs

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Input` | `ui/input.tsx` | MUI `TextFieldProps` (omitting variant) + `className?` | MUI `TextField`, `styled` | Styled outlined text input |
| `Textarea` | `ui/textarea.tsx` | `React.ComponentProps<"textarea">` | Tailwind `cn` | Native textarea with Tailwind styling |
| `Label` | `ui/label.tsx` | MUI `FormLabelProps` + `className?` | MUI `FormLabel`, `styled` | Styled form label |
| `Checkbox` | `ui/checkbox.tsx` | MUI `CheckboxProps` (omitting size) + `className?` | MUI `Checkbox`, `styled` | Styled small checkbox |
| `Switch` | `ui/switch.tsx` | MUI `SwitchProps` + `className?` | MUI `Switch`, `styled` | Toggle switch |

### Cards

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | `ui/card.tsx` | `React.HTMLAttributes<HTMLDivElement>` + `className` | Tailwind `cn` | Composable card with subcomponents |
| `RichLocationCard` | `ui/rich-location-card.tsx` | `{location: {name, storeCode?, address?, city?, platform?}; variant?: "default"\|"create"\|"delete"; showLabel?}` | `lucide-react`, `react-icons/si` | Location card with platform icon and action variant |

### Tabs

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `ui/tabs.tsx` | Radix primitive props | `@radix-ui/react-tabs` | Accessible Radix tabs |

### Tooltips

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` | `ui/tooltip.tsx` | Radix primitive props | `@radix-ui/react-tooltip` | Radix tooltip with portal |

### Accordion / Collapsible

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` | `ui/accordion.tsx` | Radix primitive props | `@radix-ui/react-accordion`, `lucide-react` | Radix accordion with animated chevron |
| `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` | `ui/collapsible.tsx` | `{open?, onOpenChange?, children}` | MUI `Accordion`, `styled` | Controlled collapsible using MUI Accordion |
| `AuditAccordion` | `ui/audit-accordion.tsx` | `{id, title, count, children, defaultOpen?, variant?: "default"\|"warning", searchPlaceholder?, searchValue?, onSearchChange?}` | `lucide-react`, internal `Input`, `Accordion` | Collapsible section with count badge and inline search |

### Badges / Chips

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Badge` | `ui/badge.tsx` | `{variant?: "default"\|"secondary"\|"destructive"\|"outline"}` + MUI ChipProps | MUI `Chip`, `styled` | Status/label chip |

### Popovers

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Popover`, `PopoverTrigger`, `PopoverContent` | `ui/popover.tsx` | Radix props; Content: `{align?, sideOffset?}` | `@radix-ui/react-popover` | Radix popover with portal |

### Separators

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Separator` | `ui/separator.tsx` | `{orientation?, decorative?}` | `@radix-ui/react-separator` | Horizontal/vertical divider |

### Loaders

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Skeleton` | `custom/skeleton.tsx` | `React.HTMLAttributes<HTMLDivElement>` + `className` | Tailwind `cn` | Pulsing loading placeholder |

---

## 2. Storefront Custom Components

**Location:** `apps/storefront/src/components/custom/`

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `SortableTableHead` | `custom/sortable-table-head.tsx` | `{children, sortKey: string; currentSort?; currentOrder?: "asc"\|"desc"; onSort: (key) => void}` | `lucide-react`, internal `TableHead` | Clickable `<th>` with sort direction icons |
| `LoadingButton` | `custom/loading-button.tsx` | Button variant/size + MUI Lab `LoadingButtonProps` (`loading?`) | MUI Lab `LoadingButton`, `styled` | Button with spinner when loading |
| `ToggleIconButton` | `custom/ToggleIconButton.tsx` | `{value, selectValues, onChange, iconLeft, iconRight}` + MUI ToggleButtonGroupProps | MUI `ToggleButton`, `ToggleButtonGroup`, `Iconify` | Two-button toggle (e.g. list/grid) |
| `ConfirmDeleteDialog` | `custom/ConfirmDeleteDialog.tsx` | `{onConfirm: () => void; title?, content?, loading?}` + MUI DialogProps | MUI `Dialog`, `Image` | Delete confirmation modal with trash icon |
| `ConfirmPublishDialog` | `custom/ConfirmPublishDialog.tsx` | `{onConfirm: () => void; title?, content?, loading?}` + MUI DialogProps | MUI `Dialog`, `lucide-react` | Publish confirmation with checkmark |
| `WarningDialog` | `custom/WarningDialog.tsx` | `{isOpen, setIsOpen?, description?, descriptionElement?, buttonText?}` | MUI `Dialog`, `Image` | Warning/alert dialog with illustration |
| `DistrictsSelector` | `custom/DistrictsSelector.tsx` | `{selectedDistrict?, onDistrictChange, selectedProvince?, disabled?}` | MUI `Select`, `turkey-neighbourhoods` | Turkish district dropdown |
| `ProvinceSelector` | `custom/ProvinceSelector.tsx` | `{selectedProvince?, onProvinceChange, disabled?}` | MUI `Select`, API hooks | Turkish province dropdown |
| `LocationStatusLabel` | `custom/LocationStatusLabel.tsx` | `{location: Location; className?}` | MUI `Typography`, `@libs/constants` | Location open/closed status text |
| `LocationStatusAlert` | `custom/LocationStatusAlert.tsx` | `{location: Location}` + MUI AlertProps | MUI `Alert`, `Dialog`, `notistack`, `@tanstack/react-query` | Status alert banner with inline edit dialog |
| `LocationAddressLink` | `custom/LocationAddressLink.tsx` | `{location: Location}` | MUI `Link`, `Stack` | Clickable location name + address link |

---

## 3. Storefront Common Components

**Location:** `apps/storefront/src/components/common/`

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Breadcrumbs` | `common/Breadcrumbs.tsx` | `CustomBreadcrumbsProps` from `@libs/atomic` | `@libs/atomic` | Breadcrumbs wrapper injecting app HeaderRight |
| `ContentTab` | `common/ContentTab.tsx` | `{tabs: {title, content, icon?, id?}[]; initialTabIndex?}` | MUI `Box`, `ButtonBase` | Hash-based tab container with active top-border |
| `FullWidthTab` | `common/FullWidthTab.tsx` | `{tabs: {title, icon?, disabled?, content?}[]}` | MUI `Box`, `ButtonBase` | Full-width tabs with bottom-border indicator |
| `VerticalTab` | `common/VerticalTab.tsx` | `{tabs: {title, subtitle?, content, icon}[]}` | MUI `Stack`, `ButtonBase` | Vertical sidebar tabs |
| `SubHead` | `common/SubHead.tsx` | `{heading?, links?, contents?, rightAction?, showBack?, noMargin?}` | MUI `Container`, `Breadcrumbs`, `@libs/atomic` | Sub-header with logo, breadcrumbs, stats, actions |
| `ContentCollapse` | `common/ContentCollapse.tsx` | `{content?, title, leftContent?, redirectUrl?, navigateState?}` | MUI `Collapse`, `IconButton` | Expandable card section or redirect link |
| `SuggestionList` | `common/SuggestionList.tsx` | `{data: {labels, rows}; isLoading?}` | MUI `Skeleton`, `Stack` | Tabular data display with loading skeleton |
| `UptimeGraph` | `common/UptimeGraph.tsx` | `{rows: UptimeGraphRow[]; isLoading?}` | MUI `Box`, `Tooltip` | 90-day uptime bar chart with status colors |

---

## 4. Storefront Hook Form Fields

**Location:** `apps/storefront/src/components/hook-form/`

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `FormRequirementsSection` | `hook-form/FormRequirements.tsx` | `{requireList: {label, formKeys, countCheck?, key, isOptional?}[]; focusIndex?; watch}` | MUI `LinearProgress`, `Iconify` | Sticky sidebar with form completion progress bar and checklist |
| `RHFCustomAutocomplete` | `hook-form/RHFCustomAutocomplete.tsx` | `{name, label?, options: T[], labelMethod, valueMethod}` + AutocompleteProps | MUI `Autocomplete`, `react-hook-form` | RHF autocomplete mapping objects to label/value |
| `RHFCustomRemoteAutocomplete` | `hook-form/RHFCustomRemoteAutocomplete.tsx` | `{name, label?, dataFetch, apiCallOptions?, labelMethod, valueMethod, maxLength?, includeIds?}` | MUI `Autocomplete`, `@tanstack/react-query`, `useDebounce` | RHF autocomplete with paginated API fetch |
| `RHFRegularHoursEditField` | `hook-form/RHFRegularHoursEditField.tsx` | `{regularHours, append, register, remove, handleDateChange, activeSwitches, setSwitchActive, setValue}` | MUI `TimePicker`, `Switch`, `react-hook-form` | Weekly hours editor with per-day toggles |
| `RHFSpecialHoursEditField` | `hook-form/RHFSpecialHoursEditField.tsx` | Similar to RHFRegularHoursEditField | MUI `TimePicker`, `react-hook-form` | Special/holiday hours editor |

---

## 5. Atomic Components Library

**Location:** `libs/atomic-components/src/components/`
**Shared across:** Storefront, VMS, and other frontend apps via `@libs/atomic` import.

### Tables

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `TableHeadCustom` | `table/TableHeadCustom.tsx` | `{order?, orderBy?, headLabel: HeadCell[], rowCount?, numSelected?, onSort?, onSelectAllRows?, enableSelectAll?}` | MUI `TableHead`, `TableSortLabel`, `Checkbox` | Table header with sort labels and select-all checkbox |
| `TablePaginationCustom` | `table/TablePaginationCustom.tsx` | `{dense?, onChangeDense?, rowsPerPage, onPageChange, onRowsPerPageChange, isLoading, count?, pageCount?, hasNextPage?, leftAction?}` | MUI `Pagination`, `Select`, `Switch`, `Skeleton` | Pagination footer; supports count-based and cursor-based modes |
| `TableSelectedAction` | `table/TableSelectedAction.tsx` | `{dense?, action?, rowCount, numSelected, onSelectAllRows}` | MUI `Checkbox`, `Typography`, `Stack` | Floating action bar for selected rows |
| `TableEmptyRows` | `table/TableEmptyRows.tsx` | `{emptyRows, height}` | MUI `TableRow`, `TableCell` | Filler rows to maintain table height |
| `TableNoData` | `table/TableNoData.tsx` | `{isNotFound, title?}` | MUI `TableRow`, `EmptyContent` | Empty table message row |
| `TableSkeleton` | `table/TableSkeleton.tsx` | `{dense?, columns?}` | MUI `Skeleton`, `TableRow` | Skeleton loading rows |
| `TablePaginationCustomLegacy` | `table/TablePaginationCustomLegacy.tsx` | Legacy pagination props | MUI `TablePagination` | Legacy pagination component |

### Dialogs

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `ConfirmDialog` | `confirm-dialog/ConfirmDialog.tsx` | `{title, content?, action, open, onClose, contentNode?, topContent?}` + MUI DialogProps | MUI `Dialog`, `DialogTitle`, `DialogContent`, `DialogActions` | Generic confirmation dialog |

### Navigation / Breadcrumbs

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `CustomBreadcrumbs` | `custom-breadcrumbs/CustomBreadcrumbs.tsx` | `{links, action?, leftAction?, heading?, headerRight?, moreLink?, activeLast?, isSticky?, showBackButton?, onBackButtonClick?}` | MUI `Breadcrumbs`, `Container`, `Stack` | Breadcrumb header with back button, heading, actions, sticky mode |
| `NavSectionHorizontal` | `nav-section/horizontal/NavSectionHorizontal.tsx` | Nav config array | MUI, `framer-motion` | Horizontal navigation bar |
| `NavSectionVertical` | `nav-section/vertical/NavSectionVertical.tsx` | Nav config array | MUI, `framer-motion` | Vertical sidebar navigation |
| `NavSectionMini` | `nav-section/mini/NavSectionMini.tsx` | Nav config array | MUI, `framer-motion` | Mini/icon sidebar navigation |

### Forms / Inputs (RHF-connected)

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `FormProvider` | `hook-form/FormProvider.tsx` | `{children, methods, onSubmit}` | `react-hook-form` | RHF context provider wrapper |
| `RHFTextField` | `hook-form/RHFTextField.tsx` | `{name, resetWhenEmpty?}` + MUI TextFieldProps | MUI `TextField`, `react-hook-form` | RHF text input with error display |
| `RHFSelect` | `hook-form/RHFSelect.tsx` | `{name, native?, maxHeight?, children}` + TextFieldProps | MUI `Select`, `TextField`, `react-hook-form` | RHF single-select dropdown |
| `RHFMultiSelect` | `hook-form/RHFSelect.tsx` | `{name, label?, chip?, checkbox?, placeholder?, options: OptionValue[]}` + SelectProps | MUI `Select`, `Chip`, `Checkbox`, `react-hook-form` | RHF multi-select with chips/checkboxes |
| `RHFAutocomplete` | `hook-form/RHFAutocomplete.tsx` | `{name, label?, helperText?}` + MUI AutocompleteProps | MUI `Autocomplete`, `react-hook-form` | RHF autocomplete |
| `RHFCheckbox` | `hook-form/RHFCheckbox.tsx` | `{name, helperText?}` + FormControlLabelProps | MUI `Checkbox`, `react-hook-form` | RHF single checkbox |
| `RHFMultiCheckbox` | `hook-form/RHFCheckbox.tsx` | `{name, options, row?, label?, spacing?, helperText?}` | MUI `Checkbox`, `FormGroup`, `react-hook-form` | RHF multi-checkbox group |
| `RHFSwitch` | `hook-form/RHFSwitch.tsx` | `{name, helperText?}` + FormControlLabelProps | MUI `Switch`, `react-hook-form` | RHF toggle switch |
| `RHFDatePicker` | `hook-form/RHFDatePicker.tsx` | `{name}` + DatePickerProps | `@mui/x-date-pickers`, `react-hook-form` | RHF date picker |
| `RHFPhoneField` | `hook-form/RHFPhoneField.tsx` | `{name, resetWhenEmpty?}` + MuiPhoneNumberProps | `material-ui-phone-number`, `react-hook-form` | RHF international phone input (default: TR) |
| `RHFPasswordField` | `hook-form/RHFPasswordField.tsx` | `{name}` + TextFieldProps | MUI `TextField`, `react-hook-form` | RHF password with show/hide toggle |
| `RHFNumberField` | `hook-form/RHFNumberField.tsx` | `{name}` + TextFieldProps | MUI `TextField`, `react-hook-form` | RHF numeric input |
| `RHFSlider` | `hook-form/RHFSlider.tsx` | `{name}` + SliderProps | MUI `Slider`, `react-hook-form` | RHF range slider |
| `RHFRadioGroup` | `hook-form/RHFRadioGroup.tsx` | `{name, options}` | MUI `RadioGroup`, `react-hook-form` | RHF radio button group |
| `RHFCodes` | `hook-form/RHFCodes.tsx` | `{name, keyName}` | `react-hook-form` | RHF OTP/verification code input |
| `RHFCustomSelect` | `hook-form/RHFCustomSelect.tsx` | `{name, options}` | MUI, `react-hook-form` | RHF custom-styled select |
| `RHFUpload` / `RHFUploadAvatar` / `RHFUploadBox` / `RHFUploadNew` | `hook-form/RHFUpload.tsx` | `{name, multiple?, helperText?}` + UploadProps | `react-hook-form`, internal Upload components | RHF file upload variants |

### Standalone Inputs

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `CustomTextField` | `custom-input/CustomTextField.tsx` | MUI TextFieldProps + `{width?: number}` | MUI `TextField`, `styled` | Borderless text field with focus shadow |
| `PhoneInput` | `custom-input/PhoneInput.tsx` | `MuiPhoneNumberProps` | `material-ui-phone-number` | Standalone phone input (default: TR) |
| `CustomSmallSelect` | `custom-input/CustomSmallSelect.tsx` | Select props | MUI `Select` | Compact select dropdown |
| `IncrementerButton` | `custom-input/IncrementerButton.tsx` | `{value, onChange, min?, max?}` | MUI `IconButton` | +/- numeric incrementer |
| `VXSelect` | `select/VXSelect.tsx` | `{name, options: OptionValue[], reset?, isLoading?, fullWidth?, selectedValue}` + TextFieldProps | MUI `TextField`, `MenuItem`, `CircularProgress` | Select with loading state and optional "None" reset |

### Date Pickers

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `DateRangePicker` | `date-range-picker/DateRangePicker.tsx` | `{title?, variant?: "input"\|"calendar", startDate, endDate, onChangeStartDate, onChangeEndDate, open, onClose, onApply?, isError?}` | MUI `Dialog`, `@mui/x-date-pickers` | Date range dialog with text or calendar mode |
| `DateRangeCalendar` | `date-range-calendar/DateRangeCalendar.tsx` | Calendar range props | `@mui/x-date-pickers` | Standalone date range calendar |
| `DateFormatBuilder` | `date-format-builder/DateFormatBuilder.tsx` | Format builder props | MUI components | Interactive date format string builder |

### Tabs

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `StatusTab` | `tabs/StatusTab.tsx` | `{tabs: {label, value, count?, isLoading?, color?: StatusTabColor, disabled?, disabledTooltip?}[]; initialActiveTabIndex?; onChangeTab?; useDefaultColors?}` | MUI `ButtonBase`, `CircularProgress`, `Tooltip` | Tabs with count badges, loading spinners, and color-coded badges |

### Labels / Badges

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Label` | `label/Label.tsx` | `{children, color?: "default"\|"primary"\|"secondary"\|"info"\|"success"\|"warning"\|"error", variant?: "filled"\|"outlined"\|"ghost"\|"soft", startIcon?, endIcon?}` | MUI theme | Styled status chip/badge |
| `BadgeStatus` | `badge-status/BadgeStatus.tsx` | `{status, size?}` | MUI `styled` | Small colored dot indicator |

### Loaders / Spinners

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `LoadingScreen` | `loading-screen/LoadingScreen.tsx` | none | MUI `LinearProgress`, `framer-motion` | Full-page loading overlay with animated logo |
| `ProgressBar` | `progress-bar/ProgressBar.tsx` | none | NProgress style | Top-of-page loading progress bar |
| `ScrollProgress` | `scroll-progress/ScrollProgress.tsx` | none | `framer-motion` | Page scroll progress indicator |

### Snackbar / Notifications

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `SnackbarProvider` | `snackbar/SnackbarProvider.tsx` | `{children}` | `notistack`, MUI `Collapse`, `Iconify` | App-level toast/snackbar provider with custom icons and RTL |

### Empty States

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `EmptyContent` | `empty-content/EmptyContent.tsx` | `{title, img?, description?, actionContent?, direction?: "row"\|"column"}` + StackProps | MUI `Stack`, `lottie-react` | Empty state with Lottie animation and action button |
| `SearchNotFound` | `search-not-found/SearchNotFound.tsx` | `{query?}` | MUI `Typography` | "No results found" message |

### File Upload

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Upload` | `upload/Upload.tsx` | `{disabled?, multiple?, error?, file?, onDelete?, files?, thumbnail?, onUpload?, onRemove?, onRemoveAll?}` + DropzoneOptions | `react-dropzone`, MUI | Drag-and-drop upload zone (single/multiple) |
| `UploadAvatar` | `upload/UploadAvatar.tsx` | Avatar upload props | `react-dropzone` | Circular avatar upload with preview |
| `UploadBox` | `upload/UploadBox.tsx` | Box upload props | `react-dropzone` | Compact file upload box |
| `UploadNew` | `upload/UploadNew.tsx` | Upload props | `react-dropzone` | Updated upload component |
| `UploadTextField` | `upload/UploadTextField.tsx` | Upload props | `react-dropzone`, MUI `TextField` | File upload styled as text field |
| `SettingsUploadPhoto` | `upload/SettingsUploadPhoto.tsx` | Upload props | `react-dropzone` | Profile/settings photo uploader |

### Icons / Media

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `Iconify` | `iconify/Iconify.tsx` | `{icon: IconifyProps; width?: number}` + MUI BoxProps | `@iconify/react` | Universal icon component (10k+ icons) |
| `SvgColor` | `svg-color/SvgColor.tsx` | `{src, sx?}` + BoxProps | MUI `styled` | SVG as CSS mask with theme color |
| `Image` | `image/Image.tsx` | `{src, alt?, ratio?, disabledEffect?}` + BoxProps | MUI `Box`, lazy loading | Lazy-loading image with ratio support |
| `ImageCarousel` | `carousel-with-lightbox/ImageCarousel.tsx` | `{images, ...}` | `react-slick`, lightbox | Image carousel with lightbox |
| `FileThumbnail` | `file-thumbnail/FileThumbnail.tsx` | `{file, tooltip?}` | MUI | File icon/thumbnail by extension |
| `Lightbox` | `lightbox/Lightbox.tsx` | `{images, photoIndex, isOpen, onClose}` | `yet-another-react-lightbox` | Full-screen image lightbox |

### Carousel

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `CarouselArrows` | `carousel/CarouselArrows.tsx` | `{onNext, onPrevious, children}` | MUI `IconButton` | Carousel prev/next arrow buttons |
| `CarouselDots` | `carousel/CarouselDots.tsx` | Dots config | MUI `Box` | Carousel dot indicators |

### Animations

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `DialogAnimate` | `animate/DialogAnimate.tsx` | MUI DialogProps + animation variants | `framer-motion`, MUI `Dialog` | Animated dialog container |
| `FabButtonAnimate` | `animate/FabButtonAnimate.tsx` | MUI FabProps | `framer-motion` | Animated FAB with hover/tap |
| `IconButtonAnimate` | `animate/IconButtonAnimate.tsx` | MUI IconButtonProps | `framer-motion` | Animated icon button |
| `MotionContainer` | `animate/MotionContainer.tsx` | `{children, action?}` | `framer-motion` | Stagger animation container |
| `MotionViewport` | `animate/MotionViewport.tsx` | `{children}` | `framer-motion` | Animate on viewport enter |
| `TextAnimate` | `animate/TextAnimate.tsx` | `{text, variants?}` | `framer-motion` | Per-character text animation |

### Avatars

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `CustomAvatar` | `custom-avatar/CustomAvatar.tsx` | `{name?, color?}` + MUI AvatarProps | MUI `Avatar` | Avatar with initials fallback |
| `CustomAvatarGroup` | `custom-avatar/CustomAvatarGroup.tsx` | `{children, size?}` + AvatarGroupProps | MUI `AvatarGroup` | Avatar group with overflow count |

### Other Utilities

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `MenuPopover` | `menu-popover/MenuPopover.tsx` | `{children, open, onClose, anchorEl?, arrow?}` + PopoverProps | MUI `Popover` | Small popover menu for actions |
| `Scrollbar` | `scrollbar/Scrollbar.tsx` | `{children, sx?}` | `simplebar-react` | Custom-styled scrollbar container |
| `TextMaxLine` | `text-max-line/TextMaxLine.tsx` | `{line?: number, asLink?, persistent?, children}` + TypographyProps | MUI `Typography`, CSS line-clamp | Text truncation to N lines with ellipsis |
| `LazyMount` | `lazy-mount/LazyMount.tsx` | `{when: boolean; children}` | React | Delay mounting until condition is true |
| `ScrollToTop` | `scroll-to-top/ScrollToTop.tsx` | none | React Router | Scroll to top on route change |
| `PathBuilder` | `path-builder/PathBuilder.tsx` | `{segments, onChange}` | MUI, drag-and-drop | Visual URL/path segment builder |

### Layout Components

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `DashboardLayout` | `layouts/dashboard/DashboardLayout.tsx` | Layout config | MUI, nav components | Full dashboard with header, sidebar, main content |
| `VxLayout` | `layouts/new/VxLayout.tsx` | Layout config | MUI, nav components | Newer VenueX application layout |
| `CompactLayout` | `layouts/compact/CompactLayout.tsx` | `{children}` | MUI `Container` | Compact layout for auth/single-column pages |
| `LoginLayout` | `layouts/login/LoginLayout.tsx` | `{children, illustration?, title?}` | MUI | Login page layout with branding panel |

### Skeletons

| Component | File | Props | Dependencies | Description |
|-----------|------|-------|-------------|-------------|
| `SkeletonMap` | `skeleton/SkeletonMap.tsx` | none | MUI `Skeleton` | Map placeholder |
| `SkeletonPostItem` | `skeleton/SkeletonPostItem.tsx` | none | MUI `Skeleton` | Post card placeholder |
| `SkeletonProductItem` | `skeleton/SkeletonProductItem.tsx` | none | MUI `Skeleton` | Product card placeholder |
| `SkeletonKanbanColumn` | `skeleton/SkeletonKanbanColumn.tsx` | none | MUI `Skeleton` | Kanban column placeholder |
| `SkeletonConversationItem` | `skeleton/SkeletonConversationItem.tsx` | none | MUI `Skeleton` | Chat conversation placeholder |
| `SkeletonMailNavItem` | `skeleton/SkeletonMailNavItem.tsx` | none | MUI `Skeleton` | Mail sidebar item placeholder |

---

## 6. VMS Legacy Components

**Location:** `apps/vms/src/components/`
**Note:** These are JavaScript (not TypeScript) components from the older VMS app.

| Component | File | Dependencies | Description |
|-----------|------|-------------|-------------|
| `Button` | `Buttons/Button.js` | Custom CSS | Basic button |
| `Breadcrumb` | `Breadcrumb/Breadcrumb.js` | React Router | Breadcrumb navigation |
| `SearchInput` | `SearchInput/` | Custom CSS | Search text input |
| `Pagination` | `Pagination/` | Custom CSS | Page navigation |
| `Toast` | `Toast/` | Custom | Toast notification |
| `Spinner` / `FullScreenSpinner` | `Spinner/`, `FullScreenSpinner/` | Custom CSS | Loading spinners |
| `Backdrop` | `Backdrop/Backdrop.js` | Custom CSS | Overlay backdrop |
| `Table` | `Table/` | Custom CSS | Data table |
| `SortDropdown` | `SortDropdown/` | Custom CSS | Sort option selector |
| `Sidebar` | `Sidebar/` | Custom CSS | App sidebar navigation |
| `Header` / `PageHeader` / `PageTitle` / `SectionHeader` | Respective dirs | Custom CSS | Various header components |
| `TabBar` | `TabBar.js` | Custom CSS | Tab navigation |
| **Form Elements** (`FormElements/`): | | | |
| `TextField`, `EmailField`, `PasswordField`, `PhoneField`, `MultiplePhoneField` | `FormElements/` | Custom CSS | Text input variants |
| `CheckboxField`, `CheckboxListField` | `FormElements/` | Custom CSS | Checkbox inputs |
| `RadioField` | `FormElements/` | Custom CSS | Radio buttons |
| `SelectField`, `SelectApiField` | `FormElements/` | `react-select` | Select dropdowns |
| `DateField` | `FormElements/` | Custom CSS | Date input |
| `FileField`, `ImageField`, `Dropzone` | `FormElements/` | `react-dropzone` | File/image upload |
| `AddressField`, `AddressChooser`, `AddressChooserMap`, `AddressSearchField` | `FormElements/` | Google Maps API | Address input with map |
| `OpeningHoursField`, `TimePicker` | `FormElements/` | Custom CSS | Hours/time editor |
| `LocalizedInputField`, `SocialField` | `FormElements/` | Custom CSS | Localized and social link inputs |
| `SwitchField` | `FormElements/` | Custom CSS | Toggle switch |
| `Submit`, `FormWizardActions` | `FormElements/` | Custom CSS | Form action buttons |
| `ApiError`, `ApiSuccess`, `InlineError`, `FormExplanation` | `FormElements/` | Custom CSS | Form feedback messages |
| `UploadProgress` | `FormElements/` | Custom CSS | Upload progress indicator |

---

## 7. Summary

### Component Counts by Category

| Category | Storefront UI | Storefront Custom | Storefront Common | Atomic Library | VMS Legacy | **Total** |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|
| Tables | 8 | 1 | 1 | 7 | 1 | **18** |
| Forms / Inputs | 5 | — | — | 20+ | 15+ | **40+** |
| Modals / Dialogs | 2 | 3 | — | 1 | — | **6** |
| Buttons | 1 | 2 | — | — | 1 | **4** |
| Dropdowns / Select | 4 | 2 | — | 2 | 2 | **10** |
| Tabs | 1 | — | 3 | 1 | 1 | **6** |
| Cards | 2 | — | — | — | — | **2** |
| Tooltips | 1 | — | — | — | — | **1** |
| Accordion / Collapsible | 3 | — | 1 | — | — | **4** |
| Badges / Labels | 1 | 1 | — | 2 | — | **4** |
| Loaders / Spinners | 1 | — | — | 3 | 2 | **6** |
| Notifications | — | — | — | 1 | 1 | **2** |
| Breadcrumbs / Nav | — | — | 1 | 4 | 2 | **7** |
| File Upload | — | — | — | 6 | 3 | **9** |
| Date Pickers | — | — | — | 3 | 1 | **4** |
| Charts / Viz | — | — | 1 | — | — | **1** |
| Layout | — | — | — | 4 | 2 | **6** |
| Icons / Media | — | — | — | 6 | — | **6** |
| Animations | — | — | — | 6 | — | **6** |
| Other Utilities | 2 | — | 1 | 6 | 3 | **12** |

### Key External Dependencies

| Library | Used In | Purpose |
|---------|---------|---------|
| `@mui/material` | All apps | Core component library |
| `@mui/x-date-pickers` | Storefront, Atomic | Date/time pickers |
| `@mui/lab` | Storefront | LoadingButton |
| `@radix-ui/*` | Storefront UI | Dropdown, Tabs, Tooltip, Popover, Accordion, Separator |
| `react-hook-form` | Storefront, Atomic | Form state management |
| `@tanstack/react-query` | Storefront | Remote data fetching in autocompletes |
| `notistack` | Atomic, Storefront | Toast/snackbar notifications |
| `react-dropzone` | Atomic | File drag-and-drop upload |
| `framer-motion` | Atomic | Animations and transitions |
| `@iconify/react` | Atomic | Universal icon rendering |
| `lucide-react` | Storefront UI | Icon set for shadcn-style components |
| `react-slick` | Atomic | Carousel functionality |
| `lottie-react` | Atomic | Lottie animations in empty states |
| `material-ui-phone-number` | Atomic | International phone input |
| `simplebar-react` | Atomic | Custom scrollbar |
| `react-select` | VMS | Select dropdowns (legacy) |
