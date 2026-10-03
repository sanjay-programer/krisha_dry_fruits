import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  grade: string;
  type: string;
  quantity: string;
  price: number;
  image: string;
  count: number;
}

export interface ICustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  doorNo?: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
  lat?: number;
  lng?: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface IOrder extends Document {
  orderId: string;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: ICustomer;
  paymentMethod: string;
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
  placedAt: Date;
  estimatedDelivery: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: String,
  grade: String,
  type: String,
  quantity: String,
  price: Number,
  image: String,
  count: Number,
});

const CustomerSchema = new Schema<ICustomer>({
  fullName: String,
  email: String,
  phone: String,
  address: String,
  doorNo: String,
  city: String,
  state: String,
  pincode: String,
  notes: String,
  lat: Number,
  lng: Number,
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    items: [OrderItemSchema],
    subtotal: Number,
    shipping: Number,
    total: Number,
    customer: CustomerSchema,
    paymentMethod: { type: String, default: 'cod' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    trackingNumber: String,
    notes: String,
    placedAt: { type: Date, default: Date.now },
    estimatedDelivery: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
