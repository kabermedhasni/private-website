import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./termsPrivacy.css";

const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const navigate = useNavigate();

  const sections = [
    {
      title: "Information Collection",
      content:
        "We collect personal information that you voluntarily provide to us when you register on the ArenaX platform, express an interest in obtaining information about us or our products and services, or otherwise contact us.",
    },
    {
      title: "Use of Information",
      content:
        "We use personal information collected via our platform for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.",
    },
    {
      title: "Information Sharing",
      content:
        "We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may process or share your data based on the following legal basis.",
    },
    {
      title: "Cookies and Tracking",
      content:
        "We may use cookies and similar tracking technologies to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.",
    },
    {
      title: "Data Retention",
      content:
        "We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law.",
    },
    {
      title: "Data Security",
      content:
        "We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards, no security system is impenetrable.",
    },
    {
      title: "Your Privacy Rights",
      content:
        "In some regions, such as the European Economic Area, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time.",
    },
    {
      title: "Children's Privacy",
      content:
        "Our platform is not intended for individuals under the age of 18. We do not knowingly collect data from or market to children under 18 years of age.",
    },
    {
      title: "Updates to This Policy",
      content:
        "We may update this privacy policy from time to time. The updated version will be indicated by an updated 'Revised' date and the updated version will be effective as soon as it is accessible.",
    },
    {
      title: "Contact Information",
      content:
        "If you have questions or comments about this policy, you may contact our Data Protection Officer (DPO) by email at privacy@arenax.com, or by post to ArenaX, Data Protection Office, 123 Arena Way, Sports City, SC 12345.",
    },
  ];

  return (
    <div className="legal-page-container">
      <div className="legal-page-sidebar">
        <div className="legal-page-logo">
          <h1>ArenaX</h1>
          <p className="legal-page-tagline">Play Like a Pro. Book Like One</p>
        </div>
        <div className="legal-page-nav">
          <h2>Privacy Policy</h2>
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
          <h1>Privacy Policy</h1>
          <p>Last Updated: March 30, 2025</p>
        </div>
        <div className="legal-page-section">
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
            onClick={() =>
              setActiveSection((prev) =>
                Math.min(sections.length - 1, prev + 1)
              )
            }
          >
            Next
          </button>
        </div>
        <div className="legal-page-powered">
          <p>Powered by WhileTrueDev</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
