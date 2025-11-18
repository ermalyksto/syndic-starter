import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCheck, ShieldCheck, Users, CheckCircle, Clock, XCircle, Plus } from "lucide-react";
import buildingImage from "@/assets/building-management.jpg";

const Proxies = () => {
  const proxies = [
    {
      id: 1,
      grantor: "Иван Петров",
      grantee: "Мария Димитрова",
      assembly: "Годишно общо събрание 2025",
      date: "10 Януари 2025",
      status: "verified",
      qesVerified: true
    },
    {
      id: 2,
      grantor: "Георги Стоянов",
      grantee: "Елена Николова",
      assembly: "Годишно общо събрание 2025",
      date: "12 Януари 2025",
      status: "pending",
      qesVerified: false
    },
    {
      id: 3,
      grantor: "Димитър Иванов",
      grantee: "Иван Петров",
      assembly: "Извънредно събрание - Асансьори",
      date: "15 Декември 2024",
      status: "verified",
      qesVerified: true
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Система за пълномощни</h1>
            <p className="text-muted-foreground mt-1">Квалифицирано дигитално делегиране на гласове</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent">
            <Plus className="h-4 w-4 mr-2" />
            Ново пълномощно
          </Button>
        </div>

        {/* Features Section */}
        <Card className="shadow-card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-primary/5 to-accent/5">
              <h3 className="text-2xl font-bold text-foreground mb-4">Квалифицирано делегиране</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <span className="font-medium">Нефалшифицируема верига</span>
                    <p className="text-sm text-muted-foreground">Правно валидно делегиране с пълна проследимост</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <span className="font-medium">Моментална верификация</span>
                    <p className="text-sm text-muted-foreground">Проверка на самоличност чрез портфейл</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <FileCheck className="h-5 w-5 text-accent mt-0.5" />
                  <div>
                    <span className="font-medium">Защита срещу измами</span>
                    <p className="text-sm text-muted-foreground">Предотвратяване на неоторизирано гласуване</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="p-8">
              <img 
                src={buildingImage} 
                alt="Proxy Management" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-foreground">24</div>
              <div className="text-sm text-muted-foreground">Активни пълномощни</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-success">20</div>
              <div className="text-sm text-muted-foreground">Верифицирани</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-warning">4</div>
              <div className="text-sm text-muted-foreground">Чакащи верификация</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">QES сигурност</div>
            </CardContent>
          </Card>
        </div>

        {/* Proxies List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Текущи пълномощни</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proxies.map((proxy) => (
                <div key={proxy.id} className="p-6 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-semibold text-foreground">{proxy.assembly}</h4>
                        <Badge 
                          variant={proxy.status === "verified" ? "default" : "secondary"}
                          className={proxy.status === "verified" ? "bg-success text-success-foreground" : ""}
                        >
                          {proxy.status === "verified" ? (
                            <><CheckCircle className="h-3 w-3 mr-1" /> Верифицирано</>
                          ) : (
                            <><Clock className="h-3 w-3 mr-1" /> Чакащо</>
                          )}
                        </Badge>
                        {proxy.qesVerified && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            <ShieldCheck className="h-3 w-3 mr-1" /> QES
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-8 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">От:</span>
                          <span className="font-medium text-foreground">{proxy.grantor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">До:</span>
                          <span className="font-medium text-foreground">{proxy.grantee}</span>
                        </div>
                        <div className="text-muted-foreground">
                          Дата: {proxy.date}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      {proxy.status === "verified" ? (
                        <>
                          <Button variant="outline" size="sm">Виж детайли</Button>
                          <Button variant="outline" size="sm">Изтегли</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm">Верифицирай</Button>
                          <Button variant="outline" size="sm">Откажи</Button>
                        </>
                      )}
                    </div>
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

export default Proxies;
