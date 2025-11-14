"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import QueueChatUI from "@/components/Status";
// Desktop flow: StartScreen and ConsentScreen are defined here. MenuScreen lives inside ChatInterface.

function DataPrivacyModal({
  onProceed,
  onDecline,
}: {
  onProceed: () => void;
  onDecline: () => void;
}) {
  const [isChecked, setIsChecked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-xl shadow-lg flex flex-col
                    w-[90%] max-w-sm h-[60%]
                    sm:w-[80%] sm:max-w-md sm:h-[65%]
                    md:w-96 md:h-[500px]"
      >
        {/* Header */}
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-center text-[#34495E]">
            Data Privacy Consent
          </h3>
        </div>

        {/* Body */}
        <div className="bg-white rounded-lg p-4 overflow-y-auto h-[300px] text-xs sm:text-sm md:text-base text-[#34495E] mb-6">
          <p className="mb-2 text-justify">
            <strong>Privacy Statement</strong> <br />
            This Privacy Notice explains how the Smart Queuing System collects,
            uses, stores, protects, and shares your personal data. The system
            may process information through camera access, facial or biometric
            capture, QR scanning, and related features. By using the system, you
            give your consent where required to the collection and processing of
            your personal data as described in this notice.
            <br />
            <br />
            This notice is issued in compliance with the Data Privacy Act of
            2012 (Republic Act No. 10173), its Implementing Rules and
            Regulations (IRR), and relevant issuances of the National Privacy
            Commission (e.g., NPC Circular No. 2023-04, and related guidelines).
            <br />
            <br />
          </p>
          <p className="mb-2 text-justify">
            <strong>Personal Information</strong>
            <br />
            We may collect and store the following information, among others, in
            our database:
            <br />
          </p>
          <ul className="list-disc list-inside ml-4 mb-4 text-[#34495E]">
            <li>Full Name</li>
            <li>Address</li>
          </ul>

          <p className="mb-2 text-justify">
            <strong>Collection Method</strong>
            <br />
            We collect personal information manually or electronically through
            online application forms connected to the Smart Queuing System. As
            part of system operations, specific data—such as, but not limited
            to, the following—are automatically generated:
            <br />
          </p>

          <ul className="list-disc list-inside ml-4 mb-4 text-[#34495E]">
            <li>Queue Numbers</li>
            <li>Timestamps</li>
            <li>Session IDs</li>
          </ul>

          <p className="mb-2 text-justify">
            The system collects a copy of the consent text, in addition to the
            previously stated data, to establish proof of lawful processing in
            accordance with data privacy requirements.
            <br />
            <br />
            <strong>Purpose of Collection</strong>
            <br />
            We collect your information to operate and improve the Smart Queuing
            System. This involves verifying your identity, assigning a queue
            number or ticket, processing QR scans for entry or tracking,
            preventing fraud or misuse, keeping system logs, generating
            analytics to enhance service quality, ensuring security, and meeting
            applicable legal and regulatory obligations.
            <br />
            <br />
            <strong>Use of Data</strong>
            <br />
            The personal data collected will be used solely to manage and
            improve the queuing process within the participating institution.
            <br />
            <br />
            Your personal information is processed for the following purposes:
            <br />
            <ul className="list-disc list-inside ml-4 mb-4 text-[#34495E]">
              <li>To assign and manage queue numbers for applicants.</li>
              <li>To provide real-time updates regarding queue status.</li>
              <li>
                To assist personnel in administering queues and prioritizing
                applicants when necessary.
              </li>
            </ul>
            <p className="mb-2 text-justify"></p>
            <strong>Disclosure of Personal Data</strong>
            <br />
            All personal data are handled with the highest degree of
            confidentiality. We will not disclose or make it accessible to any
            party unless required by law or authorized by your consent. When
            necessary, applicant inputs may be processed by external AI
            providers under strict safeguards to ensure that only the essential
            data is shared.
            <br />
            <br />
            <strong>Data Protection & Security</strong>
            <br />
            Only duly authorized personnel may process personal data. We
            regularly assess and enhance all security measures to ensure
            compliance with the Data Privacy Act of 2012 (Republic Act No.
            10173) and its Implementing Rules and Regulations (IRR).
            <br />
            <br />
            <strong>Storage & Disposal</strong>
            <br />
            Any personal data that is gathered is protected against any
            accidental or unlawful alteration, disclosure, or destruction,
            including against any form of unlawful processing. Appropriate
            measures are applied to store collected personal information
            securely, based on the nature or degree of the information.
            <br />
            <br />
            Sensitive or administrative actions are further secured through
            device registration and two-factor authentication, with all
            activities being fully logged.
            <br />
            <br />
            We retain data in accordance with established policies and legal
            requirements, as outlined below:
            <br />
          </p>
          <ul className="list-disc list-inside ml-4 mb-4 text-[#34495E]">
            <li>
              Queue and Session Data are only kept during service fulfillment
              and are properly anonymized after.
            </li>
            <li>
              Entries are retained for one (1) to three (3) years to comply with
              legal and reporting requirements before being fully
              archived/anonymized.
            </li>
            <li>
              Audit Logs are kept for security monitoring while following
              retention schedules.
            </li>
            <li>
              Backups are created nightly using pg_dump field, and Write-Ahead
              Log shipping to an offline NAS; encrypted in storage, and transit.
            </li>
          </ul>

          <p className="mb-2 text-justify">
            <strong>Rights of Data Subjects</strong>
            <br />
            As a data subject under the Data Privacy Act of 2012 (RA 10173), you
            have the right to be informed whether your personal data is or will
            be processed, to access the data and information about how it is
            processed, to correct or update inaccurate or incomplete data, to
            block, remove, or erase data under certain conditions, to object to
            processing that is based on legitimate interests or is otherwise
            objectionable, to receive your data in a portable format where
            applicable, to be indemnified for damages arising from unauthorized
            or improper processing, and for these rights to be exercised by your
            lawful heirs or assigns if you are incapacitated or deceased.
            <br />
            <br />
            <strong>Revision of Notice:</strong>
            <br />
            Authorized personnel may periodically revise or update this Privacy
            Notice (for example, to reflect changes in law, system features, or
            data practices). The revised notice will be published on the website
            or within the System, and its effective date will be indicated.
            Significant changes will be communicated to you (e.g., via app
            notice, email, or on-site signage), and if required, we will obtain
            fresh consent before applying those changes. In case of a data
            breach, users who are affected, as well as the National Privacy
            Commission, will be notified as required by law.
            <br />
            <br />
            <strong>Author of notice:</strong>
            <br />
            The Smart Queuing System (name subject to change) issues this
            Privacy Notice in its capacity as the Personal Information
            Controller, dated [20 September 2025].
            <br />
            Approval
            <br />
            Smart Queuing System
            <br />
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex flex-col gap-3">
          <label
            htmlFor="privacy-checkbox"
            className="flex items-center gap-2 text-sm text-[#34495E] cursor-pointer"
          >
            <input
              id="privacy-checkbox"
              name="privacy-consent"
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
              aria-label="Agree to Data Privacy Policy"
              autoComplete="off"
            />
            <span>I agree to the Data Privacy Policy.</span>
          </label>
          <div className="flex justify-end gap-2">
            <button
              onClick={onDecline}
              className="px-4 py-2 rounded-lg border border-[#132437] text-[#132437] bg-transparent hover:bg-[#132437]/5"
            >
              I Decline
            </button>
            <button
              onClick={() => {
                if (isChecked) onProceed();
              }}
              disabled={!isChecked}
              className={`px-4 py-2 rounded-lg text-white ${
                isChecked
                  ? "bg-[#132437] hover:bg-[#0f1a29]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    // fallback for older browsers
    window.addEventListener("resize", update);
    return () => {
      mq.removeEventListener?.("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  // desktop screen flow state (start -> consent -> menu)
  const [desktopScreen, setDesktopScreen] = useState<
    "start" | "consent" | "menu"
  >("start");
  const [consented, setConsented] = useState(false);
  const [showChat] = useState(false);
  // showStatus controls visibility of the queue status panel.
  // It should only be shown after the user submits the form.
  const [showStatus] = useState(false);

  const handleProceed = () => {
    setConsented(true);
    router.push("/chat");
  };

  const handleDecline = () => {
    router.push("/feedback");
  };

  const handleShowFeedback = () => {
    router.push("/feedback");
  };

  // Handle navigation to chat when desktop reaches menu screen
  useEffect(() => {
    if (isDesktop && desktopScreen === "menu" && !showStatus) {
      router.push("/chat");
    }
  }, [isDesktop, desktopScreen, showStatus, router]);

  // If desktop viewport, show the desktop start/consent screens here.
  if (isDesktop) {
    if (desktopScreen === "start") {
      return (
        <div className="fixed inset-0 bg-[#243344] flex items-center justify-center p-8">
          <div
            className="bg-[#ffffff] border-[16px] border-[#3d5063] w-[95%] max-w-[1600px] aspect-[16/9] flex flex-col items-center justify-center cursor-pointer shadow-xl"
            onClick={() => setDesktopScreen("consent")}
          >
            <div className="mb-8">
              <Image
                src="/institute.png"
                alt="Institute Logo"
                width={280}
                height={280}
              />
            </div>
            <p className="text-5xl font-semibold text-gray-700 italic">
              Press anywhere to start
            </p>
          </div>
        </div>
      );
    }

    if (desktopScreen === "consent") {
      return (
        <div className="h-full bg-white flex flex-col">
          {/* Header provided by layout.tsx to avoid duplicate headers */}
          <main className="flex-1 flex items-center justify-center p-8 overflow-auto">
            <div className="bg-gray-400 rounded-lg p-12 w-full max-w-md relative shadow-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Data Privacy <br /> Consent
              </h2>

              <div className="bg-white rounded-lg p-4 overflow-y-auto h-[300px] text-xs sm:text-sm md:text-base text-[#34495E] mb-6">
                <p className="mb-2 text-justify">
                  <strong>Privacy Statement</strong> <br />
                  This Privacy Notice explains how the Smart Queuing System
                  collects, uses, stores, protects, and shares your personal
                  data. The system may process information through camera
                  access, facial or biometric capture, QR scanning, and related
                  features. By using the system, you give your consent where
                  required to the collection and processing of your personal
                  data as described in this notice.
                  <br />
                  <br />
                  This notice is issued in compliance with the Data Privacy Act
                  of 2012 (Republic Act No. 10173), its Implementing Rules and
                  Regulations (IRR), and relevant issuances of the National
                  Privacy Commission (e.g., NPC Circular No. 2023-04, and
                  related guidelines).
                  <br />
                  <br />
                </p>
                <p className="mb-2 text-justify">
                  <strong>Personal Information</strong>
                  <br />
                  We may collect and store the following information, among
                  others, in our database:
                  <br />
                </p>
                <ul className="list-disc list-inside ml-4 mb-4 text-[#34495E]">
                  <li>Full Name</li>
                  <li>Address</li>
                </ul>

                <p className="mb-2 text-justify">
                  <strong>Collection Method</strong>
                  <br />
                  We collect personal information manually or electronically
                  through online application forms connected to the Smart
                  Queuing System. As part of system operations, specific
                  data—such as, but not limited to, the following—are
                  automatically generated:
                  <br />
                </p>
                <ul className="list-disc list-inside ml-4 mb-4 text-[#34495E]">
                  <li>Queue Numbers</li>
                  <li>Timestamps</li>
                  <li>Session IDs</li>
                </ul>

                <p className="mb-2 text-justify">
                  The system collects a copy of the consent text, in addition to
                  the previously stated data, to establish proof of lawful
                  processing in accordance with data privacy requirements.
                  <br />
                  <br />
                  <strong>Purpose of Collection</strong>
                  <br />
                  We collect your information to operate and improve the Smart
                  Queuing System. This involves verifying your identity,
                  assigning a queue number or ticket, processing QR scans for
                  entry or tracking, preventing fraud or misuse, keeping system
                  logs, generating analytics to enhance service quality,
                  ensuring security, and meeting applicable legal and regulatory
                  obligations.
                  <br />
                  <br />
                  <strong>Use of Data</strong>
                  <br />
                  The personal data collected will be used solely to manage and
                  improve the queuing process within the participating
                  institution.
                  <br />
                  <br />
                  Your personal information is processed for the following
                  purposes:
                  <br />
                </p>
                <ul className="list-disc list-inside ml-4 mb-4 text-[#34495E]">
                  <li>To assign and manage queue numbers for applicants.</li>
                  <li>To provide real-time updates regarding queue status.</li>
                  <li>
                    To assist personnel in administering queues and prioritizing
                    applicants when necessary.
                  </li>
                </ul>
                <p className="mb-2 text-justify">
                  <strong>Disclosure of Personal Data</strong>
                  <br />
                  All personal data are handled with the highest degree of
                  confidentiality. We will not disclose or make it accessible to
                  any party unless required by law or authorized by your
                  consent. When necessary, applicant inputs may be processed by
                  external AI providers under strict safeguards to ensure that
                  only the essential data is shared.
                  <br />
                  <br />
                  <strong>Data Protection & Security</strong>
                  <br />
                  Only duly authorized personnel may process personal data. We
                  regularly assess and enhance all security measures to ensure
                  compliance with the Data Privacy Act of 2012 (Republic Act No.
                  10173) and its Implementing Rules and Regulations (IRR).
                  <br />
                  <br />
                  <strong>Storage & Disposal</strong>
                  <br />
                  Any personal data that is gathered is protected against any
                  accidental or unlawful alteration, disclosure, or destruction,
                  including against any form of unlawful processing. Appropriate
                  measures are applied to store collected personal information
                  securely, based on the nature or degree of the information.
                  <br />
                  <br />
                  Sensitive or administrative actions are further secured
                  through device registration and two-factor authentication,
                  with all activities being fully logged.
                  <br />
                  <br />
                  We retain data in accordance with established policies and
                  legal requirements, as outlined below:
                  <br />
                </p>
                <ul className="list-disc list-inside ml-4 mb-4 text-[#34495E]">
                  <li>
                    Queue and Session Data are only kept during service
                    fulfillment and are properly anonymized after.
                  </li>
                  <li>
                    Entries are retained for one (1) to three (3) years to
                    comply with legal and reporting requirements before being
                    fully archived/anonymized.
                  </li>
                  <li>
                    Audit Logs are kept for security monitoring while following
                    retention schedules.
                  </li>
                  <li>
                    Backups are created nightly using pg_dump field, and
                    Write-Ahead Log shipping to an offline NAS; encrypted in
                    storage, and transit.
                  </li>
                </ul>
                <p className="mb-2 text-justify">
                  <strong>Rights of Data Subjects</strong>
                  <br />
                  As a data subject under the Data Privacy Act of 2012 (RA
                  10173), you have the right to be informed whether your
                  personal data is or will be processed, to access the data and
                  information about how it is processed, to correct or update
                  inaccurate or incomplete data, to block, remove, or erase data
                  under certain conditions, to object to processing that is
                  based on legitimate interests or is otherwise objectionable,
                  to receive your data in a portable format where applicable, to
                  be indemnified for damages arising from unauthorized or
                  improper processing, and for these rights to be exercised by
                  your lawful heirs or assigns if you are incapacitated or
                  deceased.
                  <br />
                  <br />
                  <strong>Revision of Notice:</strong>
                  <br />
                  Authorized personnel may periodically revise or update this
                  Privacy Notice (for example, to reflect changes in law, system
                  features, or data practices). The revised notice will be
                  published on the website or within the System, and its
                  effective date will be indicated. Significant changes will be
                  communicated to you (e.g., via app notice, email, or on-site
                  signage), and if required, we will obtain fresh consent before
                  applying those changes. In case of a data breach, users who
                  are affected, as well as the National Privacy Commission, will
                  be notified as required by law.
                  <br />
                  <br />
                  <strong>Author of notice:</strong>
                  <br />
                  The Smart Queuing System (name subject to change) issues this
                  Privacy Notice in its capacity as the Personal Information
                  Controller, dated [20 September 2025].
                  <br />
                  Approval
                  <br />
                  Smart Queuing System
                  <br />
                </p>
              </div>

              <button
                onClick={() => setDesktopScreen("menu")}
                className="bg-gray-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                Accept
              </button>
            </div>
          </main>
        </div>
      );
    }

    // desktopScreen === 'menu' -> Navigate to chat page
    // Navigation handled by useEffect to avoid rendering during render
    if (showStatus) {
      return <QueueChatUI onShowFeedback={handleShowFeedback} />;
    }

    // Return loading state while navigation is in progress
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Data Privacy Modal (shown first) */}
      {!consented && (
        <DataPrivacyModal
          key="privacy-modal"
          onProceed={handleProceed}
          onDecline={handleDecline}
        />
      )}

      {/* Main Content */}
      {showChat ? (
        <div>
          {/* Status panel should be visible only after form submission */}
          {showStatus && <QueueChatUI />}
          <button
            onClick={() => router.push("/chat")}
            className="w-full p-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Chat
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 px-6">
          <div className="h-20 w-20 rounded-full bg-[#34495E] mb-4" />
          <h2 className="text-xl font-bold text-black">Welcome!</h2>
          <p className="italic text-black mb-8">Let’s get started</p>

          <div className="w-full max-w-sm space-y-4">
            <div className="h-20 w-full rounded-lg bg-[#34495E]" />
            <div className="h-20 w-full rounded-lg bg-[#34495E]" />
          </div>
        </div>
      )}

      {/* Footer */}
      {consented && !showChat && (
        <footer className="sticky bottom-0 z-10 flex flex-col gap-2 border-t bg-[#34495E] p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Where..."
              className="flex-1 rounded-2xl bg-gray-300 px-4 py-2 text-sm text-black placeholder:text-[#34495E] focus:outline-none"
            />
            <button className="rounded-full p-3">
              <Image src="/send.png" alt="Send" width={23} height={23} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex-1 rounded-full bg-gray-300 px-4 py-1.5 text-sm text-black hover:bg-gray-200"
              onClick={() => router.push("/chat")}
            >
              I would like to inquire.
            </button>
            <button
              type="button"
              className="flex-1 rounded-full bg-gray-300 px-4 py-1.5 text-sm text-black hover:bg-gray-200"
              onClick={() => router.push("/form")}
            >
              Fill Form
            </button>
          </div>
        </footer>
      )}
    </>
  );
}
