import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2 } from "lucide-react";
import { QUERY_KEYS } from "@/hooks/query-keys";
import { useLocales } from "@/lib/formatters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { segmentDataService } from "@/lib/mock/segments";
import { showToast } from "@/lib/toast";
import type { FeedLabel, FeedLabelType, FeedChannel } from "@/lib/types/segments";

interface FeedLabelEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingLabel: FeedLabel | null;
}

const LABEL_TYPES: FeedLabelType[] = [
  "offline_bestseller",
  "high_value_category",
  "store_performer",
  "cross_sell_candidate",
  "custom",
];

const LABEL_TYPE_KEYS: Record<FeedLabelType, string> = {
  offline_bestseller: "segments.labels.offlineBestseller",
  high_value_category: "segments.labels.highValueCategory",
  store_performer: "segments.labels.storePerformer",
  cross_sell_candidate: "segments.labels.crossSellCandidate",
  custom: "segments.labels.custom",
};

const GMC_SLOTS = [
  { value: "0", label: "custom_label_0" },
  { value: "1", label: "custom_label_1" },
  { value: "2", label: "custom_label_2" },
  { value: "3", label: "custom_label_3" },
  { value: "4", label: "custom_label_4" },
];

export default function FeedLabelEditor({
  open,
  onOpenChange,
  editingLabel,
}: FeedLabelEditorProps) {
  const { t } = useLocales();

  // Fetch all labels to check occupied GMC slots
  const { data: allLabels = [] } = useQuery<FeedLabel[]>({
    queryKey: [QUERY_KEYS.SEGMENTS_FEED_LABELS],
  });

  // --- Form state ---
  const [name, setName] = useState("");
  const [labelType, setLabelType] = useState<FeedLabelType>("custom");
  const [description, setDescription] = useState("");
  const [channels, setChannels] = useState<FeedChannel[]>([]);
  const [gmcSlotIndex, setGmcSlotIndex] = useState<string>("0");

  // Pre-fill when editing
  useEffect(() => {
    if (editingLabel) {
      setName(editingLabel.name);
      setLabelType(editingLabel.type);
      setDescription(editingLabel.description);
      setChannels([...editingLabel.channels]);
      setGmcSlotIndex(
        editingLabel.gmcSlotIndex !== undefined
          ? String(editingLabel.gmcSlotIndex)
          : "0",
      );
    } else {
      setName("");
      setLabelType("custom");
      setDescription("");
      setChannels([]);
      setGmcSlotIndex("0");
    }
  }, [editingLabel, open]);

  // Occupied GMC slots (excluding current editing label)
  const occupiedSlots = useMemo(() => {
    const slots = new Set<number>();
    allLabels.forEach((l) => {
      if (
        l.channels.includes("gmc") &&
        l.gmcSlotIndex !== undefined &&
        l.id !== editingLabel?.id
      ) {
        slots.add(l.gmcSlotIndex);
      }
    });
    return slots;
  }, [allLabels, editingLabel]);

  const isGmcSelected = channels.includes("gmc");
  const isSlotOccupied = occupiedSlots.has(Number(gmcSlotIndex));

  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = editingLabel !== null;

  const handleChannelToggle = (channel: FeedChannel) => {
    setChannels((prev) =>
      prev.includes(channel)
        ? prev.filter((c) => c !== channel)
        : [...prev, channel],
    );
  };

  // Mock: Creates or updates feed label in memory. Wire to POST/PATCH /api/feed-labels in production.
  const handleSave = async () => {
    if (!name.trim() || isSaving) return;
    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        type: labelType,
        description: description.trim(),
        channels,
        gmcSlotIndex: isGmcSelected ? Number(gmcSlotIndex) : undefined,
      };
      if (isEditing && editingLabel) {
        await segmentDataService.updateFeedLabel(editingLabel.id, payload);
      } else {
        await segmentDataService.createFeedLabel(payload);
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEGMENTS_FEED_LABELS] });
      showToast({
        type: "success",
        title: isEditing
          ? (t("common.save") || "Saved")
          : (t("segments.labels.editor.createTitle") || "Label created"),
        description: name.trim(),
      });
      onOpenChange(false);
    } catch {
      showToast({ type: "error", title: t("common.error") || "Error" });
    } finally {
      setIsSaving(false);
    }
  };
  const dialogTitle = isEditing
    ? t("segments.labels.editor.editTitle") || "Edit Feed Label"
    : t("segments.labels.editor.createTitle") || "Create Feed Label";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Label Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t("segments.labels.editor.name") || "Label Name"}
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                t("segments.labels.editor.namePlaceholder") ||
                "e.g. Top Sellers Istanbul"
              }
            />
          </div>

          {/* Label Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t("segments.labels.editor.type") || "Label Type"}
            </label>
            <Select
              value={labelType}
              onValueChange={(val) => setLabelType(val as FeedLabelType)}
              fullWidth
              displayLabel={
                t(LABEL_TYPE_KEYS[labelType]) || labelType
              }
            >
              <SelectContent>
                {LABEL_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(LABEL_TYPE_KEYS[type]) || type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {t("segments.labels.editor.description") || "Description"}
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                t("segments.labels.editor.descriptionPlaceholder") ||
                "Brief description of this label..."
              }
              multiline
              rows={3}
            />
          </div>

          {/* Channels */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("segments.labels.editor.channels") || "Channels"}
            </label>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox
                  checked={channels.includes("gmc")}
                  onChange={() => handleChannelToggle("gmc")}
                />
                <span className="text-sm text-gray-700">
                  {t("segments.labels.channelGmcFull") || "Google Merchant Center (GMC)"}
                </span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox
                  checked={channels.includes("meta_catalog")}
                  onChange={() => handleChannelToggle("meta_catalog")}
                />
                <span className="text-sm text-gray-700">{t("segments.labels.channelMetaCatalog") || "Meta Catalog"}</span>
              </label>
            </div>
          </div>

          {/* GMC Slot — only when GMC channel is selected */}
          {isGmcSelected && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("segments.labels.editor.gmcSlot") || "GMC Custom Label Slot"}
              </label>
              <Select
                value={gmcSlotIndex}
                onValueChange={(val) => setGmcSlotIndex(val)}
                fullWidth
                displayLabel={
                  GMC_SLOTS.find((s) => s.value === gmcSlotIndex)?.label
                }
              >
                <SelectContent>
                  {GMC_SLOTS.map((slot) => {
                    const occupied = occupiedSlots.has(Number(slot.value));
                    return (
                      <SelectItem key={slot.value} value={slot.value}>
                        <span className="flex items-center gap-2">
                          <code className="text-xs font-mono">
                            {slot.label}
                          </code>
                          {occupied && (
                            <span className="text-xs text-amber-600 font-medium">
                              ({t("segments.labels.slotOccupiedShort") || "occupied"})
                            </span>
                          )}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {isSlotOccupied && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-600">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    {t("segments.labels.editor.slotOccupied") ||
                      "This slot is already used by another label. Assigning it here will override the existing assignment."}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("segments.labels.editor.cancel") || "Cancel"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || isSaving}
            startIcon={isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
          >
            {isSaving
              ? (t("common.loading") || "Saving...")
              : isEditing
                ? (t("segments.labels.editor.save") || "Save Changes")
                : (t("segments.labels.editor.create") || "Create Label")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
