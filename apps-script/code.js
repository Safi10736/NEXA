/**
 * NEXA - PREMIUM ORDER NOTIFICATION GOOGLE APPS SCRIPT
 * Place this complete file inside your Google Apps Script editor.
 * Ensure you also create an HTML file named "nexa_order_email.html" in the same script project.
 */

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    
    // Send order confirmation to customer and admin copy
    sendOrderEmail(postData);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Order email notification delivered successfully"
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type"
    });
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type"
    });
  }
}

// Support GET requests for testing webhook connectivity
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "alive",
    message: "NEXA Apps Script endpoint is ready and responsive."
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeaders({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET"
  });
}

function sendOrderEmail(orderData) {
  // Load the premium gold HTML template
  let template = HtmlService.createHtmlOutputFromFile('nexa_order_email').getContent();

  // Basic info replacements
  template = template
    .replace(/\{\{Customer Name\}\}/g, orderData.name || 'Valued Customer')
    .replace(/\{\{Phone Number\}\}/g, orderData.phone || 'N/A')
    .replace(/\{\{Address, City, Zip\}\}/g, orderData.address || 'N/A')
    .replace(/\{\{Total Amount\}\}/g, orderData.total || '0.00 BDT')
    .replace(/\{\{COD \/ bKash \/ Stripe\}\}/g, orderData.payment || 'Cash on Delivery')
    .replace(/\{\{TXN_ID\}\}/g, orderData.txnId || 'N/A');

  // Items loop row construction
  let itemRows = '';
  if (orderData.items && Array.isArray(orderData.items)) {
    orderData.items.forEach(item => {
      itemRows += `
      <tr style="border-bottom: 1px solid #1a1a1a;">
        <td style="padding: 16px 0; text-align: left; vertical-align: middle;">
          <div style="font-family: 'Inter', sans-serif; font-size: 13px; font-weight: bold; color: #ffffff; letter-spacing: 0.05em; margin-bottom: 4px; text-transform: uppercase;">${item.name}</div>
          <div style="font-family: 'Inter', sans-serif; font-size: 10px; font-weight: bold; color: #7f7f7f; letter-spacing: 0.1em; text-transform: uppercase;">Qty: ${item.qty}</div>
        </td>
        <td style="padding: 16px 0; text-align: right; vertical-align: middle; font-family: 'SF Mono', monospace; font-size: 12px; font-weight: bold; color: #d4af37;">
          ${item.price}
        </td>
      </tr>`;
    });
  }
  
  template = template.replace('<!-- REPEAT THIS ROW PER ITEM -->', itemRows);

  // Send to buyer (if valid email is provided)
  if (orderData.email && orderData.email.length > 5) {
    try {
      MailApp.sendEmail({
        to: orderData.email,
        subject: `⚜️ NEXA — Order Confirmation`,
        htmlBody: template
      });
    } catch (e) {
      Logger.log("Error sending to customer: " + e.toString());
    }
  }

  // Send a duplicate notification to store administrator/inbox copy (configured under settings)
  if (orderData.adminNotificationEmail && orderData.adminNotificationEmail.length > 5) {
    try {
      // Modify template slightly to signal it is an Admin Copy
      let adminTemplate = template.replace('ORDER CONFIRMED', 'NEW ORDER RECEIVED [ADMIN]');
      MailApp.sendEmail({
        to: orderData.adminNotificationEmail,
        subject: `⚜️ NEXA [NEW ORDER ALERT] — ${orderData.name}`,
        htmlBody: adminTemplate
      });
    } catch (e) {
      Logger.log("Error sending admin copy: " + e.toString());
    }
  }
}
