import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, Clock, Download } from "lucide-react";

const Finances = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Финанси</h1>
            <p className="text-muted-foreground mt-1">Бюджет, такси и финансови отчети</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent">
            <Download className="h-4 w-4 mr-2" />
            Изтегли отчет
          </Button>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Общ приход</p>
                  <p className="text-3xl font-bold text-foreground mt-1">€145,230</p>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
              <p className="text-sm text-success">↑ +15.3% спрямо миналата година</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Разходи</p>
                  <p className="text-3xl font-bold text-foreground mt-1">€98,450</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-warning" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Планирани за Q4: €25,000</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Неплатени такси</p>
                  <p className="text-3xl font-bold text-foreground mt-1">€12,340</p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <Clock className="h-6 w-6 text-destructive" />
                </div>
              </div>
              <p className="text-sm text-destructive">8 забавени плащания</p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Breakdown */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Бюджет 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: "Поддръжка сгради", planned: 45000, actual: 42300, color: "bg-primary" },
                { category: "Комунални услуги", planned: 38000, actual: 38200, color: "bg-accent" },
                { category: "Административни разходи", planned: 15000, actual: 12500, color: "bg-secondary" },
                { category: "Ремонти и подобрения", planned: 30000, actual: 18450, color: "bg-success" },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{item.category}</span>
                    <span className="text-muted-foreground">
                      €{item.actual.toLocaleString()} / €{item.planned.toLocaleString()}
                    </span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`absolute left-0 top-0 h-full ${item.color} transition-all`}
                      style={{ width: `${(item.actual / item.planned) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Последни транзакции</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "18 Дек 2024", description: "Месечна такса - Ап. А-12", amount: 250, type: "income" },
                { date: "17 Дек 2024", description: "Фактура - Чистене", amount: -450, type: "expense" },
                { date: "15 Дек 2024", description: "Месечна такса - Ап. Б-05", amount: 280, type: "income" },
                { date: "14 Дек 2024", description: "Ремонт асансьор", amount: -1200, type: "expense" },
                { date: "12 Дек 2024", description: "Месечна такса - Ап. В-18", amount: 260, type: "income" },
              ].map((transaction, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${transaction.type === "income" ? "bg-success/10" : "bg-destructive/10"}`}>
                      <DollarSign className={`h-4 w-4 ${transaction.type === "income" ? "text-success" : "text-destructive"}`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={transaction.type === "income" ? "default" : "secondary"}
                    className={transaction.type === "income" ? "bg-success text-success-foreground" : ""}
                  >
                    {transaction.amount > 0 ? "+" : ""}€{Math.abs(transaction.amount)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Finances;
