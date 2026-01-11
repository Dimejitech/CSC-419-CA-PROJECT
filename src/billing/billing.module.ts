import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter'; // Import this
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { InvoiceGenerationService } from './services/invoice-generation.service';
import { BillingEventsListener } from './events/billing-events.listener'; // Import this

@Module({
  imports: [
    PrismaModule,
    EventEmitterModule.forRoot(), // This "turns on" the event system for your module
  ],
  controllers: [BillingController],
  providers: [
    BillingService, 
    InvoiceGenerationService, 
    BillingEventsListener // Add the listener as a provider
  ],
  exports: [BillingService, InvoiceGenerationService],
})
export class BillingModule {}