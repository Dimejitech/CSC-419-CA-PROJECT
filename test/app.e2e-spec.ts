import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('CityCare E2E Tests', () => {
  let app: INestApplication<App>;
  let patientToken: string;
  let clinicianToken: string;
  let patientId: string;
  let clinicianId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication (IAM)', () => {
    const testPatient = {
      email: `test-patient-${Date.now()}@citycare.com`,
      password: 'password123',
      firstName: 'Test',
      lastName: 'Patient',
      role: 'Patient',
    };

    const testClinician = {
      email: `test-clinician-${Date.now()}@citycare.com`,
      password: 'password123',
      firstName: 'Dr. Test',
      lastName: 'Clinician',
      role: 'Clinician',
    };

    describe('POST /iam/register', () => {
      it('should register a new patient', async () => {
        const response = await request(app.getHttpServer())
          .post('/iam/register')
          .send(testPatient)
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe(testPatient.email);
        expect(response.body.role).toBe('Patient');
        patientId = response.body.id;
      });

      it('should register a new clinician', async () => {
        const response = await request(app.getHttpServer())
          .post('/iam/register')
          .send(testClinician)
          .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.role).toBe('Clinician');
        clinicianId = response.body.id;
      });

      it('should reject duplicate email', async () => {
        await request(app.getHttpServer())
          .post('/iam/register')
          .send(testPatient)
          .expect(409);
      });

      it('should reject invalid email format', async () => {
        await request(app.getHttpServer())
          .post('/iam/register')
          .send({ ...testPatient, email: 'invalid-email' })
          .expect(400);
      });
    });

    describe('POST /iam/login', () => {
      it('should login patient with valid credentials', async () => {
        const response = await request(app.getHttpServer())
          .post('/iam/login')
          .send({
            email: testPatient.email,
            password: testPatient.password,
          })
          .expect(200);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('user');
        patientToken = response.body.accessToken;
      });

      it('should login clinician with valid credentials', async () => {
        const response = await request(app.getHttpServer())
          .post('/iam/login')
          .send({
            email: testClinician.email,
            password: testClinician.password,
          })
          .expect(200);

        expect(response.body).toHaveProperty('accessToken');
        clinicianToken = response.body.accessToken;
      });

      it('should reject invalid credentials', async () => {
        await request(app.getHttpServer())
          .post('/iam/login')
          .send({
            email: testPatient.email,
            password: 'wrongpassword',
          })
          .expect(401);
      });

      it('should reject non-existent user', async () => {
        await request(app.getHttpServer())
          .post('/iam/login')
          .send({
            email: 'nonexistent@citycare.com',
            password: 'password123',
          })
          .expect(401);
      });
    });
  });

  describe('Scheduling', () => {
    describe('GET /scheduling/clinicians', () => {
      it('should return list of clinicians', async () => {
        const response = await request(app.getHttpServer())
          .get('/scheduling/clinicians')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('Slot Management', () => {
      let slotId: string;

      it('should create a new slot (clinician)', async () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);

        const endTime = new Date(tomorrow);
        endTime.setMinutes(30);

        const response = await request(app.getHttpServer())
          .post('/scheduling/slots')
          .set('Authorization', `Bearer ${clinicianToken}`)
          .send({
            clinicianId: clinicianId,
            startTime: tomorrow.toISOString(),
            endTime: endTime.toISOString(),
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        slotId = response.body.id;
      });

      it('should get available slots', async () => {
        const response = await request(app.getHttpServer())
          .get('/scheduling/slots/available')
          .query({ clinicianId: clinicianId })
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('Booking Management', () => {
      let bookingId: string;

      it('should get patient bookings', async () => {
        const response = await request(app.getHttpServer())
          .get(`/scheduling/bookings/patient/${patientId}`)
          .set('Authorization', `Bearer ${patientToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });

      it('should get clinician schedule', async () => {
        const response = await request(app.getHttpServer())
          .get(`/scheduling/clinicians/${clinicianId}/schedule`)
          .set('Authorization', `Bearer ${clinicianToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });
    });
  });

  describe('Clinical', () => {
    describe('GET /clinical/patients/search', () => {
      it('should search patients (clinician only)', async () => {
        const response = await request(app.getHttpServer())
          .get('/clinical/patients/search')
          .set('Authorization', `Bearer ${clinicianToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('Patient Charts', () => {
      it('should get patient chart', async () => {
        const response = await request(app.getHttpServer())
          .get(`/clinical/charts/${patientId}`)
          .set('Authorization', `Bearer ${clinicianToken}`)
          .expect(200);

        // May return 404 if no chart exists, or 200 with chart data
        if (response.status === 200) {
          expect(response.body).toHaveProperty('id');
        }
      });
    });
  });

  describe('Billing', () => {
    describe('GET /billing/invoices/patient/:id', () => {
      it('should get patient invoices', async () => {
        const response = await request(app.getHttpServer())
          .get(`/billing/invoices/patient/${patientId}`)
          .set('Authorization', `Bearer ${patientToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('GET /billing/outstanding/:patientId', () => {
      it('should get outstanding balance', async () => {
        const response = await request(app.getHttpServer())
          .get(`/billing/outstanding/${patientId}`)
          .set('Authorization', `Bearer ${patientToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('balance');
        expect(typeof response.body.balance).toBe('number');
      });
    });
  });

  describe('Labs', () => {
    describe('GET /lab/orders', () => {
      it('should get lab orders (clinician)', async () => {
        const response = await request(app.getHttpServer())
          .get('/lab/orders')
          .set('Authorization', `Bearer ${clinicianToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });

      it('should filter lab orders by status', async () => {
        const response = await request(app.getHttpServer())
          .get('/lab/orders')
          .query({ status: 'Pending' })
          .set('Authorization', `Bearer ${clinicianToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('GET /lab/results/unverified', () => {
      it('should get unverified results (clinician)', async () => {
        const response = await request(app.getHttpServer())
          .get('/lab/results/unverified')
          .set('Authorization', `Bearer ${clinicianToken}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
      });
    });

    describe('GET /lab/stats', () => {
      it('should get lab statistics', async () => {
        const response = await request(app.getHttpServer())
          .get('/lab/stats')
          .set('Authorization', `Bearer ${clinicianToken}`)
          .expect(200);

        expect(response.body).toHaveProperty('pending');
        expect(response.body).toHaveProperty('urgent');
        expect(response.body).toHaveProperty('completedToday');
      });
    });
  });

  describe('Authorization', () => {
    it('should reject requests without token', async () => {
      await request(app.getHttpServer())
        .get('/clinical/patients/search')
        .expect(401);
    });

    it('should reject requests with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/clinical/patients/search')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
