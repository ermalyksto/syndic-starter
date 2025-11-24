import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, FileText, Vote, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-dashboard.jpg";
import { Assembly } from "@/types";

// interface AgendaItem {
//   id: string;
//   description: string;
//   votingOption?: string;
//   customVotingOptions?: string[];
// }

// interface Assembly {
//   id: string;
//   title: string;
//   status: string;
//   voted: boolean;
//   date: string;
//   time: string;
//   participantsCount: number;
//   delegatedOwnersCount: number;
//   buildingLocation: string;
//   propertyId: string;
//   agendaItems: AgendaItem[];
// }

interface InvitationData {
  id: string;
  assembly: Assembly;
  senderName: string;
  createdAt: string;
  status: string;
}

const Invitation = () => {
  const { invitationId } = useParams<{ invitationId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/v1/invitations/${invitationId}`);
        const data = await response.json();
        
        if (!data.success) {
          setError(data.error || t('invitation.loadError'));
          return;
        }
        
        setInvitation(data.data);
      } catch (err) {
        console.error("Error fetching invitation:", err);
        setError(t('invitation.loadError'));
        toast({
          variant: "destructive",
          title: t('common.error'),
          description: t('invitation.loadError'),
        });
      } finally {
        setLoading(false);
      }
    };

    if (invitationId) {
      fetchInvitation();
    }
  }, [invitationId, t, toast]);

  const handleVoteClick = () => {
    if (invitation?.assembly.id) {
      navigate(`/assemblies/${invitation.assembly.id}/vote`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-lg text-foreground font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-6 w-6" />
              {t('common.error')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground mb-4">{error || t('invitation.notFound')}</p>
            <Button 
              onClick={() => navigate('/login')} 
              className="w-full bg-gradient-to-br from-primary to-accent"
            >
              {t('invitation.goToLogin')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { assembly, senderName } = invitation;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-6">
        {/* Hero Banner */}
        <div className="relative h-48 lg:h-64 rounded-2xl overflow-hidden shadow-lg">
          <img 
            src={heroImage} 
            alt="Assembly Invitation" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80 flex items-center">
            <div className="px-4 lg:px-8 text-white w-full">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-4xl font-bold mb-2">{t('invitation.title')}</h1>
                  <p className="text-sm lg:text-lg opacity-95 font-medium">
                    {t('invitation.from')}: {senderName}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className="bg-white/20 text-white border-white/40 backdrop-blur-sm text-base px-4 py-2"
                >
                  {t(`dashboard.status.${assembly.status}`)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Invitation Message */}
        <Card className="shadow-card border-primary/20">
          <CardContent className="pt-6">
            <p className="text-lg text-foreground leading-relaxed">
              {t('invitation.message', { senderName })}
            </p>
          </CardContent>
        </Card>

        {/* Assembly Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assembly Info */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Calendar className="h-5 w-5 text-primary" />
                {t('invitation.assemblyDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{assembly.title}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground/80 mb-1">{t('invitation.location')}</p>
                      <p className="text-base font-medium text-foreground">{assembly.buildingLocation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground/80 mb-1">{t('invitation.dateTime')}</p>
                      <p className="text-base font-medium text-foreground">
                        {new Date(assembly.date).toLocaleDateString()} {t('common.at')} {assembly.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground/80 mb-1">{t('invitation.agendaItems')}</p>
                      <p className="text-base font-medium text-foreground">
                        {assembly.agendaItems.length} {t('assemblies.items')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agenda Items */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="h-5 w-5 text-accent" />
                {t('assemblies.agenda')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assembly.agendaItems.length > 0 ? (
                <div className="space-y-3">
                  {assembly.agendaItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="p-4 bg-muted/50 rounded-lg border border-muted-foreground/10"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">{index + 1}</span>
                        </div>
                        <p className="text-base text-foreground leading-relaxed flex-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {t('createAssembly.noAgendaItems')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Vote Button */}
        <Card className="shadow-card border-primary/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-lg text-foreground font-medium">
                {t('invitation.readyToVote')}
              </p>
              <Button 
                onClick={handleVoteClick}
                size="lg"
                className="w-full md:w-auto px-8 py-6 text-lg font-semibold bg-gradient-to-br from-primary to-accent hover:opacity-90 transition-opacity"
              >
                <Vote className="h-6 w-6 mr-2" />
                {t('invitation.proceedToVote')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Invitation;