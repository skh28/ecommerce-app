/**
 * API request/response types — single source of truth for the API contract.
 * Must stay in sync with docs/API.md.
 */

// ----- Auth -----

export type SignupRequest = {
  email: string;
  password: string;
  name?: string;
};

export type SignupResponse = {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
};

// ----- Products -----

export type ProductDto = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
  imageUrl: string | null;
};

export type ProductsListResponse = {
  products: ProductDto[];
  total: number;
};

export type ProductQuery = {
  limit?: number;
  offset?: number;
};

// ----- Cart -----

export type CartItemDto = {
  id: string;
  productId: string;
  productName: string;
  priceCents: number;
  quantity: number;
  imageUrl: string | null;
};

export type CartResponse = {
  items: CartItemDto[];
  totalCents: number;
};

export type AddToCartRequest = {
  productId: string;
  quantity?: number;
};

export type UpdateCartItemRequest = {
  quantity: number;
};

// ----- Checkout -----

export type OrderItemDto = {
  productId: string;
  productName: string;
  quantity: number;
  priceCents: number;
};

export type CheckoutResponse = {
  order: {
    id: string;
    totalCents: number;
    createdAt: string;
    items: OrderItemDto[];
  };
};

// ----- Orders -----

export type OrderSummaryDto = {
  id: string;
  totalCents: number;
  createdAt: string;
  itemCount: number;
};

export type OrdersListResponse = {
  orders: OrderSummaryDto[];
  total: number;
};

export type OrderDetailResponse = {
  id: string;
  totalCents: number;
  createdAt: string;
  items: OrderItemDto[];
};

export type OrdersQuery = {
  limit?: number;
  offset?: number;
};

// ----- Error (all endpoints) -----

export type ApiErrorResponse = {
  error: string;
  code?: string;
};
