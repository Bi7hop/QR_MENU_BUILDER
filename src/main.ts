import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Alle Lucide Icons global importieren und registrieren
import { 
  LucideAngularModule,
  QrCode, 
  Edit3, 
  Eye, 
  Settings, 
  Coffee, 
  Paintbrush,
  Upload,
  X,
  Palette,
  Type,
  Check,
  ArrowRight
} from 'lucide-angular';

// Icons global registrieren VOR dem Bootstrap
LucideAngularModule.pick({
  QrCode,
  Edit3,
  Eye,
  Settings,
  Coffee,
  Paintbrush,
  Upload,
  X,
  Palette,
  Type,
  Check,
  ArrowRight
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));