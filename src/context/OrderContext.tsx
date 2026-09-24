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
          price: 240,
          rating: 4.9,
          reviewsCount: 312,
          preparationTime: '6-8 mins',
          calories: '540 kcal',
          description: 'Chopped godamba roti tossed on hot griddle with spiced chicken curry, scrambled egg, leeks, and onions.',
          image: '',
          iconName: 'restaurant',
          isVegetarian: false,
        },
        quantity: 1,
      },
      {
        item: {
          id: 'b1',
          name: 'Ceylon Kiri The (Milk Tea)',
          category: 'Beverages',
          price: 40,
          rating: 4.9,
          reviewsCount: 420,
          preparationTime: '2 mins',
          calories: '110 kcal',
          description: 'Traditional campus canteen pulled milk tea brewed with strong Ceylon black tea and sweetened milk.',
          image: '',
          iconName: 'cafe',
          isVegetarian: true,
        },
        quantity: 2,
      },
    ],
    subtotal: 320,
    total: 303,
    pickupTime: 'Yesterday, 1:15 PM',
    pickupStation: 'Counter 1: Science Faculty Canteen',
    paymentMethod: 'Kelaniya Student Smart Card',
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
          price: 50,
          rating: 4.9,
          reviewsCount: 340,
          preparationTime: '1 min',
          calories: '180 kcal',
          description: 'Crispy crumbed pancake roll filled with spicy canned mackerel, boiled potatoes, and black pepper.',
          image: '',
          iconName: 'fast-food',
          isVegetarian: false,
        },
        quantity: 2,
      },
      {
        item: {
          id: 'b2',
          name: 'Iced Milo Dinosaur',
          category: 'Beverages',
          price: 80,
          rating: 4.9,
          reviewsCount: 380,
          preparationTime: '2 mins',
          calories: '220 kcal',
          description: 'Chilled rich chocolate malt drink served over ice and topped with a spoonful of raw Milo powder.',
          image: '',
          iconName: 'cafe',
          isVegetarian: true,
        },
        quantity: 1,
      },
    ],
    subtotal: 180,
    total: 195,
    pickupTime: '22 Sep, 10:30 AM',
    pickupStation: 'Counter 2: Kannangara Canteen',
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
