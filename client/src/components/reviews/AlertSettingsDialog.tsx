import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from '@/contexts/LanguageContext';

interface AlertSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AlertSettingsDialog({ open, onOpenChange }: AlertSettingsDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.reviews.alerts.title}</DialogTitle>
          <DialogDescription>
            {t.reviews.alerts.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">{t.reviews.alerts.lowStarAlerts}</div>
              <div className="text-xs text-gray-500">{t.reviews.alerts.lowStarDescription}</div>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">{t.reviews.alerts.priceMentions}</div>
              <div className="text-xs text-gray-500">{t.reviews.alerts.priceDescription}</div>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">{t.reviews.alerts.dailySummary}</div>
              <div className="text-xs text-gray-500">{t.reviews.alerts.dailyDescription}</div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t.common.cancel}</Button>
          <Button onClick={() => onOpenChange(false)}>{t.reviews.alerts.saveSettings}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
