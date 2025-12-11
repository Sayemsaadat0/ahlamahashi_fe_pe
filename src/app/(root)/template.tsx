import Footer from "@/components/core/Footer"
import Navbar from "@/components/core/Navbar"
import { MobileBottomNav } from "@/components/core/MobileBottomNav"

const template = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Navbar />
            <div className="pb-20 lg:pb-0">
                {children}
            </div>
            <Footer />
            <MobileBottomNav />
        </div>
    )
}
export default template