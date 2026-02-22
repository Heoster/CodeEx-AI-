import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Bell, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const metadata: Metadata = {
  title: 'Privacy Policy | CODEEX AI',
  description: 'Privacy Policy and Data Protection practices for CODEEX AI platform',
};

export default function PrivacyPage() {
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
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground mt-1">Last updated: February 21, 2026</p>
            </div>
          </div>

          <Alert className="mt-4">
            <Eye className="h-4 w-4" />
            <AlertDescription>
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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
              <a href="#introduction" className="text-sm text-primary hover:underline">1. Introduction</a>
              <a href="#information" className="text-sm text-primary hover:underline">2. Information We Collect</a>
              <a href="#usage" className="text-sm text-primary hover:underline">3. How We Use Your Information</a>
              <a href="#sharing" className="text-sm text-primary hover:underline">4. Information Sharing</a>
              <a href="#third-party" className="text-sm text-primary hover:underline">5. Third-Party Services</a>
              <a href="#security" className="text-sm text-primary hover:underline">6. Data Security</a>
              <a href="#retention" className="text-sm text-primary hover:underline">7. Data Retention</a>
              <a href="#rights" className="text-sm text-primary hover:underline">8. Your Rights</a>
              <a href="#cookies" className="text-sm text-primary hover:underline">9. Cookies & Tracking</a>
              <a href="#children" className="text-sm text-primary hover:underline">10. Children's Privacy</a>
              <a href="#international" className="text-sm text-primary hover:underline">11. International Users</a>
              <a href="#changes" className="text-sm text-primary hover:underline">12. Policy Changes</a>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Content */}
        <div className="space-y-8">
          {/* Section 1 */}
          <Card id="introduction">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>1. Introduction</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                Welcome to CODEEX AI. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
              <p>
                CODEEX AI is developed and maintained by Heoster (Harsh), located in Khatauli, Uttar Pradesh, India. By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
              <p>
                If you do not agree with the terms of this Privacy Policy, please do not access or use our services.
              </p>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card id="information">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <CardTitle>2. Information We Collect</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <p>When you register for an account, we collect:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Email address</li>
                  <li>Display name (optional)</li>
                  <li>Password (encrypted and never stored in plain text)</li>
                  <li>Profile information you choose to provide</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Usage Data</h4>
                <p>We automatically collect certain information when you use our services:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Chat conversations and AI interactions</li>
                  <li>Model preferences and settings</li>
                  <li>Feature usage patterns (chat, math solver, PDF analyzer, etc.)</li>
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and general location data</li>
                  <li>Session duration and timestamps</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Content Data</h4>
                <p>We process content you provide to our services:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Text prompts and messages sent to AI models</li>
                  <li>Files uploaded for analysis (PDFs, images)</li>
                  <li>Smart notes and saved content</li>
                  <li>Math problems and solutions</li>
                  <li>Web search queries</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Technical Data</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Cookies and similar tracking technologies</li>
                  <li>Log files and error reports</li>
                  <li>Performance metrics and analytics</li>
                  <li>API usage statistics</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card id="usage">
            <CardHeader>
              <CardTitle>3. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>We use the collected information for the following purposes:</p>
              
              <div>
                <h4 className="font-semibold mb-2">Service Delivery</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide access to 35+ AI models and features</li>
                  <li>Process your requests and generate AI responses</li>
                  <li>Enable chat, math solving, PDF analysis, and other features</li>
                  <li>Maintain your account and preferences</li>
                  <li>Provide text-to-speech and voice features</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Service Improvement</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Analyze usage patterns to improve our platform</li>
                  <li>Optimize AI model performance and accuracy</li>
                  <li>Develop new features and capabilities</li>
                  <li>Fix bugs and technical issues</li>
                  <li>Enhance user experience and interface</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Communication</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Send welcome emails and account notifications</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send important updates about service changes</li>
                  <li>Notify you of new features (with your consent)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Security & Compliance</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Detect and prevent fraud and abuse</li>
                  <li>Ensure platform security and integrity</li>
                  <li>Comply with legal obligations</li>
                  <li>Enforce our Terms of Service</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card id="sharing">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>4. Information Sharing</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>

              <div>
                <h4 className="font-semibold mb-2">With Your Consent</h4>
                <p>We will share your information when you explicitly authorize us to do so.</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Service Providers</h4>
                <p>We share information with trusted third-party service providers who assist us in operating our platform (see Section 5 for details).</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Legal Requirements</h4>
                <p>We may disclose your information if required by law or in response to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                  <li>Valid legal processes (court orders, subpoenas)</li>
                  <li>Government or regulatory requests</li>
                  <li>Protection of our rights and property</li>
                  <li>Prevention of fraud or illegal activities</li>
                  <li>Protection of user safety</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Business Transfers</h4>
                <p>
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. We will notify you of any such change.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Aggregated Data</h4>
                <p>
                  We may share anonymized, aggregated data that does not identify you personally for research, analytics, or marketing purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card id="third-party">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle>5. Third-Party Services</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>CODEEX AI integrates with the following third-party services:</p>

              <div>
                <h4 className="font-semibold mb-2">Firebase (Google)</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Authentication and user management</li>
                  <li>Cloud database (Firestore)</li>
                  <li>Data storage and synchronization</li>
                  <li>Privacy Policy: <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firebase Privacy</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">AI Model Providers</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Groq:</strong> Fast AI inference for multiple models</li>
                  <li><strong>Google AI:</strong> Gemini models and services</li>
                  <li><strong>Hugging Face:</strong> Open-source AI models</li>
                  <li><strong>Cerebras:</strong> Ultra-fast inference for Llama, Qwen, and other models</li>
                </ul>
                <p className="mt-2">
                  Your prompts and content are sent to these providers to generate responses. Each provider has their own privacy policies and data handling practices.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">EmailJS</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Email delivery for contact forms and notifications</li>
                  <li>Privacy Policy: <a href="https://www.emailjs.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">EmailJS Privacy</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Edge TTS (Microsoft)</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Text-to-speech conversion</li>
                  <li>Voice synthesis for AI responses</li>
                </ul>
              </div>

              <Alert className="mt-4">
                <Bell className="h-4 w-4" />
                <AlertDescription>
                  We recommend reviewing the privacy policies of these third-party services to understand how they handle your data.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card id="security">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle>6. Data Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                We implement industry-standard security measures to protect your personal information:
              </p>

              <div>
                <h4 className="font-semibold mb-2">Technical Safeguards</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>HTTPS encryption for all data transmission</li>
                  <li>Encrypted password storage using Firebase Authentication</li>
                  <li>Secure API key management</li>
                  <li>Regular security audits and updates</li>
                  <li>Firewall and intrusion detection systems</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Administrative Safeguards</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Limited access to personal data</li>
                  <li>Employee confidentiality agreements</li>
                  <li>Regular security training</li>
                  <li>Incident response procedures</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Physical Safeguards</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Secure cloud infrastructure (Firebase, Netlify)</li>
                  <li>Data center security measures</li>
                  <li>Backup and disaster recovery systems</li>
                </ul>
              </div>

              <Alert className="mt-4">
                <AlertDescription>
                  While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card id="retention">
            <CardHeader>
              <CardTitle>7. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy.
              </p>

              <div>
                <h4 className="font-semibold mb-2">Account Data</h4>
                <p>
                  Your account information is retained until you delete your account. You can delete your account at any time through the User Management page.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Chat History</h4>
                <p>
                  Chat conversations are stored to provide service continuity. You can clear your chat history at any time.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Usage Data</h4>
                <p>
                  Anonymized usage data may be retained for analytics and service improvement purposes.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Legal Requirements</h4>
                <p>
                  We may retain certain information as required by law or for legitimate business purposes (e.g., fraud prevention, dispute resolution).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card id="rights">
            <CardHeader>
              <CardTitle>8. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>You have the following rights regarding your personal information:</p>

              <div>
                <h4 className="font-semibold mb-2">Access</h4>
                <p>
                  You can access your personal information through your account settings and user management page.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Correction</h4>
                <p>
                  You can update or correct your personal information at any time through your account settings.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Deletion</h4>
                <p>
                  You can request deletion of your account and personal data through the User Management page. Note that some information may be retained as required by law.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Data Portability</h4>
                <p>
                  You can export your data (chat history, notes) using our export features.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Opt-Out</h4>
                <p>
                  You can opt out of non-essential communications through your account settings.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Withdraw Consent</h4>
                <p>
                  Where we rely on your consent to process data, you can withdraw consent at any time.
                </p>
              </div>

              <p className="mt-4">
                To exercise these rights, please contact us at{' '}
                <a href="mailto:the.heoster@mail.com" className="text-primary hover:underline">
                  the.heoster@mail.com
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card id="cookies">
            <CardHeader>
              <CardTitle>9. Cookies & Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                We use cookies and similar tracking technologies to enhance your experience:
              </p>

              <div>
                <h4 className="font-semibold mb-2">Essential Cookies</h4>
                <p>Required for authentication, security, and basic functionality.</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Preference Cookies</h4>
                <p>Store your settings and preferences (theme, model selection, language).</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Analytics Cookies</h4>
                <p>Help us understand how users interact with our platform to improve services.</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Local Storage</h4>
                <p>
                  We use browser local storage to save your preferences and provide offline functionality for our PWA (Progressive Web App).
                </p>
              </div>

              <p className="mt-4">
                You can control cookies through your browser settings. Note that disabling cookies may affect functionality.
              </p>
            </CardContent>
          </Card>

          {/* Section 10 */}
          <Card id="children">
            <CardHeader>
              <CardTitle>10. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                CODEEX AI is intended for users aged 13 and above. We do not knowingly collect personal information from children under 13.
              </p>
              <p>
                If you are under 18, you should have parental or guardian consent before using our services.
              </p>
              <p>
                If we become aware that we have collected personal information from a child under 13 without parental consent, we will take steps to delete that information promptly.
              </p>
              <p>
                Parents or guardians who believe their child has provided personal information to us can contact us at{' '}
                <a href="mailto:the.heoster@mail.com" className="text-primary hover:underline">
                  the.heoster@mail.com
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Section 11 */}
          <Card id="international">
            <CardHeader>
              <CardTitle>11. International Users</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                CODEEX AI is operated from India. If you are accessing our services from outside India, please be aware that your information may be transferred to, stored, and processed in India and other countries where our service providers operate.
              </p>
              <p>
                By using our services, you consent to the transfer of your information to countries outside your country of residence, which may have different data protection laws.
              </p>
              <div>
                <h4 className="font-semibold mb-2">European Users (GDPR)</h4>
                <p>
                  If you are in the European Economic Area (EEA), you have additional rights under GDPR, including the right to lodge a complaint with a supervisory authority.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">California Users (CCPA)</h4>
                <p>
                  California residents have specific rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected and the right to opt-out of sale (note: we do not sell personal information).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 12 */}
          <Card id="changes">
            <CardHeader>
              <CardTitle>12. Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.
              </p>
              <p>
                When we make changes, we will:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Update the "Last updated" date at the top of this page</li>
                <li>Post a notice on our platform for significant changes</li>
                <li>Send email notifications to registered users (for material changes)</li>
              </ul>
              <p>
                Your continued use of CODEEX AI after changes are posted constitutes your acceptance of the updated Privacy Policy.
              </p>
              <p>
                We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle>13. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 mt-4">
                <p><strong>Developer:</strong> Heoster (Harsh)</p>
                <p><strong>Email:</strong>{' '}
                  <a href="mailto:the.heoster@mail.com" className="text-primary hover:underline">
                    the.heoster@mail.com
                  </a>
                </p>
                <p><strong>Location:</strong> Khatauli, Uttar Pradesh, India</p>
              </div>
              <div className="flex gap-4 mt-6">
                <Link href="/contact">
                  <Button variant="outline" size="sm">
                    Contact Form
                  </Button>
                </Link>
                <Link href="/terms">
                  <Button variant="outline" size="sm">
                    Terms of Service
                  </Button>
                </Link>
                <Link href="/user-management">
                  <Button variant="outline" size="sm">
                    Manage Your Data
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection Summary */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Data Protection Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>✓ We do not sell your personal information</p>
              <p>✓ Your data is encrypted in transit and at rest</p>
              <p>✓ You can delete your account and data at any time</p>
              <p>✓ We use trusted third-party services (Firebase, Groq, Google, Cerebras)</p>
              <p>✓ We comply with applicable data protection laws</p>
              <p>✓ You have full control over your data and privacy settings</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2026 CODEEX AI. All rights reserved.</p>
          <p className="mt-2">
            This Privacy Policy is effective as of February 21, 2026 and will remain in effect except with respect to any changes in its provisions in the future.
          </p>
        </div>
      </div>
    </div>
  );
}
