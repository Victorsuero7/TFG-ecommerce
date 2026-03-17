export type UserRole = 'ADMIN' | 'ROOT' | 'USER' | 'VIEW_ONLY';

export interface User {
  id?: number;
  name: string;
  email: string;
  lastName?: string;
  phoneNumber?: string;
  birthDate?: string | Date | null;
  role?: UserRole | null;
}