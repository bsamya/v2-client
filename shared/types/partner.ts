import type { Timestamp } from "firebase/firestore";
import { certificateLanguages, certificateTypes } from "../settings";

export type Partner = {
    id: string;
    code: string;
    name: {
        en: string; // required
    } & Partial<Record<CertificateLanguage, string>>;
    address: {
        en: string; // required
    } & Partial<Record<CertificateLanguage, string>>;
    web: string;
    email: string;
    phone: string;
    logo: string;
    isActive: boolean;
    isManagedAccount: boolean;

    creditCardFees: number;
    certificates: Record<CertificateType, Certificate>;
    contacts: {
        id: string;
        title: string;
        name: string;
        email: string;
        phone: string;
        isPublic: Boolean
    }[];
    associates: {
        id: string;
        code: string;
        name: string;
        url: string;
        logo: string;
        isActive: boolean;
    }[],
    createdAt?: Timestamp,
    updatedAt?: Timestamp,
    feeSummary?: any
}

export type PartnerContact = Partner["contacts"][0];
export type PartnerAssociate = Partner["associates"][0];

export type CertificateType = keyof typeof certificateTypes
export type CertificateLanguage = keyof typeof certificateLanguages

export type Certificate = {
    code: CertificateType;
    label: string;
    mediaType: string;
    isActive: boolean;
    allowMultipleCopies: boolean;
    maxCopies: number;
    options: {
        language: CertificateLanguage;
        isActive: boolean;
        certificateFees: {
            regular: number;
            member: number;
        };
        transactionFees: number;
        processingFees: number;
    }[];
}