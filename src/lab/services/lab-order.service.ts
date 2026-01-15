import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLabOrderDto, LabOrderPriority } from '../dto/create-lab-order.dto';
import { UpdateOrderStatusDto, LabOrderStatus } from '../dto/update-order-status.dto';

@Injectable()
export class LabOrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(dto: CreateLabOrderDto) {
    const order = await this.prisma.lab_orders.create({
      data: {
        encounter_id: dto.encounterId,
        status: 'Ordered',
        priority: dto.priority || 'Routine',
      },
    });

    return {
      id: order.id,
      encounterId: order.encounter_id,
      status: order.status,
      priority: order.priority,
    };
  }

  /**
   * Create a lab order for a patient with test items
   * This will automatically create a chart and encounter if they don't exist
   */
  async createOrderForPatient(data: {
    patientId: string;
    clinicianId: string;
    testNames: string[];
    priority?: string;
    notes?: string;
  }) {
    // Get or create patient's chart
    let chart = await this.prisma.patient_charts.findUnique({
      where: { patient_id: data.patientId },
    });

    if (!chart) {
      // Create a chart for the patient with a default DOB (required field)
      // Note: DOB should be updated when patient provides their actual date of birth
      chart = await this.prisma.patient_charts.create({
        data: {
          patient_id: data.patientId,
          dob: new Date('1990-01-01'), // Placeholder until patient provides real DOB
        },
      });
    }

    // Find or create an open encounter for the patient
    let encounter = await this.prisma.patient_encounters.findFirst({
      where: {
        chart_id: chart.id,
        status: 'Open',
      },
      orderBy: { date: 'desc' },
    });

    if (!encounter) {
      // Create a new encounter
      encounter = await this.prisma.patient_encounters.create({
        data: {
          chart_id: chart.id,
          clinician_id: data.clinicianId,
          status: 'Open',
          date: new Date(),
        },
      });
    }

    // Create the lab order with test items
    const order = await this.prisma.lab_orders.create({
      data: {
        encounter_id: encounter.id,
        status: 'Pending',
        priority: data.priority || 'Routine',
        lab_test_items: {
          create: data.testNames.map(testName => ({
            test_name: testName,
          })),
        },
      },
      include: {
        lab_test_items: true,
        patient_encounters: {
          include: {
            patient_charts: {
              include: {
                users: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      id: order.id,
      encounterId: order.encounter_id,
      status: order.status,
      priority: order.priority,
      testItems: order.lab_test_items.map(item => ({
        id: item.id,
        testName: item.test_name,
      })),
      patient: order.patient_encounters?.patient_charts?.users,
    };
  }

  async getOrders(filters: { status?: LabOrderStatus; encounterId?: string; priority?: LabOrderPriority }) {
    const orders = await this.prisma.lab_orders.findMany({
      where: {
        status: filters.status,
        encounter_id: filters.encounterId,
        priority: filters.priority,
      },
      include: {
        lab_test_items: {
          include: {
            lab_results: true,
          },
        },
        patient_encounters: {
          include: {
            patient_charts: {
              include: {
                users: true,
              },
            },
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    // Process orders and auto-fix status if needed
    const processedOrders = await Promise.all(orders.map(async (order) => {
      // Get all results from test items
      const allResults = order.lab_test_items.flatMap(item =>
        (item.lab_results || []).map(result => ({
          id: result.id,
          testItemId: item.id,
          testName: item.test_name,
          resultValue: result.result_value,
          abnormalityFlag: result.abnormality_flag,
          fileUrl: result.file_url,
          isVerified: result.is_verified,
        }))
      );

      const isAllVerified = allResults.length > 0 && allResults.every(r => r.isVerified);
      let currentStatus = order.status;

      // Auto-fix: If all results are verified but status is still Pending, update to Completed
      if (isAllVerified && order.status !== 'Completed') {
        await this.prisma.lab_orders.update({
          where: { id: order.id },
          data: { status: 'Completed' },
        });
        currentStatus = 'Completed';
      }

      return {
        id: order.id,
        encounterId: order.encounter_id,
        status: currentStatus,
        priority: order.priority,
        testItems: order.lab_test_items.map(item => ({
          id: item.id,
          testName: item.test_name,
          results: (item.lab_results || []).map(r => ({
            id: r.id,
            resultValue: r.result_value,
            abnormalityFlag: r.abnormality_flag,
            isVerified: r.is_verified,
          })),
        })),
        results: allResults,
        createdAt: order.patient_encounters?.date || null,
        completedAt: currentStatus === 'Completed' ? order.patient_encounters?.date : null,
        isVerified: isAllVerified,
        chart: order.patient_encounters?.patient_charts ? {
          id: order.patient_encounters.patient_charts.id,
          patient: order.patient_encounters.patient_charts.users,
        } : null,
      };
    }));

    return processedOrders;
  }

  async getOrderById(id: string) {
    const order = await this.prisma.lab_orders.findUnique({
      where: { id },
      include: {
        lab_test_items: {
          include: {
            lab_results: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Lab order ${id} not found`);
    }

    return {
      id: order.id,
      encounterId: order.encounter_id,
      status: order.status,
      priority: order.priority,
      testItems: order.lab_test_items.map(item => ({
        id: item.id,
        testName: item.test_name,
        results: item.lab_results,
      })),
    };
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.lab_orders.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Lab order ${id} not found`);
    }

    const updated = await this.prisma.lab_orders.update({
      where: { id },
      data: { status: dto.status },
    });

    return {
      id: updated.id,
      status: updated.status,
      message: `Order status updated to ${dto.status}`,
    };
  }

  async getOrdersByChartId(chartId: string) {
    // Get encounters for this chart first, then find lab orders
    const encounters = await this.prisma.patient_encounters.findMany({
      where: { chart_id: chartId },
      select: { id: true },
    });

    const encounterIds = encounters.map(e => e.id);

    const orders = await this.prisma.lab_orders.findMany({
      where: {
        encounter_id: { in: encounterIds },
      },
      include: {
        lab_test_items: {
          include: {
            lab_results: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    return orders.map(order => ({
      id: order.id,
      encounterId: order.encounter_id,
      status: order.status,
      priority: order.priority,
      testItems: order.lab_test_items.map(item => ({
        id: item.id,
        testName: item.test_name,
        results: item.lab_results,
      })),
    }));
  }
}
