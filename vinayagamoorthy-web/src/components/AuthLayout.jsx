import ParchmentCard from './ParchmentCard';
import SiteFooter from './SiteFooter';

export default function AuthLayout({ children, subtitle }) {
  return (
    <div className="app-shell flex items-center justify-center px-4 py-10">
      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="Vinayagamoorthy Jothidam"
            className="w-24 h-24 rounded-full border-2 border-gold shadow-lg mb-3"
          />
          <h1 className="brand-wordmark text-3xl text-center">VINAYAGAMOORTHY</h1>
          <p className="gold-heading text-sm tracking-[0.3em] mt-1">JOTHIDAM</p>
          {subtitle && (
            <p className="font-manuscript italic text-gold-bright text-sm mt-2 text-center opacity-80">
              {subtitle}
            </p>
          )}
        </div>

        <ParchmentCard>{children}</ParchmentCard>

        <SiteFooter className="mt-4 !py-3" />
      </div>
    </div>
  );
}
