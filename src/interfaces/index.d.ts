export interface ICategory {
  id: number;
  title: string;
}

export interface IPost {
  id: number;
  title: string;
  content: string;
  status: "published" | "draft" | "rejected";
  category: { id: number };
}

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
