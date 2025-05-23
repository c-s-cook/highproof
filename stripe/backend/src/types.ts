
export interface DBVoucher {
    VOUCHER_ID: string;
    TOUR_NUM: null | number;
    LINK: string;
    CREATED: number;        // new Date().valueOf() == ms as number
    AVAILABLE: Boolean;
    REDEEMED: Boolean;
    PURCHASED?: number;     // new Date().valueOf() == ms as number
    TRANSACTION_ID?: string; // Foreign Key to Transactions Table
}


export interface CSVVoucher {
    VOUCHER_ID: string;
    TourTitle: string;
    Quantity: string | number;
    REDEEMED: boolean;
    State: string;
    TOUR_NUM: null | number;
    LINK: string;
    AVAILABLE: boolean;
    CREATED: string;                
    PURCHASED?: null | number;     
    TRANSACTION_ID?: null | string;
    isNewTour?: boolean;
    dbStatus?: string | null;
    allTitles?: string[] | null;

}

export interface TourTitle {
    TITLE: string;
    COUNT: number;
}

export interface Tour {
    TOUR_REGION: string;
    TOUR_NUM: number;
    TITLES: string[];
    VM_PUBLISHED: boolean;
}

export interface ExistingTourTitle {
    TourTitle: TourTitle;
    allTitles: string[];
    tourNumber: number;
    dbIndex: number;
    confirmed?: boolean;
    published?: boolean;
    updateDBLinks?: boolean;
    updatedTourTitle? : boolean;
    updatedDBTour?: boolean;
}

export interface NewTourTitle {
    TourTitle: TourTitle;
    confirmed: boolean;
    tourNumber? : number;
    published?: boolean;
    createdInDB?: boolean;
}