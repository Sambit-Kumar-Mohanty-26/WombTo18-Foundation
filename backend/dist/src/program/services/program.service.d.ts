import { PrismaService } from '../../prisma/services/prisma.service';
export declare class ProgramService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        targetAmount: number;
        raisedAmount: number;
    }[]>;
}
