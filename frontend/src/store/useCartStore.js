import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create()(
  persist(
    (set, get) => ({
      cartItems: [],
      
      addItem: (product) => {
        const currentItems = get().cartItems;
        const existingItem = currentItems.find(item => item._id === product._id);
        
        if (existingItem) {
          set({
            cartItems: currentItems.map(item => 
              item._id === product._id ? { ...item, qty: item.qty + 1 } : item
            )
          });
        } else {
          set({ cartItems: [...currentItems, { ...product, qty: 1 }] });
        }
      },

      removeItem: (id) => {
        set({
          cartItems: get().cartItems.filter(item => item._id !== id)
        });
      },

      updateQty: (id, qty) => {
        set({
          cartItems: get().cartItems.map(item => 
            item._id === id ? { ...item, qty: Math.max(1, qty) } : item
          )
        });
      },

      clearCart: () => set({ cartItems: [] }),

      getTotalPrice: () => {
        return get().cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      },

      getItemCount: () => {
        return get().cartItems.reduce((acc, item) => acc + item.qty, 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
