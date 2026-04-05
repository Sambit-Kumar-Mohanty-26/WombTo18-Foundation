import { Scale, ShieldAlert, FileKey2 } from "lucide-react";
import { Badge } from "../components/ui/badge";

export function CompliancePage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gray-900 text-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <Scale className="w-12 h-12 mx-auto mb-6 text-gray-400" />
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Legal & Compliance</h1>
          <p className="text-lg text-gray-400">
            Terms of Use, Privacy Policy, and Entity Disclosures for WombTo18 Foundation.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Sidebar Nav (Sticky) */}
          <div className="lg:col-span-3 sticky top-24 hidden lg:block space-y-2">
            <a href="#entity" className="block px-4 py-2 font-bold text-gray-900 bg-gray-100 rounded-lg">Entity Information</a>
            <a href="#privacy" className="block px-4 py-2 font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg">Privacy Policy</a>
            <a href="#terms" className="block px-4 py-2 font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg">Terms & Conditions</a>
            <a href="#refunds" className="block px-4 py-2 font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg">Refund Policy</a>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9 space-y-16">
            
            {/* Entity Section */}
            <div id="entity" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <FileKey2 className="w-6 h-6 text-gray-400" />
                <h2 className="text-3xl font-bold text-gray-900">Entity Information</h2>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm prose max-w-none text-gray-600">
                <p>
                  <strong>WOMBTO18 Foundation</strong> is registered as a Section 8 Company (Not for Profit) under the Companies Act, 2013 (India).
                </p>
                <ul>
                  <li><strong>Domain:</strong> <a href="https://wombto18.org" className="text-[var(--journey-saffron)] font-bold">wombto18.org</a></li>
                  <li><strong>Registration Certifications:</strong> 12A and 80G registered. Donations are eligible for tax benefits under Section 80G of the Income Tax Act, as per applicable rules.</li>
                  <li><strong>Registered Address:</strong> [Insert Address Here], Pune, Maharashtra, India.</li>
                  <li><strong>CSR Empanelment:</strong> Waitlisted for TechSoup India validation and CSR Form 1 approval.</li>
                </ul>
                <p>
                  WombTo18 currently operates predominantly across 12 states in India, focusing on maternal and child health from pregnancy through age 18.
                </p>
              </div>
            </div>

            {/* Privacy Section */}
            <div id="privacy" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="w-6 h-6 text-gray-400" />
                <h2 className="text-3xl font-bold text-gray-900">Privacy Policy</h2>
                <Badge variant="outline" className="bg-gray-100 border-gray-200">Last Updated: March 2026</Badge>
              </div>
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm prose max-w-none text-gray-600">
                <h3>1. Data Collection</h3>
                <p>
                  We collect personal information (Name, PAN, Email, Phone, Address) strictly for the purpose of processing donations, generating 80G tax certificates, and communicating project updates.
                </p>
                <h3>2. Data Security & Storage</h3>
                <p>
                  Financial transactions are processed via secure payment gateways (e.g., Razorpay) employing 256-bit encryption. We do not store full credit card numbers or UPI PINs on our servers.
                </p>
                <h3>3. Third-Party Sharing</h3>
                <p>
                  We never sell, rent, or trade your personal information. Data is only shared with statutory authorities (Income Tax Department) as required by Indian Law for tax-exemption verification.
                </p>
              </div>
            </div>

            {/* Refund Policy */}
            <div id="refunds" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Cancellation & Refund Policy</h2>
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm prose max-w-none text-gray-600">
                <p>
                  We appreciate your philanthropic choice. Due to the nature of charitable donations, all transactions are generally considered non-refundable. 
                </p>
                <p>
                  However, in case of an erroneous duplicate deduction, a refund request can be submitted within 7 days of the transaction. Please write to <strong>support@wombto18.org</strong> with your transaction ID and proof of deduction. Approved refunds will be processed within 10-14 working days.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
