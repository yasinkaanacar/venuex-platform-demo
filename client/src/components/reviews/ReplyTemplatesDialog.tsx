import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from '@/contexts/LanguageContext';
import { replyTemplates } from '@/lib/mock-reviews-data';

interface ReplyTemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReplyTemplatesDialog({ open, onOpenChange }: ReplyTemplatesDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t.reviews.templates.title}</DialogTitle>
          <DialogDescription>
            {t.reviews.templates.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Button variant="outline" className="w-full justify-start">
            <Plus className="w-4 h-4 mr-2" />
            {t.reviews.templates.createNew}
          </Button>
          <div className="space-y-3">
            {replyTemplates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-gray-500">{template.preview}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t.common.cancel}</Button>
          <Button onClick={() => onOpenChange(false)}>{t.reviews.templates.saveTemplates}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
