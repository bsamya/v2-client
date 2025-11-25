
// ~/data/sampleShipment.ts
export interface ShipmentItem {
  description: string;
  grossWeight: string;
  countryOfOrigin: string[];
}

export const sampleShipment: ShipmentItem[] = [
  {
    description:
      "Industrial steel components for automotive manufacturing including precision-machined parts",
    grossWeight: "1250 kg",
    countryOfOrigin: ["CN", "VN"],
  },
  {
    description: "High-grade organic cotton textile materials",
    grossWeight: "850 kg",
    countryOfOrigin: ["IN"],
  },
  {
    description:
      "Electronic circuit boards and semiconductor components designed for telecommunications equipment with quality certifications",
    grossWeight: "320 kg",
    countryOfOrigin: ["TW", "KR"],
  },
  {
    description:
      "Premium hardwood furniture pieces handcrafted from sustainably sourced mahogany and oak with decorative inlays and carved details featuring traditional craftsmanship techniques",
    grossWeight: "2100 kg",
    countryOfOrigin: ["VN"],
  },
  {
    description: "Agricultural machinery replacement parts and hydraulic components",
    grossWeight: "1680 kg",
    countryOfOrigin: ["US", "MX"],
  },
  {
    description:
      "Medical diagnostic equipment including digital imaging sensors, LCD display panels, and precision optical lenses",
    grossWeight: "540 kg",
    countryOfOrigin: ["JP"],
  },
  {
    description: "Packaged food products",
    grossWeight: "3200 kg",
    countryOfOrigin: ["IT", "FR"],
  },
  {
    description:
      "Industrial grade polymer resins and chemical additives for manufacturing processes with material safety data sheets and handling instructions included",
    grossWeight: "4500 kg",
    countryOfOrigin: ["DE"],
  },
  {
    description:
      "Precision measuring instruments and laboratory testing equipment calibrated to international standards",
    grossWeight: "280 kg",
    countryOfOrigin: ["CH"],
  },
  {
    description: "Renewable energy solar panel modules with aluminum frames",
    grossWeight: "1890 kg",
    countryOfOrigin: ["CN"],
  },
  {
    description:
      "Sports equipment including professional grade athletic wear, footwear, and training accessories",
    grossWeight: "650 kg",
    countryOfOrigin: ["VN", "TH"],
  },
  {
    description:
      "Architectural glass panels with specialized coatings for commercial construction projects featuring energy-efficient thermal properties and UV protection meeting building code requirements",
    grossWeight: "5200 kg",
    countryOfOrigin: ["BE"],
  },
  {
    description: "Automotive brake systems and suspension components",
    grossWeight: "980 kg",
    countryOfOrigin: ["MX"],
  },
  {
    description:
      "Consumer electronics including wireless communication devices, charging accessories, and protective cases",
    grossWeight: "420 kg",
    countryOfOrigin: ["CN", "VN"],
  },
  {
    description:
      "Industrial filtration systems with replaceable cartridges for water treatment applications",
    grossWeight: "1340 kg",
    countryOfOrigin: ["US"],
  },
  {
    description:
      "Pharmaceutical raw materials and active ingredients stored in temperature-controlled packaging with batch traceability documentation and certificates of analysis conforming to pharmacopoeia standards",
    grossWeight: "180 kg",
    countryOfOrigin: ["IN"],
  },
  {
    description:
      "Decorative lighting fixtures featuring LED technology and smart home integration capabilities",
    grossWeight: "730 kg",
    countryOfOrigin: ["IT"],
  },
  {
    description: "Marine navigation equipment and communication systems",
    grossWeight: "560 kg",
    countryOfOrigin: ["NO"],
  },
  {
    description:
      "Luxury leather goods including handbags, wallets, and travel accessories crafted from full-grain Italian leather",
    grossWeight: "290 kg",
    countryOfOrigin: ["IT"],
  },
  {
    description:
      "Industrial automation programmable logic controllers, sensors, actuators, and human-machine interface panels for factory control systems with comprehensive technical documentation installation guides warranty certificates",
    grossWeight: "1120 kg",
    countryOfOrigin: ["DE", "JP"],
  },
  {
    description: "Precision engineered bearings and rotary shaft components",
    grossWeight: "640 kg",
    countryOfOrigin: ["SE"],
  },
  {
    description:
      "Commercial kitchen appliances including stainless steel refrigeration units, convection ovens, and food preparation equipment",
    grossWeight: "2850 kg",
    countryOfOrigin: ["IT", "ES"],
  },
  {
    description:
      "Wireless networking infrastructure equipment with routers and access points",
    grossWeight: "380 kg",
    countryOfOrigin: ["US"],
  },
  {
    description:
      "Biodegradable packaging materials manufactured from recycled paper pulp and sustainable plant-based polymers with compostability certifications",
    grossWeight: "1560 kg",
    countryOfOrigin: ["FI"],
  },
  {
    description:
      "High-performance athletic footwear with specialized cushioning systems",
    grossWeight: "520 kg",
    countryOfOrigin: ["VN"],
  },
  {
    description:
      "Industrial pneumatic tools and compressed air equipment including impact wrenches, drills, and spray guns with maintenance kits",
    grossWeight: "890 kg",
    countryOfOrigin: ["JP"],
  },
  {
    description:
      "Organic cosmetics and skincare products with natural ingredients",
    grossWeight: "340 kg",
    countryOfOrigin: ["FR"],
  },
  {
    description:
      "Advanced robotics components featuring servo motors, encoders, motion controllers, and vision systems designed for precision manufacturing automation applications with safety compliance documentation",
    grossWeight: "1780 kg",
    countryOfOrigin: ["JP", "DE"],
  },
  {
    description: "Thermal insulation materials for construction applications",
    grossWeight: "3200 kg",
    countryOfOrigin: ["US"],
  },
  {
    description:
      "Professional audio recording equipment including condenser microphones, mixing consoles, and digital signal processors",
    grossWeight: "620 kg",
    countryOfOrigin: ["DE"],
  },
  {
    description:
      "Recycled aluminum ingots and scrap metal materials",
    grossWeight: "8500 kg",
    countryOfOrigin: ["CA"],
  },
  {
    description:
      "Laboratory glassware and scientific research supplies including beakers, flasks, pipettes, and graduated cylinders manufactured from borosilicate glass meeting ISO standards",
    grossWeight: "280 kg",
    countryOfOrigin: ["DE"],
  },
  {
    description:
      "Wind turbine blade components made from composite materials",
    grossWeight: "4200 kg",
    countryOfOrigin: ["DK"],
  },
  {
    description:
      "Professional photography equipment with digital cameras and lenses",
    grossWeight: "450 kg",
    countryOfOrigin: ["JP"],
  },
  {
    description:
      "Ceramic tiles and porcelain flooring materials with decorative patterns and glazed finishes suitable for residential and commercial installations",
    grossWeight: "5800 kg",
    countryOfOrigin: ["ES"],
  },
  {
    description:
      "Industrial safety equipment including protective helmets and harnesses",
    grossWeight: "720 kg",
    countryOfOrigin: ["US"],
  },
  {
    description:
      "Specialty coffee beans roasted and packaged in airtight containers with origin certifications from sustainable farms featuring fair trade practices and organic cultivation methods",
    grossWeight: "980 kg",
    countryOfOrigin: ["CO", "BR"],
  },
  {
    description:
      "Hydraulic excavator attachments and construction machinery implements",
    grossWeight: "3600 kg",
    countryOfOrigin: ["KR"],
  },
  {
    description:
      "Designer textiles including upholstery fabrics and decorative materials",
    grossWeight: "840 kg",
    countryOfOrigin: ["IT"],
  },
  {
    description:
      "Electric vehicle battery modules with lithium-ion cells, battery management systems, thermal management components, and safety disconnect switches tested to automotive standards",
    grossWeight: "2400 kg",
    countryOfOrigin: ["CN"],
  },
  {
    description: "Precision optical lenses for microscopy applications",
    grossWeight: "190 kg",
    countryOfOrigin: ["DE"],
  },
  {
    description:
      "Stainless steel pipes and industrial tubing with threaded fittings",
    grossWeight: "4800 kg",
    countryOfOrigin: ["IN"],
  },
  {
    description:
      "Aviation components including aircraft fasteners and structural elements",
    grossWeight: "1240 kg",
    countryOfOrigin: ["US"],
  },
  {
    description:
      "Professional dental equipment featuring digital imaging systems, sterilization units, examination chairs, and surgical instruments manufactured to medical device quality standards with regulatory certifications",
    grossWeight: "1680 kg",
    countryOfOrigin: ["DE"],
  },
  {
    description:
      "Bamboo flooring planks finished with eco-friendly coatings",
    grossWeight: "2200 kg",
    countryOfOrigin: ["CN"],
  },
  {
    description:
      "Laboratory centrifuges and sample processing equipment with temperature control",
    grossWeight: "580 kg",
    countryOfOrigin: ["US"],
  },
  {
    description:
      "Handwoven carpets and rugs made from natural wool fibers featuring intricate traditional patterns with artisan craftsmanship representing cultural heritage designs",
    grossWeight: "1100 kg",
    countryOfOrigin: ["TR", "IN"],
  },
  {
    description:
      "Commercial refrigeration compressors and HVAC system components",
    grossWeight: "1920 kg",
    countryOfOrigin: ["JP"],
  },
  {
    description:
      "Specialty alloy steel bars and metal extrusions",
    grossWeight: "3400 kg",
    countryOfOrigin: ["SE"],
  },
  {
    description:
      "Professional culinary knives handcrafted from high-carbon stainless steel with ergonomic handles",
    grossWeight: "240 kg",
    countryOfOrigin: ["JP"],
  },
  {
    description:
      "Industrial conveyor belt systems with modular plastic chains, drive motors, guide rails, and automated sorting mechanisms designed for high-speed material handling operations in distribution centers",
    grossWeight: "2700 kg",
    countryOfOrigin: ["NL"],
  },
  {
    description:
      "Luxury timepieces with mechanical movements and sapphire crystals",
    grossWeight: "85 kg",
    countryOfOrigin: ["CH"],
  },
  {
    description:
      "Agricultural irrigation systems including drip lines and spray equipment",
    grossWeight: "1540 kg",
    countryOfOrigin: ["IL"],
  },
  {
    description:
      "Fire suppression systems with automatic sprinkler heads, control valves, and detection sensors",
    grossWeight: "2100 kg",
    countryOfOrigin: ["US"],
  },
  {
    description:
      "Premium chocolate confections handmade from single-origin cacao beans with natural sweeteners and artisanal flavor infusions packaged in temperature-stable containers for international shipping",
    grossWeight: "620 kg",
    countryOfOrigin: ["BE"],
  },
  {
    description:
      "Composite aircraft interior panels with lightweight construction",
    grossWeight: "980 kg",
    countryOfOrigin: ["FR"],
  },
  {
    description:
      "Industrial paint coating systems and spray application equipment",
    grossWeight: "1360 kg",
    countryOfOrigin: ["DE"],
  },
  {
    description:
      "Rare earth mineral concentrates and refined metal powders",
    grossWeight: "450 kg",
    countryOfOrigin: ["AU"],
  },
  {
    description:
      "Modular cleanroom equipment including HEPA filtration systems, laminar flow hoods, pass-through chambers, and environmental monitoring sensors certified for pharmaceutical manufacturing and semiconductor fabrication applications",
    grossWeight: "3200 kg",
    countryOfOrigin: ["US"],
  },
  {
    description:
      "Professional grade power tools with brushless motors",
    grossWeight: "760 kg",
    countryOfOrigin: ["JP"],
  },
];


// -----------------------------------------------------------------------------
// SAMPLE DATA – replace with your real data source
// -----------------------------------------------------------------------------
export const data = {
  applicationId: '081039d2-82ec-4c8e-a2af-8300304f5491',
  seller: 'Seller Company Name\n1234 Seller St.\nCity, State, ZIP\nCountry',
  consignee: 'Consignee Company Name\n5678 Consignee Ave.\nCity, State, ZIP\nCountry',
  buyer: 'Buyer Company Name\n9101 Buyer Blvd.\nCity, State, ZIP\nCountry',
  transportType: 'Sea Freight',
  portOfLoading: 'Port of Loading Name',
  destinationCountry: 'US',
  destinationPort: 'Destination Port Name',
  exportDate: '2023-03-28',
  exportCarrier: 'Exporting Carrier Name',
  importPermitNumber: 'IMP-1234567890',
  billOfLadingNumber: 'BL-0987654321',
  ownerAgent: 'Owner/Agent Name',
  forwardingAgent: 'Forwarding Agent Name',
  remarks: 'Handle with care',
  shipment: sampleShipment,
};