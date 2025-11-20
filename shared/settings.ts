import type { CertificateType, CertificateLanguage, Certificate } from './types/partner'

export const certificateTypes = { "cfs": "Certificate of Free Sale", "gmp": "Certificate of Good Manufacturing Practices", "coo": "Certificate of Origin" } as const
export const certificateLanguages = { "en": "English", "en-es": "English & Spanish", "en-ar": "English & Arabic", "en-fr": "English & French" }

// Initialize certificates with base data
const _certificates: Record<CertificateType, Certificate> = {
  "cfs": {
    code: "cfs",
    label: "Certificate of Free Sale",
    mediaType: "physical",
    isActive: true,
    allowMultipleCopies: false,
    maxCopies: 0,
    options: [
      {
        language: "en",
        isActive: false,
        certificateFees: {
          regular: 0,
          member: 0,
        },
        transactionFees: 0,
        processingFees: 0,
      },
      {
        language: "en-es",
        isActive: false,
        certificateFees: {
          regular: 0,
          member: 0,
        },
        transactionFees: 0,
        processingFees: 0,
      },
      {
        language: "en-ar",
        isActive: false,
        certificateFees: {
          regular: 0,
          member: 0,
        },
        transactionFees: 0,
        processingFees: 0,
      },
    ]
  },
  "gmp": {
    code: "gmp",
    label: "Certificate of Good Manufacturing Practices",
    mediaType: "physical",
    isActive: true,
    allowMultipleCopies: false,
    maxCopies: 0,
    options: [
      {
        language: "en",
        isActive: false,
        certificateFees: {
          regular: 0,
          member: 0,
        },
        transactionFees: 0,
        processingFees: 0,
      },
      {
        language: "en-es",
        isActive: false,
        certificateFees: {
          regular: 0,
          member: 0,
        },
        transactionFees: 0,
        processingFees: 0,
      },
      {
        language: "en-ar",
        isActive: false,
        certificateFees: {
          regular: 0,
          member: 0,
        },
        transactionFees: 0,
        processingFees: 0,
      },
    ]
  },
  "coo": {
    code: "coo",
    label: "Certificate of Origin",
    mediaType: "digital",
    isActive: true,
    allowMultipleCopies: false,
    maxCopies: 0,
    options: [
      {
        language: "en",
        isActive: false,
        certificateFees: {
          regular: 0,
          member: 0,
        },
        transactionFees: 0,
        processingFees: 0,
      },
    ]
  }
}

// Add new certificate types if not already present
Object.keys(certificateTypes).forEach((key) => {
  const certificateType = key as CertificateType;
  if (!_certificates[certificateType]) {
    _certificates[certificateType] = {
      code: certificateType,
      label: certificateTypes[certificateType],
      mediaType: "physical",
      isActive: false,
      allowMultipleCopies: false,
      maxCopies: 0,
      options: [],
    }
  }
})

// Add each language to the options of each certificate if not already present
Object.keys(certificateLanguages).forEach((key) => {
  const lang = key as CertificateLanguage;
  Object.values(_certificates).forEach((certificate: Certificate) => {
    if (!certificate.options.find(o => o.language === lang)) {
      certificate.options.push({
        language: lang,
        isActive: false,
        certificateFees: {
          regular: 0,
          member: 0,
        },
        transactionFees: 0,
        processingFees: 0,
      })
    }
  })
})

export const certificates = _certificates;
