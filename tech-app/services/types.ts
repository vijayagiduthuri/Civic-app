export interface Location {
  latitude?: number;
  longitude?: number;
  address: string;
}

export interface Customer {
  name?: string;
  phone?: string;
  email?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  location: Location;
  customer?: Customer;           // Optional, only for active issues
  priority: "High" | "Medium" | "Low" | string;
  assignedAt: string;
  completedAt?: string;          // Optional, only for completed issues
  status: "assigned" | "completed" | string;
  category?: string;             // Optional
}
