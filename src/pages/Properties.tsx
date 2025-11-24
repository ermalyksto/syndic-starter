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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    {property.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">{property.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {property.coOwners.length} {t('properties.coOwners')}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      {t('properties.coOwnersList')}:
                    </p>
                    <div className="space-y-1">
                      {property.coOwners.slice(0, 3).map((coOwner) => (
                        <div key={coOwner.id} className="flex justify-between text-xs">
                          <span className="text-muted-foreground truncate">{coOwner.email}</span>
                          <span className="text-muted-foreground font-medium">{coOwner.weight}%</span>
                        </div>
                      ))}
                      {property.coOwners.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{property.coOwners.length - 3} {t('properties.more')}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleEditClick(property)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    {t('common.edit')}
                  </Button>
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