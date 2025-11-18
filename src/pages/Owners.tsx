import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, Mail, Phone, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

const Owners = () => {
  const { t } = useTranslation();
  
  const owners = [
    { id: 1, name: "Иван Петров", email: "ivan@email.bg", phone: "+359 888 123 456", apartment: "А-12", quota: "2.5%", status: "active" },
    { id: 2, name: "Мария Димитрова", email: "maria@email.bg", phone: "+359 888 234 567", apartment: "Б-05", quota: "3.2%", status: "active" },
    { id: 3, name: "Георги Стоянов", email: "georgi@email.bg", phone: "+359 888 345 678", apartment: "В-18", quota: "2.8%", status: "pending" },
    { id: 4, name: "Елена Николова", email: "elena@email.bg", phone: "+359 888 456 789", apartment: "А-07", quota: "3.0%", status: "active" },
    { id: 5, name: "Димитър Иванов", email: "dimitar@email.bg", phone: "+359 888 567 890", apartment: "Б-22", quota: "2.7%", status: "active" },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('owners.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('owners.description')}</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent">
            <UserPlus className="h-4 w-4 mr-2" />
            {t('owners.addOwner')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">156</div>
              <div className="text-sm text-muted-foreground">{t('owners.totalOwners')}</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-success">148</div>
              <div className="text-sm text-muted-foreground">{t('owners.activeOwners')}</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-warning">8</div>
              <div className="text-sm text-muted-foreground">{t('owners.pendingOwners')}</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">92%</div>
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
                  <Input placeholder={t('common.search')} className="pl-10 w-64" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
                {owners.map((owner) => (
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
                      <Badge 
                        variant={owner.status === "active" ? "default" : "secondary"}
                        className={owner.status === "active" ? "bg-success text-success-foreground" : ""}
                      >
                        {owner.status === "active" ? "Активен" : "Чакащ"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">{t('common.details')}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Owners;
