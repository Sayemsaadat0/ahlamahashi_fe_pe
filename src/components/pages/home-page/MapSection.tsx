'use client'
import { useGetcityList } from "@/hooks/city.hooks"
import { Phone, Mail, Clock } from "lucide-react"
import type { ReactNode } from "react"




const badgeStyles: Record<string, string> = {
  primary: "bg-emerald-100 text-emerald-800",
  signature: "bg-lime-100 text-lime-800",
  extended: "bg-sky-100 text-sky-800",
  classic: "bg-amber-100 text-amber-800",
}

const quickFacts = [
  {
    icon: <Clock size={18} />,
    title: "25 min average",
    subtitle: "Door to door delivery window",
  },
  {
    icon: <Phone size={18} />,
    title: "+880 1234-567890",
    subtitle: "Concierge support, 9 AM – 11 PM",
  },
  {
    icon: <Mail size={18} />,
    title: "hello@aihlaa.mahashi",
    subtitle: "Group orders & collaborations",
  },
]

const MapSection = () => {

  const { data } = useGetcityList()
  return (
    <section className="py-16 md:py-20 `bg-(--background)`">
      <div className="ah-container mx-auto">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#637050]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#637050]"></span>
                Service radius
              </p>
              <h2 className="text-3xl sm:text-[40px] font-semibold text-[#1f2d17] leading-tight">
                A colourful network of neighbourhoods we reach every day.
              </h2>
              <p className="text-sm sm:text-base text-[#38452b] leading-relaxed max-w-xl">
                Morning coffee runs, late-night cravings, or weekend celebrations—our riders move through Dhaka with warmth
                and speed. Tap a badge to view highlights from each area.
              </p>
            </div>

            <div className="rounded-[28px] border border-[#c5bea7] bg-white shadow-[0_20px_35px_rgba(37,51,29,0.08)] p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#637050]">Neighbourhood list</p>
                  <h3 className="text-lg font-semibold text-[#25331d]">{data?.data?.cities.length} active drops</h3>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {data?.data?.cities && data?.data?.cities.map((area, index) => {
                  const styleKeys = Object.keys(badgeStyles);
                  const styleKey = styleKeys[index % styleKeys.length];
                  return (
                    <span
                      key={area.name}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] shadow-sm ${badgeStyles[styleKey]}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                      {area.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <div className="rounded-[32px] border border-[#c5bea7] bg-white shadow-[0_18px_35px_rgba(37,51,29,0.08)] p-6 md:p-8 space-y-6">
              <p className="text-xs uppercase tracking-[0.35em] text-[#637050]">Logistics team</p>
              <p className="text-sm md:text-base text-[#38452b] leading-relaxed">
                Planning an event or looking to add your block? We map routes at sunrise, track traffic patterns, and keep
                guest notes so every visit feels familiar.
              </p>
              <div className="grid gap-4">
                {quickFacts.map((fact) => (
                  <FactRow key={fact.title} icon={fact.icon} title={fact.title} subtitle={fact.subtitle} />
                ))}
              </div>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f2d17] border-b border-current pb-1 hover:text-[#0f160a]"
              >
                Speak with dispatch
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="rounded-[28px] border border-dashed border-[#cfc8b4] bg-[#f8f5ea] shadow-[0_10px_20px_rgba(37,51,29,0.05)] p-6 space-y-4 text-sm text-[#38452b]">
              <p className="text-xs uppercase tracking-[0.35em] text-[#637050]">Coming soon</p>
              <p>
                We’re charting routes through Baridhara, Bashundhara, and Uttara Sector 13. Share your location and we’ll
                prioritise your drop.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

type FactRowProps = {
  icon: ReactNode
  title: string
  subtitle: string
}

function FactRow({ icon, title, subtitle }: FactRowProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#efe6cc] text-[#1f2d17] shadow-sm">
        {icon}
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-[#25331d]">{title}</p>
        <p className="text-xs text-[#4a5a33] leading-relaxed">{subtitle}</p>
      </div>
    </div>
  )
}

export default MapSection
