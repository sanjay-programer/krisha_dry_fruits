import { ArrowRight, Leaf } from 'lucide-react';
import { useSiteContent } from '@/site-content';

interface HeroProps {
  onShopNow: () => void;
  onLearnMore?: () => void;
}

export default function Hero({ onShopNow }: HeroProps) {
  const content = useSiteContent();
  const { hero } = content;

  return (
    <section className="relative overflow-hidden bg-cream-100 border-b border-brand-200/40">
      {/* Background Photography Container */}
      <div className="relative min-h-[470px] sm:min-h-[520px] lg:min-h-[560px] flex items-center">
        {/* Background Image: Positioned to prominently showcase the overflowing cashew bowl on right */}
        <div className="absolute inset-0 z-0">
          <img
            src={hero.image || '/hero_cashew_bowl.jpg'}
            alt="Hand-selected whole premium cashews in rustic wooden bowl with fresh leaves"
            className="w-full h-full object-cover object-[78%_center] sm:object-[70%_center] lg:object-right filter contrast-[1.02]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/hero_cashew_bowl.jpg';
            }}
          />
          {/* Directional Vignette Gradient Overlay ensuring high text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-cream-100/95 via-cream-100/85 sm:via-cream-100/70 to-transparent lg:w-3/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-cream-100/60 via-transparent to-cream-50/20 sm:hidden" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
          <div className="max-w-[290px] sm:max-w-md lg:max-w-lg">

            {/* Pill Badge */}
            {hero.badge && (
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur-md px-3 py-1 mb-4 sm:mb-5 border border-brand-200/70 shadow-sm animate-fade-in">
                <span className="w-4 h-4 rounded-full bg-forest-600/15 flex items-center justify-center text-forest-700">
                  <Leaf className="w-2.5 h-2.5 text-forest-700" />
                </span>
                <span className="text-[10.5px] sm:text-xs font-semibold text-brand-900 tracking-wide">
                  {hero.badge}
                </span>
              </div>
            )}

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-brand-950 tracking-tight leading-[1.12] mb-3 sm:mb-4 animate-fade-in-up">
              {hero.titleLine1} <br />
              {hero.titleLine2} <br />
              <span className="italic font-normal text-brand-800">{hero.titleHighlight}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-brand-800/90 leading-relaxed font-normal mb-6 sm:mb-8 animate-fade-in-up max-w-[280px] sm:max-w-sm">
              {hero.subtitle}
            </p>

            {/* Action CTA */}
            <div className="flex items-center gap-3 animate-fade-in-up">
              <button
                onClick={onShopNow}
                className="inline-flex items-center gap-2 rounded-full bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-cream-50 text-xs sm:text-sm font-semibold px-6 sm:px-7 py-3 sm:py-3.5 shadow-md shadow-brand-950/15 transition-all group"
              >
                <span>{hero.buttonText || 'Shop Now'}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Slider Indicator Dots at bottom */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-800" />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400/50" />
        </div>
      </div>
    </section>
  );
}
