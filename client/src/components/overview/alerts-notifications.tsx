import { useState } from 'react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Button } from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Alert as AlertType } from '@shared/schema';
import { CheckCircle, AlertTriangle, AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

interface AlertsNotificationsProps {
  alerts?: AlertType[];
}

export default function AlertsNotifications({ alerts = [] }: AlertsNotificationsProps) {
  // Mock alerts and notifications data
  const systemAlerts = [
    {
      id: '1',
      type: 'warning',
      icon: AlertTriangle,
      title: 'Data sync delay detected',
      description: 'Meta Ads data is 15 minutes behind schedule',
      timestamp: '11 minutes ago',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      iconColor: 'text-yellow-600'
    },
    {
      id: '2',
      type: 'success',
      icon: CheckCircle,
      title: 'Data enrichment completed',
      description: '47 location profiles updated with new attributes',
      timestamp: '11 minutes ago',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-600'
    },
    {
      id: '3',
      type: 'error',
      icon: AlertCircle,
      title: 'API rate limit warning',
      description: 'Google Ads API approaching rate limit (85% used)',
      timestamp: '11 minutes ago',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-600'
    }
  ];

  // Initialize as expanded if there are alerts, collapsed if no alerts
  const [isOpen, setIsOpen] = useState(systemAlerts.length > 0);

  return (
    <Card sx={{ mb: 2 }}>
      <Accordion expanded={isOpen} onChange={() => setIsOpen(!isOpen)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h6" component="h2">
                Alerts & Notifications
              </Typography>
              <p className="text-sm text-muted-foreground">
                Recent system alerts and data notifications
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium bg-transparent border-none cursor-pointer" data-testid="button-view-all-alerts">
                View All →
              </button>
              <Button 
                variant="text" 
                size="small" 
                onClick={() => setIsOpen(!isOpen)}
                sx={{ minWidth: 32, width: 32, height: 32, p: 0 }}
                data-testid="button-toggle-alerts"
              >
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <AccordionDetails>
          <CardContent>
            <div className="space-y-3">
              {systemAlerts.map((alert) => {
                const IconComponent = alert.icon;
                return (
                  <div 
                    key={alert.id}
                    className={`flex items-start justify-between p-4 rounded-lg border-2 ${alert.bgColor} ${alert.borderColor} shadow-sm`}
                    data-testid={`alert-${alert.id}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`${alert.iconColor} mt-0.5`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground mb-1">
                          {alert.title}
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {alert.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {alert.timestamp}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      data-testid={`close-alert-${alert.id}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
}