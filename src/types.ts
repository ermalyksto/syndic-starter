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
  propertyId: string;
}
export interface AgendaItem {
  id: string;
  description: string;
  customVotingOptions?: string [];
  votingOption?: "yes" | "no" | "abstained";
  files?: File[];
}
export enum AssemblyStatus{
  DRAFT = "draft",
  ACTIVE = "active",
  COMPLETED = "completed"
}

export enum UserRole{
  SYNDIC = "ROLE_SYNDIC",
  COOWNER = "ROLE_CO_OWNER"
}