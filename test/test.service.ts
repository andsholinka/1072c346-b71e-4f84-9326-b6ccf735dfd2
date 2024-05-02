import { PrismaService } from '../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import { Employee } from '@prisma/client';

@Injectable()
export class TestService {
    constructor(private prismaService: PrismaService) { }

    async deleteEmployee() {
        await this.prismaService.employee.deleteMany({
        });
    }

    async getEmployee(): Promise<Employee> {
        return this.prismaService.employee.findFirst({
            where: {
                email: 'test@example.com',
            },
        });
    }

    async createEmployee() {
        await this.prismaService.employee.create({
            data: {
                first_name: 'bos',
                last_name: 'andrey',
                position: 'CEO',
                email: 'test@example.com',
                phone: '9999',
            },
        });
    }
}
