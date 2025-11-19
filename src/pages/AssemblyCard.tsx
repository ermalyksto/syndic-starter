import { useState } from "react";
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
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface AgendaItem {
  description: string;
}

interface Assembly {
  id: string;
  title: string;
  status: "draft" | "active" | "completed";
  date: string;
  time: string;
  participantsCount: number;
  delegatedOwnersCount?: number;
  buildingLocation?: string;
  agendaItems?: AgendaItem[];
  voted?: boolean;
}

interface AssemblyCardProps {
  assembly: Assembly;
  userRole?: string;
  showManageButtons?: boolean;
  onManage?: (assembly: Assembly) => void;
  onDelete?: (assembly: Assembly) => void;
  onNavigate?: (assemblyId: string) => void;
}

export const AssemblyCard = ({
  assembly,
  userRole,
  showManageButtons = false,
  onManage,
  onDelete,
  onNavigate,
}: AssemblyCardProps) => {
  const { t } = useTranslation();
  const [agendaExpanded, setAgendaExpanded] = useState(false);

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

  return (
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
                {assembly.date} в {assembly.time}
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
                  Дневен ред ({assembly.agendaItems.length} точки)
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
          {showManageButtons && assembly.status === "draft" && (
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
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                {t("dashboard.invite")}
              </Button>
            </>
          )}
          {!showManageButtons && assembly.status === "active" && !assembly.voted && (
            <>
              {userRole === "co-owner" ? (
                <Button size="sm" onClick={() => onNavigate?.(assembly.id)}>
                  Гласувай
                </Button>
              ) : (
                <>
                  <Button size="sm">Изпрати покани</Button>
                  <Button variant="outline" size="sm">
                    Редактирай
                  </Button>
                  <Button variant="outline" size="sm">
                    Пълномощни
                  </Button>
                </>
              )}
            </>
          )}
          {!showManageButtons &&
            (assembly.status === "completed" ||
              (assembly.status === "active" && assembly.voted)) && (
              <>
                <Button variant="outline" size="sm">
                  Виж протокол
                </Button>
                <Button variant="outline" size="sm">
                  Подписи
                </Button>
                <Button variant="outline" size="sm">
                  Изтегли
                </Button>
              </>
            )}
          {(assembly.status === "active" || assembly.status === "completed") &&
            showManageButtons && (
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                {t("dashboard.eventLog")}
              </Button>
            )}
        </div>
      </div>
    </div>
  );
};
