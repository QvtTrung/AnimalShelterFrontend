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
  status: "pending" | "confirming" | "confirmed" | "completed" | "cancelled";
  pet_id?: string | IPet;  // Can be ID string or populated pet object
  user_id?: string | IUser;  // Can be ID string or populated user object
  approval_date?: string;
  appointment_date?: string;
  notes?: string;
  date_created?: string;
  date_updated?: string;
  confirmation_sent_at?: string;
  confirmation_expires_at?: string;
  pets?: IPet;  // Legacy field name for backwards compatibility
  user?: IUser;  // Legacy field name for backwards compatibility
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
  coordinates?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface IRescueParticipant {
  id: string;
  rescue_id: string;
  users_id: string;
  role: "leader" | "member";
  date_created?: string;
  date_updated?: string;
  user?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
  };
}

export interface IRescueReport {
  id: string;
  rescue_id: string;
  reports_id: string;  // ← Change from `report_id` to `reports_id`
  status: "success" | "in_progress" | "cancelled";
  note?: string;
  date_created?: string;
  date_updated?: string;
  report?: {
    id: string;
    title: string;
    status: string;
    urgency_level: string;
    location: string;
    description: string;
    coordinates?: string | { type: "Point"; coordinates: [number, number] };
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
  participants?: IRescueParticipant[];
  reports?: IRescueReport[];
}
