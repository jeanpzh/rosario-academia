export interface userProfile {
  first_name: string;
  paternal_last_name: string;
  maternal_last_name: string;
  phone: string;
  level?: string;
  shift?: string;
  avatar_url?: string;
  birth_date?: string;
  dni?: string;
  weight?: number;
  height?: number;
}
export enum LevelToSpanish {
  beginner = "Principiante",
  intermediate = "Intermedio",
  advanced = "Avanzado",
}
export interface ProfileCardProps {
  userProfile: {
    first_name: string;
    paternal_last_name: string;
    maternal_last_name: string;
    avatar_url?: string;
    weight?: number;
    height?: number;
    dni?: string;
    birth_date?: string;
  };
  athlete: any;
  isEditing: boolean;
  onAvatarClick?: () => void;
}

export interface AthleteProfile {
  first_name: string;
  paternal_last_name: string;
  maternal_last_name: string;
}

export interface Athlete {
  profile: AthleteProfile;
  level: keyof typeof LevelToSpanish;
}
