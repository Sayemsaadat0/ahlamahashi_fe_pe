// stores/CartStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type MenuItem = {
    id: string
    title: string
    short_description: string
    thumbnail: string
    qty: number
    actual_price: number
}

export type OrderType = {
    menus: MenuItem[]
}

export type CartStore = {
    order: OrderType | null
    setOrder: (item: MenuItem) => void
    clearOrder: () => void
    increaseQty: (id: string) => void
    decreaseQty: (id: string) => void
    removeItem: (id: string) => void
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            order: { menus: [] },
            setOrder: (item) =>
                set((state) => {
                    if (!state.order) return { order: { menus: [item] } }

                    const existing = state.order.menus.find((m) => m.id === item.id)
                    if (existing) {
                        const updated = state.order.menus.map((m) =>
                            m.id === item.id ? { ...m, qty: m.qty + 1 } : m
                        )
                        return { order: { ...state.order, menus: updated } }
                    }
                    return { order: { ...state.order, menus: [...state.order.menus, item] } }
                }),

            clearOrder: () => set({ order: { menus: [] } }),

            increaseQty: (id) =>
                set((state) => {
                    if (!state.order) return { order: { menus: [] } }
                    const updated = state.order.menus.map((m) =>
                        m.id === id ? { ...m, qty: m.qty + 1 } : m
                    )
                    return { order: { ...state.order, menus: updated } }
                }),

            decreaseQty: (id) =>
                set((state) => {
                    if (!state.order) return { order: { menus: [] } }
                    const updated = state.order.menus
                        .map((m) =>
                            m.id === id ? { ...m, qty: Math.max(0, m.qty - 1) } : m
                        )
                        .filter((m) => m.qty > 0)
                    return { order: { ...state.order, menus: updated } }
                }),

            removeItem: (id) => set((state) => ({
                order: state.order, menus: state.order?.menus.filter((m) => m.id !== id) || []
            })),
        }),
        {
            name: "cart-store",
        }
    )
)
