declare module "pdf-parse" {
  type PdfParseResult = {
    text?: string;
  };

  function pdfParse(dataBuffer: Buffer): Promise<PdfParseResult>;
  export default pdfParse;
}

declare module "nodemailer" {
  const nodemailer: {
    createTransport: (...args: unknown[]) => {
      sendMail: (...args: unknown[]) => Promise<unknown>;
    };
  };
  export default nodemailer;
}

declare module "pdfjs-dist/build/pdf" {
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };

  export function getDocument(args: { data: ArrayBuffer }): {
    promise: Promise<{
      numPages: number;
      getPage: (pageNumber: number) => Promise<{
        getViewport: (args: { scale: number }) => {
          width: number;
          height: number;
        };
        render: (args: {
          canvasContext: CanvasRenderingContext2D;
          viewport: {
            width: number;
            height: number;
          };
        }) => { promise: Promise<void> };
      }>;
    }>;
  };
}
