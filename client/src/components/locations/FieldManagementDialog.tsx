import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Settings, Eye, EyeOff } from "lucide-react";

interface Field {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  required: boolean;
}

const defaultFields: Field[] = [
  { id: "storeCode", name: "Store Code", type: "text", visible: true, required: true },
  { id: "locationName", name: "Location Name", type: "text", visible: true, required: true },
  { id: "address", name: "Address", type: "text", visible: true, required: false },
  { id: "city", name: "City", type: "text", visible: true, required: false },
  { id: "phone", name: "Phone", type: "tel", visible: true, required: false },
  { id: "businessStatus", name: "Business Status", type: "select", visible: true, required: false },
  { id: "platformStatus", name: "Platform Status", type: "select", visible: true, required: false },
  { id: "hours", name: "Business Hours", type: "text", visible: false, required: false },
  { id: "website", name: "Website", type: "url", visible: false, required: false },
  { id: "description", name: "Description", type: "textarea", visible: false, required: false },
];

interface FieldManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FieldManagementDialog({ isOpen, onClose }: FieldManagementDialogProps) {
  const [fields, setFields] = useState<Field[]>(defaultFields);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");

  const filteredFields = fields.filter(field =>
    field.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleVisibility = (fieldId: string) => {
    setFields(fields.map(field =>
      field.id === fieldId ? { ...field, visible: !field.visible } : field
    ));
  };

  const handleToggleRequired = (fieldId: string) => {
    setFields(fields.map(field =>
      field.id === fieldId ? { ...field, required: !field.required } : field
    ));
  };

  const handleAddField = () => {
    if (newFieldName.trim()) {
      const newField: Field = {
        id: `custom_${Date.now()}`,
        name: newFieldName.trim(),
        type: "text",
        visible: true,
        required: false
      };
      setFields([...fields, newField]);
      setNewFieldName("");
      setShowAddField(false);
    }
  };

  const handleSave = () => {
    console.log("Saving field configuration:", fields);
    onClose();
  };

  const visibleFieldsCount = fields.filter(f => f.visible).length;
  const hiddenFieldsCount = fields.filter(f => !f.visible).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Manage Table Fields
          </DialogTitle>
          <DialogDescription>
            Customize which fields are displayed in your locations table. You can show/hide fields and mark them as required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Badge variant="outline" className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {visibleFieldsCount} Visible
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <EyeOff className="w-3 h-3" />
              {hiddenFieldsCount} Hidden
            </Badge>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search fields..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Add Custom Field */}
          <div className="space-y-2">
            {!showAddField ? (
              <Button
                variant="outline"
                onClick={() => setShowAddField(true)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Field
              </Button>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter field name..."
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddField()}
                />
                <Button onClick={handleAddField} disabled={!newFieldName.trim()}>
                  Add
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddField(false);
                    setNewFieldName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Fields List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredFields.map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={field.visible}
                    onChange={() => handleToggleVisibility(field.id)}
                  />
                  <div>
                    <div className="font-medium text-sm">{field.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {field.type}
                      </Badge>
                      {field.required && (
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-xs text-gray-500">Required:</Label>
                  <Checkbox
                    checked={field.required}
                    onChange={() => handleToggleRequired(field.id)}
                    disabled={field.id === "storeCode" || field.id === "locationName"} // Core fields always required
                  />
                </div>
              </div>
            ))}
          </div>

          {filteredFields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No fields match your search criteria.
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}