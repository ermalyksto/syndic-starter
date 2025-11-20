import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { mockApi } from "@/services/mockApi";
import { useAppSelector } from "@/store/hooks";
import { Property } from "@/services/mockApi";

interface PropertySelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPropertySelected: (propertyId: string, propertyLocation: string) => void;
}

export const PropertySelectDialog = ({
  open,
  onOpenChange,
  onPropertySelected,
}: PropertySelectDialogProps) => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && user?.id) {
      loadProperties();
    }
  }, [open, user?.id]);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const data = await mockApi.getProperties(user.id);
      setProperties(data);
    } catch (error) {
      console.error("Failed to load properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedPropertyId) {
      const property = properties.find((p) => p.id === selectedPropertyId);
      if (property) {
        onPropertySelected(selectedPropertyId, property.location);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("properties.selectProperty")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>{t("properties.property")}</Label>
            <Select
              value={selectedPropertyId}
              onValueChange={setSelectedPropertyId}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("properties.selectProperty")} />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name} - {property.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedPropertyId}
          >
            {t("common.ok")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
