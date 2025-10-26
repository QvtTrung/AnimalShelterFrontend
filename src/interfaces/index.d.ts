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
  species?: string;
  description?: string;
  reporter?: string;
  location?: string;
  title?: string;
  type?: string;
  urgency_level?: string;
  date_created?: string;
  date_updated?: string;
  reporter_user?: IUser;
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
