<template>
  <div>
    <vue-pdf-embed v-if="isReady"
                   :source="'data:application/pdf;base64,' + pdfSrc" />

    <vue-pdf-embed v-if="mergedPdfReady"
                   :source="mergedPDF" />

    <v-checkbox v-model="agree"><template v-slot:label>
        I agree to the terms and conditions
      </template>
    </v-checkbox>
    <v-btn color="info"
           size="x-large"
           block>
      Submit Application</v-btn>

  </div>
</template>

<script setup lang="ts">
import PDFMerger from 'pdf-merger-js/browser';

import VuePdfEmbed from "vue-pdf-embed";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;

pdfMake.fonts = {
  Roboto: {
    normal:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
    bold:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
    italics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
    bolditalics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
  },
};


const application = defineModel<COO>({ required: true });
const isReady = ref(false);
const pdfSrc = ref("");

//get pdf doc definition
const docDefinition = await getPdfDocDefinition(application.value);

//create pdf generator instance
// @ts-expect-error - pdfmake type definitions have issues with table content
const pdfGenerator = pdfMake.createPdf(docDefinition);

//create the certificate
pdfGenerator.getBase64((data) => {
  pdfSrc.value = data;
  isReady.value = true;
});

function downloadPdf() {
  pdfGenerator.download("Preview copy COO");
}
function printPdf() {
  pdfGenerator.print();
}

const agree = ref(false);



async function getPdfDocDefinition(data: COO) {
  const blobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const backgroundImg = await fetch("/images/coo.png")
    .then((res) => res.blob())
    .then(async (blob) => {
      return await blobToBase64(blob);
    });

  const shipmentInformation = () => {
    const countryStore = useCountryStore();

    const content = [];
    data.shipment.forEach((shipment) => {
      let countryOfOrigin = shipment.countryOfOrigin.map(c => countryStore.dataMap.get(c)?.title || c)
        .join(", ");
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
          text: countryOfOrigin,

          border: [false, false],
        },
      ]);
    });

    //closing wrapper
    content.push([
      { text: "=".repeat(84), border: [false, false] },
      { text: "===============", border: [false, false] },
      { text: "===================", border: [false, false] },
    ]);

    console.log("content", content);

    return content;
  };
  return {
    pageSize: "letter",
    pageOrientation: "portrait",
    pageMargins: [21, 385, 20, 170],
    defaultStyle: {
      fontSize: 8,
      //font: "Courier"
    },
    styles: {
      certificateNumber: {
        fontSize: 12,
        bold: true,
        color: "#990000",
        //alignment: 'center',
        //margin: [0, 0, 0, 0],
      },
      certificateDate: {
        //fontSize: 8,
        bold: true,
        color: "#990000",
        //alignment: 'center',
        //margin: [0, 0, 0, 0],
      },
      pageNumber: {
        fontSize: 8,
        bold: true,
        color: "#808080",
        alignment: "center",
        //margin: [0, 0, 0, 0],
      },
      certificateSignatory: {
        fontSize: 12,
        bold: true,
        color: "#990000",
        //alignment: 'center',
        //margin: [0, 0, 0, 0],
      },
    },

    background: {
      image: backgroundImg,
      width: 609,
      //opacity: 0.05,
      absolutePosition: { x: 0, y: 0 },
    },

    header: (
      currentPage: number,
      pageCount: number,
      pageSize: number | string
    ) => {
      const countryStore = useCountryStore();
      return [
        {
          absolutePosition: { x: 408, y: 56 },
          text: "",
          style: "certificateNumber",
        },
        {
          absolutePosition: { x: 408, y: 68 },
          text: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          style: "certificateDate",
        },
        {
          //seller information
          absolutePosition: { x: 20, y: 105 },
          table: {
            //Seller INformation
            body: [
              [{ text: data.seller, border: [false, false] }],
              [{ text: data.seller, border: [false, false] }],
              [{ text: data.seller, border: [false, false] }],
              [{ text: data.seller, border: [false, false] }],
            ],
          },
        },

        {
          //Consignee Information
          absolutePosition: { x: 20, y: 190 },
          table: {
            body: [
              [
                {
                  text: data.consignee,
                  border: [false, false],
                },
              ],
            ],
          },
        },
        {
          absolutePosition: { x: 20, y: 280 },
          table: {
            //Buyer information
            body: [[{ text: data.buyer, border: [false, false] }]],
          },
        },
        {
          //transport Type
          absolutePosition: { x: 267, y: 105 },
          text: data.transportType,
        },

        {
          //Port of Loading
          absolutePosition: { x: 430, y: 105 },
          text: data.portOfLoading,
        },

        {
          //Country
          absolutePosition: { x: 267, y: 140 },
          text: countryStore.dataMap.get(data.destinationCountry)?.title ||
            data.destinationCountry,
        },
        {
          //Destination port
          absolutePosition: { x: 430, y: 140 },
          text: data.destinationPort,
        },
        {
          //export date
          absolutePosition: { x: 267, y: 175 },
          text: new Date(data.exportDate).toLocaleDateString(),
        },
        {
          //Exporting Carrier
          absolutePosition: { x: 430, y: 175 },
          text: data.exportCarrier.padEnd(40, "*"),
        },
        {
          //import permit #
          absolutePosition: { x: 267, y: 73.5 * 2.835 },
          text: data.importPermitNumber.padEnd(40, "*"),
        },
        {
          //import permint #
          absolutePosition: { x: 430, y: 73.5 * 2.835 },
          text: data.billOfLadingNumber.padEnd(40, "*"),
        },
        {
          //owner/agent
          absolutePosition: { x: 267, y: 86 * 2.835 },
          text: data.ownerAgent.padEnd(40, "*"),
        },

        {
          //Forwarding Agent
          absolutePosition: { x: 430, y: 86 * 2.835 },
          text: (data.forwardingAgent || '').padEnd(40, "*"),
        },

        {
          //import permint #
          absolutePosition: { x: 267, y: 98 * 2.835 },
          text: data.remarks,
        },
        {
          //import permint #
          absolutePosition: { x: 550, y: 95 * 2.835 },
          fit: 40,
          qr: "https://verify.swiftdox.com/FT-COO-1253156890",
        },
        {
          svg: "<svg><style>.txt{font: 16px Courier; fill: #990000}</style><text transform='translate(40,650) rotate(-90)' class='txt' letter-spacing='2'>FT-COO-0000-0000-0000/March 28, 2023</text></svg>",
          absolutePosition: { x: 560, y: 100 },
        },
      ];
    },

    footer: function (currentPage: number, pageCount: number) {
      return [
        {
          text: "Ben Samia",
          alingment: "left",
          absolutePosition: { x: 98, y: 128 },
          style: "certificateSignatory",
        },
        {
          text:
            "Los Angeles Chamber of Commerce | FT-COO-1253156890 | March 28, 2023 | Page " +
            currentPage.toString() +
            " of " +
            pageCount,
          alingment: "center",
          absolutePosition: { x: 0, y: 150 },
          style: "pageNumber",
        },
      ];
    },

    content: [
      {
        table: {
          widths: [373, 70, 95],
          // dontBreakRows: true,
          // keepWithHeaderRows: 1,
          body: shipmentInformation(),
        },
      },
    ],
  };
}




const mergedPDF = ref()
const mergedPdfReady = ref(false)

const mergeDocuments = async () => {
  var merger = new PDFMerger();

  for (const doc of application.value.documents.invoice) {
    await merger.add(doc);
  }

  // Set metadata
  await merger.setMetadata({
    producer: "pdf-merger-js based script",
    author: "John Doe",
    creator: "John Doe",
    title: "My live as John Doe"
  });

  const blob = await merger.saveAsBlob();
  const url = URL.createObjectURL(blob);
  mergedPDF.value = url;
  mergedPdfReady.value = true;
}



onMounted(async () => {
  await mergeDocuments();
});
//await merger.save('merged.pdf'); //


</script>
