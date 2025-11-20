export interface Assembly {
  id: string;
  title: string;
  status: string;
  date: string;
  time: string;
  participantsCount: number;
  delegatedOwnersCount: number;
  buildingLocation: string;
  agendaItems: AgendaItem[];
}
interface AgendaItem {
  id: string;
  description: string;
  customVotingOptions?: string [];
}