interface CartItem  {
    id: string
    name: string;
    price: number;
    quantity: number;
    orderPrice: number;
    description?: string;
    image: string;
    comment?: string;
    categoryId: string
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem, update?: boolean) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  toggleCart: () => void;
  closeCart: () => void;
};