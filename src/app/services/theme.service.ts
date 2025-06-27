import { Injectable, signal } from '@angular/core';
import { Theme } from '../models/menu.models';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themes: Record<string, Theme> = {
    neon: {
      name: 'Neon Cyberpunk',
      primary: '#00ff88',
      secondary: '#ff0080',
      accent: '#ffff00',
      bg: 'from-gray-900 via-purple-900 to-violet-900',
      text: 'text-white',
      card: 'bg-gray-800/50 border-green-400/30'
    },
    sunset: {
      name: 'Sonnenuntergang',
      primary: '#ff6b35',
      secondary: '#f7931e',
      accent: '#ffb627',
      bg: 'from-orange-400 via-red-500 to-pink-500',
      text: 'text-white',
      card: 'bg-white/10 border-orange-300/30'
    },
    ocean: {
      name: 'Tiefer Ozean',
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#10b981',
      bg: 'from-slate-900 via-blue-900 to-cyan-900',
      text: 'text-white',
      card: 'bg-slate-800/50 border-cyan-400/30'
    },
    forest: {
      name: 'Dunkler Wald',
      primary: '#22c55e',
      secondary: '#16a34a',
      accent: '#84cc16',
      bg: 'from-green-900 via-emerald-900 to-teal-900',
      text: 'text-white',
      card: 'bg-green-800/50 border-green-400/30'
    },
    platinum: {
      name: 'Platinum Elite',
      primary: '#e5e7eb',
      secondary: '#9ca3af',
      accent: '#d1d5db',
      bg: 'from-slate-800 via-gray-900 to-zinc-900',
      text: 'text-gray-100',
      card: 'bg-slate-800/60 border-gray-400/20'
    },
    minimal: {
      name: 'Minimal Schwarz',
      primary: '#000000',
      secondary: '#404040',
      accent: '#808080',
      bg: 'from-gray-50 to-gray-100',
      text: 'text-gray-900',
      card: 'bg-white border-gray-300/50'
    }
  };

  currentTheme = signal<string>('neon');

  getThemes() {
    return this.themes;
  }

  getCurrentTheme(): Theme {
    const themeName = this.currentTheme();
    return this.themes[themeName];
  }

  setTheme(themeName: string) {
    if (this.themes[themeName]) {
      this.currentTheme.set(themeName);
    }
  }
}