import { ApiProperty } from "@nestjs/swagger";

export class CreateEmployeeRequest {
    @ApiProperty({
        example: 'first',
        description: 'First Name',
    })
    first_name: string;

    @ApiProperty({
        example: 'last',
        description: 'Last Name',
    })
    last_name: string;

    @ApiProperty({
        example: 'CTO',
        description: 'Position',
    })
    position: string;

    @ApiProperty({
        example: '(818) 555-2024',
        description: 'Phone',
    })
    phone: string;

    @ApiProperty({
        example: 'test@gmail.com',
        description: 'Email',
    })
    email: string;
}

export class EmployeeResponse {
    @ApiProperty({
        example: 1,
        description: 'ID',
    })
    id: number;

    @ApiProperty({
        example: 'first',
        description: 'First Name',
    })
    first_name: string;

    @ApiProperty({
        example: 'last',
        description: 'Last Name',
    })
    last_name: string;

    @ApiProperty({
        example: 'CTO',
        description: 'Position',
    })
    position: string;

    @ApiProperty({
        example: '(818) 555-2024',
        description: 'Phone',
    })
    phone: string;

    @ApiProperty({
        example: 'test@gmail.com',
        description: 'Email',
    })
    email: string;
}

export class SearchEmployeeRequest {
    name?: string;
    page?: number;
    size?: number;
}

export class UpdateEmployeeRequest {
    @ApiProperty({
        example: 1,
        description: 'ID',
    })
    id: number;

    @ApiProperty({
        example: 'first',
        description: 'First Name',
    })
    first_name?: string;

    @ApiProperty({
        example: 'last',
        description: 'Last Name',
    })
    last_name?: string;

    @ApiProperty({
        example: 'CTO',
        description: 'Position',
    })
    position?: string;

    @ApiProperty({
        example: '(818) 555-2024',
        description: 'Phone',
    })
    phone?: string;

    @ApiProperty({
        example: 'test@gmail.com',
        description: 'Email',
    })
    email?: string;
}