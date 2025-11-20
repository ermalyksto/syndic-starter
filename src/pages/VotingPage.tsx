import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Download, Calendar, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AgendaItem {
  id: string;
  description: string;
  votingOption?: 'yes' | 'no';
  customVotingOptions?: string[];
  supportingDocuments?: { name: string; url: string }[];
}

interface Assembly {
  id: string;
  title: string;
  date: string;
  time: string;
  buildingLocation: string;
  agendaItems: AgendaItem[];
}

const VotingPage = () => {
  const { assemblyID } = useParams<{ assemblyID: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assembly, setAssembly] = useState<Assembly | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    const fetchAssembly = async () => {
      try {
        const response = await fetch(`/api/assemblies/${assemblyID}`);
        if (!response.ok) {
          throw new Error('Assembly not found');
        }
        const data = await response.json();
        console.log("Assembly", data)
        setAssembly(data);
      } catch (error) {
        toast({
          title: 'Грешка',
          description: 'Не може да се зареди събранието',
          variant: 'destructive',
        });
        navigate('/assemblies');
      } finally {
        setIsLoading(false);
      }
    };

    if (assemblyID) {
      fetchAssembly();
    }
  }, [assemblyID, navigate, toast]);

  const handleVoteChange = (itemId: string, value: string) => {
    // Prevent changes while submitting
    if (isSubmitting) return;
    setVotes((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleSubmitVote = async () => {
    // Check if all items have been voted on
    const allItemsVoted = assembly?.agendaItems.every((item) => votes[item.id]);
    
    if (!allItemsVoted) {
      toast({
        title: 'Внимание',
        description: 'Моля, гласувайте по всички точки от дневния ред',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/assemblies/${assemblyID}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ votes }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }

      // Show success dialog
      setShowSuccessDialog(true);
    } catch (error) {
      toast({
        title: 'Грешка',
        description: 'Не можахме да регистрираме вашия глас. Моля, опитайте отново.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate('/assemblies');
  };

  const getVotingOptions = (item: AgendaItem): string[] => {
    if (item.customVotingOptions) {
      return item.customVotingOptions;
    }
    return item.votingOption === 'yes' ? ['Да', 'Не', 'Въздържал се'] : [];
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Зареждане...</p>
        </div>
      </MainLayout>
    );
  }

  if (!assembly) {
    return null;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{assembly.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {assembly.date} в {assembly.time}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {assembly.buildingLocation}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Дневен ред</h2>
          
          {assembly.agendaItems.map((item, index) => {
            const votingOptions = getVotingOptions(item);
            
            return (
              <Card key={item.id} className={`shadow-card ${isSubmitting ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Точка {index + 1}: {item.description}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {item.supportingDocuments && item.supportingDocuments.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground">
                        Приложени документи:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {item.supportingDocuments.map((doc, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            disabled={isSubmitting}
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                            {doc.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {votingOptions.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">
                        Изберете вашия вот:
                      </h4>
                      <RadioGroup
                        value={votes[item.id]}
                        onValueChange={(value) => handleVoteChange(item.id, value)}
                        disabled={isSubmitting}
                      >
                        {votingOptions.map((option, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <RadioGroupItem 
                              value={option} 
                              id={`${item.id}-${idx}`}
                              disabled={isSubmitting}
                            />
                            <Label
                              htmlFor={`${item.id}-${idx}`}
                              className={`cursor-pointer ${isSubmitting ? 'cursor-not-allowed' : ''}`}
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-end gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/assemblies')}
            disabled={isSubmitting}
          >
            Отказ
          </Button>
          <Button
            onClick={handleSubmitVote}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-primary to-accent min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Изпращане...
              </>
            ) : (
              'Гласувай'
            )}
          </Button>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Успешно гласуване</DialogTitle>
            <DialogDescription>
              Благодарим ви за вашия глас!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSuccessDialogClose}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default VotingPage;