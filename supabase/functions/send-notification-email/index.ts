import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@4.0.0";
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
// Cambia esta URL por la del logo oficial de tu marca
const logoUrl = "https://aiyujapan.com/aiyu_logo_small.png";
const appUrl = "https://aiyujapan.com";
serve(async (req)=>{
  if (req.method === "OPTIONS") return new Response(null, {
    headers: corsHeaders
  });
  try {
    const payload = await req.json();
    const { data: profile, error: profileError } = await supabase.from("profiles").select("email, full_name, user_personal_id").eq("id", payload.user_id).single();
    if (profileError || !profile?.email) {
      return json({
        error: "User email not found"
      }, 404);
    }
    const { subject, html, text } = generateEmailContent(payload, profile);
    const adminTypes = [
      "new_product_request",
      "order_resubmitted",
      "new_shipping_request"
    ];
    const toEmail = adminTypes.includes(payload.type) ? "notification@aiyujapan.com" : profile.email;
    const emailResponse = await resend.emails.send({
      from: "Aiyu Japan <notification@aiyujapan.com>",
      to: [
        toEmail
      ],
      subject,
      html,
      text
    });
    return json({
      success: true,
      emailResponse
    }, 200);
  } catch (error) {
    console.error("Error sending email:", error);
    return json({
      error: error.message
    }, 500);
  }
});
function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
// -------------------------
// Email Templates
// -------------------------
function generateEmailContent(payload, profile) {
  const userName = profile.full_name || "Customer";
  const userId = profile.user_personal_id || "N/A";
  const templates = {
    quote_received: {
      subject: `Your Quote for Order #${payload.personal_order_id} is Ready - Aiyu Japan`,
      title: `Your Quote for Order #${payload.personal_order_id} is Ready - Aiyu Japan`,
      body: `
        Hello ${userName},<br><br>
        We’re pleased to inform you that your requested product quote is now available for review.<br><br>
        ${payload.message || ""}
        <br><strong>Order Reference Number:</strong> ${payload.order_group_id || "N/A"}
      `,
      buttonText: "View Your Quote",
      buttonLink: `${appUrl}/user-dashboard?tab=orders`
    },
    shipping_quote_received: {
      subject: `Your Shipping Quote for #${payload.personal_shipping_id} is Ready - Aiyu Japan`,
      title: `Your Shipping Quote for #${payload.personal_shipping_id} is Ready - Aiyu Japan`,
      body: `
        Hello ${userName},<br><br>
        Your shipping quote is now available for review.<br><br>
        ${payload.message || ""}
        <br><strong>Shipment Reference Number:</strong> ${payload.order_group_id || "N/A"}
      `,
      buttonText: "Review Shipping Quote",
      buttonLink: `${appUrl}/user-dashboard?tab=shipping`
    },
    order_shipped: {
      subject: `Your Order #${payload.personal_order_id} Has Been Shipped - Aiyu Japan`,
      title: `Your Order #${payload.personal_order_id} Has Been Shipped - Aiyu Japan`,
      body: `
        Hello ${userName},<br><br>
        Great news! Your order has been shipped.<br><br>
        ${payload.message || ""}
        <br><strong>Shipment Reference Number:</strong> ${payload.order_group_id || "N/A"}
      `,
      buttonText: "Track Your Shipment",
      buttonLink: `${appUrl}/user-dashboard?tab=shipping`
    },
    order_rejected: {
      subject: `Action Required: Please Review Your Order #${payload.personal_order_id} - Aiyu Japan`,
      title: `Action Required: Please Review Your Order #${payload.personal_order_id} - Aiyu Japan`,
      body: `
        Hello ${userName},<br><br>
        We need your attention to proceed with your order.<br><br>
        ${payload.message || ""}
        <br><strong>Order Reference Number:</strong> ${payload.order_group_id || "N/A"}
      `,
      buttonText: "Review Order Details",
      buttonLink: `${appUrl}/user-dashboard?tab=orders`,
      alert: true
    },
    new_product_request: {
      subject: "New Order Notification - Aiyu Japan Admin",
      title: "New Order Notification",
      body: `
        Hello Admin,<br><br>
        ${payload.message || ""}
        <br><br><strong>Customer:</strong> ${userName} (${userId})
        <br><strong>Order ID:</strong> ${payload.order_group_id || "N/A"}
        <br><strong>Customer Personal Order ID:</strong> ${payload.personal_order_id || "N/A"}
      `,
      buttonText: "Review Order",
      buttonLink: `${appUrl}/admin-dashboard?tab=requests&orderId=${payload.order_group_id}`
    },
    order_resubmitted: {
      subject: "New Order Notification - Aiyu Japan Admin",
      title: "New Order Notification",
      body: `
        Hello Admin,<br><br>
        ${payload.message || ""}
        <br><br><strong>Customer:</strong> ${userName} (${userId})
        <br><strong>Order ID:</strong> ${payload.order_group_id || "N/A"}
        <br><strong>Customer Personal Order ID:</strong> ${payload.personal_order_id || "N/A"}
      `,
      buttonText: "Review Order",
      buttonLink: `${appUrl}/admin-dashboard?tab=requests&orderId=${payload.order_group_id}`
    },
    new_shipping_request: {
      subject: "New Shipping Request - Aiyu Japan Admin",
      title: "New Shipping Request",
      body: `
        Hello Admin,<br><br>
        ${payload.message || ""}
        <br><br><strong>Customer:</strong> ${userName} (${userId})
        <br><strong>Customer Personal Shipment ID:</strong> ${payload.personal_shipping_id || "N/A"}
      `,
      buttonText: "Process Request",
      buttonLink: `${appUrl}/admin-dashboard?tab=shipping-requests&shipmentId=${payload.order_group_id}`
    },
    payment_confirmed: {
      subject: `Payment Confirmed for Order #${payload.personal_order_id} - Aiyu Japan`,
      title: `Payment Confirmed for Order #${payload.personal_order_id}`,
      body: `
        Hello ${userName},<br><br>
        ${payload.message || "We will now proceed to purchase your requested items and keep you updated on their status."}
        <br><br><strong>Order Reference Number:</strong> ${payload.order_group_id || "N/A"}
      `,
      buttonText: "View Your Order",
      buttonLink: `${appUrl}/user-dashboard?tab=orders`
    },
    items_at_warehouse: {
      subject: `Your Items Have Arrived at Our Warehouse - Aiyu Japan`,
      title: `Your Items Have Arrived at Our Warehouse`,
      body: `
        Hello ${userName},<br><br>

        ${payload.message || "You can now request shipping or combine with other pending orders before final shipment."}
        <br><br><strong>Order Reference Number:</strong> ${payload.order_group_id || "N/A"}
      `,
      buttonText: "Proceed to Shipping",
      buttonLink: `${appUrl}/user-dashboard?tab=storage`
    },
    shipping_payment_confirmed: {
      subject: `Shipping Payment Confirmed for Order - Aiyu Japan`,
      title: `Shipping Payment Confirmed`,
      body: `
        Hello ${userName},<br><br>

        ${payload.message || "We are now preparing your package for international dispatch."}
        <br><br><strong>Order Reference Number:</strong> ${payload.order_group_id || "N/A"}
      `,
      buttonText: "Track Order Progress",
      buttonLink: `${appUrl}/user-dashboard?tab=shipping&shipmentId=${payload.order_group_id}`
    },
    shipment_sent: {
      subject: `Your Shipment Has Been Sent - Aiyu Japan`,
      title: `Your Shipment Is On the Way!`,
      body: `
        Hello ${userName},<br><br>
        
        ${payload.message || "You can track your shipment details and estimated delivery time below."}

      `,
      buttonText: "View Shipment",
      buttonLink: `${appUrl}/user-dashboard?tab=shipping&shipmentId=${payload.order_group_id}`
    },
    shipping_request_rejected: {
      subject: `Action Required: Please Review Your Shipment - Aiyu Japan`,
      title: `Action Required: Please Review Your Shipment!`,
      body: `
        Hello ${userName},<br><br>
        
        ${payload.message || "Please review the details of your shipping request and make the necessary corrections or contact support for assistance."}
        <br><br><strong>Shipment Reference Number:</strong> ${payload.order_group_id || "N/A"}
      `,
      buttonText: "Review Shipping Request",
      buttonLink: `${appUrl}/user-dashboard?tab=shipping&shipmentId=${payload.order_group_id}`,
      alert: true
    },
    box_item_added: {
      subject: `Your Package Has Arrived at Our Warehouse - Aiyu Japan`,
      title: `Your Package Has Arrived at Our Warehouse`,
      body: `
        Hello ${userName},<br><br>
        
        ${payload.message || "A box shipment has been added to your storage. You can now request shipping or combine with other pending orders before final shipment."}
        <br><br><strong>Item Details:</strong> ${payload.item_name || "Package"}
      `,
      buttonText: "View Storage",
      buttonLink: `${appUrl}/user-dashboard?tab=storage`
    }
  };
  const t = templates[payload.type] || {
    subject: "Aiyu Japan Notification",
    title: "Aiyu Japan Notification",
    body: `Hello ${userName},<br><br>${payload.message || ""}`,
    buttonText: "View Dashboard",
    buttonLink: `${appUrl}/user-dashboard`
  };
  const html = `
  <div style="background:#f3f5f7;padding:32px 16px;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      <div style="text-align:center;padding:24px 24px 8px;">
        <img src="${logoUrl}" alt="Aiyu Japan" style="height:48px;object-fit:contain;" />
      </div>
      <div style="padding:8px 24px 0 24px;text-align:center;">
        <h2 style="margin:8px 0 12px;color:#333;font-family:Arial,Helvetica,sans-serif;">${t.title}</h2>
        <p style="color:#555;font-family:Arial,Helvetica,sans-serif;line-height:1.6;">${t.body}</p>
        <a href="${t.buttonLink}"
           style="display:inline-block;margin-top:16px;background:${t.alert ? "#F6B40E" : "#5DC4EE"};color:${t.alert ? "#111" : "#fff"};text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-family:Arial,Helvetica,sans-serif;">
           ${t.buttonText}
        </a>
        <p style="margin:20px 0 0;color:#666;font-size:14px;font-family:Arial,Helvetica,sans-serif;">
          Customer ID: ${userId}
        </p>
      </div>
      <div style="padding:24px;text-align:center;">
        <p style="color:#999;font-size:12px;line-height:1.5;font-family:Arial,Helvetica,sans-serif;">
          This message was sent automatically by Aiyu Japan’s notification system.<br>
          If you have questions, please contact
          <a href="mailto:support@aiyujapan.com" style="color:#5DC4EE;text-decoration:none;">support@aiyujapan.com</a>.
        </p>
        <p style="color:#999;font-size:12px;text-align:center;margin:40px 0 0;">
          © 2025 SERRUDO合同会社 - Aiyu Japan. All rights reserved.
        </p>
      </div>
    </div>
  </div>
  `;
  const text = `
${t.title}

${t.body.replace(/<[^>]*>?/gm, "")}

Link: ${t.buttonLink}
Customer ID: ${userId}
© 2025 SERRUDO合同会社 - Aiyu Japan. All rights reserved.
`;
  return {
    subject: t.subject,
    html,
    text
  };
}
