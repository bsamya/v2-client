import type { Timestamp } from "firebase/firestore"
export type Notifications = "Applications" | "Accounting" | "Company Updates"
export type Permissions = "Manage Users" | "Manage Company Info" | "View Applications" | "Edit Applications"

export type Company = {
  partnerId: string,
  partnerCode: string,
  companyId: string,
  company: string,
  dba: boolean,
  dbaName: string,
  dbaUrl: string,
  website: string,
  agent: null | string,
  agentId: null | string,
  associates: string[],
  registeredAddress: string,
  hasOperationsAddress: boolean,
  operationsAddress: string,
  contacts: {
    contactId: string,
    fullName: string,
    title: string,
    email: string,
    tel: string,
    extension: string,
    mobile: string,
    notifications: string[],
  }[],
  businessLicense: {
    number: string,
    expiry: string,
    url: string,
  },
  isManufacturer: boolean,
  manufacturingLicense: {
    number: string,
    expiry: string,
    url: string,
  }
  goodManufacturingLicenseURL: string,
  isChamberMember: boolean,
  chamberMembership: {
    number: string,
    expiry: string,
  }

  authorizedUsers: string[],
  isDefault?: boolean,
  isArchived?: boolean,

  userSettings: Record<string, {
    permissions: (Permissions)[]
    notifications: (Notifications)[]

    created: {
      by: string
      date: Timestamp
    }
    lastUpdate: {
      by: string
      date: Timestamp
    }
  }>,

  status: "approved" | "pending" | "rejected",
  events: {
    created?: { by: string, date: Timestamp },
    submitted?: { by: string, date: Timestamp }[],
    lastUpdated?: { by: string, date: Timestamp }[],
  },
}

export type CompanyNotifications = Partial<Record<Notifications, string[]>>

export type CompanyContact = Company["contacts"][0]

//Applications types depend on CompanyNotifications
export interface Application {
  /** Unique identifier for this certificate */
  applicationId: string

  /** Associated company */
  companyId: string

  /** Country where the certificate applies */
  country: string

  /** Language of the certificate (e.g., 'en', 'es', 'fr') */
  language: string

  /** Number of copies requested */
  copies: number

  /** Whether authentication is required */
  authentication: boolean

  /** List of product IDs or names included in this certificate */
  products: string[]

  /** Indicates if an addendum is included */
  hasAddendum: boolean

  /** Reference or content of the addendum (nullable for flexibility) */
  addendum?: string | null

  /** Delivery information */
  delivery: {
    /** Delivery methods chosen */
    method: ('prepaidLabel' | 'usps' | 'scanAndSend')[]

    /** Uploaded prepaid label file path, if applicable */
    prepaidLabel?: string | null

    /** USPS mailing details */
    usps: {
      recipient: MailingAddress | null
      trackingNumber: string | null
      date: Date | null
    } | null
  }
  /** Notification preferences or settings */
  notifications: CompanyNotifications,
  status: 'draft' | 'submitted' | 'approved' | 'rejected'

  events: {
    created: Timestamp | null
    lastUpdated: Timestamp | null
    submitted?: Timestamp
    approved?: Timestamp
    rejected?: Timestamp
  }

}

export interface CFS extends Application {
  type: 'CFS'
  /** Attached documents */
  documents: {
    invoice: string[]
    manufacturingStatement: string[]
  }
}

export interface GMP extends Application {
  type: 'GMP'
  /** Attached documents */
  documents: {
    GMPStatement: string[]
  }
}

/** Union of all application types */
export type CFS_GMP = CFS | GMP


export type COO = {
  applicationId: string;
  certificateType: "COO";
  partnerCode: string;
  companyId: string;
  language: string;
  status: string;
  seller: string;
  consignee: Address | null;
  buyer: Address | null;
  transportationType: string;
  transportType: string;
  portOfLoading: string;
  destinationCountry: string;
  destinationPort: string;
  consignorReference: string;
  importPermitNumber: string;
  billOfLadingNumber: string;
  ownerAgent: string;
  exportCarrier: string;
  forwardingAgent: string | null;
  exportDate: string;
  remarks: string;
  shipment: COOShippingItem[];

  documents: {
    invoice: string[];
    packingList: string[];
    otherDocuments: string[];
  };
  events: {
    created: Timestamp | null;
    lastUpdated: Timestamp | null;
    submitted?: Timestamp;
    approved?: Timestamp;
    declined?: Timestamp;
  };
};

export type COOShippingItem = {
  description: string;
  countryOfOrigin: string[];
  hsCode: string;
  netWeight: string;
  grossWeight: string;
  marksAndNumbers: string;
};

export type MailingAddress = {
  id: string
  company: string
  name: string
  address: string
  city: string
  state: string
  zip: string
}


export type Address = {
  addressId: string;
  type: 'buyer' | 'consignee';
  company: string;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
  isDeleted: boolean;
};