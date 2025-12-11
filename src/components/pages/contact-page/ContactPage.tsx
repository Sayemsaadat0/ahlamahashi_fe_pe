import { Mail, Phone, MapPin, Clock, MessageCircle, Leaf } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { ContactForm } from "./ContactForm"

const quickDetails = [
  {
    icon: Phone,
    title: "Direct line",
    description: "+880 1234-567890",
    helper: "Daily • 9 AM – 11 PM",
  },
  {
    icon: Mail,
    title: "Say hello",
    description: "hello@foodapp.com",
    helper: "We respond within 6 hours",
  },
  {
    icon: MapPin,
    title: "Visit the kitchen",
    description: "House 12, Road 4, Mirpur 10, Dhaka",
    helper: "Open 7 days a week",
  },
]

const ContactPage = () => {
  return (
    <main className="bg-white min-h-screen pt-16 md:pt-24">
      {/* Section 1 — Hero */}
      <section className="ah-container mx-auto space-y-12 md:space-y-16">
        <header>
          <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-semibold tracking-[0.2em] uppercase text-[#25331d]">
            Contact us
          </h1>
        </header>

        <div className="grid gap-10 md:gap-14 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#637050]">Get in touch</p>
            <h2 className="text-2xl md:text-[28px] font-semibold leading-relaxed text-[#242f1b]">
              Let&apos;s plan your next delicious moment together.
            </h2>
            <p className="text-sm md:text-base text-[#38452b] leading-relaxed">
              Share the occasion, guests, or cravings—we&apos;ll reply with tailored recommendations, timelines, and pricing so you can relax into the planning. Whether it&apos;s a quiet dinner for two or a celebration for fifty, we&apos;re here to make it seamless.
            </p>
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#637050]"></div>
                <p className="text-sm text-[#38452b]">Reservations & table bookings</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#637050]"></div>
                <p className="text-sm text-[#38452b]">Catering & event planning</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#637050]"></div>
                <p className="text-sm text-[#38452b]">Custom menu consultations</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="overflow-hidden rounded-[32px] bg-[#d7d0bf]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero.jpg"
                alt="Our kitchen space"
                className="w-full h-full object-cover max-h-[420px]"
              />
            </div>
            <div className="rounded-[28px] border border-[#c5bea7] bg-white shadow-[0_10px_20px_rgba(37,51,29,0.05)] p-6 space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-[#637050]">Response time</p>
              <p className="text-sm md:text-base text-[#38452b] leading-relaxed">
                We typically respond within 4–6 hours during business days. For urgent requests, call our direct line for immediate assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 — Contact Form */}
      <section className="py-16 mt-10 bg-gray-50">
        <div className="ah-container mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-start">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-a-green-600">We’re listening</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Tell us what you’re dreaming up</h2>
            <p className="text-gray-600 leading-relaxed">
              From business lunches and family celebrations to bespoke tasting menus, we treat every request like a hosted experience.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <SupportTag icon={Clock} label="Avg. response" value="Under 6 hours" />
              <SupportTag icon={MessageCircle} label="Live support" value="9 AM – 11 PM" />
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-gray-300 px-4 py-3">
              <Leaf className="text-a-green-600" size={18} />
              <p className="text-sm text-gray-600">
                Need menu ideas? Attach inspiration and we’ll curate seasonal options.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Section 3 — Quick info */}
      <section className="py-16">
        <div className="ah-container mx-auto">
          <div className="text-center mb-10 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-a-green-600">Need a fast answer?</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Reach us the way that works for you</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Drop in, call ahead, or send details for a custom quote. We’ll guide you through setups, staffing, and timelines so the day unfolds smoothly.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickDetails.map((detail) => (
              <QuickDetailCard key={detail.title} {...detail} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default ContactPage

type SupportTagProps = {
  icon: LucideIcon
  label: string
  value: string
}

function SupportTag({ icon: Icon, label, value }: SupportTagProps) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 w-fit">
      <div className="w-10 h-10 rounded-xl bg-white text-a-green-600 flex items-center justify-center shadow-sm">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

type QuickDetailProps = {
  icon: LucideIcon
  title: string
  description: string
  helper: string
}

function QuickDetailCard({ icon: Icon, title, description, helper }: QuickDetailProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow space-y-3">
      <div className="w-10 h-10 rounded-xl bg-a-green-600/10 text-a-green-600 flex items-center justify-center">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-700 font-medium">{description}</p>
      <p className="text-xs text-gray-500">{helper}</p>
    </div>
  )
}

