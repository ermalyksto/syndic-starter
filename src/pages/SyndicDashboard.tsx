import { MainLayout } from "@/components/Layout/MainLayout";
import { StatCard } from "@/components/Dashboard/StatCard";
import { Plus, Users, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { mockApi, AssemblyStats, Property } from "@/services/mockApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { CreateAssemblyDialog } from "@/components/CreateAssemblyDialog";
import { PropertySelectDialog } from "@/components/PropertySelectDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setSelectedProperty } from "@/store/slices/propertySlice";
import { AssemblyCard } from "./AssemblyCard";
import { Assembly } from "@/types";

const SyndicDashboard = () => {
  const dispatch = useAppDispatch();
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [stats, setStats] = useState<AssemblyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingAssembly, setEditingAssembly] = useState<Assembly | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assemblyToDelete, setAssemblyToDelete] = useState<Assembly | null>(
    null
  );
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [sendingInvites, setSendingInvites] = useState(false);
  const [propertySelectDialogOpen, setPropertySelectDialogOpen] = useState(false);
  const [selectedPropertyLocation, setSelectedPropertyLocation] = useState<string>("");
  const [properties, setProperties] = useState<Property[]>([]);
  const { user } = useAppSelector((state) => state.auth);
  const { selectedPropertyId } = useAppSelector((state) => state.property);
  const { t } = useTranslation();

  useEffect(() => {
    if (user?.id) {
      loadProperties();
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedPropertyId && properties.length > 0) {
      const property = properties.find((p) => p.id === selectedPropertyId);
      setSelectedPropertyLocation(property?.location || "");
    } else {
      setSelectedPropertyLocation("");
    }
  }, [selectedPropertyId, properties]);

  const loadProperties = async () => {
    try {
      const data = await mockApi.getProperties(user.id);
      setProperties(data);
    } catch (error) {
      console.error("Failed to load properties:", error);
    }
  };

  const loadData = useCallback(async () => {
    try {
      const url = selectedPropertyId
        ? `/api/assemblies/user/${user.id}/property/${selectedPropertyId}`
        : `/api/assemblies/user/${user.id}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch assemblies");
      const assembliesData = await response.json();
      
      const statsData = await mockApi.getAssemblyStats();
      
      setAssemblies(assembliesData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedPropertyId, user.id]);

  useEffect(() => {
    loadData();
  }, [selectedPropertyId, loadData]);

  const handleAssemblyCreated = () => {
    loadData();
    setEditingAssembly(null);
  };

  const handleManageClick = (assembly: Assembly) => {
    setEditingAssembly(assembly);
    setCreateDialogOpen(true);
  };

  const handleDeleteClick = (assembly: Assembly) => {
    setAssemblyToDelete(assembly);
    setDeleteDialogOpen(true);
  };

  const handleInviteClick = async (assemblyId: string) => {
    setSendingInvites(true);
    try {
      console.log("Send request", assemblyId);
      const response = await fetch(`/api/invitations/${assemblyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to send invitations');
      }

      setInviteDialogOpen(true);
    } catch (error) {
      toast({
        title: t("createAssembly.error"),
        description: error instanceof Error ? error.message : "Failed to send invitations",
        variant: "destructive",
      });
    } finally {
      setSendingInvites(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!assemblyToDelete) return;

    try {
      await mockApi.deleteAssembly(assemblyToDelete.id);
      toast({
        title: t("createAssembly.deleted"),
      });
      loadData();
    } catch (error) {
      toast({
        title: t("createAssembly.error"),
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setAssemblyToDelete(null);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {t("nav.assemblies")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("dashboard.description")}
            </p>
          </div>
          <Button
            className="bg-gradient-to-br from-primary to-accent hover:opacity-90"
            onClick={() => {
              setEditingAssembly(null);
              if (!selectedPropertyId) {
                setPropertySelectDialogOpen(true);
              } else {
                setCreateDialogOpen(true);
              }
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("dashboard.createAssembly")}
          </Button>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title={t("dashboard.totalAssemblies")}
              value={stats.totalAssemblies}
              icon={Calendar}
            />
            <StatCard
              title={t("dashboard.activeAssemblies")}
              value={stats.activeAssemblies}
              icon={FileText}
            />
            <StatCard
              title={t("dashboard.participants")}
              value={stats.totalParticipants}
              icon={Users}
            />
            <StatCard
              title={t("dashboard.avgParticipation")}
              value={stats.averageAttendance}
              icon={Users}
            />
          </div>
        ) : null}

        {/* Assemblies List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t("dashboard.upcomingAssemblies")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {assemblies.map((assembly) => (
                  <AssemblyCard
                    key={assembly.id}
                    assembly={assembly}
                    userRole={user.role}
                    onManage={handleManageClick}
                    onDelete={handleDeleteClick}
                    onInvite={handleInviteClick}
                    onRefresh={loadData}
                    sendingInvites={sendingInvites}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Property Selection Dialog */}
        <PropertySelectDialog
          open={propertySelectDialogOpen}
          onOpenChange={setPropertySelectDialogOpen}
          onPropertySelected={(propertyId, location) => {
            dispatch(setSelectedProperty(propertyId));
            setSelectedPropertyLocation(location);
            setPropertySelectDialogOpen(false);
            setCreateDialogOpen(true);
          }}
        />

        {/* Create/Edit Assembly Dialog */}
        <CreateAssemblyDialog
          open={createDialogOpen}
          onOpenChange={(open) => {
            setCreateDialogOpen(open);
            if (!open) setEditingAssembly(null);
          }}
          onSuccess={handleAssemblyCreated}
          assembly={editingAssembly || undefined}
          propertyLocation={selectedPropertyLocation}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteDialog.description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("deleteDialog.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {t("deleteDialog.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Invite Success Dialog */}
        <AlertDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("dashboard.invite")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("dashboard.inviteSuccessMessage")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setInviteDialogOpen(false)}>
                {t("common.ok")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default SyndicDashboard;