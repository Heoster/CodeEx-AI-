import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader 
        backLink="/" 
        backText="Back to Home" 
        title="Privacy Policy"
      />
      <main className="container mx-auto max-w-4xl px-4 py-6 md:py-8 lg:py-12 md:px-6">
        <div className="space-y-8">
          <p className="text-sm text-muted-foreground">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold">1. Introduction</h2>
            <p className="leading-relaxed text-muted-foreground">
              Welcome to CODEEX AI (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;), developed by Heoster. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. By using CODEEX AI, you agree to the collection and use of information in accordance with this policy.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold">2. Information We Collect</h2>
            <p className="leading-relaxed text-muted-foreground">We may collect information about you in a variety of ways. The information we may collect includes:</p>
            <ul className="list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground">
              <li>
                <strong>Personal Data:</strong> Personally identifiable information, such as your name and email address, that you voluntarily give to us when you register with the application.
              </li>
              <li>
                <strong>Chat Data:</strong> The content of your conversations with our AI assistant, including any text, commands, or other information you provide. This data is used to provide the service and improve the AI&apos;s performance.
              </li>
              <li>
                <strong>Usage Data:</strong> Information that your browser sends whenever you visit our Service. This may include information such as your computer&apos;s Internet Protocol (IP) address, browser type, browser version, and other diagnostic data.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold">3. How We Use Your Information</h2>
            <p className="leading-relaxed text-muted-foreground">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
            <ul className="list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground">
              <li>Create and manage your account.</li>
              <li>Provide and operate the AI chat service.</li>
              <li>Improve the accuracy and capabilities of our AI models through analysis of anonymized chat data.</li>
              <li>Send you a welcome email upon registration.</li>
              <li>Monitor and analyze usage and trends to improve your experience with the application.</li>
              <li>Ensure the security of our application and prevent fraudulent activity.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold">4. Disclosure of Your Information</h2>
            <p className="leading-relaxed text-muted-foreground">We do not share your personal information with third parties except as described in this Privacy Policy. We may share information we have collected about you in certain situations:</p>
            <ul className="list-disc space-y-2 pl-6 leading-relaxed text-muted-foreground">
              <li>
                <strong>With Third-Party Service Providers:</strong> We use third-party services to operate our application, including Google Firebase for authentication and database services, and Hugging Face (inference API) for providing AI model inference. These services have their own privacy policies.
              </li>
              <li>
                <strong>By Law or to Protect Rights:</strong> If we believe the release of information is necessary to respond to legal process, to investigate potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted by law.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold">5. Security of Your Information</h2>
            <p className="leading-relaxed text-muted-foreground">
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure your data, please be aware that no security measures are perfect or impenetrable.
            </p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold">6. Your Data Rights</h2>
            <p className="leading-relaxed text-muted-foreground">
              You have the right to access, update, or delete your personal information. If you wish to delete your account, please contact us at the email address provided below.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold">7. Contact Us</h2>
            <p className="leading-relaxed text-muted-foreground">
              If you have questions or comments about this Privacy Policy, please contact us at:
              <br />
              <strong>Heoster</strong>
              <br />
              <a href="mailto:codeex@email.com" className="font-medium text-primary hover:underline">codeex@email.com</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}