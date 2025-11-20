import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, FileUp, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { mockApi } from "@/services/mockApi";
import { Switch } from "@/components/ui/switch";
import { AgendaItem, Assembly } from "@/types";
import { useAppSelector } from "@/store/hooks";

// interface AgendaItem {
//   id: string;
//   description: string;
//   votingOption?: "yes" | "no" | "abstained";
//   customVotingOptions?: string[];
//   files?: File[];
// }

interface CreateAssemblyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  assembly?: Assembly;
  propertyLocation?: string;
}

export const CreateAssemblyDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess, 
  assembly,
  propertyLocation 
}: CreateAssemblyDialogProps) => {
  const { t } = useTranslation();
  const { selectedPropertyId } = useAppSelector((state) => state.property);
  const [title, setTitle] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [showAgendaForm, setShowAgendaForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [currentDescription, setCurrentDescription] = useState("");
  const [useCustomOptions, setUseCustomOptions] = useState(false);
  const [currentVotingOption, setCurrentVotingOption] = useState<"yes" | "no" | "abstained">("yes");
  const [customOptions, setCustomOptions] = useState<string[]>([""]);
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);

  // Initialize form with assembly data when in edit mode
  useEffect(() => {
    if (assembly && open) {
      setTitle(assembly.title);
      setEndDate(assembly.date);
      setAgendaItems(assembly.agendaItems || []);
    } else if (!open) {
      // Reset form when dialog closes
      setTitle("");
      setEndDate("");
      setAgendaItems([]);
      setCurrentDescription("");
      setCurrentVotingOption("yes");
      setUseCustomOptions(false);
      setCustomOptions([""]);
      setCurrentFiles([]);
      setShowAgendaForm(false);
      setEditingItemId(null);
    }
  }, [assembly, open]);

  const handleAddOrEditAgendaItem = () => {
    if (!currentDescription.trim()) {
      toast({
        title: t("createAssembly.error"),
        description: t("createAssembly.agendaItemDescription") + " is required",
        variant: "destructive",
      });
      return;
    }

    if (useCustomOptions) {
      const validOptions = customOptions.filter(opt => opt.trim());
      if (validOptions.length === 0) {
        toast({
          title: t("createAssembly.error"),
          description: "Please add at least one voting option",
          variant: "destructive",
        });
        return;
      }
    }

    if (editingItemId) {
      setAgendaItems(items =>
        items.map(item =>
          item.id === editingItemId
            ? { 
                ...item, 
                description: currentDescription,
                votingOption: useCustomOptions ? undefined : currentVotingOption,
                customVotingOptions: useCustomOptions ? customOptions.filter(opt => opt.trim()) : undefined,
                files: currentFiles.length > 0 ? currentFiles : undefined,
              }
            : item
        )
      );
      setEditingItemId(null);
    } else {
      const newItem: AgendaItem = {
        id: Date.now().toString(),
        description: currentDescription,
        votingOption: useCustomOptions ? undefined : currentVotingOption,
        customVotingOptions: useCustomOptions ? customOptions.filter(opt => opt.trim()) : undefined,
        files: currentFiles.length > 0 ? currentFiles : undefined,
      };
      setAgendaItems([...agendaItems, newItem]);
    }

    setCurrentDescription("");
    setCurrentVotingOption("yes");
    setUseCustomOptions(false);
    setCustomOptions([""]);
    setCurrentFiles([]);
    setShowAgendaForm(false);
  };

  const handleEditItem = (item: AgendaItem) => {
    setEditingItemId(item.id);
    setCurrentDescription(item.description);
    if (item.customVotingOptions) {
      setUseCustomOptions(true);
      setCustomOptions(item.customVotingOptions);
    } else {
      setUseCustomOptions(false);
      setCurrentVotingOption(item.votingOption || "yes");
    }
    setCurrentFiles(item.files || []);
    setShowAgendaForm(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setAgendaItems(items => items.filter(item => item.id !== itemId));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setCurrentFiles([...currentFiles, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setCurrentFiles(currentFiles.filter((_, i) => i !== index));
  };

  const handleAddCustomOption = () => {
    setCustomOptions([...customOptions, ""]);
  };

  const handleRemoveCustomOption = (index: number) => {
    setCustomOptions(customOptions.filter((_, i) => i !== index));
  };

  const handleCustomOptionChange = (index: number, value: string) => {
    const newOptions = [...customOptions];
    newOptions[index] = value;
    setCustomOptions(newOptions);
  };

  const handleCreate = async () => {
    if (!title || !endDate) {
      toast({
        title: t("createAssembly.error"),
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!propertyLocation) {
      toast({
        title: t("createAssembly.error"),
        description: t("properties.selectProperty"),
        variant: "destructive",
      });
      return;
    }

    if (agendaItems.length === 0) {
      toast({
        title: t("createAssembly.error"),
        description: "Please add at least one agenda item",
        variant: "destructive",
      });
      return;
    }

    try {
      if (assembly) {
        // Update existing assembly
        await mockApi.updateAssembly(assembly.id, {
          title,
          buildingLocation: propertyLocation,
          date: endDate,
          agendaItems: agendaItems,
        });

        toast({
          title: t("createAssembly.updated"),
        });
      } else {
        // Create new assembly
        await mockApi.createAssembly({
          title,
          buildingLocation: propertyLocation,
          date: endDate,
          agendaItems: agendaItems,
        });

        toast({
          title: t("createAssembly.created"),
        });
      }
      
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: t("createAssembly.error"),
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{assembly ? t("createAssembly.editTitle") : t("createAssembly.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t("dashboard.createAssembly")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("createAssembly.title")}
            />
          </div>

          {/* Building Location */}
          {propertyLocation && (
            <div className="space-y-2">
              <Label>{t("createAssembly.buildingLocation")}</Label>
              <div className="p-3 bg-muted rounded-md text-sm">
                {propertyLocation}
              </div>
            </div>
          )}

          {/* Start and End Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endDate">{t("createAssembly.endDate")}</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Agenda */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t("createAssembly.agenda")}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAgendaForm(!showAgendaForm);
                  setEditingItemId(null);
                  setCurrentDescription("");
                  setCurrentVotingOption("yes");
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("createAssembly.addAgendaItem")}
              </Button>
            </div>

            {/* Agenda Items List */}
            {agendaItems.length === 0 && !showAgendaForm && (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t("createAssembly.noAgendaItems")}
              </p>
            )}

            {agendaItems.length > 0 && (
              <div className="space-y-2">
                {agendaItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 bg-muted rounded-lg flex items-start justify-between gap-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {index + 1}. {item.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("createAssembly.votingOptions")}: {
                          item.customVotingOptions 
                            ? item.customVotingOptions.join(", ") 
                            : t(`createAssembly.${item.votingOption}`)
                        }
                      </p>
                      {item.files && item.files.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("createAssembly.attachFiles")}: {item.files.length} {item.files.length === 1 ? "file" : "files"}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Agenda Item Form */}
            {showAgendaForm && (
              <div className="p-4 border border-border rounded-lg space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">
                    {t("createAssembly.agendaItemDescription")}
                  </Label>
                  <Textarea
                    id="description"
                    value={currentDescription}
                    onChange={(e) => setCurrentDescription(e.target.value)}
                    placeholder={t("createAssembly.agendaItemDescriptionPlaceholder")}
                    rows={3}
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>{t("createAssembly.attachFiles")}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('file-input')?.click()}
                    >
                      <FileUp className="h-4 w-4 mr-2" />
                      {t("createAssembly.addFiles")}
                    </Button>
                  </div>
                  {currentFiles.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {currentFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                          <span className="truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Voting Options Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t("createAssembly.votingOptions")}</Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="custom-toggle" className="text-sm font-normal">
                        {t("createAssembly.customOptions")}
                      </Label>
                      <Switch
                        id="custom-toggle"
                        checked={useCustomOptions}
                        onCheckedChange={setUseCustomOptions}
                      />
                    </div>
                  </div>

                  {!useCustomOptions ? (
                    <RadioGroup
                      value={currentVotingOption}
                      onValueChange={(value) => setCurrentVotingOption(value as "yes" | "no" | "abstained")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes" className="font-normal cursor-pointer">
                          {t("createAssembly.yes")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="font-normal cursor-pointer">
                          {t("createAssembly.no")}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="abstained" id="abstained" />
                        <Label htmlFor="abstained" className="font-normal cursor-pointer">
                          {t("createAssembly.abstained")}
                        </Label>
                      </div>
                    </RadioGroup>
                  ) : (
                    <div className="space-y-2">
                      {customOptions.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(e) => handleCustomOptionChange(index, e.target.value)}
                            placeholder={t("createAssembly.customOptionPlaceholder")}
                          />
                          {customOptions.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveCustomOption(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddCustomOption}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {t("createAssembly.addCustomOption")}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="button" onClick={handleAddOrEditAgendaItem}>
                    {editingItemId ? t("common.edit") : t("common.save")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAgendaForm(false);
                      setEditingItemId(null);
                      setCurrentDescription("");
                      setCurrentVotingOption("yes");
                      setUseCustomOptions(false);
                      setCustomOptions([""]);
                      setCurrentFiles([]);
                    }}
                  >
                    {t("common.cancel")}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={handleCancel}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleCreate}>
              {assembly ? t("common.update") : t("common.create")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
