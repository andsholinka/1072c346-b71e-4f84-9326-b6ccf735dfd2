import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { Employee } from '@prisma/client';
import {
    CreateEmployeeRequest,
    EmployeeResponse,
    SearchEmployeeRequest,
    UpdateEmployeeRequest
} from '../model/employee.model';
import { ValidationService } from '../common/validation.service';
import { EmployeeValidation } from './employee.validation';
import { WebResponse } from '../model/web.model';

@Injectable()
export class EmployeeService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
        private validationService: ValidationService,
    ) { }

    toEmployeeResponse(employee: Employee): EmployeeResponse {
        return {
            first_name: employee.first_name,
            last_name: employee.last_name,
            position: employee.position,
            email: employee.email,
            phone: employee.phone,
            id: employee.id,
        };
    }

    async isEmployeeExists(
        employeeId: number,
    ): Promise<Employee> {
        const employee = await this.prismaService.employee.findFirst({
            where: {
                id: employeeId,
            },
        });

        if (!employee) {
            throw new HttpException('Employee is not found', 404);
        }

        return employee;
    }

    async create(
        employee: Employee,
        request: CreateEmployeeRequest,
    ): Promise<EmployeeResponse> {
        this.logger.debug(
            `EmployeeService.create(${JSON.stringify(employee)}, ${JSON.stringify(request)})`,
        );
        const createRequest: CreateEmployeeRequest = this.validationService.validate(
            EmployeeValidation.CREATE,
            request,
        );

        const isEmailExists = await this.prismaService.employee.findFirst({
            where: {
                email: createRequest.email,
            },
        });

        if (isEmailExists) {
            throw new HttpException('Email address is not unique', 400);
        }

        const contact = await this.prismaService.employee.create({
            data: createRequest,
        });

        return contact;
    }

    async read(
        request: SearchEmployeeRequest,
    ): Promise<WebResponse<EmployeeResponse[]>> {
        const searchRequest: SearchEmployeeRequest = this.validationService.validate(
            EmployeeValidation.SEARCH,
            request,
        );

        const filters = [];

        if (searchRequest.name) {
            filters.push({
                OR: [
                    {
                        first_name: {
                            contains: searchRequest.name,
                        },
                    },
                    {
                        last_name: {
                            contains: searchRequest.name,
                        },
                    },
                ],
            });
        }

        const skip = (searchRequest.page - 1) * searchRequest.size;

        const employees = await this.prismaService.employee.findMany({
            where: {
                AND: filters,
            },
            take: searchRequest.size,
            skip: skip,
        });

        const total = await this.prismaService.employee.count({
            where: {
                AND: filters,
            },
        });

        return {
            data: employees.map((employee) => this.toEmployeeResponse(employee)),
            paging: {
                current_page: searchRequest.page,
                size: searchRequest.size,
                total_page: Math.ceil(total / searchRequest.size),
            },
        };
    }

    async update(
        request: UpdateEmployeeRequest,
    ): Promise<EmployeeResponse> {
        this.validationService.validate(
            EmployeeValidation.UPDATE,
            request,
        );

        let employee = await this.isEmployeeExists(
            request.id,
        );

        employee = await this.prismaService.employee.update({
            where: {
                id: employee.id,
            },
            data: request,
        });

        return this.toEmployeeResponse(employee);
    }

    async delete(employeeId: number): Promise<EmployeeResponse> {
        await this.isEmployeeExists(employeeId);

        const employee = await this.prismaService.employee.delete({
            where: {
                id: employeeId,
            },
        });

        return this.toEmployeeResponse(employee);
    }
}