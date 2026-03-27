import { ProgramService } from '../services/program.service';
export declare class ProgramController {
    private readonly programService;
    constructor(programService: ProgramService);
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
