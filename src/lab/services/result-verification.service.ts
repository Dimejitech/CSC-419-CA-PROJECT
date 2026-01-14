import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../../notification/notification.service';

@Injectable()
export class ResultVerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async verifyResult(resultId: string, verifiedByUserId: string) {
    const result = await this.prisma.lab_results.findUnique({
      where: { id: resultId },
      include: {
        lab_test_items: {
          include: {
            lab_orders: {
              include: {
                patient_encounters: {
                  include: {
                    patient_charts: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException(`Lab result ${resultId} not found`);
    }

    const updated = await this.prisma.lab_results.update({
      where: { id: resultId },
      data: {
        is_verified: true,
        verified_by: verifiedByUserId,
      },
    });

    // Send notification to patient
    const patientId = result.lab_test_items?.lab_orders?.patient_encounters?.patient_charts?.patient_id;
    const testName = result.lab_test_items?.test_name || 'Lab test';

    if (patientId) {
      this.notificationService.notifyLabResultReady(patientId, {
        testName,
        resultId,
      }).catch(err => console.error('Failed to send lab result notification:', err));
    }

    return {
      id: updated.id,
      isVerified: updated.is_verified,
      verifiedBy: updated.verified_by,
      message: 'Result verified successfully. Patient can now view this result.',
    };
  }

  async getUnverifiedResults(clinicianId: string) {
    const results = await this.prisma.lab_results.findMany({
      where: {
        is_verified: false,
      },
      include: {
        lab_test_items: {
          include: {
            lab_orders: {
              include: {
                patient_encounters: {
                  include: {
                    patient_charts: {
                      include: {
                        users: {
                          select: { id: true, first_name: true, last_name: true },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    return results.map(result => ({
      id: result.id,
      testName: result.lab_test_items?.test_name,
      resultValue: result.result_value,
      abnormalityFlag: result.abnormality_flag,
      patient: result.lab_test_items?.lab_orders?.patient_encounters?.patient_charts?.users,
      orderId: result.lab_test_items?.order_id,
    }));
  }

  async getVerifiedResultsForPatient(patientId: string) {
    // Get chart for this patient
    const chart = await this.prisma.patient_charts.findFirst({
      where: { patient_id: patientId },
    });

    if (!chart) {
      return [];
    }

    // Get encounters for this patient's chart with dates
    const encounters = await this.prisma.patient_encounters.findMany({
      where: { chart_id: chart.id },
      select: { id: true, date: true },
    });

    const encounterMap = new Map(encounters.map(e => [e.id, e.date]));
    const encounterIds = encounters.map(e => e.id);

    const orders = await this.prisma.lab_orders.findMany({
      where: {
        encounter_id: { in: encounterIds },
      },
      include: {
        lab_test_items: {
          include: {
            lab_results: {
              where: { is_verified: true },
            },
          },
        },
      },
    });

    // Reference ranges based on test type
    const referenceRanges: Record<string, string> = {
      'Complete Blood Count (CBC)': 'WBC: 4.5-11.0, RBC: 4.5-5.5, Hgb: 12-17 g/dL',
      'Basic Metabolic Panel': 'Glucose: 70-100 mg/dL, BUN: 7-20 mg/dL',
      'Comprehensive Metabolic Panel': 'Glucose: 70-100, BUN: 7-20, Creatinine: 0.7-1.3',
      'Hemoglobin A1C': '4.0-5.6% (Normal), 5.7-6.4% (Prediabetes)',
      'Lipid Panel': 'Total Chol: <200, LDL: <100, HDL: >40, Trig: <150',
      'Urinalysis': 'pH: 4.5-8.0, Specific Gravity: 1.005-1.030',
      'Thyroid Panel (TSH, T3, T4)': 'TSH: 0.4-4.0 mIU/L, T4: 4.5-12.0 μg/dL',
      'COVID-19 PCR': 'Negative',
      'Influenza A/B': 'Negative',
    };

    const results: any[] = [];
    for (const order of orders) {
      // Get the encounter date for this order
      const encounterDate = order.encounter_id ? encounterMap.get(order.encounter_id) : null;

      for (const item of order.lab_test_items) {
        for (const result of item.lab_results) {
          results.push({
            id: result.id,
            test_name: item.test_name,
            result_value: result.result_value,
            // Map abnormality_flag to status for frontend compatibility
            status: result.abnormality_flag || 'Normal',
            // Use encounter date as result_date
            result_date: encounterDate ? encounterDate.toISOString() : null,
            // Add reference range based on test name
            unit: '',
            reference_range: referenceRanges[item.test_name] || 'See lab report',
            notes: result.abnormality_flag === 'High' ? 'Result is above normal range. Please consult with your doctor.' : '',
            order: {
              id: order.id,
              test_type: item.test_name,
            },
          });
        }
      }
    }

    return results;
  }

  async getVerificationStats() {
    const [total, verified, unverified] = await Promise.all([
      this.prisma.lab_results.count(),
      this.prisma.lab_results.count({ where: { is_verified: true } }),
      this.prisma.lab_results.count({ where: { is_verified: false } }),
    ]);

    return {
      totalResults: total,
      verifiedResults: verified,
      unverifiedResults: unverified,
      verificationRate: total > 0 ? Math.round((verified / total) * 100) : 0,
    };
  }
}
