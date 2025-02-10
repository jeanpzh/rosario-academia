export type Athlete = {
  id: string;
  avatar_url: string;
  first_name: string;
  paternal_last_name: string;
  maternal_last_name: string;
  birth_date: string;
  dni: string;
  phone: string;
  level: "beginner" | "intermediate" | "advanced";
  status: "approved" | "rejected" | "pending";
};
