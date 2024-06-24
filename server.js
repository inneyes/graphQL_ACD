const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs');
const path = require('path');

// Helper function to load JSON data from files
const loadJSON = (filename) => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', filename), 'utf8'));
};

// Load JSON data
const poData = loadJSON('PO.json');
const creditNoteData = loadJSON('Credit_Note.json');
const debitNoteData = loadJSON('Debit_Note.json');
const deliveryOrderTaxInvoiceData = loadJSON('Delivery_OrderTax_Invoice.json');
const receiptTaxInvoiceData = loadJSON('ReceiptTax_Invoice.json');

// Define GraphQL schema
const typeDefs = gql `
  type Taxes {
    Tax: [Tax]
  }
  type Tax {
    Code: String
    Rate: Float
    Amount: Float
  }

  type LineItems {
    Item: [Item]
  }

  type Item {
    No: Int
    Id: Int
    Name: String
    Description: String
    Quantity: Int
    Unit: String
    Price: Float
    Allowances: String
    Amount: Float
    Tax: Tax
    TaxAmount: Float
    Total: Float
  }

  type Seller {
    ID: String
    Name: String
    TaxID: String
    TaxIDType: String
    Branch: Int
    BuildingNo: Int
    BuildingName: String
    Street: String
    District: String
    City: String
    Province: String
    PostalCode: Int
    CountryCode: String
    CountryName: String
    Telephone: String
    Fax: String
    Contact: String
    Department: String
    Email: String
  }

  type Buyer {
    ID: Int
    Name: String
    TaxID: String
    TaxIDType: String
    Branch: String
    BuildingNo: Int
    BuildingName: String
    Street: String
    District: String
    City: String
    Province: String
    PostalCode: Int
    CountryCode: String
    CountryName: String
    Telephone: String
    Fax: String
    Contact: String
    Department: String
    Email: String
  }

  type Summary {
    Data: [Data]
  }

  type Data {
    Label: String
    Amount: Float
  }

  type Settings {
    TaxInclusive: Boolean
    InlineTax: Boolean
    InlineAllowance: Boolean
    CumulativeAllowance: Boolean
  }

  type PurchaseOrder {
    TypeCode: String
    TypeNameTh: String
    TypeNameEn: String
    No: String
    Date: String
    Seller: Seller
    Buyer: Buyer
    DueDate: String
    PurposeCode: String
    Purpose: String
    References: String
    IssueToBranch: Int
    Remark: String
    CurrencyCode: String
    Currency: String
    LineItems: LineItems
    TotalQuantity: Int
    Quantity: Int
    Amount: Float
    ChargeTotal: Float
    AllowanceTotal: Float
    TaxBasisAmount: Float
    NonVat: Float
    TaxAmount: Float
    Taxes: Tax
    Total: Float
    Summary: Summary
    TotalEn: String
    TotalTh: String
    Settings: Settings
    Manager: String
    Position: String
    RelatedInvoices: ReceiptTaxInvoice
    RelatedDeliveryOrders: DeliveryOrderTaxInvoice
  }

  type References {
    TypeCode: String
    No: String
    Date: String
  }

  type CreditNote {
    TypeCode: String
    TypeNameTh: String
    TypeNameEn: String
    No: String
    Date: String
    Seller: Seller
    Buyer: Buyer
    DueDate: String
    PurposeCode: String
    Purpose: String
    References: References
    OriginalAmount: Float
    CorrectAmount: Float
    DifferenceAmount: Float
    CurrencyCode: String
    Currency: String
    LineItems: LineItems
    TotalQuantity: Int
    Quantity: Int
    Amount: Float
    ChargeTotal: Float
    AllowanceTotal: Float
    TaxBasisAmount: Float
    TaxAmount: Float
    Taxes: Taxes
    Total: Float
    Summary: Summary
    TotalEn: String
    TotalTh: String
    Settings: Settings
    Manager: String
    Position: String
  }

  type DebitNote {
    TypeCode: String
    TypeNameTh: String
    TypeNameEn: String
    No: String
    Date: String
    Seller: Seller
    Buyer: Buyer
    DueDate: String
    PurposeCode: String
    Purpose: String
    References: References
    OriginalAmount: Float
    CorrectAmount: Float
    DifferenceAmount: Float
    CurrencyCode: String
    Currency: String
    LineItems: LineItems
    TotalQuantity: Int
    Quantity: Int
    Amount: Float
    ChargeTotal : Float
    AllowanceTotal: Float
    TaxBasisAmount: Float
    NonVat: Float
    TaxAmount: Float
    Taxes: Taxes
    Total: Float
    Summary: Summary
    TotalEn: String
    TotalTh: String
    Settings: Settings
    Manager: String
    Position: String
  }

  type DeliveryOrderTaxInvoice {
    TypeCode: String
    TypeNameTh: String
    TypeNameEn: String
    No: String
    Date: String
    Seller: Seller
    Buyer: Buyer
    DueDate: String
    PurposeCode: String
    Purpose: String
    References: References
    Remark: String
    FormOfPayment : String
    CurrencyCode: String
    Currency: String
    LineItems: LineItems
    TotalQuantity: Int
    Quantity: Int
    Amount: Float
    ChargeTotal : Float
    AllowanceTotal: Float
    TaxBasisAmount: Float
    NonVat: Float
    TaxAmount: Float
    Taxes: Taxes
    Total: Float
    Summary: Summary
    TotalEn: String
    TotalTh: String
    Settings: Settings
    Manager: String
    Position: String
  }

  type ReceiptTaxInvoice {
    TypeCode: String
    TypeNameTh: String
    TypeNameEn: String
    No: String
    Date: String
    Seller: Seller
    Buyer: Buyer
    DueDate: String
    PurposeCode: String
    Purpose: String
    References: References
    CurrencyCode: String
    Currency: String
    LineItems: LineItems
    TotalQuantity: Int
    Quantity: Int
    Amount: Float
    ChargeTotal: Float
    AllowanceTotal: Float
    TaxBasisAmount: Float
    NonVat: Float
    TaxAmount: Float
    Taxes: Taxes
    Total: Float
    Summary: Summary
    TotalEn: String
    TotalTh: String
    Settings: Settings
    Manager: String
    Position: String
  }

  type Query {
    getPurchaseOrder(No: String!): PurchaseOrder
    getCreditNote: CreditNote
    getDebitNote: DebitNote
    getDeliveryOrderTaxInvoice: DeliveryOrderTaxInvoice
    getReceiptTaxInvoice: ReceiptTaxInvoice
  }

  type Mutation {
    createCreditNoteFromReceipt(No: String!, newPrice: Float!): CreditNote
    createDebitNoteFromReceipt(No: String!, newPrice: Float!): DebitNote
  }
`;

// Define resolvers
const resolvers = {
    Query: {
        getPurchaseOrder: (_, { No }) => {
            const purchaseOrder = poData.GetInvoice.find(po => po.No === No);
            const receipt = receiptTaxInvoiceData.GetInvoice;
            const delivery = deliveryOrderTaxInvoiceData.GetInvoice;
            if (purchaseOrder) {
                purchaseOrder.RelatedInvoices = receiptTaxInvoiceData.GetInvoice.filter(receipt => receipt.References);
                purchaseOrder.RelatedDeliveryOrders = deliveryOrderTaxInvoiceData.GetInvoice.filter(delivery => delivery.References);
            }
            return purchaseOrder;
        },
        getPurchaseOrder: () => poData.GetInvoice,
        getCreditNote: () => creditNoteData.GetInvoice,
        getDebitNote: () => debitNoteData.GetInvoice,
        getDeliveryOrderTaxInvoice: () => deliveryOrderTaxInvoiceData.GetInvoice,
        getReceiptTaxInvoice: () => receiptTaxInvoiceData.GetInvoice,
    },
    Mutation: {
        createCreditNoteFromReceipt: (_, { No, newPrice }) => {
            const receipt = receiptTaxInvoiceData.GetInvoice;
            if (receipt.No === No && receipt.Amount > newPrice) { // If receipt amount is higher than new price
                const newCreditNote = {
                    TypeCode: "CN",
                    TypeNameTh: "Credit Note",
                    TypeNameEn: "Credit Note",
                    No: `CN-${Date.now()}`,
                    Date: new Date().toISOString(),
                    Seller: receipt.Seller,
                    Buyer: receipt.Buyer,
                    Purpose: "Price Adjustment",
                    References: {
                        TypeCode: receipt.TypeCode,
                        No: receipt.No,
                        Date: receipt.Date
                    },
                    OriginalAmount: receipt.Amount,
                    CorrectAmount: newPrice,
                    DifferenceAmount: receipt.Amount - newPrice,
                    CurrencyCode: receipt.CurrencyCode,
                    Currency: receipt.Currency,
                    LineItems: receipt.LineItems,
                    TotalQuantity: receipt.TotalQuantity,
                    Amount: newPrice,
                    TaxAmount: (newPrice * receipt.Taxes.Tax.Rate) / 100,
                    Total: newPrice + (newPrice * receipt.Taxes.Tax.Rate) / 100
                };
                creditNoteData.GetInvoice = newCreditNote;
                fs.writeFileSync(path.join(__dirname, 'data', 'Credit_Note.json'), JSON.stringify(creditNoteData, null, 2));
                return newCreditNote;
            }
            return null;
        },
        createDebitNoteFromReceipt: (_, { No, newPrice }) => {
            const receipt = receiptTaxInvoiceData.GetInvoice;
            if (receipt.No === No && receipt.Amount < newPrice) { // If receipt amount is lower than new price
                const newDebitNote = {
                    TypeCode: "DN",
                    TypeNameTh: "Debit Note",
                    TypeNameEn: "Debit Note",
                    No: `DN-${Date.now()}`,
                    Date: new Date().toISOString(),
                    Seller: receipt.Seller,
                    Buyer: receipt.Buyer,
                    Purpose: "Price Adjustment",
                    References: {
                        TypeCode: receipt.TypeCode,
                        No: receipt.No,
                        Date: receipt.Date
                    },
                    OriginalAmount: receipt.Amount,
                    CorrectAmount: newPrice,
                    DifferenceAmount: newPrice - receipt.Amount,
                    CurrencyCode: receipt.CurrencyCode,
                    Currency: receipt.Currency,
                    LineItems: receipt.LineItems,
                    TotalQuantity: receipt.TotalQuantity,
                    Amount: newPrice,
                    TaxAmount: (newPrice * receipt.Taxes.Tax.Rate) / 100,
                    Total: newPrice + (newPrice * receipt.Taxes.Tax.Rate) / 100
                };
                debitNoteData.GetInvoice = newDebitNote;
                fs.writeFileSync(path.join(__dirname, 'data', 'Debit_Note.json'), JSON.stringify(debitNoteData, null, 2));
                return newDebitNote;
            }
            return null;
        }

    }
};

// Create an Apollo Server instance
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Start the server
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});