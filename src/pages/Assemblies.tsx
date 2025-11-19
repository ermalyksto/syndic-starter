import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import signatureImage from "@/assets/signature-icon.jpg";
import { mockApi } from "@/services/mockApi";
import { AssemblyCard } from "./AssemblyCard";

const Assemblies = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [assemblies, setAssemblies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssemblies = async () => {
      try {
        // const response = await fetch("/api/assemblies");
        const data = await mockApi.getAssemblies(user.email);

        // const data = await response.json();
        // const data = await response;
        setAssemblies(data);
      } catch (error) {
        console.error("Failed to fetch assemblies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssemblies();
  }, []);

  const handleNavigateToVote = (assemblyId: string) => {
    navigate(`/assemblies/${assemblyId}/vote`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Общи събрания
            </h1>
            <p className="text-muted-foreground mt-1">
              Управление на AGM с дигитални подписи и гласуване
            </p>
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
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Напълно дигитално събрание
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <span className="font-medium">
                      Квалифициран електронен подпис (QES)
                    </span>
                    <p className="text-sm text-muted-foreground">
                      Правно еквивалентен на ръкописен подпис
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <span className="font-medium">Система за пълномощни</span>
                    <p className="text-sm text-muted-foreground">
                      Дигитално делегиране с верификация
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <span className="font-medium">QERDS комуникация</span>
                    <p className="text-sm text-muted-foreground">
                      Гарантирана доставка на покани и протоколи
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Assemblies List */}
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Зареждане...</p>
          ) : assemblies.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Няма налични събрания
            </p>
          ) : (
            assemblies.map((assembly) => (
              <AssemblyCard
                key={assembly.id}
                assembly={assembly}
                showManageButtons={false}
                userRole={user?.role}
                onNavigate={handleNavigateToVote}
              />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Assemblies;
