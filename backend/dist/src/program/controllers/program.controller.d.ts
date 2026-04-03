import { ProgramService } from '../services/program.service';
export declare class ProgramController {
    private readonly programService;
    constructor(programService: ProgramService);
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
