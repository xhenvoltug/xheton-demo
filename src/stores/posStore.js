import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePOSStore = create(
  persist(
    (set, get) => ({
      cart: [],
      customer: null,
      discount: 0,
      paymentMethod: 'cash',
      
      addToCart: (product) => set((state) => {
        const existing = state.cart.find(item => item.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),
      
      updateQuantity: (id, change) => set((state) => ({
        cart: state.cart.map(item => {
          if (item.id === id) {
            const newQty = Math.max(0, item.quantity + change);
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        }).filter(Boolean)
      })),
      
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(item => item.id !== id)
      })),
      
      clearCart: () => set({
        cart: [],
        customer: null,
        discount: 0
      }),
      
      setCustomer: (customer) => set({ customer }),
      setDiscount: (discount) => set({ discount }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
      
      getSubtotal: () => {
        const { cart } = get();
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      },
      
      getTotal: () => {
        const { cart, discount } = get();
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discountAmount = subtotal * (discount / 100);
        const afterDiscount = subtotal - discountAmount;
        const tax = afterDiscount * 0.16;
        return afterDiscount + tax;
      }
    }),
    {
      name: 'pos-storage',
      partialize: (state) => ({
        cart: state.cart,
        customer: state.customer,
        discount: state.discount,
        paymentMethod: state.paymentMethod
      })
    }
  )
);

export default usePOSStore;
