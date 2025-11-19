import { User } from "@/store/slices/authSlice";

export type AssemblyStatus = "draft" | "active" | "completed";

export interface AgendaItem {
  id: string;
  description: string;
  votingOption?: "yes" | "no" | "abstained";
  customVotingOptions?: string[];
  files?: File[];
}

export interface Assembly {
  id: string;
  title: string;
  status: AssemblyStatus;
  date: string;
  time: string;
  participantsCount: number;
  delegatedOwnersCount: number;
  buildingLocation?: string;
  agendaItems?: AgendaItem[];
}

export interface AssemblyStats {
  totalAssemblies: number;
  activeAssemblies: number;
  totalParticipants: number;
  averageAttendance: string;
}

// Property types
export interface CoOwner {
  id: string;
  email: string;
  weight: number;
}

export interface Property {
  id: string;
  name: string;
  location: string;
  coOwners: CoOwner[];
}

// API base URL - will use /api for development with setupProxy
const API_BASE_URL = "/api";

const handleApiError = (error: unknown) => {
  if (error instanceof Response) {
    throw new Error(`API Error: ${error.statusText}`);
  }
  throw error;
};

export const mockApi = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Невалиден имейл или парола");
      }

      return await response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  loginWithEmail: async (
    email: string
  ): Promise<{ qrUrl: string; user: User }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Невалиден имейл");
      }

      return await response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  getAssemblies: async (userId: string): Promise<Assembly[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/assemblies/${userId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assemblies");
      }

      return await response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  getAssemblyStats: async (): Promise<AssemblyStats> => {
    try {
      const response = await fetch(`${API_BASE_URL}/assemblies/stats`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assembly stats");
      }

      return await response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  createAssembly: async (data: {
    title: string;
    buildingLocation: string;
    date: string;
    time: string;
    agendaItems: AgendaItem[];
  }): Promise<Assembly> => {
    try {
      const response = await fetch(`${API_BASE_URL}/assemblies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create assembly");
      }

      return await response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  updateAssembly: async (
    id: string,
    data: {
      title: string;
      buildingLocation: string;
      date: string;
      time: string;
      agendaItems: AgendaItem[];
    }
  ): Promise<Assembly> => {
    try {
      const response = await fetch(`${API_BASE_URL}/assemblies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update assembly");
      }

      return await response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  deleteAssembly: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/assemblies/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete assembly");
      }
    } catch (error) {
      handleApiError(error);
    }
  },

  // Property management
  getProperties: async (userId: string): Promise<Property[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${userId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      return await response.json();
    } catch (error) {
      handleApiError(error);
    }
  },

  createProperty: async (data: {
    name: string;
    location: string;
    coOwners: CoOwner[];
  }): Promise<Property> => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create property");
      }

      return await response.json();
    } catch (error) {
      handleApiError(error);
    }
  },
};
