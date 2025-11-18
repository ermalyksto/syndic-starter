import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Search, Download, Shield, Clock } from "lucide-react";

const Documents = () => {
  const documents = [
    {
      id: 1,
      name: "Протокол ОС - Януари 2025.pdf",
      type: "Протокол",
      date: "15 Януари 2025",
      size: "2.4 MB",
      signed: true,
      signatureType: "QES"
    },
    {
      id: 2,
      name: "Финансов отчет Q4 2024.xlsx",
      type: "Финансов отчет",
      date: "31 Декември 2024",
      size: "1.8 MB",
      signed: true,
      signatureType: "QES"
    },
    {
      id: 3,
      name: "Правилник етажна собственост.pdf",
      type: "Правилник",
      date: "10 Януари 2024",
      size: "3.2 MB",
      signed: true,
      signatureType: "QES"
    },
    {
      id: 4,
      name: "Договор - Чистене.pdf",
      type: "Договор",
      date: "01 Януари 2024",
      size: "890 KB",
      signed: true,
      signatureType: "QES"
    },
    {
      id: 5,
      name: "Покана ОС - Септември 2024.pdf",
      type: "Покана",
      date: "01 Септември 2024",
      size: "450 KB",
      signed: true,
      signatureType: "QERDS"
    },
    {
      id: 6,
      name: "Застрахователна полица.pdf",
      type: "Застраховка",
      date: "15 Март 2024",
      size: "1.2 MB",
      signed: false,
      signatureType: null
    }
  ];

  const documentCategories = [
    { name: "Протоколи", count: 24, icon: FileText },
    { name: "Финансови", count: 18, icon: FileText },
    { name: "Договори", count: 12, icon: FileText },
    { name: "Покани", count: 36, icon: FileText }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Документи</h1>
            <p className="text-muted-foreground mt-1">Централизирано хранилище с дигитални подписи</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent">
            <Upload className="h-4 w-4 mr-2" />
            Качи документ
          </Button>
        </div>

        {/* Document Categories */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {documentCategories.map((category, idx) => (
            <Card key={idx} className="shadow-card hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{category.name}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{category.count}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Търси документи..." className="pl-10" />
              </div>
              <Button variant="outline">Филтри</Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Всички документи</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc) => (
                <div 
                  key={doc.id} 
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-foreground">{doc.name}</h4>
                        {doc.signed && (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            <Shield className="h-3 w-3 mr-1" />
                            {doc.signatureType}
                          </Badge>
                        )}
                        <Badge variant="secondary">{doc.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {doc.date}
                        </span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Изтегли
                    </Button>
                    <Button variant="ghost" size="sm">Виж</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Digital Signature Info */}
        <Card className="shadow-card border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">Защита с дигитални подписи</h3>
                <p className="text-sm text-muted-foreground">
                  Всички критични документи са защитени с Квалифициран електронен подпис (QES), 
                  правно еквивалентен на ръкописен подпис. QERDS гарантира доставка с пълна проследимост.
                </p>
                <div className="flex gap-2 pt-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    QES - Квалифициран подпис
                  </Badge>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    QERDS - Гарантирана доставка
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Documents;
