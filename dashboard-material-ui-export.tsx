import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Alert,
  Avatar,
  IconButton,
  Container,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Error,
  Warning,
  Launch,
  ArrowUpward,
  ArrowDownward,
  LocationOn,
  Inventory,
  Receipt,
  EmojiObjects,
  Info,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Types
interface KPIData {
  title: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down";
  previous: string;
  icon: React.ReactNode;
  color: string;
}

interface LocationData {
  name: string;
  address: string;
  impressions: number;
  clicks: number;
  calls: number;
  directions: number;
  visits: number;
  sales: string;
  purchases: number;
  ratio: string;
}

interface CampaignData {
  name: string;
  platform: string;
  platformIcon: string;
  platformColor: string;
  impressions: number;
  ctv: string;
  spend: string;
  roas: string;
  visits: number;
  purchases: number;
}

interface EnrichmentSuggestion {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  improvement: string;
  itemsAffected: string;
  timeToFix: string;
  buttonType: "apply" | "info";
  iconType: "location" | "description" | "hours";
}

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[8],
  },
}));

const QualityBar = styled(Box)(({ theme }) => ({
  width: "120px",
  height: "12px",
  backgroundColor: theme.palette.grey[300],
  borderRadius: "6px",
  overflow: "hidden",
  position: "relative",
  "& .fill": {
    height: "100%",
    background: "linear-gradient(to right, #3b82f6, #2563eb)",
    borderRadius: "6px",
    transition: "width 0.3s",
  },
}));

const PlatformIcon = styled(Avatar)<{ platformColor: string }>(
  ({ platformColor }) => ({
    width: 24,
    height: 24,
    fontSize: "12px",
    fontWeight: 700,
    backgroundColor: platformColor,
  }),
);

const SuggestionIcon = styled(Avatar)<{ iconType: string }>(({ iconType }) => ({
  width: 40,
  height: 40,
  backgroundColor:
    iconType === "hours"
      ? "#16a34a"
      : iconType === "description"
        ? "#9333ea"
        : iconType === "location"
          ? "#2563eb"
          : "#f59e0b",
}));

// Main Dashboard Component
const VenueXDashboard: React.FC = () => {
  // Sample data
  const kpiData: KPIData[] = [
    {
      title: "Offline ROAS",
      value: "4.0x",
      trend: "+12.8%",
      trendDirection: "up",
      previous: "vs 3.5x previous period",
      icon: <Receipt />,
      color: "#3b82f6",
    },
    {
      title: "Location Interactions",
      value: "25,234",
      trend: "+8.7%",
      trendDirection: "up",
      previous: "vs 23,147 previous period",
      icon: <LocationOn />,
      color: "#2563eb",
    },
    {
      title: "Local Inventory",
      value: "94.2%",
      trend: "+2.1%",
      trendDirection: "up",
      previous: "vs 92.3% previous period",
      icon: <Inventory />,
      color: "#22c55e",
    },
    {
      title: "Average Star Rating",
      value: "4.7 ⭐",
      trend: "+0.2",
      trendDirection: "up",
      previous: "vs 4.5 previous period",
      icon: <EmojiObjects />,
      color: "#9333ea",
    },
  ];

  const locationData: LocationData[] = [
    {
      name: "Istanbul - Beyoğlu",
      address: "İstiklal Caddesi 125",
      impressions: 89420,
      clicks: 4821,
      calls: 276,
      directions: 549,
      visits: 2845,
      sales: "$68,712",
      purchases: 1186,
      ratio: "2.4x",
    },
    {
      name: "Ankara - Çankaya",
      address: "Tunalı Hilmi Caddesi 89",
      impressions: 76230,
      clicks: 4103,
      calls: 242,
      directions: 514,
      visits: 2371,
      sales: "$58,590",
      purchases: 987,
      ratio: "2.4x",
    },
  ];

  const campaignData: CampaignData[] = [
    {
      name: "Summer Sale 2024",
      platform: "google-ads",
      platformIcon: "G",
      platformColor: "#ea4335",
      impressions: 142580,
      ctv: "3.4%",
      spend: "$16,350",
      roas: "4.2x",
      visits: 24387,
      purchases: 1247,
    },
    {
      name: "Local Shopping Campaign",
      platform: "google-ads",
      platformIcon: "G",
      platformColor: "#ea4335",
      impressions: 118420,
      ctv: "2.9%",
      spend: "$15,420",
      roas: "3.8x",
      visits: 18652,
      purchases: 923,
    },
    {
      name: "Local Store Promo",
      platform: "meta-ads",
      platformIcon: "f",
      platformColor: "#1877f2",
      impressions: 89670,
      ctv: "4.1%",
      spend: "$12,840",
      roas: "5.1x",
      visits: 16234,
      purchases: 785,
    },
  ];

  const qualityData = [
    {
      category: "Location Data",
      items: [
        { name: "Business Names", percentage: 100 },
        { name: "Addresses", percentage: 98 },
        { name: "Phone Numbers", percentage: 94 },
        { name: "Opening Hours", percentage: 96 },
      ],
    },
    {
      category: "Inventory Data",
      items: [
        { name: "Product Names", percentage: 99 },
        { name: "Prices", percentage: 97 },
        { name: "Stock Levels", percentage: 92 },
        { name: "Categories", percentage: 95 },
      ],
    },
    {
      category: "Customer Data",
      items: [
        { name: "Email Addresses", percentage: 98 },
        { name: "Phone Numbers", percentage: 89 },
        { name: "Purchase History", percentage: 94 },
        { name: "Preferences", percentage: 87 },
      ],
    },
  ];

  const enrichmentSuggestions: EnrichmentSuggestion[] = [
    {
      id: "1",
      title: "Add missing business hours",
      description:
        "23 locations missing accurate operating hours. This can improve local search visibility by up to 15%.",
      impact: "medium",
      improvement: "+15%",
      itemsAffected: "23 items affected",
      timeToFix: "~2 hours to fix",
      buttonType: "apply",
      iconType: "hours",
    },
    {
      id: "2",
      title: "Optimize product descriptions",
      description:
        "89 products have incomplete or poorly optimized descriptions. Enhanced descriptions can improve conversion rates by 25%.",
      impact: "high",
      improvement: "+25%",
      itemsAffected: "89 items affected",
      timeToFix: "~6 hours to fix",
      buttonType: "info",
      iconType: "description",
    },
    {
      id: "3",
      title: "Update location categories",
      description:
        "8 locations using outdated category classifications. Updated categories improve discovery and targeting accuracy.",
      impact: "low",
      improvement: "+8%",
      itemsAffected: "8 items affected",
      timeToFix: "~30 minutes to fix",
      buttonType: "apply",
      iconType: "location",
    },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "default";
    }
  };

  const getSuggestionIcon = (iconType: string) => {
    switch (iconType) {
      case "location":
        return <LocationOn />;
      case "description":
        return <EmojiObjects />;
      case "hours":
        return <Receipt />;
      default:
        return <Info />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Data Health Banner */}
      <Alert
        severity="success"
        icon={<CheckCircle />}
        action={
          <Button color="inherit" size="small" endIcon={<ArrowDownward />}>
            View Details
          </Button>
        }
        sx={{ mb: 3 }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
          Data Health & Flow
        </Typography>
        <Typography variant="body2" sx={{ ml: 2 }}>
          Everything is well
        </Typography>
      </Alert>

      {/* Filter Bar */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Platform</InputLabel>
            <Select defaultValue="Google" label="Platform">
              <MenuItem value="Google">🔴 Google</MenuItem>
              <MenuItem value="Meta">🔵 Meta</MenuItem>
              <MenuItem value="TikTok">⚫ TikTok</MenuItem>
              <MenuItem value="Apple">🍎 Apple</MenuItem>
              <MenuItem value="Yandex">🔴 Yandex</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Date Range</InputLabel>
            <Select defaultValue="Last 7 days" label="Date Range">
              <MenuItem value="Last 7 days">Last 7 days</MenuItem>
              <MenuItem value="Last 30 days">Last 30 days</MenuItem>
              <MenuItem value="Last 90 days">Last 90 days</MenuItem>
              <MenuItem value="Custom range">Custom range</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StyledCard sx={{ cursor: "pointer", height: "100%" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: kpi.color + "20",
                        color: kpi.color,
                        width: 40,
                        height: 40,
                      }}
                    >
                      {kpi.icon}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      {kpi.title}
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <Launch fontSize="small" />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {kpi.value}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "success.main",
                    }}
                  >
                    {kpi.trendDirection === "up" ? (
                      <TrendingUp fontSize="small" />
                    ) : (
                      <TrendingDown fontSize="small" />
                    )}
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      {kpi.trend}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {kpi.previous}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Performance Chart */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Online-to-Offline Conversion Funnel"
          subheader="Conversion metrics from digital channels to physical store"
          action={
            <Button variant="text" endIcon={<ArrowUpward />}>
              View All
            </Button>
          }
        />
        <CardContent>
          <Box
            sx={{
              bgcolor: "grey.100",
              borderRadius: 1,
              p: 8,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <Typography variant="h6">Customer Journey Funnel Chart</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Digital Impressions → Website Visits → Store Visits → Purchases
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Top Performing Locations */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Top Performing Store Locations"
          subheader="Store visits and conversions by location"
          action={
            <Button variant="text" endIcon={<ArrowUpward />}>
              View All
            </Button>
          }
        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Store Location</TableCell>
                  <TableCell align="center">Impressions</TableCell>
                  <TableCell align="center">Website Clicks</TableCell>
                  <TableCell align="center">Calls</TableCell>
                  <TableCell align="center">Directions</TableCell>
                  <TableCell align="center">Visits</TableCell>
                  <TableCell align="center">Sales Value</TableCell>
                  <TableCell align="center">Purchases</TableCell>
                  <TableCell align="center">Visit/Purchases</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {locationData.map((location, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {location.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {location.address}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 500 }}>
                      {location.impressions.toLocaleString()}
                    </TableCell>
                    <TableCell align="center" color="text.secondary">
                      {location.clicks.toLocaleString()}
                    </TableCell>
                    <TableCell align="center" color="text.secondary">
                      {location.calls}
                    </TableCell>
                    <TableCell align="center" color="text.secondary">
                      {location.directions}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 500 }}>
                      {location.visits.toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {location.sales}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "success.main",
                          }}
                        >
                          <TrendingUp fontSize="small" />
                          <Typography variant="caption">+12%</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {location.purchases.toLocaleString()}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "success.main",
                          }}
                        >
                          <TrendingUp fontSize="small" />
                          <Typography variant="caption">+8%</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {location.ratio}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "success.main",
                          }}
                        >
                          <TrendingUp fontSize="small" />
                          <Typography variant="caption">+5%</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Top Performing Campaigns */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Top Performing Campaigns"
          action={
            <Button variant="text" endIcon={<ArrowUpward />}>
              View All
            </Button>
          }
        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Campaign</TableCell>
                  <TableCell align="center">Impressions</TableCell>
                  <TableCell align="center">CTV (Click to Visit)</TableCell>
                  <TableCell align="center">Spend</TableCell>
                  <TableCell align="center">ROAS</TableCell>
                  <TableCell align="center">Visits</TableCell>
                  <TableCell align="center">Purchases</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campaignData.map((campaign, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <PlatformIcon platformColor={campaign.platformColor}>
                          {campaign.platformIcon}
                        </PlatformIcon>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {campaign.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {campaign.platform}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 500 }}>
                      {campaign.impressions.toLocaleString()}
                    </TableCell>
                    <TableCell align="center" color="text.secondary">
                      {campaign.ctv}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 500 }}>
                      {campaign.spend}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 500 }}>
                      {campaign.roas}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 500 }}>
                      {campaign.visits.toLocaleString()}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 500 }}>
                      {campaign.purchases.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Data Quality Assessment */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="h6">Data Quality Assessment</Typography>
              <Typography variant="body2" color="text.secondary">
                Overall Score:{" "}
                <Typography
                  component="span"
                  sx={{ color: "success.main", fontWeight: 600 }}
                >
                  97%
                </Typography>
              </Typography>
            </Box>
          }
          action={
            <Button variant="text" endIcon={<ArrowUpward />}>
              View All
            </Button>
          }
        />
        <CardContent>
          <Grid container spacing={4}>
            {qualityData.map((section, sectionIndex) => (
              <Grid item xs={12} md={4} key={sectionIndex}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
                  {section.category}
                </Typography>
                {section.items.map((item, itemIndex) => (
                  <Box
                    key={itemIndex}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {item.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <QualityBar>
                        <Box
                          className="fill"
                          sx={{ width: `${item.percentage}%` }}
                        />
                      </QualityBar>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, minWidth: "32px" }}
                      >
                        {item.percentage}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Grid>
            ))}
          </Grid>

          {/* Data Enrichment Suggestions */}
          <Box sx={{ borderTop: 2, borderColor: "divider", pt: 4, mt: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Data Enrichment Suggestions
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmojiObjects fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  AI-Powered Recommendations
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {enrichmentSuggestions.map((suggestion) => (
                <Paper key={suggestion.id} variant="outlined" sx={{ p: 2 }}>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
                    <SuggestionIcon iconType={suggestion.iconType}>
                      {getSuggestionIcon(suggestion.iconType)}
                    </SuggestionIcon>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {suggestion.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "success.main" }}
                        >
                          {suggestion.improvement}
                        </Typography>
                        <Chip
                          label={
                            suggestion.impact.charAt(0).toUpperCase() +
                            suggestion.impact.slice(1)
                          }
                          color={getImpactColor(suggestion.impact) as any}
                          size="small"
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {suggestion.description}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {suggestion.itemsAffected}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          •
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {suggestion.timeToFix}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 1,
                      }}
                    >
                      {suggestion.buttonType === "apply" ? (
                        <Button variant="contained" size="small">
                          Apply Fix
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Info />}
                        >
                          More Information
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 3,
                pt: 2,
                borderTop: 2,
                borderColor: "divider",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                3 suggestions shown • Potential impact:{" "}
                <Typography component="span" sx={{ fontWeight: 500 }}>
                  +48.0% overall performance
                </Typography>
              </Typography>
              <Button variant="outlined" size="small">
                View all suggestions
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default VenueXDashboard;
