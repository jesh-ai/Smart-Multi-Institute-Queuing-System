import { useState } from "react";

// ChevronDown Icon Component
function ChevronDown() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FormFillingPage({ onBack }: { onBack: () => void }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "+63 ",
    text: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    contact: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleShowExample = () => {
    alert("Example: john.doe@example.com");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors = {
      fullName: "",
      email: "",
      contact: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.contact.trim() || formData.contact === "+63 ") {
      newErrors.contact = "Contact number is required";
    } else if (formData.contact.replace(/\D/g, "").length !== 12) {
      newErrors.contact = "Contact number must be 10 digits after +63";
    }

    setErrors(newErrors);

    if (!newErrors.fullName && !newErrors.email && !newErrors.contact) {
      alert(
        `Form submitted!\nName: ${formData.fullName}\nEmail: ${formData.email}\nContact: ${formData.contact}\nText: ${formData.text}`
      );
      onBack();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Form area centered */}
      <main className="flex justify-center items-start flex-1 py-10 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-200 p-6 flex flex-col gap-4"
          >
            {/* Full Name */}
            <div>
              <label className="block font-semibold text-gray-800">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md mt-1 bg-white text-gray-900 placeholder-gray-400 
                ${
                  errors.fullName
                    ? "border-red-500"
                    : formData.fullName
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
                placeholder="Jana Del Rosario"
              />
              <p className="text-xs text-gray-600 mt-1">
                *Enter your legal name as shown on your Valid ID.
              </p>
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block font-semibold text-gray-800">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md mt-1 bg-white text-gray-900 placeholder-gray-400 
                ${
                  errors.email
                    ? "border-red-500"
                    : formData.email
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
                placeholder="example@email.com"
              />
              <p className="text-xs text-gray-600 mt-1">
                *Enter an active email address.
              </p>

              {errors.email && (
                <div className="mt-2 bg-white border border-gray-300 p-2 rounded-md shadow-sm">
                  <p className="text-sm text-gray-800">
                    Looks like you missed the email field. Need help?
                  </p>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={handleShowExample}
                      className="px-2 py-1 text-xs bg-[#1c2b39] text-white rounded"
                    >
                      Show Example
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setErrors((prev) => ({ ...prev, email: "" }))
                      }
                      className="px-2 py-1 text-xs border border-gray-400 rounded"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block font-semibold text-gray-800">
                Contact Number
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={(e) => {
                  let input = e.target.value.replace(/\D/g, "");

                  if (!input.startsWith("63")) {
                    input = "63" + input;
                  }

                  let formatted = "+63 ";

                  if (input.length > 2) formatted += input.substring(2, 5);
                  if (input.length > 5)
                    formatted += " " + input.substring(5, 8);
                  if (input.length > 8)
                    formatted += " " + input.substring(8, 12);

                  setFormData((prev) => ({ ...prev, contact: formatted }));
                  setErrors((prev) => ({ ...prev, contact: "" }));
                }}
                maxLength={17}
                className={`w-full p-2 border rounded-md mt-1 bg-white text-gray-900 placeholder-gray-400
      ${
        errors.contact
          ? "border-red-500"
          : formData.contact !== "+63 "
          ? "border-green-500"
          : "border-gray-300"
      }
    `}
                placeholder="+63 912 345 6789"
              />
              <p className="text-xs text-gray-600 mt-1">
                *Format: +63 XXX XXX XXXX
              </p>
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
              )}
            </div>

            {/* Dropdown */}
            <div>
              <label className="block font-semibold text-gray-800">Text</label>
              <div className="relative">
                <select
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black bg-white appearance-none"
                >
                  <option value="">Select an option</option>
                  <option value="Option 1">Option 1</option>
                  <option value="Option 2">Option 2</option>
                </select>
                {/* Custom dropdown icon */}
                <div className="pointer-events-none absolute right-3 top-3">
                  <ChevronDown />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-2">
              <button
                type="button"
                onClick={onBack}
                className="bg-gray-400 text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-500 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-[#1c2b39] text-white font-semibold py-2 px-6 rounded-full hover:bg-[#243647] transition-all"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
