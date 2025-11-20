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
import { Assembly } from "@/types";
import { useTranslation } from "react-i18next";

const Assemblies = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAppSelector((state) => state.auth);
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssemblies = async () => {
    setIsLoading(true);
    try {
      // const response = await fetch("/api/assemblies");
      const data = await mockApi.getAssemblies(user.id);

      // const data = await response.json();
      // const data = await response;
      setAssemblies(data);
    } catch (error) {
      console.error("Failed to fetch assemblies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssemblies();
  }, [user]);

  const handleNavigateToVote = (assemblyId: string) => {
    navigate(`/assemblies/${assemblyId}/vote`);
  };

  const handleRefresh = () => {
    fetchAssemblies();
  };

  return (
    <MainLayout>
      <div className="space-y-6">

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
                {t("assemblies.digitalAssembly")}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <span className="font-medium">
                      {t("assemblies.qesSignature")}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {t("assemblies.qesDescription")}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <span className="font-medium">{t("assemblies.proxySystem")}</span>
                    <p className="text-sm text-muted-foreground">
                      {t("assemblies.proxyDescription")}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <span className="font-medium">{t("assemblies.qerdsCommunication")}</span>
                    <p className="text-sm text-muted-foreground">
                      {t("assemblies.qerdsDescription")}
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
            <p className="text-center text-muted-foreground">{t("common.loading")}</p>
          ) : assemblies.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {t("assemblies.noAssemblies")}
            </p>
          ) : (
            assemblies.map((assembly) => (
              <AssemblyCard
                key={assembly.id}
                assembly={assembly}
                userRole={user?.role}
                onNavigate={handleNavigateToVote}
                onRefresh={handleRefresh}
              />
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Assemblies;