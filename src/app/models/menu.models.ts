export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  featured: boolean;
}

export interface MenuCategory {
  id: number;
  category: string;
  items: MenuItem[];
}

export interface Restaurant {
  name: string;
  description: string;
  logo?: string;
  theme: string;
  customColors: {
    primary: string;
    secondary: string;
  };
  font: string;
}

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  text: string;
  card: string;
}