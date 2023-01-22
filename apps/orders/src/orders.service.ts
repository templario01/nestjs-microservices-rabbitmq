import { Inject, Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderRequest } from './dtos/create-order.request';
import { BILLING_SERVICE } from './dtos/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}
  async createOrder(request: CreateOrderRequest) {
    try {
      const order = await this.orderRepository.create(request);
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
        }),
      );

      return order;
    } catch (error) {
      throw error;
    }
  }

  async getOrders() {
    return this.orderRepository.find({});
  }
}
