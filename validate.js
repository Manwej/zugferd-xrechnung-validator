#!/usr/bin/env node
/**
 * EN 16931 structural quick-check — dependency-free.
 *
 *   node validate.js <path-to-invoice.xml>
 *
 * Detects the format (CII / UBL) and checks that the core EN 16931 fields are
 * present. This is a FAST SANITY CHECK, not full business-rule validation.
 * For authoritative validation use the KoSIT validator
 * (https://github.com/itplr-kosit/validator) or the online tools at
 * https://taxlayer.de/tools/validator .
 */
"use strict";
const fs = require("fs");

const file = process.argv[2];
if (!file) {
  console.error("Usage: node validate.js <path-to-invoice.xml>");
  process.exit(2);
}

let xml;
try {
  xml = fs.readFileSync(file, "utf8");
} catch (e) {
  console.error(`Cannot read file: ${file}\n${e.message}`);
  process.exit(2);
}

// Element helpers — tolerant of namespace prefixes and attributes
// (e.g. <cbc:PayableAmount currencyID="EUR">…</cbc:PayableAmount>).
const hasEl = (name) => new RegExp(`<(?:\\w+:)?${name}[\\s>]`).test(xml);
const valOf = (name) => {
  const m = xml.match(new RegExp(`<(?:\\w+:)?${name}(?:\\s[^>]*)?>([^<]+)`));
  return m ? m[1].trim() : null;
};

const isCII = /<(?:\w+:)?CrossIndustryInvoice[\s>]/.test(xml);
const isUBL = /<(?:\w+:)?Invoice[\s>]/.test(xml) && /urn:oasis:names:specification:ubl/.test(xml);

console.log(`\nFile: ${file}`);

if (!isCII && !isUBL) {
  console.error("✗ Unrecognized format — expected UN/CEFACT CII (ZUGFeRD/Factur-X) or OASIS UBL (XRechnung).");
  process.exit(1);
}

const results = [];
const check = (label, ok, detail) => results.push({ label, ok, detail });

if (isCII) {
  const profileM = xml.match(/GuidelineSpecifiedDocumentContextParameter>[\s\S]*?<(?:\w+:)?ID>([^<]+)/);
  console.log(`Format:  UN/CEFACT CII (ZUGFeRD / Factur-X)`);
  console.log(`Profile: ${profileM ? profileM[1].trim() : "(not found)"}\n`);

  check("Invoice header (ExchangedDocument)", hasEl("ExchangedDocument"));
  check("Invoice type code (BT-3)", hasEl("TypeCode"));
  check("Issue date (BT-2)", hasEl("IssueDateTime"));
  check("Currency (BT-5)", hasEl("InvoiceCurrencyCode"), valOf("InvoiceCurrencyCode"));
  check("Seller (BG-4)", hasEl("SellerTradeParty"));
  check("Buyer (BG-7)", hasEl("BuyerTradeParty"));
  check("At least one line (BG-25)", hasEl("IncludedSupplyChainTradeLineItem"));
  check("VAT breakdown (BG-23)", hasEl("ApplicableTradeTax"));
  check("Grand total (BT-112)", hasEl("GrandTotalAmount"), valOf("GrandTotalAmount"));
  check("Amount due (BT-115)", hasEl("DuePayableAmount"), valOf("DuePayableAmount"));
} else {
  console.log(`Format:  OASIS UBL 2.1 (XRechnung)`);
  console.log(`Profile: ${valOf("CustomizationID") || "(not found)"}\n`);

  check("Invoice number (BT-1)", hasEl("ID"));
  check("Issue date (BT-2)", hasEl("IssueDate"));
  check("Invoice type code (BT-3)", hasEl("InvoiceTypeCode"));
  check("Currency (BT-5)", hasEl("DocumentCurrencyCode"), valOf("DocumentCurrencyCode"));
  check("Seller (BG-4)", hasEl("AccountingSupplierParty"));
  check("Buyer (BG-7)", hasEl("AccountingCustomerParty"));
  check("At least one line (BG-25)", hasEl("InvoiceLine"));
  check("Tax total (BG-22)", hasEl("TaxTotal"));
  check("Payable amount (BT-115)", hasEl("PayableAmount"), valOf("PayableAmount"));
  const hasRef = !!valOf("BuyerReference");
  check("Buyer reference / Leitweg-ID (BT-10)", hasRef, hasRef ? valOf("BuyerReference") : "recommended for XRechnung to public bodies");
}

let ok = true;
for (const r of results) {
  if (!r.ok) ok = false;
  console.log(`  ${r.ok ? "✓" : "✗"} ${r.label}${r.detail ? `  →  ${r.detail}` : ""}`);
}

console.log(
  ok
    ? "\n✓ Core EN 16931 fields present (structural check passed).\n"
    : "\n✗ Some core fields are missing — see above.\n"
);
console.log("Authoritative validation:");
console.log("  • KoSIT validator:      https://github.com/itplr-kosit/validator");
console.log("  • Online (no install):  https://taxlayer.de/tools/validator\n");

process.exit(ok ? 0 : 1);
