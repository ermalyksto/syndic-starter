import { useState, useEffect } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, Mail, Phone, Home, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { useToast } from "@/hooks/use-toast";

interface Owner {
  id: number;
  name: string;
  email: string;
  phone: string;
  apartment: string;
  quota: string;
  status: "active" | "pending";
  propertyId?: string;
}

interface OwnersResponse {
  success: boolean;
  data: Owner[];
  total: number;
}

const Owners = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { selectedPropertyId } = useAppSelector((state) => state.property);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    activityRate: 0
  });

  useEffect(() => {
    fetchOwners();
  }, [user?.id, selectedPropertyId]);

  useEffect(() => {
    // Filter owners based on search term
    if (searchTerm) {
      const filtered = owners.filter((owner) => 
        owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.phone.includes(searchTerm)
      );
      setFilteredOwners(filtered);
    } else {
      setFilteredOwners(owners);
    }
  }, [searchTerm, owners]);

  const fetchOwners = async () => {
    if (!user?.id) {
      console.error("No user ID found");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const url = selectedPropertyId 
        ? `/api/owners/${user.id}/property/${selectedPropertyId}`
        : `/api/owners/${user.id}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch owners");
      }

      const data: OwnersResponse = await response.json();
      
      if (data.success && data.data) {
        setOwners(data.data);
        setFilteredOwners(data.data);
        
        // Calculate stats
        const activeCount = data.data.filter(owner => owner.status === "active").length;
        const pendingCount = data.data.filter(owner => owner.status === "pending").length;
        const activityRate = data.total > 0 ? Math.round((activeCount / data.total) * 100) : 0;
        
        setStats({
          total: data.total,
          active: activeCount,
          pending: pendingCount,
          activityRate: activityRate
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching owners:", error);
      toast({
        title: t("owners.error"),
        description: t("owners.loadError"),
        variant: "destructive",
      });
      
      // Fallback to empty data
      setOwners([]);
      setFilteredOwners([]);
      setStats({
        total: 0,
        active: 0,
        pending: 0,
        activityRate: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOwner = () => {
    // TODO: Implement add owner functionality
    console.log("Add owner clicked");
  };

  const handleViewDetails = (ownerId: number) => {
    // TODO: Implement view details functionality
    console.log("View details for owner:", ownerId);
  };

  const getStatusBadge = (status: "active" | "pending") => {
    if (status === "active") {
      return (
        <Badge className="bg-success text-success-foreground">
          {t("owners.statusActive")}
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary">
          {t("owners.statusPending")}
        </Badge>
      );
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('owners.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('owners.description')}</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-primary to-accent"
            onClick={handleAddOwner}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {t('owners.addOwner')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  stats.total
                )}
              </div>
              <div className="text-sm text-muted-foreground">{t('owners.totalOwners')}</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-success">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  stats.active
                )}
              </div>
              <div className="text-sm text-muted-foreground">{t('owners.activeOwners')}</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-warning">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  stats.pending
                )}
              </div>
              <div className="text-sm text-muted-foreground">{t('owners.pendingOwners')}</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  `${stats.activityRate}%`
                )}
              </div>
              <div className="text-sm text-muted-foreground">{t('owners.activity')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('owners.title')}</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder={t('common.search')} 
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredOwners.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                {searchTerm ? t('owners.noSearchResults') : t('owners.noOwners')}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('owners.name')}</TableHead>
                    <TableHead>{t('owners.contact')}</TableHead>
                    <TableHead>{t('owners.apartment')}</TableHead>
                    <TableHead>{t('owners.quota')}</TableHead>
                    <TableHead>{t('owners.status')}</TableHead>
                    <TableHead className="text-right">{t('common.details')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOwners.map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell className="font-medium">{owner.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{owner.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{owner.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-primary" />
                          <span className="font-medium">{owner.apartment}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{owner.quota}</TableCell>
                      <TableCell>
                        {getStatusBadge(owner.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(owner.id)}
                        >
                          {t('common.details')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Owners;