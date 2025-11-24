import { MainLayout } from "@/components/Layout/MainLayout";
import { Plus, Building2, MapPin, Users, Edit2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RegisterPropertyDialog } from "@/components/RegisterPropertyDialog";
import { mockApi } from "@/services/mockApi";
import { toast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";

export interface CoOwner {
  id: string;
  email: string;
  weight: number;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  coOwners: CoOwner[];
}

const Properties = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPropertyId, setExpandedPropertyId] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const data = await mockApi.getProperties(user.id);
      setProperties(data);
    } catch (error) {
      toast({
        title: t('properties.error'),
        description: t('properties.loadError'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleRegisterSuccess = () => {
    loadProperties();
    setIsDialogOpen(false);
    setEditingProperty(null);
    toast({
      title: t('properties.success'),
      description: editingProperty ? t('properties.updated') : t('properties.registered'),
    });
  };

  const handleEditClick = (property: Property) => {
    setEditingProperty(property);
    setIsDialogOpen(true);
  };

  const handleAddClick = () => {
    setEditingProperty(null);
    setIsDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t('properties.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('properties.description')}</p>
          </div>
          <Button onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            {t('properties.register')}
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </div>
        ) : properties.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('properties.noProperties')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => {
              const isExpanded = expandedPropertyId === property.id;
              
              return (
                <div key={property.id} className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="font-semibold text-foreground">{property.name}</h3>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(property)}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          {t('common.edit')}
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{property.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>
                            {property.coOwners.length} {t('properties.coOwners')}
                          </span>
                        </div>
                      </div>

                      {/* Co-Owners List Section */}
                      {property.coOwners && property.coOwners.length > 0 && (
                        <div className="pt-2">
                          <button
                            onClick={() => setExpandedPropertyId(isExpanded ? null : property.id)}
                            className="flex items-center gap-2 text-sm font-medium text-primary hover:underline cursor-pointer"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                            <span>
                              {t('properties.coOwnersList')} ({property.coOwners.length} {t('properties.coOwners')})
                            </span>
                          </button>
                          
                          {isExpanded && (
                            <ul className="mt-3 space-y-2 pl-6">
                              {property.coOwners.map((coOwner, idx) => (
                                <li
                                  key={coOwner.id}
                                  className="text-sm flex items-center justify-between gap-3 p-2 bg-background/50 rounded border border-border/30"
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <span className="text-primary font-medium flex-shrink-0">
                                      {idx + 1}.
                                    </span>
                                    <span className="text-foreground truncate">
                                      {coOwner.email}
                                    </span>
                                  </div>
                                  <span className="text-sm font-semibold text-foreground bg-muted px-2 py-1 rounded flex-shrink-0">
                                    {coOwner.weight}%
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <RegisterPropertyDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingProperty(null);
          }}
          onSuccess={handleRegisterSuccess}
          property={editingProperty}
        />
      </div>
    </MainLayout>
  );
};

export default Properties;