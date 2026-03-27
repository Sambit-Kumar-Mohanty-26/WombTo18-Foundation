import { PrismaService } from '../../prisma/services/prisma.service';
export declare class ProgramService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        description: string;
        targetAmount: number;
        raisedAmount: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
