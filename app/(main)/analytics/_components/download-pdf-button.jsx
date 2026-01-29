"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { toast } from "sonner";

export default function DownloadPDFButton() {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            const element = document.getElementById("analytics-dashboard");
            if (!element) {
                throw new Error("Analytics dashboard element not found");
            }

            const dataUrl = await toPng(element, {
                pixelRatio: 2, // Equivalent to scale: 2
                backgroundColor: "#ffffff", // Ensure white background
            });

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm

            // Calculate height based on aspect ratio
            const imgProperties = pdf.getImageProperties(dataUrl);
            const imgHeight = (imgProperties.height * imgWidth) / imgProperties.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Add first page
            pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add subsequent pages if content overflows
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save("finease-analytics-report.pdf");
            toast.success("PDF downloaded successfully");
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.error(error.message || "Failed to generate PDF");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={generatePDF}
            disabled={isGenerating}
            className="gap-2"
        >
            {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Download className="h-4 w-4" />
            )}
            Export PDF
        </Button>
    );
}
