import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, FileCheck, CheckCircle, Clock, User, Calendar } from "lucide-react";
import signatureImage from "@/assets/signature-icon.jpg";

const Signatures = () => {
  const signatureRequests = [
    {
      id: 1,
      document: "Протокол ОС - Януари 2025",
      requester: "Управител",
      signers: ["Иван Петров", "Мария Димитрова", "Георги Стоянов"],
      signed: 2,
      total: 3,
      deadline: "20 Януари 2025",
      status: "pending"
    },
    {
      id: 2,
      document: "Договор - Ремонт покрив",
      requester: "Управител",
      signers: ["Всички съсобственици"],
      signed: 148,
      total: 156,
      deadline: "31 Декември 2024",
      status: "in_progress"
    },
    {
      id: 3,
      document: "Финансов отчет Q4 2024",
      requester: "Счетоводител",
      signers: ["Управител", "Председател"],
      signed: 2,
      total: 2,
      deadline: "10 Януари 2025",
      status: "completed"
    }
  ];

  const mySignatures = [
    { id: 1, document: "Присъствен лист ОС", date: "15 Януари 2025", type: "QES", verified: true },
    { id: 2, document: "Пълномощно - Мария Димитрова", date: "12 Януари 2025", type: "QES", verified: true },
    { id: 3, document: "Протокол ОС - Септември 2024", date: "15 Септември 2024", type: "QES", verified: true },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Електронни подписи</h1>
            <p className="text-muted-foreground mt-1">Управление на QES подписи и верификация</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent">
            <FileCheck className="h-4 w-4 mr-2" />
            Нова заявка
          </Button>
        </div>

        {/* Hero Section */}
        <Card className="shadow-card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8">
              <img 
                src={signatureImage} 
                alt="Digital Signatures" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-primary/5 to-accent/5">
              <h3 className="text-2xl font-bold text-foreground mb-4">Квалифициран електронен подпис</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <span className="font-medium">Максимална правна сигурност</span>
                    <p className="text-sm text-muted-foreground">Еквивалентен на ръкописен подпис в ЕС (eIDAS, чл. 25.2)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <span className="font-medium">Неоспоримост</span>
                    <p className="text-sm text-muted-foreground">Защита срещу съдебно оспорване</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FileCheck className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <span className="font-medium">Пълна проследимост</span>
                    <p className="text-sm text-muted-foreground">Одит на всички действия и верификации</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">156</div>
              <div className="text-sm text-muted-foreground">Общо подписи</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Активни заявки</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-success">148</div>
              <div className="text-sm text-muted-foreground">Верифицирани</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-warning">8</div>
              <div className="text-sm text-muted-foreground">Чакащи</div>
            </CardContent>
          </Card>
        </div>

        {/* Signature Requests */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Заявки за подписи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {signatureRequests.map((request) => (
                <div key={request.id} className="p-6 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-semibold text-foreground">{request.document}</h4>
                        <Badge 
                          variant={request.status === "completed" ? "default" : request.status === "in_progress" ? "default" : "secondary"}
                          className={
                            request.status === "completed" ? "bg-success text-success-foreground" :
                            request.status === "in_progress" ? "bg-primary text-primary-foreground" : ""
                          }
                        >
                          {request.status === "completed" ? "Завършено" : 
                           request.status === "in_progress" ? "В процес" : "Чакащо"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          Заявено от: {request.requester}
                        </span>
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Краен срок: {request.deadline}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Прогрес</span>
                          <span className="font-medium text-foreground">{request.signed} / {request.total} подписани</span>
                        </div>
                        <div className="relative h-2 bg-background rounded-full overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-accent transition-all"
                            style={{ width: `${(request.signed / request.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      {request.status !== "completed" ? (
                        <>
                          <Button size="sm">Виж детайли</Button>
                          <Button variant="outline" size="sm">Напомни</Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" size="sm">Преглед</Button>
                          <Button variant="outline" size="sm">Изтегли</Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Signatures */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Моите подписи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mySignatures.map((signature) => (
                <div key={signature.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{signature.document}</p>
                      <p className="text-sm text-muted-foreground">{signature.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      {signature.type}
                    </Badge>
                    {signature.verified && (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        Верифициран
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm">Виж</Button>
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

export default Signatures;
