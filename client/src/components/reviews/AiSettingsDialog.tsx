import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from '@/contexts/LanguageContext';
import type { AiTone } from '@/lib/types/reviews';

interface AiSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AiSettingsDialog({ open, onOpenChange }: AiSettingsDialogProps) {
  const { t } = useTranslation();
  const [aiTone, setAiTone] = useState<AiTone>('empathetic');

  const toneLabels: Record<AiTone, string> = {
    empathetic: t.reviews.ai.empathetic,
    professional: t.reviews.ai.professional,
    concise: t.reviews.ai.concise,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.reviews.ai.title}</DialogTitle>
          <DialogDescription>
            {t.reviews.ai.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">{t.reviews.ai.aiDrafts}</div>
              <div className="text-xs text-gray-500">{t.reviews.ai.aiDraftsDescription}</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">{t.reviews.ai.defaultTone}</div>
            <Select
              value={aiTone}
              onValueChange={(v) => setAiTone(v as AiTone)}
              displayLabel={toneLabels[aiTone]}
            >
              <SelectContent>
                <SelectItem value="empathetic">{t.reviews.ai.empathetic}</SelectItem>
                <SelectItem value="professional">{t.reviews.ai.professional}</SelectItem>
                <SelectItem value="concise">{t.reviews.ai.concise}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">{t.reviews.ai.brandGuidelines}</div>
            <Textarea
              placeholder={t.reviews.ai.brandPlaceholder}
              className="min-h-[80px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t.common.cancel}</Button>
          <Button onClick={() => onOpenChange(false)}>{t.reviews.ai.savePreferences}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
