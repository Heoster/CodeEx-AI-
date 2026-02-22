import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, Shield, AlertCircle, Scale, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const metadata: Metadata = {
  title: 'Terms of Service | CODEEX AI',
  description: 'Terms of Service and User Agreement for CODEEX AI platform',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Terms of Service</h1>
              <p className="text-muted-foreground mt-1">Last updated: February 21, 2026</p>
            </div>
          </div>

          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              By accessing or using CODEEX AI, you agree to be bound by these Terms of Service. Please read them carefully.
            </AlertDescription>
          </Alert>
        </div>

        {/* Quick Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <a href="#acceptance" className="text-sm text-primary hover:underline">1. Acceptance of Terms</a>
              <a href="#services" className="text-sm text-primary hover:underline">2. Description of Services</a>
              <a href="#account" className="text-sm text-primary hover:underline">3. User Accounts</a>
              <a href="#usage" className="text-sm text-primary hover:underline">4. Acceptable Use</a>
              <a href="#content" className="text-sm text-primary hover:underline">5. User Content</a>
              <a href="#intellectual" className="text-sm text-primary hover:underline">6. Intellectual Property</a>
              <a href="#privacy" className="text-sm text-primary hover:underline">7. Privacy</a>
              <a href="#limitations" className="text-sm text-primary hover:underline">8. Limitations of Liability</a>
              <a href="#termination" className="text-sm text-primary hover:underline">9. Termination</a>
              <a href="#changes" className="text-sm text-primary hover:underline">10. Changes to Terms</a>
            </div>
          </CardContent>
        </Card>

        {/* Terms Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <Card id="acceptance">
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                Welcome to CODEEX AI. By accessing or using our platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
              <p>
                These terms apply to all users, including visitors, registered users, and contributors. Your use of CODEEX AI constitutes your acceptance of these terms.
              </p>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card id="services">
            <CardHeader>
              <CardTitle>2. Description of Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                CODEEX AI provides access to artificial intelligence models and tools for various purposes including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI-powered chat and conversation</li>
                <li>Code generation and analysis</li>
                <li>Mathematical problem solving</li>
                <li>PDF document analysis</li>
                <li>Smart note-taking and organization</li>
                <li>Web search integration</li>
                <li>Text-to-speech capabilities</li>
              </ul>
              <p>
                We provide access to 35+ AI models from multiple providers including Groq, Google, Hugging Face, and Cerebras. Services are provided "as is" and may be modified or discontinued at any time.
              </p>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card id="account">
            <CardHeader>
              <CardTitle>3. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Account Registration</h4>
                <p>
                  To access certain features, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Account Security</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You are responsible for all activities that occur under your account</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                  <li>We are not liable for any loss or damage arising from your failure to protect your account</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Age Requirement</h4>
                <p>
                  You must be at least 13 years old to use CODEEX AI. Users under 18 should have parental or guardian consent.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card id="usage">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>4. Acceptable Use</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>You agree NOT to use CODEEX AI to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Generate harmful, abusive, or offensive content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Distribute malware, viruses, or malicious code</li>
                <li>Engage in automated scraping or data mining without permission</li>
                <li>Impersonate others or misrepresent your affiliation</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Use the service for illegal activities or fraud</li>
                <li>Generate spam or unsolicited communications</li>
              </ul>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Violation of these terms may result in immediate account suspension or termination.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card id="content">
            <CardHeader>
              <CardTitle>5. User Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Your Content</h4>
                <p>
                  You retain ownership of any content you submit to CODEEX AI. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, store, and process your content solely to provide and improve our services.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">AI-Generated Content</h4>
                <p>
                  Content generated by AI models through our platform is provided for your use. However, you are responsible for reviewing and verifying AI-generated content before use. We do not guarantee the accuracy, completeness, or reliability of AI-generated content.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Content Responsibility</h4>
                <p>
                  You are solely responsible for your use of any content, whether user-submitted or AI-generated. We are not liable for any consequences arising from your use of such content.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card id="intellectual">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                <CardTitle>6. Intellectual Property</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                The CODEEX AI platform, including its design, code, features, and documentation, is owned by CODEEX AI and protected by intellectual property laws.
              </p>
              <div>
                <h4 className="font-semibold mb-2">Our Rights</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>All trademarks, logos, and service marks are our property</li>
                  <li>The platform's source code and architecture are proprietary</li>
                  <li>You may not copy, modify, or reverse engineer our platform</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Third-Party Models</h4>
                <p>
                  AI models provided through our platform are subject to their respective providers' terms and licenses. We integrate models from Groq, Google, Hugging Face, and Cerebras.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card id="privacy">
            <CardHeader>
              <CardTitle>7. Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <div>
                <h4 className="font-semibold mb-2">Data Collection</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>We collect information you provide during registration and use</li>
                  <li>We may collect usage data to improve our services</li>
                  <li>We use Firebase for authentication and data storage</li>
                </ul>
              </div>
              <p>
                For detailed information about our privacy practices, please review our{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card id="limitations">
            <CardHeader>
              <CardTitle>8. Limitations of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Service Availability</h4>
                <p>
                  CODEEX AI is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service. The platform may experience downtime for maintenance or technical issues.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Disclaimer</h4>
                <p>
                  To the maximum extent permitted by law, we disclaim all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Limitation of Damages</h4>
                <p>
                  We shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of CODEEX AI, including but not limited to loss of data, loss of profits, or business interruption.
                </p>
              </div>
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  AI-generated content may contain errors or inaccuracies. Always verify important information before use.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card id="termination">
            <CardHeader>
              <CardTitle>9. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">By You</h4>
                <p>
                  You may terminate your account at any time through the user management page. Upon termination, your access to the service will cease.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">By Us</h4>
                <p>
                  We reserve the right to suspend or terminate your account at any time for:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Violation of these Terms of Service</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Abuse of the platform or other users</li>
                  <li>Any reason at our sole discretion</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Effect of Termination</h4>
                <p>
                  Upon termination, your right to use the service will immediately cease. We may delete your account data in accordance with our data retention policies.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 10 */}
          <Card id="changes">
            <CardHeader>
              <CardTitle>10. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes by:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Updating the "Last updated" date at the top of this page</li>
                <li>Posting a notice on our platform</li>
                <li>Sending an email notification (for registered users)</li>
              </ul>
              <p>
                Your continued use of CODEEX AI after changes are posted constitutes your acceptance of the modified terms.
              </p>
            </CardContent>
          </Card>

          {/* Additional Sections */}
          <Card>
            <CardHeader>
              <CardTitle>11. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Uttar Pradesh, India.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> the.heoster@mail.com</p>
                <p><strong>Developer:</strong> Heoster (Harsh)</p>
                <p><strong>Location:</strong> Khatauli, Uttar Pradesh, India</p>
              </div>
              <div className="flex gap-4 mt-4">
                <Link href="/contact">
                  <Button variant="outline" size="sm">
                    Contact Us
                  </Button>
                </Link>
                <Link href="/privacy">
                  <Button variant="outline" size="sm">
                    Privacy Policy
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2026 CODEEX AI. All rights reserved.</p>
          <p className="mt-2">
            By using CODEEX AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
