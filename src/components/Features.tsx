import { Leaf, Award, Truck, ShieldCheck, Heart, Clock, Check } from 'lucide-react';
import { useSiteContent } from '@/site-content';

const ICON_MAP: Record<string, any> = {
  Leaf,
  Award,
  Truck,
  ShieldCheck,
  Heart,
  Clock,
  Check,
};

export default function Features() {
  const content = useSiteContent();
  const features = content.features || [];

  return (
    <section className="bg-cream-100/90 border-b border-brand-200/50">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-4 divide-x divide-brand-200/70">
          {features.map((f, i) => {
            const Icon = ICON_MAP[f.iconName] || Leaf;
            return (
              <div
                key={f.id || i}
                className="flex flex-col items-center justify-center text-center px-1 sm:px-3 py-1 group"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-brand-800 group-hover:text-forest-700 transition-colors mb-1 sm:mb-1.5">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-brand-950 leading-tight">
                  {f.title}
                </div>
                <div className="text-[10px] sm:text-[11px] font-medium text-brand-600/90 leading-tight">
                  {f.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
