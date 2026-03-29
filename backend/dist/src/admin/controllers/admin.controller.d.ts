import { AdminService } from '../services/admin.service';
import type { Response } from 'express';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAdminPanel(res: Response): void;
    getDonors(): Promise<({
        donations: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            donorId: string;
            status: string;
            amount: number;
            currency: string;
            razorpayOrderId: string;
            razorpayPaymentId: string | null;
            razorpaySignature: string | null;
            programId: string;
            displayName: boolean;
            receiptNumber: string | null;
        }[];
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        donorId: string;
        email: string;
        mobile: string | null;
        password: string | null;
        pan: string | null;
        address: string | null;
        tier: string;
        totalDonated: number;
        otpHash: string | null;
        otpExpiry: Date | null;
        isEligible: boolean;
        isVolunteer: boolean;
        isNonDonor: boolean;
    })[]>;
    getStats(): Promise<{
        totalDonations: number;
        totalDonors: number;
        totalPrograms: number;
        recentDonations: ({
            program: {
                id: string;
                name: string;
                description: string;
                targetAmount: number;
                raisedAmount: number;
                createdAt: Date;
                updatedAt: Date;
            };
            donor: {
                id: string;
                name: string | null;
                createdAt: Date;
                updatedAt: Date;
                donorId: string;
                email: string;
                mobile: string | null;
                password: string | null;
                pan: string | null;
                address: string | null;
                tier: string;
                totalDonated: number;
                otpHash: string | null;
                otpExpiry: Date | null;
                isEligible: boolean;
                isVolunteer: boolean;
                isNonDonor: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            donorId: string;
            status: string;
            amount: number;
            currency: string;
            razorpayOrderId: string;
            razorpayPaymentId: string | null;
            razorpaySignature: string | null;
            programId: string;
            displayName: boolean;
            receiptNumber: string | null;
        })[];
    }>;
    getPrograms(): Promise<{
        id: string;
        name: string;
        description: string;
        targetAmount: number;
        raisedAmount: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createProgram(body: any): Promise<{
        id: string;
        name: string;
        description: string;
        targetAmount: number;
        raisedAmount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    postReport(body: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
