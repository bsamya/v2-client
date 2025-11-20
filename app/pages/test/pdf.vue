<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

const files = [
  //'/samples/coo.pdf',
  '/samples/tab.pdf',
  '/samples/sample.pdf',
];

pdfMake.vfs = pdfFonts.vfs;
pdfMake.fonts = {
  Roboto: {
    normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf',
    bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf',
    italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Italic.ttf',
    bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-MediumItalic.ttf',
  },
};


// -----------------------------------------------------------------------------
// STATE
// -----------------------------------------------------------------------------
const isReady = ref(false);          // pdfMake preview (optional)
const pdfSrc = ref<string | null>(null); // optional preview of first PDF

const firstPdfBytes = ref<Uint8Array | null>(null);

const mergedPDF = ref<string | null>(null);
const mergedPdfReady = ref(false);
const isGenerating = ref(true);

const pdfBlob = ref<Blob | null>(null);
const isSaving = ref(false);

const logo =
  'https://firebasestorage.googleapis.com/v0/b/swiftdox-dev.appspot.com/o/sdx_logo_full_color.png?alt=media&token=336fba9c-1342-4ffc-a5e6-f346e812520e';

// -----------------------------------------------------------------------------
// CACHES FOR FONT + IMAGE
// -----------------------------------------------------------------------------
const fontCache = new Map<string, ArrayBuffer>();
const imageCache = new Map<string, ArrayBuffer>();

const fetchAndCache = async (url: string, cache: Map<string, ArrayBuffer>) => {
  if (cache.has(url)) return cache.get(url)!;
  const arrayBuffer = await fetch(url).then((res) => res.arrayBuffer());
  cache.set(url, arrayBuffer);
  return arrayBuffer;
};

// -----------------------------------------------------------------------------
// PDFMAKE DOC DEFINITION
// -----------------------------------------------------------------------------
async function getPdfDocDefinition(data: any) {
  const blobToBase64 = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const backgroundImg = await fetch('/images/coo.png')
    .then((res) => res.blob())
    .then((blob) => blobToBase64(blob));

  const shipmentInformation = () => {
    const countryStore = useCountryStore(); // your Pinia store

    const content: any[] = [];

    data.shipment.forEach((shipment: any) => {
      content.push([
        {
          text: shipment.description,
          border: [false, false],
        },
        {
          text: shipment.grossWeight,
          border: [false, false],
        },
        {
          text:
            countryStore.dataMap.get(shipment.countryOfOrigin?.[0])?.title ??
            shipment.countryOfOrigin?.[0] ??
            '',
          border: [false, false],
        },
      ]);
    });

    // closing wrapper row
    content.push([
      { text: '='.repeat(84), border: [false, false] },
      { text: '===============', border: [false, false] },
      { text: '===================', border: [false, false] },
    ]);

    return content;
  };

  return {
    pageSize: 'letter',
    pageOrientation: 'portrait',
    pageMargins: [21, 385, 20, 170],
    defaultStyle: {
      fontSize: 8,
      font: 'Roboto',
    },
    styles: {
      certificateNumber: {
        fontSize: 12,
        bold: true,
        color: '#990000',
      },
      certificateDate: {
        bold: true,
        color: '#990000',
      },
      pageNumber: {
        fontSize: 8,
        bold: true,
        color: '#808080',
        alignment: 'center',
      },
      certificateSignatory: {
        fontSize: 12,
        bold: true,
        color: '#990000',
      },
    },

    background: {
      image: backgroundImg,
      width: 609,
      absolutePosition: { x: 0, y: 0 },
    },

    header: () => {
      const countryStore = useCountryStore();
      return [
        {
          absolutePosition: { x: 408, y: 56 },
          text: 'FT-COO-0000-0000-0000',
          style: 'certificateNumber',
        },
        {
          absolutePosition: { x: 408, y: 68 },
          text: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          style: 'certificateDate',
        },
        // Seller
        {
          absolutePosition: { x: 20, y: 105 },
          table: {
            body: [[{ text: data.seller, border: [false, false] }]],
          },
        },
        // Consignee
        {
          absolutePosition: { x: 20, y: 190 },
          table: {
            body: [[{ text: data.consignee, border: [false, false] }]],
          },
        },
        // Buyer
        {
          absolutePosition: { x: 20, y: 280 },
          table: {
            body: [[{ text: data.buyer, border: [false, false] }]],
          },
        },
        // Transport type
        {
          absolutePosition: { x: 267, y: 105 },
          text: data.transportType,
        },
        // Port of loading
        {
          absolutePosition: { x: 430, y: 105 },
          text: data.portOfLoading,
        },
        // Destination country
        {
          absolutePosition: { x: 267, y: 140 },
          text:
            countryStore.dataMap.get(data.destinationCountry)?.title ??
            data.destinationCountry,
        },
        // Destination port
        {
          absolutePosition: { x: 430, y: 140 },
          text: data.destinationPort,
        },
        // Export date
        {
          absolutePosition: { x: 267, y: 175 },
          text: new Date(data.exportDate).toLocaleDateString(),
        },
        // Exporting carrier
        {
          absolutePosition: { x: 430, y: 175 },
          text: data.exportCarrier.padEnd(40, '*'),
        },
        // Import permit
        {
          absolutePosition: { x: 267, y: 73.5 * 2.835 },
          text: data.importPermitNumber.padEnd(40, '*'),
        },
        // Bill of lading
        {
          absolutePosition: { x: 430, y: 73.5 * 2.835 },
          text: data.billOfLadingNumber.padEnd(40, '*'),
        },
        // Owner / agent
        {
          absolutePosition: { x: 267, y: 86 * 2.835 },
          text: data.ownerAgent.padEnd(40, '*'),
        },
        // Forwarding agent
        {
          absolutePosition: { x: 430, y: 86 * 2.835 },
          text: (data.forwardingAgent || '').padEnd(40, '*'),
        },
        // Remarks
        {
          absolutePosition: { x: 267, y: 98 * 2.835 },
          text: data.remarks,
        },
        // QR
        {
          absolutePosition: { x: 550, y: 95 * 2.835 },
          fit: 40,
          qr: 'https://verify.swiftdox.com/FT-COO-1253156890',
        },
        // Vertical footer text (SVG)
        {
          svg: "<svg><style>.txt{font: 16px Courier; fill: #990000}</style><text transform='translate(40,650) rotate(-90)' class='txt' letter-spacing='2'>FT-COO-0000-0000-0000/March 28, 2023</text></svg>",
          absolutePosition: { x: 560, y: 100 },
        },
      ];
    },

    footer: (currentPage: number, pageCount: number) => {
      return [
        {
          text: 'Ben Samia',
          absolutePosition: { x: 98, y: 128 },
          style: 'certificateSignatory',
        },
        {
          text:
            'Los Angeles Chamber of Commerce | FT-COO-1253156890 | March 28, 2023 | Page ' +
            currentPage.toString() +
            ' of ' +
            pageCount,
          absolutePosition: { x: 0, y: 150 },
          style: 'pageNumber',
        },
      ];
    },

    content: [
      {
        table: {
          widths: [373, 70, 95],
          dontBreakRows: true,
          keepWithHeaderRows: 1,
          body: shipmentInformation(),
        },
      },
    ],
  };
}

// -----------------------------------------------------------------------------
// GENERATE FIRST PDF (pdfMake) AS BYTES
// -----------------------------------------------------------------------------
const generateFirstPdf = async () => {
  const docDefinition = await getPdfDocDefinition(data);

  // @ts-expect-error - pdfmake types are imperfect with table content
  const pdfGenerator = pdfMake.createPdf(docDefinition);

  pdfGenerator.getBuffer(async (buffer: Uint8Array) => {
    firstPdfBytes.value = buffer;

    // Optional: preview of original certificate
    // @ts-expect-error - Uint8Array is compatible with BlobPart
    const blob = new Blob([buffer], { type: 'application/pdf' });
    pdfSrc.value = URL.createObjectURL(blob);
    isReady.value = true;

    await mergeDocuments();
  });
};

// -----------------------------------------------------------------------------
// MERGE WITH SECOND PDF (handle protected docs) + DECORATE PAGES
// -----------------------------------------------------------------------------
const mergeDocuments = async () => {
  if (!firstPdfBytes.value) {
    console.error('First PDF bytes not ready');
    return;
  }

  try {
    isGenerating.value = true;

    const mergedPdfDoc = await PDFDocument.create();

    // ------------------------------------------------------------
    // 1) Add FIRST PDF (generated by pdfMake)
    // ------------------------------------------------------------
    const firstPdfDoc = await PDFDocument.load(firstPdfBytes.value, {
      ignoreEncryption: true,
    });

    const firstPages = await mergedPdfDoc.copyPages(
      firstPdfDoc,
      firstPdfDoc.getPageIndices()
    );
    firstPages.forEach((p) => mergedPdfDoc.addPage(p));

    const mainDocPageCount = firstPdfDoc.getPageCount();
    console.log(`Main document (pdfMake-generated) has ${mainDocPageCount} pages`);

    const firstDocPageCount = firstPdfDoc.getPageCount();
    console.log(`First document (pdfMake-generated) has ${firstDocPageCount} pages`);

    // ------------------------------------------------------------
    // 2) Merge all files from the files array
    // ------------------------------------------------------------
    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const fileUrl = files[fileIndex];
      try {
        console.log(`Loading file ${fileIndex + 1} of ${files.length}: ${fileUrl}`);

        const pdfArrayBuffer = await fetch(fileUrl).then((res) => res.arrayBuffer());

        let pdfDoc: PDFDocument;

        // Try loading with multiple fallback strategies
        try {
          pdfDoc = await PDFDocument.load(pdfArrayBuffer, {
            ignoreEncryption: true,
            updateMetadata: false,
          });
        } catch (strictErr) {
          console.warn(`Strict load failed for ${fileUrl}, retrying with relaxed options`, strictErr);
          try {
            // Fallback 1: relaxed load
            pdfDoc = await PDFDocument.load(pdfArrayBuffer, {
              ignoreEncryption: true,
              updateMetadata: false,
              throwOnInvalidObject: false,
            });
          } catch (relaxedErr) {
            console.warn(`Relaxed load failed for ${fileUrl}, attempting repair`, relaxedErr);
            // Fallback 2: Load, save, and reload to repair structure
            try {
              const tempDoc = await PDFDocument.load(pdfArrayBuffer, {
                ignoreEncryption: true,
                throwOnInvalidObject: false,
                capNumbers: false,
              });
              const repairedBytes = await tempDoc.save({ useObjectStreams: false });
              pdfDoc = await PDFDocument.load(repairedBytes, {
                ignoreEncryption: true,
                updateMetadata: false,
              });
              console.log(`Successfully repaired ${fileUrl} by re-serializing`);
            } catch (repairErr) {
              throw new Error(`PDF has severe structural corruption (invalid Pages tree with broken object references). Repair externally with 'qpdf --check ${fileUrl}' or Ghostscript before merging.`);
            }
          }
        }

        // Safely get page count with try-catch (can fail on corrupted page trees)
        let pageCount: number;
        try {
          pageCount = pdfDoc.getPageCount();
          console.log(`File ${fileIndex + 1} has ${pageCount} pages`);
        } catch (pageCountErr) {
          throw new Error(`Cannot read page tree - PDF has corrupted internal structure. Original error: ${(pageCountErr as Error).message}`);
        }

        // Copy all pages from this PDF
        const pages = await mergedPdfDoc.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );
        pages.forEach((page) => {
          mergedPdfDoc.addPage(page);
        });

        console.log(`✓ Successfully merged file ${fileIndex + 1}: ${fileUrl}`);
      } catch (fileErr) {
        console.error(`Failed to merge file ${fileIndex + 1} (${fileUrl}):`, fileErr);
        const errorMsg = (fileErr as Error).message;
        alert(`Warning: Could not merge file "${fileUrl}". ${errorMsg}. Continuing with other files.`);
      }
    }

    // ------------------------------------------------------------
    // 3) Decorate ALL pages (logo + page numbers + side text)
    // ------------------------------------------------------------
    mergedPdfDoc.registerFontkit(fontkit);

    const pages = mergedPdfDoc.getPages();
    const totalPages = pages.length;

    const fontUrl =
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf';
    const fontBytes = await fetchAndCache(fontUrl, fontCache);
    const robotoFont = await mergedPdfDoc.embedFont(fontBytes);

    for (let i = 0; i < totalPages; i++) {
      const page = pages[i];
      if (!page) continue;
      const { width, height } = page.getSize();

      // Page number (center bottom) with spacing
      const pageText = `Page ${i + 1} of ${totalPages}`;
      const pageCharSpacing = 2;
      let xOffset = width / 2 - 40;

      for (const char of pageText) {
        page.drawText(char, {
          x: xOffset,
          y: 20,
          size: 10,
          color: rgb(153 / 255, 0, 0),
          font: robotoFont,
        });
        xOffset += robotoFont.widthOfTextAtSize(char, 10) + pageCharSpacing;
      }

      // Vertical "Certificate of Origin" text on the right side
      const certText = 'Certificate of Origin';
      const certCharSpacing = 2;
      let yOffset = 200; // tweak as needed

      for (const char of certText) {
        page.drawText(char, {
          x: width - 20,
          y: yOffset,
          size: 12,
          color: rgb(153 / 255, 0, 0),
          rotate: degrees(270),
          font: robotoFont,
        });
        yOffset -= robotoFont.widthOfTextAtSize(char, 12) + certCharSpacing;
      }
    }

    // ------------------------------------------------------------
    // 4) Save + expose merged PDF
    // ------------------------------------------------------------
    const finalBytes = await mergedPdfDoc.save();
    // @ts-expect-error - Uint8Array is compatible with BlobPart
    const mergedBlob = new Blob([finalBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(mergedBlob);

    mergedPDF.value = url;
    mergedPdfReady.value = true;
    pdfBlob.value = mergedBlob;
    isGenerating.value = false;
  } catch (err) {
    console.error('Error during PDF merge', err);
    isGenerating.value = false;
    alert('Failed to generate PDF: ' + (err as Error).message);
  }
};


// -----------------------------------------------------------------------------
// SAVE / DOWNLOAD / PRINT
// -----------------------------------------------------------------------------
const saveToFirebase = async () => {
  if (!pdfBlob.value) return;

  try {
    isSaving.value = true;
    const { $storage } = useNuxtApp();

    const timestamp = Date.now();
    const fileName = `merged-documents/merged-${timestamp}.pdf`;

    const fileRef = storageRef($storage, fileName);
    const snapshot = await uploadBytes(fileRef, pdfBlob.value);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    console.log('PDF saved to Firebase Storage:', downloadUrl);
    alert('PDF saved successfully to Firebase!');
    return downloadUrl;
  } catch (error) {
    console.error('Error saving PDF to Firebase:', error);
    alert('Error saving PDF to Firebase');
    throw error;
  } finally {
    isSaving.value = false;
  }
};

const downloadPdf = () => {
  if (mergedPDF.value) {
    const link = document.createElement('a');
    link.href = mergedPDF.value;
    link.download = 'merged-document.pdf';
    link.click();
  }
};

const printPdf = () => {
  if (mergedPDF.value) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = mergedPDF.value;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.print();
    };
  }
};

// -----------------------------------------------------------------------------
// INIT ON MOUNT (CLIENT-SIDE)
// -----------------------------------------------------------------------------
onMounted(() => {
  generateFirstPdf();
});
</script>

<template>
  <div>
    <div class="mb-4 flex gap-2">
      <v-btn color="primary"
             @click="downloadPdf"
             :disabled="!mergedPdfReady">
        <v-icon left>mdi-download</v-icon>
        Download PDF
      </v-btn>

      <v-btn color="secondary"
             @click="printPdf"
             :disabled="!mergedPdfReady">
        <v-icon left>mdi-printer</v-icon>
        Print PDF
      </v-btn>

      <v-btn color="success"
             @click="saveToFirebase"
             :disabled="!mergedPdfReady"
             :loading="isSaving">
        <v-icon left>mdi-cloud-upload</v-icon>
        Save to Firebase
      </v-btn>
    </div>

    <div v-if="isGenerating"
         class="text-center my-4">
      <v-progress-circular indeterminate
                           color="primary"
                           size="64" />
      <p class="mt-2">Generating Preview...</p>
    </div>

    <h2>Merged PDF:</h2>
    <iframe v-if="mergedPdfReady"
            :src="mergedPDF || ''"
            style="width: 100%; height: 800px; border: 1px solid #ccc;"
            type="application/pdf" />
  </div>
</template>
