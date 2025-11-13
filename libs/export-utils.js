// Export utilities for AI Article Summarizer Pro
// Simplified implementations for PDF, DOCX, TXT, and Markdown export

class ExportUtils {
  // Export as PDF using jsPDF (formatted)
  static exportToPDF(text, filename = 'summary.pdf') {
    try {
      // Check if jsPDF is available - try different ways to access it
      let jsPDFClass = null;
      
      if (typeof window.jsPDF !== 'undefined') {
        jsPDFClass = window.jsPDF;
      } else if (typeof window.jspdf !== 'undefined' && window.jspdf.jsPDF) {
        jsPDFClass = window.jspdf.jsPDF;
      } else if (typeof window.default !== 'undefined' && window.default.jsPDF) {
        jsPDFClass = window.default.jsPDF;
      }
      
      if (!jsPDFClass) {
        console.error('jsPDF not available. Available objects:', Object.keys(window).filter(k => k.toLowerCase().includes('pdf')));
        throw new Error('jsPDF not available');
      }

      // Create new jsPDF instance
      const doc = new jsPDFClass();
      
      // Set up document
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const usableWidth = pageWidth - (margin * 2);
      
      // Header
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('AI Article Summarizer Pro - Summary', margin, 30);
      
      // Date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, 45);
      
      // Content
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      // Clean text and split into lines
      const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      const lines = doc.splitTextToSize(cleanText, usableWidth);
      
      let y = 60;
      const lineHeight = 7;
      
      lines.forEach(line => {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
      
      // Save the PDF
      doc.save(filename);
      
    } catch (e) {
      console.error('PDF export error:', e);
      // Fallback to TXT if jsPDF fails
      ExportUtils.exportToTXT(text, filename.replace('.pdf', '.txt'));
    }
  }


  // Export as TXT
  static exportToTXT(text, filename = 'summary.txt') {
    const content = `
AI Article Summarizer Pro - Summary
Generated on: ${new Date().toLocaleString()}

${text}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

}

// Make available globally
if (typeof window !== 'undefined') {
  window.ExportUtils = ExportUtils;
}
