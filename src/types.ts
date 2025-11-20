export interface Assembly {
  id: string;
  title: string;
  status: AssemblyStatus;
  date: string;
  time: string;
  participantsCount: number;
  delegatedOwnersCount: number;
  buildingLocation: string;
  agendaItems: AgendaItem[];
  voted?: boolean;
}
interface AgendaItem {
  id: string;
  description: string;
  customVotingOptions?: string [];
}
export enum AssemblyStatus{
  DRAFT = "draft",
  ACTIVE = "active",
  COMPLETED = "completed"
}

export enum UserRole{
  SYNDIC = "syndic",
  COOWNER = "co-owner"
}