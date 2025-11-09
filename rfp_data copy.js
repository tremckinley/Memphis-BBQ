// JavaScript module - not JSON
const rfpData = {
    "confidence": "medium",
    "flags": [
      "The Bid Due Date is listed as Nov 19, 2025 on amended pages (Page 1, 4) but as Nov 12, 2025 in the terms (Page 10). The amended date of Nov 19 is most likely correct.",
      "The mailing address for bids is listed as 'Room 368' (Page 2) but also 'Room 354' (Page 10). Bidders should verify the correct room before mailing.",
      "Key documents, including the 'Bid & Price Sheet' and 'Insurance Requirements,' are attachments and were not included in this text. These attachments are required for submission."
    ],
    "projectInfo": {
      "rfpNumber": "325762,1",
      "title": "Fire Sprinkler System Maintenance",
      "issuingOrganization": "City of Memphis"
    },
    "summary": {
      "scope": "The City of Memphis is seeking bids from qualified vendors to provide maintenance services for fire sprinkler systems.",
      "contractDuration": null,
      "contractValue": "TBD / Bidder sets price"
    },
    "keyDates": [
      {
        "event": "Question Deadline",
        "date": "2025-11-05",
        "time": "5:00 PM CT",
        "sourceSection": "Page 2 "
      },
      {
        "event": "Answers Posted",
        "date": "2025-11-12",
        "time": "5:00 PM CT",
        "sourceSection": "Page 2 "
      },
      {
        "event": "Bid Due Date",
        "date": "2025-11-19",
        "time": "12:00 PM CT",
        "sourceSection": "Page 1 "
      }
    ],
    "keyContacts": [
      {
        "name": "Sherrod, Lakisha",
        "role": "Buyer / Sole Point of Contact",
        "contactInfo": "lakisha.sherrod@memphistn.gov, 901-636-6195",
        "sourceSection": "Page 2 , Page 13 "
      }
    ],
    "keyAddresses": [
      {
        "type": "Bid Submission - eProcurement (Preferred)",
        "address": "eProcurement system/online (which is the preferable method for bidding)",
        "sourceSection": "Page 1 "
      },
      {
        "type": "Bid Submission - By Hand",
        "address": "City of Memphis, Main Lobby, Bid Drop Box, 125 N. Main St, Memphis, TN 38103",
        "sourceSection": "Page 10 "
      },
      {
        "type": "Bid Submission - Mail",
        "address": "City of Memphis, Purchasing Department, Room 354, 125 N. Main St, Memphis, TN 38103",
        "sourceSection": "Page 10 "
      }
    ],
    "qualifications": {
      "eligibilityRequirements": [
        {
          "requirement": "Registered City of Memphis Supplier",
          "details": "You must be registered as a supplier with the City of Memphis to participate. You can register on the City's website.",
          "sourceSection": "Page 1 "
        },
        {
          "requirement": "Memphis and Shelby County Business License",
          "details": "If your business operates within the city limits of Memphis, you must have a current Memphis and Shelby County business license.",
          "sourceSection": "Page 12 "
        },
        {
          "requirement": "Comply with laws on hiring",
          "details": "You must certify that you comply with all federal and state laws prohibiting the employment of individuals not legally authorized to work in the United States.",
          "sourceSection": "Page 17 "
        },
        {
          "requirement": "Local Business Preference (Optional)",
          "details": "The bid may be subject to a local preference for businesses in Memphis. To be considered for this, you must include a copy of your local business tax receipt.",
          "sourceSection": "Page 2 "
        }
      ],
      "insuranceRequirements": [
        {
          "type": "Various",
          "amount": "Not Specified in Text",
          "details": "Insurance is required. You must review the 'Fire Sprinkler System Maintenance Insurance Requirements' attachment (listed on Page 8) for specific types and amounts. A Certificate of Insurance will be required from the winning bidder.",
          "sourceSection": "Page 1 , Page 8 , Page 11 "
        }
      ],
      "equipmentRequirements": []
    },
    "disqualifiers": [
      {
        "reason": "Bid is submitted by email.",
        "sourceSection": "Page 1 "
      },
      {
        "reason": "A hardcopy bid is not physically signed.",
        "sourceSection": "Page 1 "
      },
      {
        "reason": "Failure to submit ALL required attachments and documentation.",
        "sourceSection": "Page 1 "
      },
      {
        "reason": "Bid is received after the deadline (Late Bid).",
        "sourceSection": "Page 11 "
      },
      {
        "reason": "Contacting any City personnel other than the designated buyer (Lakisha Sherrod) about the RFQ.",
        "sourceSection": "Page 11 , Page 13 "
      },
      {
        "reason": "Bid contains modifications to the RFQ's terms and conditions.",
        "sourceSection": "Page 10 "
      }
    ],
    "tasks": [
      {
        "id": 1,
        "title": "Register as a City of Memphis Supplier",
        "priority": "high",
        "sourceText": "Vendors must be registered as a supplier with the City of Memphis to participate in City of Memphis bids.",
        "sourceSection": "Page 1 ",
        "subtasks": [
          {
            "id": 11,
            "title": "Visit Memphistn.gov - Business - Supplier Registration and complete the Online Suppliers Registration Form "
          }
        ]
      },
      {
        "id": 2,
        "title": "Review All Attachments",
        "priority": "high",
        "sourceText": "If attachments are included with this RFQ, Bidders are to fill out and return, in their entirety, all required attachments",
        "sourceSection": "Page 1 ",
        "subtasks": [
          {
            "id": 21,
            "title": "Locate and review 'Fire Sprinkler Systems maintenance (Bid & Price Sheet)' "
          },
          {
            "id": 22,
            "title": "Locate and review 'Fire Sprinkler System Maintenance Specifications' "
          },
          {
            "id": 23,
            "title": "Locate and review 'Fire Sprinkler System Maintenance Insurance Requirements' "
          }
        ]
      }
    ],
    "requiredDocuments": [
      {
        "id": 1,
        "name": "Specifications/Bid Section (Bid & Price Sheet)",
        "required": true,
        "instructions": "This is the main form for your bid, listed as an attachment. You must fill it out completely. If submitting online, you must enter the 'Grand Total' from this form into the Oracle system.",
        "sourceText": "Fill out, in its entirety the attached Specifications/Bid Section and return for evaluation and award purposes. ... Any bid submitted without this attachment may be deemed non-conforming. In Oracle, enter the Grand Total from the attached Bid Section.",
        "sourceSection": "Page 7 , Page 8 "
      },
      {
        "id": 2,
        "name": "All other required attachments (e.g., Comply/Exception Pages)",
        "required": true,
        "instructions": "The RFQ mentions other attachments like 'Exceptions to Specifications Pages' and 'Comply/Exception Pages'. You must find, complete, and return all forms that are part of the RFQ package.",
        "sourceText": "Bidders are to fill out and return, in their entirety, all required attachments (attachments may include, but are not limited to: Bid Sections, Exceptions to Specifications Pages, Comply/Exception Pages...)",
        "sourceSection": "Page 1 "
      },
      {
        "id": 3,
        "name": "Signature for Contract Specifications (Page XXVI)",
        "required": true,
        "instructions": "Page 26 of the RFQ is a signature form that must be completed, signed, and returned with your bid.",
        "sourceText": "SIGNATURE FOR CONTRACT SPECIFICATIONS",
        "sourceSection": "Page 26 "
      },
      {
        "id": 4,
        "name": "Disclosure of Criminal and Civil Proceedings",
        "required": true,
        "instructions": "You must provide a written description of all ongoing or past (within 10 years) civil or criminal proceedings against your company. This must be included with your bid.",
        "sourceText": "PROPOSING FIRM'S DISCLOSURE OF CRIMINAL AND CIVIL PROCEEDINGS. ... This information must be included as part of your bid response.",
        "sourceSection": "Page 13 "
      },
      {
        "id": 5,
        "name": "List of Exceptions (if any)",
        "required": false,
        "instructions": "If your bid deviates from the specifications in any way, you must list these exceptions on a separate sheet. Do not just send a product brochure instead.",
        "sourceText": "The bidder is required to list all exceptions, deviations or variations to the specifications in a clear, logical fashion on a sheet designated by the bidder as such.",
        "sourceSection": "Page 13 "
      },
      {
        "id": 6,
        "name": "Memphis and Shelby County Business Tax Receipt",
        "required": false,
        "instructions": "This is only required if you want to be considered for the Local Business Preference. It will also be required from the winning vendor if their business is in Memphis.",
        "sourceText": "A COPY OF YOUR MEMPHIS AND SHELBY COUNTY TENNESSEE BUSINESS TAX RECEIPT MUST ACCOMPANY YOUR BID FOR CONSIDERATION OF THIS ORDINANCE.",
        "sourceSection": "Page 2 , Page 12 "
      }
    ],
    "scoringCriteria": [
      {
        "criteria": "Price",
        "weight": "Primary",
        "description": "The City will rank bids based on 'Price Only'.",
        "sourceSection": "Page 6 "
      },
      {
        "criteria": "Lowest and Best Bid",
        "weight": "Overall",
        "description": "The final award will be made to the 'lowest and best bid' that meets all requirements set forth in the solicitation.",
        "sourceSection": "Page 11 "
      }
    ]
  };

export default rfpData;