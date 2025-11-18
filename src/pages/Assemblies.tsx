import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, FileText, CheckCircle, Clock, Plus } from "lucide-react";
import signatureImage from "@/assets/signature-icon.jpg";

const Assemblies = () => {
  const assemblies = [
    {
      id: 1,
      title: "Годишно общо събрание 2025",
      date: "15 Януари 2025",
      time: "18:00",
      location: "Заседателна зала, ет. 1",
      attendees: 142,
      status: "upcoming",
      agenda: ["Финансов отчет 2024", "Бюджет 2025", "Ремонт на покрива", "Избор на нов синдик"]
    },
    {
      id: 2,
      title: "Извънредно събрание - Асансьори",
      date: "20 Декември 2024",
      time: "19:00",
      location: "Онлайн",
      attendees: 98,
      status: "upcoming",
      agenda: ["Оферти за ремонт", "Гласуване за доставчик"]
    },
    {
      id: 3,
      title: "Редовно общо събрание Q3",
      date: "15 Септември 2024",
      time: "18:30",
      location: "Заседателна зала, ет. 1",
      attendees: 156,
      status: "completed",
      agenda: ["Отчет Q2-Q3", "Поддръжка общи части", "Нови договори"]
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Общи събрания</h1>
            <p className="text-muted-foreground mt-1">Управление на AGM с дигитални подписи и гласуване</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent">
            <Plus className="h-4 w-4 mr-2" />
            Планирай събрание
          </Button>
        </div>

        {/* Features Banner */}
        <Card className="shadow-card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 bg-gradient-to-br from-primary/10 to-accent/10">
              <img 
                src={signatureImage} 
                alt="Digital Signatures" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Напълно дигитално събрание</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <span className="font-medium">Квалифициран електронен подпис (QES)</span>
                    <p className="text-sm text-muted-foreground">Правно еквивалентен на ръкописен подпис</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <span className="font-medium">Система за пълномощни</span>
                    <p className="text-sm text-muted-foreground">Дигитално делегиране с верификация</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <span className="font-medium">QERDS комуникация</span>
                    <p className="text-sm text-muted-foreground">Гарантирана доставка на покани и протоколи</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Assemblies List */}
        <div className="space-y-4">
          {assemblies.map((assembly) => (
            <Card key={assembly.id} className="shadow-card hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">{assembly.title}</h3>
                        <Badge 
                          variant={assembly.status === "completed" ? "secondary" : "default"}
                          className={assembly.status === "upcoming" ? "bg-primary text-primary-foreground" : ""}
                        >
                          {assembly.status === "upcoming" ? (
                            <><Clock className="h-3 w-3 mr-1" /> Предстоящо</>
                          ) : (
                            <><CheckCircle className="h-3 w-3 mr-1" /> Завършено</>
                          )}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {assembly.date} в {assembly.time}
                        </span>
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {assembly.attendees} участници
                        </span>
                        <span className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {assembly.location}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">Дневен ред:</h4>
                      <ul className="space-y-1">
                        {assembly.agenda.map((item, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary font-medium">{idx + 1}.</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-6">
                    {assembly.status === "upcoming" ? (
                      <>
                        <Button>Изпрати покани</Button>
                        <Button variant="outline">Редактирай</Button>
                        <Button variant="outline">Пълномощни</Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline">Виж протокол</Button>
                        <Button variant="outline">Подписи</Button>
                        <Button variant="outline">Изтегли</Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Assemblies;
