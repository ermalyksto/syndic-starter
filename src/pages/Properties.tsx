import { MainLayout } from "@/components/Layout/MainLayout";
import { Plus, Building2, MapPin, Users, Edit2 } from "lucide-react";
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
            {properties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{property.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{property.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {property.coOwners.length} {t('properties.coOwners')}
                        </span>
                      </div>

                      <div className="pt-3 border-t border-border">
                        <p className="text-sm font-medium text-foreground mb-3">
                          {t('properties.coOwnersList')}:
                        </p>
                        <div className="space-y-2">
                          {property.coOwners.map((coOwner, index) => (
                            <div 
                              key={coOwner.id} 
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium flex-shrink-0">
                                  {index + 1}
                                </div>
                                <span className="text-sm text-foreground truncate">{coOwner.email}</span>
                              </div>
                              <span className="text-sm font-semibold text-foreground bg-background px-3 py-1 rounded-md border border-border ml-3 flex-shrink-0">
                                {coOwner.weight}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-2 lg:items-end">
                      <Button
                        variant="outline"
                        className="flex-1 lg:flex-initial"
                        onClick={() => handleEditClick(property)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        {t('common.edit')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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