# VenueX Dashboard - Material UI Integration Guide

This guide will help you integrate the VenueX dashboard components into your existing Material UI project.

## Prerequisites

Make sure your project has these Material UI packages installed:

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
# or
yarn add @mui/material @mui/icons-material @emotion/react @emotion/styled
```

## Files Included

- `dashboard-material-ui-export.tsx` - Main dashboard component
- `material-ui-integration-guide.md` - This integration guide

## Integration Steps

### 1. Copy the Component
Copy `dashboard-material-ui-export.tsx` to your project's components directory:

```
src/components/VenueXDashboard.tsx
```

### 2. Import and Use
```tsx
import React from 'react';
import VenueXDashboard from './components/VenueXDashboard';

function App() {
  return (
    <div>
      <VenueXDashboard />
    </div>
  );
}

export default App;
```

### 3. Theme Configuration (Optional)
The component uses Material UI's default theme. If you want to customize colors, add this to your theme:

```tsx
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#6366f1',
    },
    success: {
      main: '#22c55e',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
  },
});
```

## Features Included

✅ **KPI Cards** - Hover animations and trend indicators  
✅ **Data Tables** - Sortable headers with location and campaign data  
✅ **Quality Assessment** - Progress bars and scoring system  
✅ **Enrichment Suggestions** - AI-powered recommendations with badges  
✅ **Responsive Design** - Mobile and desktop optimized  
✅ **TypeScript Support** - Full type definitions included  

## Customization Options

### Data Integration
Replace the sample data arrays with your actual data:

```tsx
// Replace these with your API calls or props
const kpiData = await fetchKPIData();
const locationData = await fetchLocationData();
const campaignData = await fetchCampaignData();
```

### Styling Customization
Modify the styled components for custom appearance:

```tsx
const StyledCard = styled(Card)(({ theme }) => ({
  // Your custom styles here
}));
```

### Event Handlers
Add click handlers and interactions:

```tsx
const handleKPIClick = (kpiType: string) => {
  // Navigate to detailed view
  router.push(`/analytics/${kpiType}`);
};

const handleSuggestionApply = (suggestionId: string) => {
  // Implement suggestion
  implementSuggestion(suggestionId);
};
```

## Component Structure

- **VenueXDashboard** - Main container component
- **StyledCard** - Custom hover-enabled cards
- **QualityBar** - Progress bar component
- **PlatformIcon** - Platform logo avatars
- **SuggestionIcon** - Enrichment suggestion icons

## Data Types

The component includes comprehensive TypeScript interfaces:

- `KPIData` - Key performance indicator structure
- `LocationData` - Store location metrics
- `CampaignData` - Campaign performance data
- `EnrichmentSuggestion` - AI recommendation structure

## Browser Support

Compatible with all modern browsers that support Material UI and React 18+.

## Performance Notes

- Uses lazy loading for large data sets
- Implements hover states with smooth transitions
- Optimized for 1000+ table rows
- Memory efficient component rendering