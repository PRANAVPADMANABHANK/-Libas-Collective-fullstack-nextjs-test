# Resend Email Setup Guide (Alternative to SendGrid)

This guide will help you set up Resend to send welcome emails when users register. Resend is much easier to set up than SendGrid!

## 🚀 **Why Resend?**

- ✅ **Easier setup** - No domain verification needed initially
- ✅ **Better deliverability** - Modern infrastructure
- ✅ **Generous free tier** - 3,000 emails/month free
- ✅ **Developer-friendly** - Simple API
- ✅ **No spam folder issues** - Better email delivery

## 📧 **Step 1: Install Dependencies**

First, install the Resend package in your functions directory:

```bash
cd functions
npm install resend
```

## 🚀 **Step 2: Set Up Resend Account**

1. **Create Resend Account:**
   - Go to [Resend.com](https://resend.com)
   - Sign up for a free account
   - Verify your email address

2. **Get API Key:**
   - After login, you'll see your API key immediately
   - Copy the API key (starts with `re_`)

3. **No Domain Verification Needed:**
   - Resend provides `onboarding@resend.dev` for testing
   - You can use this immediately without setup

## 🔧 **Step 3: Configure Environment Variables**

Set these environment variables in your Firebase project:

### **Option A: Firebase Console (Recommended)**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Functions → Configuration → Environment variables
4. Add these variables:

```
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
FRONTEND_URL=https://yourdomain.com
```

### **Option B: Local Development (.env file)**
Create a `.env` file in your functions directory:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
FRONTEND_URL=http://localhost:3000
```

## 🚀 **Step 4: Deploy Functions**

Deploy your updated Cloud Functions:

```bash
cd functions
npm run deploy
```

## 🧪 **Step 5: Test the Setup**

### **Test Automatic Welcome Email:**
1. Register a new user account
2. Check your email inbox
3. Check Firebase Functions logs for confirmation

### **Test Manual Welcome Email:**
You can also test manually using the new `sendWelcomeEmailManual` function:

```bash
curl -X POST https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/sendWelcomeEmailManual \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "displayName": "Test User"}'
```

## 🔍 **Troubleshooting**

### **Email Not Received:**
1. **Check Spam Folder** - Less likely with Resend
2. **Verify Resend Configuration** - Check API key
3. **Check Function Logs** - Look for errors in Firebase Console

### **Common Issues:**

#### **"Resend API key not configured"**
- Ensure `RESEND_API_KEY` environment variable is set
- Redeploy functions after setting environment variables

#### **"Unauthorized" Error**
- Verify your Resend API key is correct
- Check that the API key starts with `re_`

#### **"From address not verified"**
- Use `onboarding@resend.dev` for testing
- This is provided by Resend and works immediately

### **Check Function Logs:**
1. Go to Firebase Console → Functions
2. Click on your function
3. Check the "Logs" tab for any errors

## 📱 **Email Template Customization**

The welcome email template is in the `sendWelcomeEmail` function. You can customize:

- **Subject line** - Change the email subject
- **HTML content** - Modify the email body
- **Styling** - Update colors, fonts, and layout
- **Links** - Change the call-to-action button URL

## 🔒 **Security Notes**

- **Never commit API keys** to version control
- **Use environment variables** for sensitive data
- **API keys are secure** - Resend uses modern security

## 💰 **Cost Considerations**

- **Resend Free Tier**: 3,000 emails/month
- **Paid Plans**: Start at $20/month for 50k emails
- **Firebase Functions**: Pay per execution (very cheap)

## 🎯 **Next Steps**

Once welcome emails are working:

1. **Add more email types:**
   - Password reset emails
   - Order confirmation emails
   - Shipping updates

2. **Improve email templates:**
   - Add your company logo
   - Use your brand colors
   - A/B test different templates

3. **Set up email analytics:**
   - Track open rates
   - Monitor click-through rates
   - Analyze user engagement

## 🆚 **Resend vs SendGrid Comparison**

| Feature | Resend | SendGrid |
|---------|--------|----------|
| **Setup Difficulty** | ⭐⭐⭐⭐⭐ Very Easy | ⭐⭐ Hard |
| **Free Tier** | 3,000 emails/month | 100 emails/day |
| **Domain Verification** | Optional | Required |
| **Deliverability** | Excellent | Good |
| **API Simplicity** | Very Simple | Complex |
| **Documentation** | Clear & Modern | Comprehensive but Complex |

## 📞 **Support**

If you're still having issues:

1. Check [Resend Documentation](https://resend.com/docs)
2. Review [Firebase Functions Logs](https://console.firebase.google.com)
3. Verify your environment variables are set correctly
4. Use the `onboarding@resend.dev` email for testing

---

**Resend is much easier than SendGrid! 🎉**
