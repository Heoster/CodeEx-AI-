/**
 * PDF Export Utility
 * Exports messages to PDF with CodeEx branding
 */

import { type Message } from '@/lib/types';

export interface PDFExportOptions {
  message: Message;
  includeMetadata?: boolean;
  includeBranding?: boolean;
}

/**
 * Export message to PDF using browser's print functionality
 * This is a lightweight solution that doesn't require external libraries
 */
export async function exportMessageToPDF(options: PDFExportOptions): Promise<void> {
  const { message, includeMetadata = true, includeBranding = true } = options;

  // Create a hidden iframe for printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) {
    document.body.removeChild(iframe);
    throw new Error('Failed to create PDF document');
  }

  // Generate HTML content
  const html = generatePDFHTML(message, includeMetadata, includeBranding);
  
  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();

  // Wait for content to load
  await new Promise(resolve => setTimeout(resolve, 500));

  // Trigger print dialog
  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();

  // Clean up after a delay
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
}

/**
 * Generate HTML for PDF export
 */
function generatePDFHTML(
  message: Message,
  includeMetadata: boolean,
  includeBranding: boolean
): string {
  const timestamp = message.createdAt 
    ? new Date(message.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '';

  // Convert markdown-style formatting to HTML
  let content = message.content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Wrap in paragraph tags
  if (!content.startsWith('<')) {
    content = `<p>${content}</p>`;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Response - CODEEX AI</title>
  <style>
    @page {
      margin: 2cm;
      size: A4;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      font-size: 11pt;
      background: white;
    }
    
    .container {
      max-width: 100%;
      padding: 0;
    }
    
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20px;
      margin-bottom: 30px;
      border-bottom: 3px solid #0070f3;
    }
    
    .logo-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .logo {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #0070f3 0%, #00a8ff 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 24px;
      font-family: 'Arial', sans-serif;
    }
    
    .brand {
      display: flex;
      flex-direction: column;
    }
    
    .brand-name {
      font-size: 24px;
      font-weight: 700;
      color: #0070f3;
      letter-spacing: -0.5px;
    }
    
    .brand-tagline {
      font-size: 10px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .doc-title {
      font-size: 14px;
      color: #666;
      text-align: right;
    }
    
    .metadata {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 30px;
      border-left: 4px solid #0070f3;
    }
    
    .metadata-item {
      display: flex;
      margin-bottom: 8px;
      font-size: 10pt;
    }
    
    .metadata-item:last-child {
      margin-bottom: 0;
    }
    
    .metadata-label {
      font-weight: 600;
      color: #555;
      min-width: 100px;
    }
    
    .metadata-value {
      color: #333;
    }
    
    .content {
      margin: 30px 0;
      color: #1a1a1a;
    }
    
    .content h1 {
      font-size: 20pt;
      margin: 20px 0 10px 0;
      color: #0070f3;
    }
    
    .content h2 {
      font-size: 16pt;
      margin: 18px 0 8px 0;
      color: #0070f3;
    }
    
    .content h3 {
      font-size: 13pt;
      margin: 15px 0 6px 0;
      color: #333;
    }
    
    .content p {
      margin: 10px 0;
      text-align: justify;
    }
    
    .content code {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', 'Consolas', monospace;
      font-size: 10pt;
      color: #d63384;
    }
    
    .content pre {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 15px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 15px 0;
      border-left: 4px solid #0070f3;
    }
    
    .content pre code {
      background: transparent;
      color: #d4d4d4;
      padding: 0;
    }
    
    .content strong {
      font-weight: 600;
      color: #000;
    }
    
    .content em {
      font-style: italic;
      color: #555;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 9pt;
    }
    
    .footer-logo {
      font-weight: 700;
      color: #0070f3;
    }
    
    .footer-link {
      color: #0070f3;
      text-decoration: none;
    }
    
    .footer-note {
      margin-top: 10px;
      font-size: 8pt;
      color: #999;
    }
    
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      
      .no-print {
        display: none !important;
      }
      
      .page-break {
        page-break-before: always;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    ${includeBranding ? `
    <div class="header">
      <div class="logo-section">
        <div class="logo">C</div>
        <div class="brand">
          <div class="brand-name">CODEEX AI</div>
          <div class="brand-tagline">Intelligent Code Assistant</div>
        </div>
      </div>
      <div class="doc-title">
        <div style="font-weight: 600; color: #333;">AI Response Document</div>
        <div style="font-size: 9pt; color: #999; margin-top: 4px;">Generated Export</div>
      </div>
    </div>
    ` : ''}
    
    ${includeMetadata ? `
    <div class="metadata">
      ${timestamp ? `
      <div class="metadata-item">
        <span class="metadata-label">Generated:</span>
        <span class="metadata-value">${timestamp}</span>
      </div>
      ` : ''}
      ${message.modelUsed ? `
      <div class="metadata-item">
        <span class="metadata-label">AI Model:</span>
        <span class="metadata-value">${message.modelUsed}</span>
      </div>
      ` : ''}
      ${message.modelCategory ? `
      <div class="metadata-item">
        <span class="metadata-label">Category:</span>
        <span class="metadata-value">${message.modelCategory}</span>
      </div>
      ` : ''}
      <div class="metadata-item">
        <span class="metadata-label">Document ID:</span>
        <span class="metadata-value">${message.id.substring(0, 12)}...</span>
      </div>
    </div>
    ` : ''}
    
    <div class="content">
      ${content}
    </div>
    
    ${includeBranding ? `
    <div class="footer">
      <div>
        Generated by <span class="footer-logo">CODEEX AI</span>
      </div>
      <div style="margin-top: 8px;">
        <a href="https://codeex-ai.netlify.app" class="footer-link">https://codeex-ai.netlify.app</a>
      </div>
      <div class="footer-note">
        This document was automatically generated. For the best experience, visit our web application.
      </div>
    </div>
    ` : ''}
  </div>
</body>
</html>`;
}

/**
 * Download message as PDF (alternative method using data URL)
 */
export function downloadMessageAsPDF(message: Message): void {
  const html = generatePDFHTML(message, true, true);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `codeex-ai-response-${message.id.substring(0, 8)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
