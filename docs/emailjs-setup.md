# EmailJS Setup Guide for CODEEX AI

This guide explains how to set up EmailJS for the contact form and welcome emails.

## Step 1: Create an EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/) and create a free account
2. The free tier allows 200 emails/month

## Step 2: Add an Email Service

1. Go to **Email Services** in your dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Copy the **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Templates

### Contact Form Template

1. Go to **Email Templates** → **Create New Template**
2. Name it "Contact Form" or similar
3. Use this template:

**Subject:**
```
New Contact from {{user_name}} - CODEEX AI
```

**Body:**
```html
<h2>New Contact Form Submission</h2>

<p><strong>From:</strong> {{user_name}}</p>
<p><strong>Email:</strong> {{user_email}}</p>

<h3>Message:</h3>
<p>{{message}}</p>

<hr>
<p><small>Sent from <a href="{{app_url}}">CODEEX AI</a></small></p>
```

4. Set **To Email** to your email address
5. Save and copy the **Template ID**

### Welcome Email Template

1. Create another template named "Welcome Email"
2. Use this template:

**Subject:**
```
Welcome to CODEEX AI, {{to_name}}! 🎉
```

**Body:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="text-align: center; padding: 20px;">
    <h1 style="color: #3b82f6;">Welcome to CODEEX AI! 🎉</h1>
  </div>
  
  <p>Hi {{to_name}},</p>
  
  <p>Welcome aboard! We're thrilled to have you with us at <strong>CODEEX AI</strong>.</p>
  
  <p>Your account has been successfully created, and you're now ready to experience the future of intelligent AI assistance.</p>
  
  <h3>What you can do:</h3>
  <ul>
    <li>💬 Chat with our AI assistant</li>
    <li>🔍 Search the web with /search command</li>
    <li>📝 Solve problems with /solve command</li>
    <li>📄 Summarize text with /summarize command</li>
    <li>📷 Solve math from images</li>
    <li>📑 Analyze PDF documents</li>
  </ul>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{app_url}}/chat" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
      Start Chatting Now
    </a>
  </div>
  
  <p>If you have any questions, feel free to reach out to us at <a href="mailto:{{support_email}}">{{support_email}}</a>.</p>
  
  <p>Let's shape the future together!</p>
  
  <p>Warm regards,<br>
  <strong>Team CODEEX AI</strong> 🚀</p>
  
  <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;">
  <p style="font-size: 12px; color: #666; text-align: center;">
    This app is proudly developed by <strong>Heoster</strong>.<br>
    <a href="{{app_url}}">{{app_url}}</a>
  </p>
</div>
```

3. Set **To Email** to `{{to_email}}`
4. Save and copy the **Template ID**

## Step 4: Get Your Public Key

1. Go to **Account** → **General**
2. Copy your **Public Key** (User ID)

## Step 5: Update Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_contact_xxx
NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID=template_welcome_xxx
NEXT_PUBLIC_EMAILJS_USER_ID=your_public_key_here
```

## Step 6: Test

1. Restart your development server
2. Try the contact form at `/contact`
3. Create a new account to test the welcome email

## Template Variables Reference

### Contact Form Template
- `{{user_name}}` - Sender's name
- `{{user_email}}` - Sender's email
- `{{message}}` - Message content
- `{{app_url}}` - App URL (https://codeex-ai.netlify.app)

### Welcome Email Template
- `{{to_name}}` - User's display name
- `{{to_email}}` - User's email address
- `{{app_url}}` - App URL
- `{{app_name}}` - "CODEEX AI"
- `{{support_email}}` - Support email address

## Troubleshooting

- **Emails not sending**: Check browser console for errors
- **Invalid template**: Verify template IDs match exactly
- **Rate limited**: Free tier has 200 emails/month limit
