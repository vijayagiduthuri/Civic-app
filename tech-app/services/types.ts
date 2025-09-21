// types.ts
export type Issue = {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  priority: string;
  assignedAt: string; // ISO date string
  completedAt: string; 
  status: string;
};

  // Proper TypeScript interface in issueDetails.tsx
  export interface IssueData {
    id: string;
    title: string;
    description: string;
    created_at: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    assigned_at: string;
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
    user: {
      name: string;
      phone: string;
      avatar?: string;
      role: string;
    };
    images: string[];
    latitude: number;
    longitude: number;
    category: string;
    estimatedTime?: string;
    address?: string;
  }