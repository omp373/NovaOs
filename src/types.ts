export interface AppDefinition {
  id: string;
  name: string;
  icon: any;
  color: string;
  size?: 'small' | 'medium' | 'large' | 'wide';
  notifications?: number;
}
