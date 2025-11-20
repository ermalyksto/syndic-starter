import { Bell, Menu, Languages, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setSelectedProperty } from "@/store/slices/propertySlice";
import { useState, useEffect } from "react";
import { mockApi, Property } from "@/services/mockApi";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const { selectedPropertyId } = useAppSelector((state) => state.property);
  const dispatch = useAppDispatch();
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (user?.role === 'syndic' && user?.id) {
      mockApi.getProperties(user.id).then(setProperties).catch(console.error);
    }
  }, [user]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handlePropertyChange = (value: string) => {
    dispatch(setSelectedProperty(value === 'all' ? null : value));
  };

  const languages = [
    { code: 'bg', name: 'Български' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
  ];

  return (
    <header className="fixed top-0 right-0 lg:left-64 left-0 h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 z-10">
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      {user?.role === 'syndic' && (
        <div className="flex items-center gap-4 flex-1 max-w-xs">
          <Select 
            value={selectedPropertyId || 'all'} 
            onValueChange={handlePropertyChange}
          >
            <SelectTrigger className="w-full">
              <Building2 className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('properties.allProperties') || 'All properties'}</SelectItem>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Languages className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={i18n.language === lang.code ? 'bg-accent' : ''}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" />
        </Button>
      </div>
    </header>
  );
};
