import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('EmployeeController', () => {
    let app: INestApplication;
    let logger: Logger;
    let testService: TestService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, TestModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        logger = app.get(WINSTON_MODULE_PROVIDER);
        testService = app.get(TestService);
    });

    describe('POST /api/employees', () => {
        beforeEach(async () => {
            await testService.deleteEmployee();
        });

        it('should be rejected if request is invalid', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/employees')
                .send({
                    first_name: '',
                    last_name: '',
                    position: '',
                    email: 'test@example',
                    phone: '',
                });

            logger.info(response.body);

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to create employee', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/employees')
                .send({
                    first_name: 'bos',
                    last_name: 'andrey',
                    position: 'CEO',
                    email: 'test@example.com',
                    phone: '9999',
                });

            logger.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data[0].id).toBeDefined();
            expect(response.body.data[0].first_name).toBe('bos');
            expect(response.body.data[0].last_name).toBe('andrey');
            expect(response.body.data[0].position).toBe('CEO');
            expect(response.body.data[0].email).toBe('test@example.com');
            expect(response.body.data[0].phone).toBe('9999');
        });
    });

    describe('GET /api/employees', () => {
        beforeEach(async () => {
            await testService.deleteEmployee();

            await testService.createEmployee();
        });

        it('should be rejected if employee is not found', async () => {
            const employee = await testService.getEmployee();

            const response = await request(app.getHttpServer())
                .get(`/api/employees/${employee.id + 1}`)

            logger.info(response.body);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to get employee', async () => {
            const response = await request(app.getHttpServer())
                .get(`/api/employees`)

            logger.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data[0].id).toBeDefined();
            expect(response.body.data[0].first_name).toBe('bos');
            expect(response.body.data[0].last_name).toBe('andrey');
            expect(response.body.data[0].position).toBe('CEO');
            expect(response.body.data[0].email).toBe('test@example.com');
            expect(response.body.data[0].phone).toBe('9999');
        });
    });

    describe('PUT /api/employees', () => {
        beforeEach(async () => {
            await testService.deleteEmployee();

            await testService.createEmployee();
        });

        it('should be rejected if request is invalid', async () => {
            const employee = await testService.getEmployee();
            const response = await request(app.getHttpServer())
                .put(`/api/employees`)
                .send({
                    data: [
                        {
                            id: employee.id,
                            email: 'test',
                        }
                    ]
                });

            logger.info(response.body);

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        it('should be rejected if contact is not found', async () => {
            const employee = await testService.getEmployee();
            const response = await request(app.getHttpServer())
                .put(`/api/employees`)
                .send({
                    data: [
                        {
                            id: employee.id + 1,
                            email: 'test@gmail.com',
                        }
                    ]
                });

            logger.info(response.body);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to update employee', async () => {
            const employee = await testService.getEmployee();
            const response = await request(app.getHttpServer())
                .put(`/api/employees`)
                .send({
                    data: [
                        {
                            id: employee.id,
                            email: 'testupdated@example.com',
                        }
                    ]
                });

            logger.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data[0].id).toBeDefined();
            expect(response.body.data[0].email).toBe('testupdated@example.com');
        });
    });

    describe('DELETE /api/employees/:employeeId', () => {
        beforeEach(async () => {
            await testService.deleteEmployee();

            await testService.createEmployee();
        });

        it('should be rejected if employee is not found', async () => {
            const employee = await testService.getEmployee();
            const response = await request(app.getHttpServer())
                .delete(`/api/employees/${employee.id + 1}`)

            logger.info(response.body);

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
        });

        it('should be able to remove employee', async () => {
            const contact = await testService.getEmployee();
            const response = await request(app.getHttpServer())
                .delete(`/api/employees/${contact.id}`)

            logger.info(response.body);

            expect(response.status).toBe(200);
            expect(response.body.data).toBe(true);
        });
    });
});
