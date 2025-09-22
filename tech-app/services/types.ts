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
