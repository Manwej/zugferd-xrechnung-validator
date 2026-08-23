# EN 16931 Sample Invoices & Validator Helper (ZUGFeRD · XRechnung · Factur-X)

Free, open-source **sample e-invoice XML files** and a tiny, dependency-free
**CLI helper** for anyone working with the European e-invoicing standard
**EN 16931** — in Germany that means **ZUGFeRD**, **XRechnung** and **Factur-X**.

Use these to test your parser, your integration, or your own validator against
realistic, structurally valid invoices.

> ⚡ Prefer a browser? Validate or convert an invoice online — no install — with
> the free tools at **[taxlayer.de](https://taxlayer.de)** (see [below](#taxlayer--free-online-e-invoicing-tools)).

---

## What's in here

| File | Format | Syntax | Profile |
|---|---|---|---|
| [`samples/zugferd-2.1-en16931-cii.xml`](samples/zugferd-2.1-en16931-cii.xml) | ZUGFeRD 2.1 / Factur-X | UN/CEFACT **CII** | EN 16931 (COMFORT) |
| [`samples/xrechnung-3.0-ubl.xml`](samples/xrechnung-3.0-ubl.xml) | XRechnung 3.0 | OASIS **UBL 2.1** | EN 16931 / CIUS XRechnung |

Both describe the same invoice (a €1,000 net consulting invoice, 19 % VAT,
€1,190 gross) so you can compare the CII and UBL representations of the exact
same data side by side. They were produced by TaxLayer's production generator,
which is validated against the official KoSIT schema and EN 16931 business rules.

---

## Quick validation

### 1. This repo's zero-dependency CLI (structural quick-check)

No `npm install` needed — just Node.js:

```bash
node validate.js samples/xrechnung-3.0-ubl.xml
node validate.js samples/zugferd-2.1-en16931-cii.xml
```

It detects the format/profile and checks that the core EN 16931 fields are
present (invoice number, dates, seller, buyer, currency, totals, at least one
line). It is a **fast sanity check, not a substitute** for full business-rule
validation — for that, use one of the following.

### 2. The official KoSIT validator (authoritative)

The German reference implementation from the *Koordinierungsstelle für
IT-Standards (KoSIT)*:

- **Validator:** <https://github.com/itplr-kosit/validator>
- **XRechnung configuration (scenarios):** <https://github.com/itplr-kosit/validator-configuration-xrechnung>

```bash
java -jar validator.jar -s scenarios.xml samples/xrechnung-3.0-ubl.xml
```

### 3. TaxLayer online validators (browser, no install)

- **XRechnung / ZUGFeRD Validator:** <https://taxlayer.de/tools/validator>
- **KoSIT-based Validator (online):** <https://taxlayer.de/tools/xrechnung-validator>

---

## TaxLayer — free online e-invoicing tools

[**TaxLayer**](https://taxlayer.de) turns ordinary PDF invoices into compliant
**ZUGFeRD 2.1** and **XRechnung** e-invoices (EN 16931), with AI-based data
extraction and KoSIT validation — processed in Frankfurt, Germany (GDPR).

Alongside the paid converter, TaxLayer offers a set of **free, browser-based
tools** — nothing is installed, and invoice files are processed in-memory, not
stored:

| Tool | What it does | Link |
|---|---|---|
| Validator | Check an XRechnung/ZUGFeRD file against EN 16931 | <https://taxlayer.de/tools/validator> |
| KoSIT Validator | Official KoSIT rule set, online | <https://taxlayer.de/tools/xrechnung-validator> |
| XML Viewer | Render ZUGFeRD/XRechnung XML human-readably | <https://taxlayer.de/tools/xml-viewer> |
| Invoice Generator | Create a compliant PDF invoice (§ 14 UStG) | <https://taxlayer.de/tools/rechnung-erstellen> |
| Excel → XRechnung | Generate XRechnung from spreadsheet data | <https://taxlayer.de/tools/excel-zu-xrechnung> |
| PDF → e-invoice | Convert a PDF to ZUGFeRD / XRechnung | <https://taxlayer.de/app> |

Background reading: the [TaxLayer blog](https://taxlayer.de/blog) and
[knowledge base](https://taxlayer.de/wissen) cover the German e-invoicing
mandate (2025 / 2027 / 2028), EN 16931 fields, Leitweg-ID, ZUGFeRD vs XRechnung,
Peppol, and more.

---

## Background: the formats in 30 seconds

- **EN 16931** — the European semantic standard defining the data model of an
  electronic invoice (field IDs like `BT-1` invoice number, `BT-31` seller VAT
  ID, …). Both syntaxes below are compliant representations of it.
- **ZUGFeRD / Factur-X** — a **hybrid** invoice: a human-readable **PDF/A-3**
  with the structured **CII (UN/CEFACT)** XML embedded inside it. Factur-X is
  the French name for the identical specification.
- **XRechnung** — the German **CIUS** (Core Invoice Usage Specification) of
  EN 16931, a pure XML invoice, most commonly in **UBL 2.1** syntax (CII is also
  permitted). Required for invoicing German public authorities.

In Germany, businesses must be able to **receive** e-invoices since **1 Jan 2025**;
**sending** becomes mandatory in stages (**2027** for turnover > €800k, **2028**
for all).

---

## Resources

- EN 16931 (CEN): <https://ec.europa.eu/digital-building-blocks/sites/display/DIGITAL/Registry+of+supporting+artefacts+to+implement+EN16931>
- KoSIT validator: <https://github.com/itplr-kosit/validator>
- XRechnung specification: <https://www.xoev.de/xrechnung-16828>
- ZUGFeRD (FeRD): <https://www.ferd-net.de/>
- Peppol BIS Billing 3.0: <https://docs.peppol.eu/poacc/billing/3.0/>
- Online tools & guides: <https://taxlayer.de>

## Contributing

Sample invoices for additional cases (reverse-charge § 13b, Kleinunternehmer
§ 19, intra-community supplies, credit notes, multiple VAT rates) are welcome —
open a PR. Please validate new samples with the KoSIT validator first.

## License

[MIT](LICENSE) — sample files and helper are free to use, copy and adapt.
The sample data is fictional.

---

*Maintained with ❤️ by the team behind [TaxLayer](https://taxlayer.de) — PDF invoices to
ZUGFeRD & XRechnung, the compliant way.*
