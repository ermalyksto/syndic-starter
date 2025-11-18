import { MainLayout } from "@/components/Layout/MainLayout";
import { StatCard } from "@/components/Dashboard/StatCard";
import { FileCheck, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-dashboard.jpg";
import { useTranslation } from "react-i18next";

const CoOwnerDashboard = () => {
  const { t } = useTranslation();
  
  const myEvents = [
    { id: 1, title: "Годишно общо събрание 2025", date: "15 Януари 2025", status: "Предстоящо" },
    { id: 2, title: "Гласуване за ремонт", date: "20 Декември 2024", status: "Активно" },
  ];

  const myPayments = [
    { id: 1, description: "Месечна такса - Декември", amount: "€150", status: "Платено", date: "01 Дек 2024" },
    { id: 2, description: "Такса ремонт", amount: "€300", status: "Очаква се", date: "31 Дек 2024" },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="relative h-48 lg:h-64 rounded-2xl overflow-hidden">
          <img 
            src={heroImage} 
            alt="Dashboard Overview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80 flex items-center">
            <div className="px-4 lg:px-8 text-white">
              <h1 className="text-2xl lg:text-4xl font-bold mb-2">Моят профил</h1>
              <p className="text-sm lg:text-lg opacity-90">Съсобственик - Иван Петров</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={t('dashboard.upcomingEvents')}
            value="2"
            icon={Calendar}
          />
          <StatCard
            title={t('dashboard.outstandingPayments')}
            value="€300"
            icon={DollarSign}
          />
          <StatCard
            title={t('dashboard.activeProxies')}
            value="1"
            icon={FileCheck}
          />
          <StatCard
            title={t('dashboard.pendingSignatures')}
            value="3"
            icon={AlertCircle}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Events */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {t('nav.myEvents')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {event.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                {t('dashboard.viewEvents')}
              </Button>
            </CardContent>
          </Card>

          {/* My Payments */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-accent" />
                {t('nav.myPayments')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myPayments.map((payment) => (
                  <div key={payment.id} className="flex items-start justify-between p-4 bg-muted rounded-lg">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">{payment.description}</p>
                      <p className="text-xs text-muted-foreground">{payment.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{payment.amount}</p>
                      <Badge 
                        variant="outline" 
                        className={payment.status === 'Платено' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Виж всички плащания
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-24 flex flex-col gap-2 bg-gradient-to-br from-primary to-accent hover:opacity-90">
                <FileCheck className="h-6 w-6" />
                <span>{t('dashboard.delegateVote')}</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <Calendar className="h-6 w-6" />
                <span>{t('dashboard.viewEvents')}</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <DollarSign className="h-6 w-6" />
                <span>{t('dashboard.payFees')}</span>
              </Button>
              <Button variant="outline" className="h-24 flex flex-col gap-2">
                <AlertCircle className="h-6 w-6" />
                <span>{t('dashboard.signDocuments')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CoOwnerDashboard;
