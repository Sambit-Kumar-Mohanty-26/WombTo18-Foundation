import { AdminService } from '../services/admin.service';
import type { Response } from 'express';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAdminPanel(res: Response): void;
    getDonors(): Promise<({
        donations: {
            id: string;
            amount: number;
            currency: string;
            status: string;
            razorpayOrderId: string;
            razorpayPaymentId: string | null;
            razorpaySignature: string | null;
            donorId: string;
            programId: string;
            displayName: boolean;
            receiptNumber: string | null;
            referralCode: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        donorId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string;
        mobile: string | null;
        password: string | null;
        pan: string | null;
        address: string | null;
        tier: string;
        totalDonated: number;
        otpHash: string | null;
        otpExpiry: Date | null;
        emailOtpHash: string | null;
        mobileOtpHash: string | null;
        emailVerified: boolean;
        mobileVerified: boolean;
        isEligible: boolean;
        isVolunteer: boolean;
        isNonDonor: boolean;
        showOnLeaderboard: boolean;
        profileImage: string | null;
        referredById: string | null;
        twoFactorEnabled: boolean;
        tokenVersion: number;
    })[]>;
    getStats(): Promise<{
        totalDonations: number;
        totalDonors: number;
        totalPrograms: number;
        recentDonations: ({
            donor: {
                id: string;
                donorId: string;
                createdAt: Date;
                updatedAt: Date;
                name: string | null;
                email: string;
                mobile: string | null;
                password: string | null;
                pan: string | null;
                address: string | null;
                tier: string;
                totalDonated: number;
                otpHash: string | null;
                otpExpiry: Date | null;
                emailOtpHash: string | null;
                mobileOtpHash: string | null;
                emailVerified: boolean;
                mobileVerified: boolean;
                isEligible: boolean;
                isVolunteer: boolean;
                isNonDonor: boolean;
                showOnLeaderboard: boolean;
                profileImage: string | null;
                referredById: string | null;
                twoFactorEnabled: boolean;
                tokenVersion: number;
            };
            program: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string;
                targetAmount: number;
                raisedAmount: number;
            };
        } & {
            id: string;
            amount: number;
            currency: string;
            status: string;
            razorpayOrderId: string;
            razorpayPaymentId: string | null;
            razorpaySignature: string | null;
            donorId: string;
            programId: string;
            displayName: boolean;
            receiptNumber: string | null;
            referralCode: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    getPrograms(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        targetAmount: number;
        raisedAmount: number;
    }[]>;
    createProgram(body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        targetAmount: number;
        raisedAmount: number;
    }>;
    postReport(body: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
