import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  FileText,
  Settings,
  Trash2,
  Mail,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Assembly, AssemblyStatus, UserRole } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { mockApi } from "@/services/mockApi";
import { useAppSelector } from "@/store/hooks";

interface AssemblyCardProps {
  assembly: Assembly;
  userRole?: UserRole;
  onManage?: (assembly: Assembly) => void;
  onDelete?: (assembly: Assembly) => void;
  onNavigate?: (assemblyId: string) => void;
  onInvite?: (assemblyId: string) => void;
  onRefresh?: () => void;
  sendingInvites?: boolean;
}

export const AssemblyCard = ({
  assembly,
  userRole,
  onManage,
  onDelete,
  onNavigate,
  onInvite,
  onRefresh,
  sendingInvites = false,
}: AssemblyCardProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const [agendaExpanded, setAgendaExpanded] = useState(false);
  const [showDelegateDialog, setShowDelegateDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedDelegateId, setSelectedDelegateId] = useState("");
  const [isDelegating, setIsDelegating] = useState(false);
  const [availableOwners, setAvailableOwners] = useState<any[]>([]);
  const [isLoadingOwners, setIsLoadingOwners] = useState(false);
  const [showFinalizeDialog, setShowFinalizeDialog] = useState(false);
  const [showFinalizeSuccessDialog, setShowFinalizeSuccessDialog] = useState(false);
  const [protocolFile, setProtocolFile] = useState<File | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

  useEffect(() => {
    if (showDelegateDialog && user?.id) {
      loadOwners();
    }
  }, [showDelegateDialog, user?.id]);

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

  const getStatusBadge = (status: Assembly["status"]) => {
    const variants = {
      draft: {
        label: t("dashboard.status.draft"),
        className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      },
      active: {
        label: t("dashboard.status.active"),
        className: "bg-green-500/10 text-green-600 border-green-500/20",
      },
      completed: {
        label: t("dashboard.status.completed"),
        className: "bg-muted text-muted-foreground border-border",
      },
    };
    const variantData = variants[status];
    return (
      <Badge variant="outline" className={variantData.className}>
        {variantData.label}
      </Badge>
    );
  };

  const handleDelegateClick = () => {
    setSelectedDelegateId("");
    setShowDelegateDialog(true);
  };

  const handleDelegateSubmit = async () => {
    if (!selectedDelegateId) {
      toast({
        title: t("delegation.error"),
        description: t("delegation.selectOwner"),
        variant: "destructive",
      });
      return;
    }

    const selectedOwner = availableOwners.find(o => o.id.toString() === selectedDelegateId);
    if (!selectedOwner) return;

    setIsDelegating(true);

    try {
      const response = await fetch(`/api/assemblies/${assembly.id}/delegate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: selectedOwner.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to delegate vote");
      }

      setShowDelegateDialog(false);
      setShowSuccessDialog(true);
    } catch (error) {
      toast({
        title: t("delegation.error"),
        description: t("delegation.failedToDelegate"),
        variant: "destructive",
      });
    } finally {
      setIsDelegating(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    onRefresh?.();
  };

  const handleFinalizeClick = () => {
    setProtocolFile(null);
    setShowFinalizeDialog(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProtocolFile(file);
    }
  };

  const handleFinalizeSubmit = async () => {
    if (!protocolFile) {
      toast({
        title: t("finalize.error"),
        description: t("finalize.noFile"),
        variant: "destructive",
      });
      return;
    }

    setIsFinalizing(true);

    try {
      const formData = new FormData();
      formData.append("protocol", protocolFile);

      const response = await fetch(`/api/protocol/${assembly.id}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to finalize assembly");
      }

      setShowFinalizeDialog(false);
      setShowFinalizeSuccessDialog(true);
    } catch (error) {
      toast({
        title: t("finalize.error"),
        description: t("finalize.failedToFinalize"),
        variant: "destructive",
      });
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleFinalizeSuccessClose = () => {
    setShowFinalizeSuccessDialog(false);
    onRefresh?.();
  };

  return (
    <>
      <div className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-3 flex-wrap">
              <h3 className="font-semibold text-foreground">{assembly.title}</h3>
              {getStatusBadge(assembly.status)}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {assembly.date} {t("common.at")} {assembly.time}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>
                  {assembly.participantsCount} {t("dashboard.participants")}
                </span>
              </div>
              {assembly.delegatedOwnersCount !== undefined && (
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>
                    {assembly.delegatedOwnersCount} {t("dashboard.delegated")}
                  </span>
                </div>
              )}
              {assembly.buildingLocation && (
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{assembly.buildingLocation}</span>
                </div>
              )}
            </div>

            {/* Agenda Items Section */}
            {assembly.agendaItems && assembly.agendaItems.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => setAgendaExpanded(!agendaExpanded)}
                  className="flex items-center gap-2 text-sm font-medium text-primary hover:underline cursor-pointer"
                >
                  {agendaExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span>
                    {t("assemblies.agenda")} ({assembly.agendaItems.length} {t("assemblies.items")})
                  </span>
                </button>
                
                {agendaExpanded && (
                  <ul className="mt-3 space-y-2 pl-6">
                    {assembly.agendaItems.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-foreground flex items-start gap-2"
                      >
                        <span className="text-primary font-medium flex-shrink-0">
                          {idx + 1}.
                        </span>
                        <span className="text-muted-foreground">
                          {item.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap lg:flex-shrink-0">
            {userRole === "syndic" && assembly.status === "draft" && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onManage?.(assembly)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {t("dashboard.manage")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete?.(assembly)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("common.delete")}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onInvite?.(assembly.id)}
                  disabled={sendingInvites}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {sendingInvites ? t("dashboard.sending") : t("dashboard.invite")}
                </Button>
              </>
            )}
            {userRole === "syndic" && assembly.status === "active" && (
              <Button
                variant="default"
                size="sm"
                onClick={handleFinalizeClick}
                className="bg-gradient-to-br from-primary to-accent hover:opacity-90"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {t("finalize.finalize")}
              </Button>
            )}
            {userRole === UserRole.COOWNER && assembly.status === AssemblyStatus.ACTIVE && !assembly.voted && (
              <>
                <Button size="sm" onClick={() => onNavigate?.(assembly.id)}>
                  {t("assemblies.vote")}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleDelegateClick}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  {t("assemblies.delegate")}
                </Button>
              </>
            )}
            {userRole === UserRole.COOWNER && assembly.status === AssemblyStatus.COMPLETED && (
              <Button size="sm" onClick={() => {}}>
                {t("assemblies.protocol")}
              </Button>
            )}
            {userRole === "syndic" && (
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                {t("dashboard.eventLog")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Delegate Dialog */}
      <Dialog open={showDelegateDialog} onOpenChange={setShowDelegateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delegation.title")}</DialogTitle>
            <DialogDescription>
              {t("delegation.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delegateSelect">{t("delegation.selectOwner")}</Label>
              <Select
                value={selectedDelegateId}
                onValueChange={setSelectedDelegateId}
                disabled={isDelegating || isLoadingOwners}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("delegation.selectOwnerPlaceholder")} />
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
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDelegateDialog(false)}
              disabled={isDelegating}
            >
              {t("common.cancel")}
            </Button>
            <Button 
              onClick={handleDelegateSubmit}
              disabled={isDelegating}
            >
              {isDelegating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("delegation.delegating")}
                </>
              ) : (
                t("delegation.delegateButton")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("delegation.successTitle")}</DialogTitle>
            <DialogDescription>
              {t("delegation.successMessage", { 
                email: availableOwners.find(o => o.id.toString() === selectedDelegateId)?.email || "" 
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSuccessDialogClose}>
              {t("common.ok")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finalize Dialog */}
      <Dialog open={showFinalizeDialog} onOpenChange={setShowFinalizeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("finalize.title")}</DialogTitle>
            <DialogDescription>
              {t("finalize.message")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="protocolFile">{t("finalize.protocolFile")}</Label>
              <input
                id="protocolFile"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={isFinalizing}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {protocolFile && (
                <p className="text-sm text-muted-foreground">
                  {t("finalize.selectedFile")}: {protocolFile.name}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowFinalizeDialog(false)}
              disabled={isFinalizing}
            >
              {t("common.cancel")}
            </Button>
            <Button 
              onClick={handleFinalizeSubmit}
              disabled={isFinalizing}
              className="bg-gradient-to-br from-primary to-accent hover:opacity-90"
            >
              {isFinalizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("finalize.finalizing")}
                </>
              ) : (
                t("finalize.finalize")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finalize Success Dialog */}
      <Dialog open={showFinalizeSuccessDialog} onOpenChange={setShowFinalizeSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("finalize.successTitle")}</DialogTitle>
            <DialogDescription>
              {t("finalize.successMessage")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleFinalizeSuccessClose}>
              {t("common.ok")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};