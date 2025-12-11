// import { Award, Heart, Leaf, ShieldCheck, Sparkles, Users, Coffee, Clock } from "lucide-react"

const coreHighlights = [
  {
    title: "What we do",
    description:
      "We craft nourishing dining experiences with a personal touch, moving from intimate pop-up suppers to a neighbourhood kitchen that feels like home.",
  },
  {
    title: "Our methods",
    description:
      "Seasonal menus, gentle pacing, and warm hosts keep every visit effortless. We slow-roast, ferment, and finish each plate with thoughtful detail.",
  },
  {
    title: "Accessibility",
    description:
      "Hospitality should be welcoming to everyone. Our pathways, menus, and conversations adapt to what every guest needs to feel comfortable.",
  },
  {
    title: "Our crew",
    description:
      "A passionate kitchen team and floor family who love to share stories, playlists, and the flavours that inspired them.",
    cta: { label: "Meet the team", href: "/contact" },
  },
]

export default function AboutPage() {
  return (
    <main className="text-[#1c2716] py-16 md:py-24">
      <div className="ah-container mx-auto space-y-12 md:space-y-16">
        {/* Title */}
        <header>
          <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-semibold tracking-[0.2em] uppercase text-[#25331d]">
            About us
          </h1>
        </header>

        {/* Hero Image */}
        <div className="w-full overflow-hidden rounded-[32px] bg-[#d7d0bf]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero.jpg"
            alt="Dining space"
            className="w-full h-full object-cover max-h-[420px]"
          />
        </div>

        {/* Introduction Grid */}
        <section className="grid gap-10 md:gap-14 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#637050]">AIHLAA Mahashi</p>
            <h2 className="text-2xl md:text-[28px] font-semibold leading-relaxed text-[#242f1b]">
              Our kitchen was created with a single promise: make every gathering calm, seamless, and memorable.
            </h2>
            <p className="text-sm md:text-base text-[#38452b] leading-relaxed">
              We serve premium comfort food with a generous dose of hospitality. Whether you join us for a quiet lunch or a
              celebratory dinner, we keep every detail considered—from the playlists we cue to the candles we light.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-[#637050]">Roots & neighbourhood</p>
              <p className="text-sm md:text-base text-[#38452b] leading-relaxed">
                Years of service across Dhaka inspired us to design a space that feels like an escape without leaving the
                city. The terrace herbs, open kitchen, and lingering desserts are all invitations to stay a little longer.
              </p>
            </div>
            <div className="overflow-hidden rounded-[28px] bg-[#d7d0bf]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                alt="Our travel vehicle"
                className="w-full h-full object-cover max-h-[260px]"
              />
            </div>
          </div>
        </section>

        {/* Highlight Cards */}
        <section className="grid gap-10 md:grid-cols-2">
          {coreHighlights.map((highlight) => (
            <article key={highlight.title} className="space-y-3 border-t border-[#c9c2af] pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#4f5b3d]">{highlight.title}</h3>
              <p className="text-sm md:text-base text-[#38452b] leading-relaxed">{highlight.description}</p>
              {highlight.cta && (
                <a
                  href={highlight.cta.href}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f2d17] hover:text-[#0f160a] transition"
                >
                  {highlight.cta.label}
                  <span aria-hidden="true">→</span>
                </a>
              )}
            </article>
          ))}
        </section>

        {/* Closing CTA */}
        <section className="border-t border-[#c9c2af] pt-10 md:pt-14">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#637050]">stay in harmony</p>
            <p className="text-lg md:text-xl leading-relaxed text-[#25331d]">
              We make every visit feel like a well-planned escape—full of comfort, discovery, and gentle surprises. Ready to
              plan something special with us?
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f2d17] border-b border-current pb-1 hover:text-[#0f160a]"
            >
              Contact us
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}

// type HighlightProps = {
//   title: string
//   description: string
//   icon: LucideIcon
// }

// function HighlightCard({ title, description, icon: Icon }: HighlightProps) {
//   return (
//     <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-8">
//       <div className="w-12 h-12 rounded-2xl bg-a-green-600/10 text-a-green-600 flex items-center justify-center mb-6">
//         <Icon size={24} />
//       </div>
//       <h3 className="font-semibold text-gray-900 text-lg mb-3">{title}</h3>
//       <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
//     </div>
//   )
// }

