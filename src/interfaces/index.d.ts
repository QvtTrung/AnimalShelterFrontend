export interface IPet {
  id: string;
  name?: string;
  species?: string;
  description?: string;
  age?: number;
  age_unit?: "months" | "years";
  size?: "small" | "medium" | "large";
  health_status?: "healthy" | "needs_attention" | "critical" | "deceased";
  gender?: string;
  status: "available" | "pending" | "adopted" | "archived";
  linked_report?: string;
  date_created?: string;
  date_updated?: string;
}

export interface IUser {
  id: string;
  email: string;
  password?: string;
  status: "active" | "inactive";
  first_name?: string;
  last_name?: string;
  directus_user_id?: string;
  phone_number?: string;
  avatar?: string;
  address?: string;
  role?: string;
  role_name?: string;
  date_created?: string;
  date_updated?: string;
}

export interface IAdoption {
  id: string;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  pet_id?: string;
  user_id?: string;
  approval_date?: string;
  notes?: string;
  date_created?: string;
  date_updated?: string;
  pets?: IPet;
  user?: IUser;
}

export interface IReport {
  id: string;
  status: "pending" | "assigned" | "resolved";
  species: string;
  description: string;
  location: string;
  title: string;
  type: "abuse" | "abandonment" | "injured_animal" | "other";
  urgency_level: "low" | "medium" | "high" | "critical";
  date_created?: string;
  date_updated?: string;
  user_created?: string;
  user_created_user?: IUser;
  coordinates?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface IRescue {
  id: string;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  required_participants?: number;
  title?: string;
  description?: string;
  date_created?: string;
  date_updated?: string;
}
