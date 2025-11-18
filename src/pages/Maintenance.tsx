import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, AlertCircle, CheckCircle, Clock, Plus, Calendar } from "lucide-react";

const Maintenance = () => {
  const maintenanceRequests = [
    {
      id: 1,
      title: "Ремонт асансьор - Блок А",
      description: "Асансьорът издава странни звуци при движение",
      location: "Блок А, Асансьор 1",
      reportedBy: "Иван Петров (А-12)",
      date: "15 Дек 2024",
      priority: "high",
      status: "in_progress"
    },
    {
      id: 2,
      title: "Теч на вода - Партер",
      description: "Течаща вода в коридора на партерния етаж",
      location: "Партер, Коридор",
      reportedBy: "Мария Димитрова (Б-05)",
      date: "18 Дек 2024",
      priority: "urgent",
      status: "open"
    },
    {
      id: 3,
      title: "Счупена лампа - Стълбище Б",
      description: "Осветлението на етаж 3 не работи",
      location: "Блок Б, Етаж 3",
      reportedBy: "Георги Стоянов (В-18)",
      date: "10 Дек 2024",
      priority: "low",
      status: "completed"
    },
    {
      id: 4,
      title: "Почистване на покрив",
      description: "Натрупани листа и отпадъци на покрива",
      location: "Покрив, Блок А",
      reportedBy: "Управител",
      date: "12 Дек 2024",
      priority: "medium",
      status: "scheduled"
    }
  ];

  const contracts = [
    { id: 1, service: "Чистене", provider: "Клийн БГ ООД", contract: "2024-CLEAN-001", validUntil: "31 Дек 2024", amount: "€450/месец" },
    { id: 2, service: "Асансьори", provider: "Елевейтър Сървис", contract: "2024-ELEV-001", validUntil: "30 Юни 2025", amount: "€280/месец" },
    { id: 3, service: "Озеленяване", provider: "Грийн Гардън", contract: "2024-GARD-001", validUntil: "31 Март 2025", amount: "€320/месец" }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: "Отворена", variant: "default" as const, color: "bg-warning text-warning-foreground" },
      in_progress: { label: "В процес", variant: "default" as const, color: "bg-primary text-primary-foreground" },
      scheduled: { label: "Планирана", variant: "secondary" as const, color: "" },
      completed: { label: "Завършена", variant: "default" as const, color: "bg-success text-success-foreground" }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      urgent: { label: "Спешно", color: "text-destructive" },
      high: { label: "Висок", color: "text-warning" },
      medium: { label: "Среден", color: "text-primary" },
      low: { label: "Нисък", color: "text-muted-foreground" }
    };
    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <span className={`text-sm font-medium ${config.color}`}>● {config.label}</span>;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Поддръжка</h1>
            <p className="text-muted-foreground mt-1">Управление на заявки и договори за поддръжка</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent">
            <Plus className="h-4 w-4 mr-2" />
            Нова заявка
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Активни заявки</p>
                  <p className="text-3xl font-bold text-foreground mt-1">8</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Спешни</p>
                  <p className="text-3xl font-bold text-destructive mt-1">2</p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Завършени този месец</p>
                  <p className="text-3xl font-bold text-success mt-1">23</p>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Среден срок</p>
                  <p className="text-3xl font-bold text-foreground mt-1">3.5д</p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Requests */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Заявки за поддръжка</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maintenanceRequests.map((request) => (
                <div key={request.id} className="p-6 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-semibold text-foreground">{request.title}</h4>
                        {getStatusBadge(request.status)}
                        {getPriorityBadge(request.priority)}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <span className="text-muted-foreground">
                          <strong>Локация:</strong> {request.location}
                        </span>
                        <span className="text-muted-foreground">
                          <strong>Докладвана от:</strong> {request.reportedBy}
                        </span>
                        <span className="text-muted-foreground">
                          <strong>Дата:</strong> {request.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <Button size="sm">Детайли</Button>
                      {request.status === "open" && (
                        <Button variant="outline" size="sm">Започни</Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Contracts */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Договори за услуги</CardTitle>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Нов договор
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contracts.map((contract) => (
                <div key={contract.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-foreground">{contract.service}</h4>
                      <Badge variant="outline">{contract.contract}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{contract.provider}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{contract.amount}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Валиден до {contract.validUntil}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Преглед</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Maintenance;
