import { useNavigate } from "react-router-dom"
import { useState } from "react"
import "./termsPrivacy.css"

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<number>(0)

  const sections = [
    {
      title: "Agreement to Terms",
      content:
        "By accessing or using the ArenaX platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
    },
    {
      title: "Use License",
      content:
        "Permission is granted to temporarily use the ArenaX platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials.",
    },
    {
      title: "Account Responsibilities",
      content:
        "If you create an account with us, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it.",
    },
    {
      title: "Intellectual Property",
      content:
        "The Service and its original content, features, and functionality are and will remain the exclusive property of ArenaX and its licensors. The Service is protected by copyright, trademark, and other laws.",
    },
    {
      title: "User Content",
      content:
        "Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content you post to the Service.",
    },
    {
      title: "Prohibited Uses",
      content:
        "You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service for any illegal or unauthorized purpose or to violate any laws in your jurisdiction.",
    },
    {
      title: "Termination",
      content:
        "We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation.",
    },
    {
      title: "Limitation of Liability",
      content:
        "In no event shall ArenaX, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.",
    },
    {
      title: "Governing Law",
      content:
        "These Terms shall be governed and construed in accordance with the laws applicable in your jurisdiction, without regard to its conflict of law provisions.",
    },
    {
      title: "Changes to Terms",
      content:
        "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect.",
    },
  ]

  return (
    <div className="legal-page-container">
      <div className="legal-page-sidebar">
        <div className="legal-page-logo">
          <h1>ArenaX</h1>
          <p className="legal-page-tagline">Play Like a Pro. Book Like One</p>
        </div>
        <div className="legal-page-nav">
          <h2>Terms of Service</h2>
          <ul>
            {sections.map((section, index) => (
              <li
                key={index}
                className={activeSection === index ? "active" : ""}
                onClick={() => setActiveSection(index)}
              >
                {section.title}
              </li>
            ))}
          </ul>
        </div>
        <div className="legal-page-footer">
          <a onClick={() => navigate("/login")} className="back-link">
            Back to Login
          </a>
        </div>
      </div>
      <div className="legal-page-content">
        <div className="legal-page-header">
          <h1>Terms of Service</h1>
          <p>Last Updated: March 30, 2025</p>
        </div>
        <div className="legal-page-section" >
          <h2>{sections[activeSection].title}</h2>
          <p>{sections[activeSection].content}</p>
        </div>
        <div className="legal-page-navigation">
          <button
            className="nav-button"
            disabled={activeSection === 0}
            onClick={() => setActiveSection((prev) => Math.max(0, prev - 1))}
          >
            Previous
          </button>
          <div className="section-indicator">
            {activeSection + 1} of {sections.length}
          </div>
          <button
            className="nav-button"
            disabled={activeSection === sections.length - 1}
            onClick={() => setActiveSection((prev) => Math.min(sections.length - 1, prev + 1))}
          >
            Next
          </button>
        </div>
        <div className="legal-page-powered">
          <p>Powered by WhileTrueDev</p>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService

