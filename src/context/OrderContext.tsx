import React, { createContext, useContext, useState } from 'react';
import { CartItem } from './CartContext';

export type OrderStatus = 'Placed' | 'Preparing' | 'Ready for pickup' | 'Completed';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  pickupTime: string;
  pickupStation: string;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
  pickupCode: string;
}

interface OrderContextType {
  activeOrder: Order | null;
  orderHistory: Order[];
  placeOrder: (
    items: CartItem[],
    subtotal: number,
    total: number,
    pickupTime: string,
    pickupStation: string,
    paymentMethod: string
  ) => Order;
  advanceOrderStatus: (orderId: string) => void;
  resetOrder: () => void;
}

const SAMPLE_HISTORY: Order[] = [
  {
    id: 'QB-4102',
    items: [
      {
        item: {
          id: 'm1',
          name: 'Chicken Kottu Roti',
          category: 'Meals',
          price: 550,
          rating: 4.9,
          reviewsCount: 312,
          preparationTime: '8-10 mins',
          calories: '540 kcal',
          description: '',
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
          isVegetarian: false,
        },
        quantity: 1,
      },
      {
        item: {
          id: 'b1',
          name: 'Ceylon Kiri The (Milk Tea)',
          category: 'Beverages',
          price: 120,
          rating: 4.9,
          reviewsCount: 420,
          preparationTime: '2-3 mins',
          calories: '110 kcal',
          description: '',
          image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
          isVegetarian: true,
        },
        quantity: 2,
      },
    ],
    subtotal: 790,
    total: 820,
    pickupTime: 'Yesterday, 1:15 PM',
    pickupStation: 'Counter 1: Main Meals',
    paymentMethod: 'University Student Smart Card',
    status: 'Completed',
    createdAt: 'Yesterday, 1:05 PM',
    estimatedMinutes: 0,
    pickupCode: '4821',
  },
  {
    id: 'QB-3981',
    items: [
      {
        item: {
          id: 's1',
          name: 'Crispy Fish Chinese Roll',
          category: 'Snacks',
          price: 130,
          rating: 4.9,
          reviewsCount: 340,
          preparationTime: '2 mins',
          calories: '180 kcal',
          description: '',
          image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&auto=format&fit=crop&q=80',
          isVegetarian: false,
        },
        quantity: 2,
      },
      {
        item: {
          id: 'b2',
          name: 'Milo Dinosaur',
          category: 'Beverages',
          price: 250,
          rating: 4.9,
          reviewsCount: 380,
          preparationTime: '3 mins',
          calories: '220 kcal',
          description: '',
          image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&auto=format&fit=crop&q=80',
          isVegetarian: true,
        },
        quantity: 1,
      },
    ],
    subtotal: 510,
    total: 540,
    pickupTime: '22 Sep, 10:30 AM',
    pickupStation: 'Counter 2: Short Eats and Tea',
    paymentMethod: 'Cash at Counter',
    status: 'Completed',
    createdAt: '22 Sep, 10:20 AM',
    estimatedMinutes: 0,
    pickupCode: '1093',
  },
];

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>(SAMPLE_HISTORY);

  const placeOrder = (
    items: CartItem[],
    subtotal: number,
    total: number,
    pickupTime: string,
    pickupStation: string,
    paymentMethod: string
  ): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const pickupPin = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder: Order = {
      id: `QB-${randomNum}`,
      items: [...items],
      subtotal,
      total,
      pickupTime,
      pickupStation,
      paymentMethod,
      status: 'Placed',
      createdAt: 'Just now',
      estimatedMinutes: 8,
      pickupCode: pickupPin,
    };

    setActiveOrder(newOrder);
    setOrderHistory((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const advanceOrderStatus = (orderId: string) => {
    const statusSequence: OrderStatus[] = ['Placed', 'Preparing', 'Ready for pickup', 'Completed'];

    const updateStatus = (current: Order): Order => {
      const idx = statusSequence.indexOf(current.status);
      if (idx >= 0 && idx < statusSequence.length - 1) {
        const nextStatus = statusSequence[idx + 1];
        const nextMinutes = nextStatus === 'Preparing' ? 5 : nextStatus === 'Ready for pickup' ? 1 : 0;
        return {
          ...current,
          status: nextStatus,
          estimatedMinutes: nextMinutes,
        };
      }
      return current;
    };

    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder((prev) => (prev ? updateStatus(prev) : null));
    }

    setOrderHistory((prev) =>
      prev.map((order) => (order.id === orderId ? updateStatus(order) : order))
    );
  };

  const resetOrder = () => {
    setActiveOrder(null);
  };

  return (
    <OrderContext.Provider
      value={{
        activeOrder,
        orderHistory,
        placeOrder,
        advanceOrderStatus,
        resetOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
