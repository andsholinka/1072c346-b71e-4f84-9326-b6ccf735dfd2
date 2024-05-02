import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { Employee } from '@prisma/client';
import {
    CreateEmployeeRequest,
    EmployeeResponse,
    SearchEmployeeRequest,
    UpdateEmployeeRequest
} from '../model/employee.model';
import { WebResponse } from '../model/web.model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('employee')
@Controller('/api/employees')
export class EmployeeController {
    constructor(private employeeService: EmployeeService) { }

    @Post()
    @HttpCode(200)
    async create(
        employee: Employee,
        @Body() request: CreateEmployeeRequest,
    ): Promise<WebResponse<EmployeeResponse[]>> {
        await this.employeeService.create(employee, request);

        return this.employeeService.read({ page: 1, size: 5 });
    }

    @Get()
    @HttpCode(200)
    async read(
        @Query('name') name?: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
        @Query('size', new DefaultValuePipe(5), ParseIntPipe) size?: number,
    ): Promise<WebResponse<EmployeeResponse[]>> {
        const pagination: SearchEmployeeRequest = {
            name,
            page,
            size,
        };
        return this.employeeService.read(pagination);
    }

    @Put('')
    @HttpCode(200)
    async update(
        @Body() payload: { data: UpdateEmployeeRequest[] },
    ): Promise<WebResponse<EmployeeResponse[]>> {
        await Promise.all(payload.data.map(request => this.employeeService.update(request)));

        const pagination: SearchEmployeeRequest = {
            page: 1,
            size: 5,
        };
        const employees = await this.employeeService.read(pagination);

        return employees;
    }

    @Delete('/:employeeId')
    @HttpCode(200)
    async delete(
        @Param('employeeId', ParseIntPipe) employeeId: number,
    ): Promise<WebResponse<boolean>> {
        await this.employeeService.delete(employeeId);
        return {
            data: true,
        };
    }
}
