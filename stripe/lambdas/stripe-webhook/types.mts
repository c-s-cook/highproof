
export interface Tour {
    TOUR_REGION: string;
    TOUR_NUM: number;
    TITLES: string[];
}

export interface Voucher {
    VOUCHER_ID: string;
    TOUR_NUM: number;
    LINK: string;
    CREATED: number;        // new Date().valueOf() == ms as number
    AVAILABLE: Boolean;
    REDEEMED: Boolean;
    PURCHASED?: number;     // new Date().valueOf() == ms as number
    TRANSACTION_ID?: string; // Foreign Key to Transactions Table
}

export interface VoucherResult {
    voucher: Voucher;
    count: number;
    scannedCount: number;
    attempts: number;
}

export interface Address {
    city: string;
    country: string;
    line1: string;
    line2?: string;
    postal_code: string;
    state: string;
}

export interface Customer {
    CUSTOMER: string;       //  their email
    NAME: string;
    ADDRESS: Address;
    TRANSACTIONS: string[];
}

export interface Transaction {
    TRANSACTION_ID: string;     // the Checkout.session ID
    CUSTOMER: string;           // their email | Foreign Key to CUSTOMERS table
    VOUCHERS: string[];         // list of VOUCHER_ID strings
    DATE: number;               // new Date().valueOf() == ms as number
}


export interface EmailInfo {
    name: string;
    email: string;
    tourTitle: string;
    vouchers: Voucher[];
    startingLocation?: string;
}