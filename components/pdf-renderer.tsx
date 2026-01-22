"use client";

import { useEffect, useRef, useState } from "react";

type PdfRendererProps = {
  url: string;
  scale?: number;
};

export default function PdfRenderer({ url, scale = 1.2 }: PdfRendererProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "empty"
  >("idle");

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const renderPdf = async () => {
      if (!containerRef.current) return;
      setStatus("loading");
      containerRef.current.innerHTML = "";
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`PDF request failed: ${response.status}`);
        }
        const buffer = await response.arrayBuffer();
        if (!buffer.byteLength) {
          if (isActive) {
            setStatus("empty");
          }
          return;
        }
        const pdfjsLib = await import("pdfjs-dist/build/pdf");
        const workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

        const task = pdfjsLib.getDocument({ data: buffer });
        const pdf = await task.promise;
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) continue;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = "pdf-canvas";
          const wrapper = document.createElement("div");
          wrapper.className = "pdf-page";
          wrapper.appendChild(canvas);
          containerRef.current.appendChild(wrapper);
          await page.render({ canvasContext: context, viewport }).promise;
        }
        if (isActive) {
          setStatus("idle");
        }
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") {
          return;
        }
        console.error("PDF render error:", error);
        if (isActive) {
          setStatus("error");
        }
      }
    };

    renderPdf();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [url, scale]);

  return (
    <div className="pdf-renderer">
      {status === "loading" ? (
        <p className="pdf-status">Memuat dokumen...</p>
      ) : null}
      {status === "error" ? (
        <p className="pdf-status">Dokumen tidak dapat ditampilkan.</p>
      ) : null}
      {status === "empty" ? (
        <p className="pdf-status">Dokumen kosong atau belum terunggah.</p>
      ) : null}
      <div ref={containerRef} className="pdf-pages" />
    </div>
  );
}
