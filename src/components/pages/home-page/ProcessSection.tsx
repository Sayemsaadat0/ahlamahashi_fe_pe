import { Search, MessageCircle, Package, Clock } from "lucide-react"

const ProcessSection = () => {
    const steps = [
        {
            id: 1,
            number: "01",
            icon: Search,
            title: "BROWSE OUR MENU",
            description: "Explore our extensive menu featuring local favorites and international cuisine. Find exactly what you're craving with our easy-to-navigate categories.",
            highlight: "Find your perfect meal"
        },
        {
            id: 2,
            number: "02",
            icon: MessageCircle,
            title: "PLACE YOUR ORDER",
            description: "Add items to your cart, customize your order, and checkout securely. Our streamlined process makes ordering quick and hassle-free.",
            highlight: "Quick & secure checkout"
        },
        {
            id: 3,
            number: "03",
            icon: Package,
            title: "WE PREPARE YOUR FOOD",
            description: "Our partner restaurants prepare your food fresh to order. We ensure quality and freshness while maintaining our fast delivery promise.",
            highlight: "Fresh to order"
        },
        {
            id: 4,
            number: "04",
            icon: Clock,
            title: "ENJOY DELIVERY",
            description: "Track your order in real-time and receive your food at your doorstep in under 30 minutes. Hot, fresh, and ready to enjoy.",
            highlight: "30-minute delivery"
        }
    ]

    return (
        <section className="bg-white fade-top-mask z-20 py-12 md:py-20">
            <div className="ah-container mx-auto relative">
                                                                 {/* Title */}
                 <div className="text-center mb-8 md:mb-12">
                     <div className="inline-flex items-center bg-a-green-600/10 text-a-green-600 px-3 py-1 rounded-full text-xs font-medium mb-3">
                         <span className="w-1.5 h-1.5 bg-a-green-600 rounded-full mr-2 animate-pulse"></span>
                         Simple & Fast
                     </div>
                     <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
                         <span className="text-gray-900">How It</span>
                         <span className="text-transparent bg-clip-text bg-gradient-to-r from-a-green-600 to-a-green-600"> Works</span>
                     </h2>
                     <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto px-4 sm:px-0">
                         Getting your favorite food delivered has never been easier. 
                         Follow these simple steps and enjoy delicious meals in minutes.
                     </p>
                 </div>

                {/* Process Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                    {steps.map((step, index) => (
                        <div key={index} className={`flex items-start space-x-4 md:space-x-6 ${step.id % 2 === 1 ? 'md:-mt-20' : ''}`}>
                            {/* Number and Line */}
                            <div className="flex flex-col items-center">
                                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-a-green-600 leading-none mb-2">
                                    {step.number}
                                </div>
                                <div className="w-0.5 h-12 md:h-16 bg-a-green-600"></div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                {/* Icon */}
                                <div className="w-12 h-12 bg-a-green-600/10 rounded-xl flex items-center justify-center mb-4">
                                    <step.icon className="w-6 h-6 text-a-green-600" />
                                </div>

                                {/* Title */}
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 md:mb-3 uppercase tracking-wide">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                    {step.description}
                                    <span className="text-a-green-600 font-medium ml-1">
                                        {step.highlight}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-12 md:mt-16">
                    <div className="bg-gradient-to-r from-a-green-600 to-a-green-600 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                            Ready to Get Started?
                        </h3>
                        <p className="text-sm sm:text-base text-white/90 mb-4 md:mb-6 max-w-2xl mx-auto px-4 sm:px-0">
                            Join thousands of customers who trust us for their daily meals.
                            Start your first order today and experience the difference!
                        </p>
                        <button className="bg-white text-a-green-600 px-6 md:px-8 py-2.5 md:py-3 rounded-full text-base md:text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1">
                            Start Ordering
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProcessSection
