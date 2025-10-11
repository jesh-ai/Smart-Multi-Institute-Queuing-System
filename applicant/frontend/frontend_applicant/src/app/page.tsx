"use client";

import Image from "next/image";
import { useState } from "react";

type FormData = {
  fullName: string;
  email: string;
  contact: string;
  text: string;
};

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    contact: "",
    text: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^\+63\s\d{3}\s\d{3}\s\d{4}$/; // +63 123 456 7899

    if (!formData.fullName.trim())
      newErrors.fullName = "Please enter your full name.";
    if (!emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email address.";
    if (!phoneRegex.test(formData.contact))
      newErrors.contact = "Use the format +63 XXX XXX XXXX";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Form submitted successfully!");
    }
  };

  const handleShowExample = () => {
    setFormData((prev) => ({ ...prev, email: "example@email.com" }));
    setErrors((prev) => ({ ...prev, email: "" }));
  };

  const ChevronDown = () => (
    <svg
      className="w-4 h-4 text-gray-500"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* ✅ Header is now responsive & outside of form container */}
      <header className="w-full flex items-center gap-2 border-b-8 border-[#34495E] px-4 py-3 bg-white shadow-sm">
        <Image
          src="/institute.png"
          alt="Logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <h1 className="text-xl font-bold text-[#34495E]">Institute Name</h1>
      </header>

      {/* ✅ Form area centered and independent of header */}
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullName}
                </p>
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
            <label className="block font-semibold text-gray-800">Contact Number</label>
            <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={(e) => {
      let input = e.target.value.replace(/\D/g, ""); // remove all non-digit characters

      // ensure it always starts with '+63 '
      if (!input.startsWith("63")) {
        input = "63" + input;
      }

      // remove leading 63 so we can format
      let formatted = "+63 ";

      // Add spaces as the user types: +63 912 345 6789
      if (input.length > 2) formatted += input.substring(2, 5);
      if (input.length > 5) formatted += " " + input.substring(5, 8);
      if (input.length > 8) formatted += " " + input.substring(8, 12);

      setFormData((prev) => ({ ...prev, contact: formatted }));
      setErrors((prev) => ({ ...prev, contact: "" }));
             }}
             maxLength={17}
             className={`w-full p-2 border rounded-md mt-1 bg-white text-gray-900 placeholder-gray-400
               ${
              errors.contact
               ? "border-red-500"
              : formData.contact
              ? "border-green-500"
               : "border-gray-300"
               }
             `}
             placeholder="+63 912 345 6789"
           />
             <p className="text-xs text-gray-600 mt-1">*Format: +63 XXX XXX XXXX</p>
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

            {/* Submit */}
            <div className="flex justify-end">
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
