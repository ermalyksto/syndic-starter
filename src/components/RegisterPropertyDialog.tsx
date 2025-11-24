import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockApi } from "@/services/mockApi";
import { toast } from "@/hooks/use-toast";
import { CoOwner } from "@/pages/Properties";
import { useAppSelector } from "@/store/hooks";

interface RegisterPropertyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const RegisterPropertyDialog = ({ open, onOpenChange, onSuccess }: RegisterPropertyDialogProps) => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const [propertyName, setPropertyName] = useState("");
  const [propertyLocation, setPropertyLocation] = useState("");
  const [coOwners, setCoOwners] = useState<CoOwner[]>([]);
  const [isAddingCoOwner, setIsAddingCoOwner] = useState(false);
  const [editingCoOwnerId, setEditingCoOwnerId] = useState<string | null>(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState("");
  const [coOwnerWeight, setCoOwnerWeight] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableOwners, setAvailableOwners] = useState<any[]>([]);
  const [isLoadingOwners, setIsLoadingOwners] = useState(false);

  useEffect(() => {
    if (open && user?.id) {
      loadOwners();
    }
  }, [open, user?.id]);

  const loadOwners = async () => {
    setIsLoadingOwners(true);
    try {
      const owners = await mockApi.getOwners(user.id);
      setAvailableOwners(owners);
    } catch (error) {
      console.error("Failed to load owners:", error);
    } finally {
      setIsLoadingOwners(false);
    }
  };

  const resetForm = () => {
    setPropertyName("");
    setPropertyLocation("");
    setCoOwners([]);
    setIsAddingCoOwner(false);
    setEditingCoOwnerId(null);
    setSelectedOwnerId("");
    setCoOwnerWeight("");
  };

  const handleCancel = () => {
    if (propertyName || propertyLocation || coOwners.length > 0) {
      setShowCancelDialog(true);
    } else {
      onOpenChange(false);
      resetForm();
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    onOpenChange(false);
    resetForm();
  };

  const handleSaveCoOwner = () => {
    if (!selectedOwnerId || !coOwnerWeight) {
      toast({
        title: t('properties.error'),
        description: t('properties.fillAllFields'),
        variant: "destructive",
      });
      return;
    }

    const weight = parseFloat(coOwnerWeight);
    if (isNaN(weight) || weight <= 0 || weight > 100) {
      toast({
        title: t('properties.error'),
        description: t('properties.invalidWeight'),
        variant: "destructive",
      });
      return;
    }

    const selectedOwner = availableOwners.find(o => o.id.toString() === selectedOwnerId);
    if (!selectedOwner) return;

    if (editingCoOwnerId) {
      setCoOwners(coOwners.map(co => 
        co.id === editingCoOwnerId 
          ? { ...co, id: selectedOwner.id.toString(), email: selectedOwner.email, weight } 
          : co
      ));
      setEditingCoOwnerId(null);
    } else {
      const newCoOwner: CoOwner = {
        id: selectedOwner.id.toString(),
        email: selectedOwner.email,
        weight,
      };
      setCoOwners([...coOwners, newCoOwner]);
    }

    setSelectedOwnerId("");
    setCoOwnerWeight("");
    setIsAddingCoOwner(false);
  };

  const handleEditCoOwner = (coOwner: CoOwner) => {
    setEditingCoOwnerId(coOwner.id);
    setSelectedOwnerId(coOwner.id);
    setCoOwnerWeight(coOwner.weight.toString());
    setIsAddingCoOwner(true);
  };

  const handleDeleteCoOwner = (id: string) => {
    setCoOwners(coOwners.filter(co => co.id !== id));
  };

  const handleRegister = async () => {
    if (!propertyName || !propertyLocation) {
      toast({
        title: t('properties.error'),
        description: t('properties.fillAllFields'),
        variant: "destructive",
      });
      return;
    }

    if (coOwners.length === 0) {
      toast({
        title: t('properties.error'),
        description: t('properties.atLeastOneCoOwner'),
        variant: "destructive",
      });
      return;
    }

    const totalWeight = coOwners.reduce((sum, co) => sum + co.weight, 0);
    if (totalWeight > 100) {
      toast({
        title: t('properties.error'),
        description: t('properties.weightMustBe100'),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await mockApi.createProperty({
        name: propertyName,
        location: propertyLocation,
        coOwners,
      });
      resetForm();
      onSuccess();
    } catch (error) {
      toast({
        title: t('properties.error'),
        description: t('properties.registerError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalWeight = coOwners.reduce((sum, co) => sum + co.weight, 0);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('properties.registerProperty')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="propertyName">{t('properties.propertyName')}</Label>
                <Input
                  id="propertyName"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder={t('properties.propertyNamePlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyLocation">{t('properties.propertyLocation')}</Label>
                <Input
                  id="propertyLocation"
                  value={propertyLocation}
                  onChange={(e) => setPropertyLocation(e.target.value)}
                  placeholder={t('properties.propertyLocationPlaceholder')}
                />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t('properties.coOwnersSection')}</span>
                  {coOwners.length > 0 && (
                    <span className={`text-sm font-normal ${totalWeight <= 100 ? 'text-green-600' : 'text-destructive'}`}>
                      {t('properties.totalWeight')}: {totalWeight.toFixed(2)}%
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {coOwners.length > 0 && (
                  <div className="space-y-2">
                    {coOwners.map((coOwner) => (
                      <div key={coOwner.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{coOwner.email}</p>
                          <p className="text-sm text-muted-foreground">{t('properties.weight')}: {coOwner.weight}%</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCoOwner(coOwner)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCoOwner(coOwner.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {isAddingCoOwner && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <div className="space-y-2">
                    <Label htmlFor="coOwnerSelect">{t('properties.coOwner')}</Label>
                    <Select
                      value={selectedOwnerId}
                      onValueChange={setSelectedOwnerId}
                      disabled={isLoadingOwners}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('properties.selectOwner')} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableOwners.map((owner) => (
                          <SelectItem key={owner.id} value={owner.id.toString()}>
                            {owner.name} ({owner.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coOwnerWeight">{t('properties.coOwnerWeight')}</Label>
                    <Input
                      id="coOwnerWeight"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={coOwnerWeight}
                      onChange={(e) => setCoOwnerWeight(e.target.value)}
                      placeholder={t('properties.coOwnerWeightPlaceholder')}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveCoOwner}>
                      {t('common.save')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingCoOwner(false);
                        setEditingCoOwnerId(null);
                        setSelectedOwnerId("");
                        setCoOwnerWeight("");
                      }}
                    >
                      {t('common.cancel')}
                    </Button>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsAddingCoOwner(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('properties.addCoOwner')}
              </Button>
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleCancel}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleRegister} disabled={isSubmitting}>
                {t('properties.registerButton')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('properties.cancelTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('properties.cancelDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.no')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>{t('common.yes')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
