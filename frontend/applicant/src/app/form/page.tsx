"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NeedHelp } from "../../components/NeedHelp";
import HelpChatbot from "../../components/HelpChatbot";

// JSON types used for form definition and values
type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
interface JsonObject {
  [k: string]: JsonValue;
}

// helper: create an empty clone of the JSON structure (keeps keys, clears values)
function deepCloneAndEmpty(obj: JsonValue): JsonValue {
  if (Array.isArray(obj)) {
    if (obj.length === 0) return [];
    const first = obj[0];
    if (typeof first === "object" && first !== null) {
      return [deepCloneAndEmpty(first)];
    }
    return [];
  }
  if (obj === null) return "";
  if (typeof obj === "object") {
    const out: JsonObject = {};
    for (const k of Object.keys(obj as JsonObject)) {
      out[k] = deepCloneAndEmpty((obj as JsonObject)[k]);
    }
    return out;
  }
  if (typeof obj === "boolean") return false;
  return "";
}

function isObjectEmptyValues(obj: JsonValue): boolean {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === "string") return obj.trim() === "";
  if (typeof obj === "boolean") return false;
  if (Array.isArray(obj))
    return obj.length === 0 || obj.every(isObjectEmptyValues);
  if (typeof obj === "object") {
    return Object.values(obj as JsonObject).every(isObjectEmptyValues);
  }
  return false;
}

function FormFillingPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDesktop, setIsDesktop] = useState<boolean | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  // 🧠 Manage chatbot visibility
  const [showChat, setShowChat] = useState(false);

  // Listen for openHelpChat event from NeedHelp component
  useEffect(() => {
    const openChat = () => setShowChat(true);
    window.addEventListener("openHelpChat", openChat);
    return () => window.removeEventListener("openHelpChat", openChat);
  }, []);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    window.addEventListener("resize", update);
    return () => {
      mq.removeEventListener?.("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  const [formDef, setFormDef] = useState<JsonObject | null>(null);
  const [formData, setFormData] = useState<JsonObject>({});
  const [serviceName, setServiceName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [leafFields, setLeafFields] = useState<
    { path: string; schema: JsonValue }[]
  >([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [fieldsPerPage, setFieldsPerPage] = useState(4);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Calculate responsive fields per page based on viewport height
  useEffect(() => {
    const calculateFieldsPerPage = () => {
      if (typeof window === "undefined") return;
      const vh = window.innerHeight;
      // Rough estimation: header ~100px, footer ~80px, field ~120px average
      // Available space = vh - 200px (header/footer/padding)
      const availableHeight = vh - 250;
      const estimatedFieldHeight = 120;
      const calculated = Math.max(
        2,
        Math.floor(availableHeight / estimatedFieldHeight)
      );
      setFieldsPerPage(Math.min(calculated, 6)); // cap at 6 fields per page
    };
    calculateFieldsPerPage();
    window.addEventListener("resize", calculateFieldsPerPage);
    return () => window.removeEventListener("resize", calculateFieldsPerPage);
  }, []);

  const collectLeafPaths = useCallback(
    (obj: JsonValue, prefix = ""): { path: string; schema: JsonValue }[] => {
      const out: { path: string; schema: JsonValue }[] = [];
      if (obj === null) return out;
      if (
        typeof obj === "string" ||
        typeof obj === "boolean" ||
        Array.isArray(obj)
      ) {
        out.push({ path: prefix, schema: obj });
        return out;
      }
      if (typeof obj === "object") {
        const asObj = obj as JsonObject;
        for (const k of Object.keys(asObj)) {
          const child = asObj[k];
          const path = prefix ? `${prefix}.${k}` : k;
          out.push(...collectLeafPaths(child, path));
        }
      }
      return out;
    },
    []
  );

  const chunk = <T,>(arr: T[], size: number) => {
    const res: T[][] = [];
    for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
    return res;
  };

  // Reset confirmation checkbox AND error state when page changes
  useEffect(() => {
    setConfirmationChecked(false);
    setShowErrors(false);
  }, [pageIndex]);

  // Check if all required fields on current page are filled
  const areRequiredFieldsFilled = useCallback(() => {
    const pages = chunk(leafFields, fieldsPerPage);
    const currentPageFields = pages[pageIndex] || [];

    for (const field of currentPageFields) {
      const { path, schema } = field;

      // Check if field is required
      if (schema && typeof schema === "object" && !Array.isArray(schema)) {
        const schemaObj = schema as JsonObject;
        const required = schemaObj.required as boolean | undefined;

        if (required) {
          // Get the value for this field
          const value = getValueAtPath(formData, path);
          const strValue =
            typeof value === "string" ? value : String(value || "");

          // If required field is empty, return false
          if (!strValue.trim()) {
            return false;
          }
        }
      }
    }

    return true;
  }, [leafFields, fieldsPerPage, pageIndex, formData]);

  // Validation function
  const validateField = (
    path: string,
    value: JsonValue,
    fieldSchema: JsonValue
  ): string => {
    if (
      fieldSchema === null ||
      typeof fieldSchema !== "object" ||
      Array.isArray(fieldSchema)
    ) {
      return "";
    }

    const schema = fieldSchema as JsonObject;
    const validation = schema.validation as JsonObject | undefined;
    const required = schema.required as boolean | undefined;
    const fieldType = schema.fieldType as string | undefined;
    const pattern = schema.pattern as string | undefined; // For tel fields

    const strValue = typeof value === "string" ? value : String(value || "");

    // Check required
    if (required && !strValue.trim()) {
      return "This field is required";
    }

    // Skip validation if field is empty and not required
    if (!strValue.trim() && !required) {
      return "";
    }

    // Check validation rules
    if (validation) {
      // Pattern validation
      const validationPattern = validation.pattern as string | undefined;
      if (validationPattern) {
        try {
          const regex = new RegExp(validationPattern);
          if (!regex.test(strValue)) {
            return "Invalid format";
          }
        } catch (e) {
          console.error("Invalid regex pattern:", validationPattern, e);
        }
      }

      // Max length validation
      const maxLength = validation.maxLength as number | undefined;
      if (maxLength && strValue.length > maxLength) {
        return `Maximum ${maxLength} characters allowed`;
      }

      // Number validation (min/max)
      if (fieldType === "number" && strValue) {
        const numValue = parseFloat(strValue);
        if (!isNaN(numValue)) {
          const min = validation.min as number | undefined;
          const max = validation.max as number | undefined;

          if (min !== undefined && numValue < min) {
            return `Value must be at least ${min}`;
          }
          if (max !== undefined && numValue > max) {
            return `Value must not exceed ${max}`;
          }
        } else if (strValue.trim()) {
          return "Please enter a valid number";
        }
      }
    }

    // Check pattern attribute (for tel fields)
    if (pattern && fieldType === "tel") {
      try {
        const regex = new RegExp(pattern);
        if (!regex.test(strValue)) {
          return "Invalid phone number format";
        }
      } catch (e) {
        console.error("Invalid regex pattern:", pattern, e);
      }
    }

    // Email validation
    if (fieldType === "email" && strValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(strValue)) {
        return "Invalid email address";
      }
    }

    return "";
  };

  const handleChange = (path: string, value: JsonValue) => {
    // update nested formData by path (dot separated)
    setFormData((prev) => {
      const clone: JsonObject = { ...(prev || {}) };
      const parts = path.split(".");
      let cur: unknown = clone;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        const curObj = cur as JsonObject;
        // If the property doesn't exist, is null, or is a primitive value, replace it with an object
        if (
          curObj[p] === undefined ||
          curObj[p] === null ||
          typeof curObj[p] !== "object" ||
          Array.isArray(curObj[p])
        ) {
          curObj[p] = {} as JsonObject;
        }
        cur = curObj[p];
      }
      const lastKey = parts[parts.length - 1];
      (cur as JsonObject)[lastKey] = value;
      return clone;
    });

    // Validate the field
    const fieldDef = leafFields.find((f) => f.path === path);
    console.log("🔍 Validating field:", path, "value:", value);
    console.log("📄 Field definition:", fieldDef);
    if (fieldDef) {
      const error = validateField(path, value, fieldDef.schema);
      console.log("❌ Validation error:", error);
      setValidationErrors((prev) => {
        const updated = { ...prev };
        if (error) {
          updated[path] = error;
        } else {
          delete updated[path];
        }
        return updated;
      });
    } else {
      console.log("⚠️ No field definition found for:", path);
    }
  };
  useEffect(() => {
    // fetch form definition from API
    const fetchForm = async () => {
      try {
        const serviceId = new URLSearchParams(window.location.search).get(
          "serviceId"
        );
        let json;

        if (serviceId !== null) {
          // Fetch form from backend API based on serviceId
          const res = await fetch(
            `${API_URL}/api/institute/form/${serviceId}`,
            { credentials: "include" }
          );
          if (!res.ok) throw new Error("Failed to fetch form");
          const data = await res.json();
          // Extract the form structure and service name from the response
          json = data.form;
          setServiceName(data.service?.name || "Unknown Service");
        } else {
          // Fallback to local API
          const res = await fetch("/api/get-form");
          if (!res.ok) throw new Error("Failed to fetch form");
          json = await res.json();
        }

        setFormDef(json);

        console.log("🔍 Form JSON structure:", json);
        console.log("🔍 Has sections?", "sections" in json);
        console.log("🔍 JSON keys:", Object.keys(json));

        // Check if json has nested form structure (backend returns {institution, form, metadata})
        let formData = json;
        if (json && typeof json === "object" && "form" in json) {
          console.log("📦 Extracting form from nested structure");
          formData = (json as JsonObject).form as JsonObject;
          console.log("📦 Extracted form:", formData);
          console.log(
            "📦 Form has sections?",
            formData && "sections" in formData
          );
        }

        // Check if form has sections with fields (new structure)
        if (
          formData &&
          typeof formData === "object" &&
          "sections" in formData
        ) {
          console.log("📋 Form has sections structure");
          const sections = (formData as JsonObject).sections as JsonValue[];
          if (Array.isArray(sections)) {
            // Extract all fields from sections
            const allFields: { path: string; schema: JsonValue }[] = [];
            const initData: JsonObject = {};

            sections.forEach((section) => {
              if (typeof section === "object" && section !== null) {
                const sectionObj = section as JsonObject;
                const fields = sectionObj.fields as JsonValue[];

                if (Array.isArray(fields)) {
                  fields.forEach((field) => {
                    if (typeof field === "object" && field !== null) {
                      const fieldObj = field as JsonObject;
                      const fieldId = fieldObj.id as string;

                      if (fieldId) {
                        // Store the full field definition as schema
                        allFields.push({
                          path: fieldId,
                          schema: field,
                        });

                        // Initialize empty value based on field type
                        const fieldType = fieldObj.fieldType as string;
                        if (fieldType === "checkbox") {
                          initData[fieldId] = false;
                        } else {
                          initData[fieldId] = "";
                        }
                      }
                    }
                  });
                }
              }
            });

            console.log("✅ Extracted fields:", allFields.length);
            console.log("📝 Sample field:", allFields[0]);
            setLeafFields(allFields);
            setFormData(initData);
            setPageIndex(0);
            setLoading(false);
            return;
          }
        }

        console.log("⚠️ Using fallback flat structure");

        // Fallback to old flat structure
        const initData = deepCloneAndEmpty(formData) as JsonObject;
        setFormData(initData);
        const leaves = collectLeafPaths(formData, "");
        setLeafFields(leaves.filter((l) => l.path));
        setPageIndex(0);
      } catch (err) {
        console.error("failed to load form", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [collectLeafPaths, API_URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pages = chunk(leafFields, fieldsPerPage);

    // Only submit if on the last page AND confirmation is checked
    if (pageIndex < pages.length - 1) {
      // Not on last page, just move to next page
      setPageIndex((p) => p + 1);
      return;
    }

    // On last page but confirmation not checked - don't submit
    if (!confirmationChecked) {
      return;
    }

    // Basic validation
    const isEmpty = isObjectEmptyValues(formData);
    if (isEmpty) {
      alert("Please fill at least one field before submitting.");
      return;
    }

    try {
      // Extract name from form data (try different field combinations)
      const data = formData as JsonObject;
      let name = "";

      if (data.first_name || data.last_name) {
        name = `${data.first_name || ""} ${data.last_name || ""}`.trim();
      } else if (data.name) {
        name = String(data.name);
      } else if (data.fullName) {
        name = String(data.fullName);
      }

      // Check if applicant has priority status
      const isPriority = Boolean(
        data.is_senior_citizen ||
          data.is_pwd ||
          data.is_pregnant ||
          data.isSeniorCitizen ||
          data.isPwd ||
          data.isPregnant
      );

      const res = await fetch(`${API_URL}/api/applicant/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name || "Applicant",
          document: serviceName || "Unknown Document",
          isPriority: isPriority,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const result = await res.json();

      // Session ID is now stored in cookie, no need to pass in URL
      alert("Form submitted successfully!");
      router.push(`/chat?formCompleted=true`);
    } catch (err) {
      console.error(err);
      alert("Failed to save form input");
    }
  };
  // use the helper defined above

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading form...
      </div>
    );
  }

  // Common Checkbox Logic handler
  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
        // If user tries to check the box, validate first
        if (!isCurrentPageValid()) {
            setShowErrors(true);
            // Do NOT set confirmationChecked to true
            return;
        }
    }
    setConfirmationChecked(checked);
  };

  // Desktop
  if (isDesktop) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white overflow-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-[#B7C3C7] rounded-lg shadow-md w-full max-w-3xl my-7 px-6 py-6 flex flex-col gap-3"
        >
          {/* Add NeedHelp here */}
          <NeedHelp message="Need Help?" />
          <h2 className="text-2xl font-bold text-[#34495E] pt-2">
            Fill up form to proceed
          </h2>

          {/* Render dynamic fields from formDef (keeps the JSON-driven inputs) */}
          <div className="space-y-4">
            {formDef && (
              <>
                {(() => {
                  const pages = chunk(leafFields, fieldsPerPage);
                  const current = pages[pageIndex] || [];
                  const totalPages = pages.length;
                  return (
                    <>
                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-[#34495E]">
                            Step {pageIndex + 1} of {totalPages}
                          </span>
                          <span className="text-xs text-gray-600">
                            {/* {Math.round(((pageIndex + 1) / totalPages) * 100)}%
                            Complete */}
                          </span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-2.5">
                          <div
                            className="bg-[#34495E] h-2.5 rounded-full transition-all duration-300"
                            style={{
                              width: `${((pageIndex + 1) / totalPages) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {current.map((f) => renderLeafField(f))}
                      </div>

                      {/* Confirmation Checkbox */}
                      <div className="mt-6 flex items-start gap-3 bg-white p-4 rounded-lg border-2 border-gray-300">
                        <input
                          type="checkbox"
                          id="confirmation-checkbox"
                          checked={confirmationChecked}
                          onChange={(e) =>
                            setConfirmationChecked(e.target.checked)
                          }
                          disabled={!areRequiredFieldsFilled()}
                          className={`mt-1 w-5 h-5 ${
                            areRequiredFieldsFilled()
                              ? "cursor-pointer"
                              : "cursor-not-allowed opacity-50"
                          }`}
                        />
                        <label
                          htmlFor="confirmation-checkbox"
                          className={`text-sm font-medium ${
                            areRequiredFieldsFilled()
                              ? "text-gray-800 cursor-pointer"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Please confirm if the following information is
                          correct.
                          {!areRequiredFieldsFilled() && (
                            <span className="block text-xs text-red-500 mt-1">
                              * Please fill all required fields first
                            </span>
                          )}
                        </label>
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </div>

          <div className="flex justify-between mt-4 mb-4">
            {(() => {
              const pages = chunk(leafFields, fieldsPerPage);

              return (
                <>
                  {/* Previous/Back button on the left */}
                  <button
                    type="button"
                    onClick={
                      pageIndex === 0
                        ? () => router.back()
                        : () => setPageIndex((p) => p - 1)
                    }
                    className="px-8 py-2 rounded-full bg-gray-600 text-white hover:bg-gray-700"
                  >
                    {pageIndex === 0 ? "Back" : "Previous"}
                  </button>

                  {/* Next/Submit button on the right */}
                  {pageIndex < pages.length - 1 ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setPageIndex((p) => p + 1);
                      }}
                      disabled={!confirmationChecked}
                      className={`px-8 py-2 rounded-full transition-all ${
                        confirmationChecked
                          ? "bg-[#132437] text-white hover:bg-[#0f1a29]"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      }`}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!confirmationChecked}
                      className={`px-8 py-2 rounded-full transition-all ${
                        confirmationChecked
                          ? "bg-[#132437] text-white hover:bg-[#0f1a29]"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      }`}
                    >
                      Submit
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        </form>
        {showChat && <HelpChatbot onClose={() => setShowChat(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Form area centered */}
      <main className="flex justify-center items-start flex-1 py-8 px-4">
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-200 p-4 md:p-6 flex flex-col gap-4"
          >
            {/* Add NeedHelp for mobile */}
            <NeedHelp message="Need Help?" />

            {/* Render dynamic fields from formDef (paginated) */}
            {formDef && (
              <>
                {(() => {
                  const pages = chunk(leafFields, fieldsPerPage);
                  const current = pages[pageIndex] || [];
                  const totalPages = pages.length;
                  return (
                    <>
                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-[#34495E]">
                            Step {pageIndex + 1} of {totalPages}
                          </span>
                          <span className="text-xs text-gray-600">
                            {Math.round(((pageIndex + 1) / totalPages) * 100)}%
                            Complete
                          </span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-2.5">
                          <div
                            className="bg-[#34495E] h-2.5 rounded-full transition-all duration-300"
                            style={{
                              width: `${((pageIndex + 1) / totalPages) * 100}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {current.map((f) => renderLeafField(f))}
                      </div>

                      {/* Confirmation Checkbox */}
                      <div className="mt-6 flex items-start gap-3 bg-white p-4 rounded-lg border-2 border-gray-300">
                        <input
                          type="checkbox"
                          id="confirmation-checkbox-desktop"
                          checked={confirmationChecked}
                          onChange={(e) =>
                            setConfirmationChecked(e.target.checked)
                          }
                          disabled={!areRequiredFieldsFilled()}
                          className={`mt-1 w-5 h-5 ${
                            areRequiredFieldsFilled()
                              ? "cursor-pointer"
                              : "cursor-not-allowed opacity-50"
                          }`}
                        />
                        <label
                          htmlFor="confirmation-checkbox-desktop"
                          className={`text-sm font-medium ${
                            areRequiredFieldsFilled()
                              ? "text-gray-800 cursor-pointer"
                              : "text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Please confirm if the following information is
                          correct.
                          {!areRequiredFieldsFilled() && (
                            <span className="block text-xs text-red-500 mt-1">
                              * Please fill all required fields first
                            </span>
                          )}
                        </label>
                      </div>
                    </>
                  );
                })()}
              </>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              {(() => {
                const pages = chunk(leafFields, fieldsPerPage);
                return (
                  <>
                    <button
                      type="button"
                      onClick={
                        pageIndex === 0
                          ? () => router.back()
                          : () => setPageIndex((p) => p - 1)
                      }
                      className="w-full sm:w-auto bg-gray-400 text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-500 transition-all"
                    >
                      {pageIndex === 0 ? "Back" : "Previous"}
                    </button>
                    {pageIndex < pages.length - 1 ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPageIndex((p) => p + 1);
                        }}
                        disabled={!confirmationChecked}
                        className={`w-full sm:w-auto font-semibold py-2 px-6 rounded-full transition-all ${
                          confirmationChecked
                            ? "bg-[#1c2b39] text-white hover:bg-[#243647]"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        }`}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!confirmationChecked}
                        className={`w-full sm:w-auto font-semibold py-2 px-6 rounded-full transition-all ${
                          confirmationChecked
                            ? "bg-[#1c2b39] text-white hover:bg-[#243647]"
                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                        }`}
                      >
                        Submit
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </form>
        </div>
      </main>
      {showChat && <HelpChatbot onClose={() => setShowChat(false)} />}
    </div>
  );

  // Recursive renderer
  function humanize(key: string) {
    // convert camelCase or snake_case to normal title
    const withSpaces = key
      // camelCase -> split
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/[_\-]+/g, " ")
      .trim();
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
  }

  function renderObjectFields(obj: JsonValue, pathPrefix: string) {
    if (obj === null || typeof obj !== "object") return null;
    const asObj = obj as JsonObject;
    return Object.keys(asObj).map((key) => {
      const value = asObj[key];
      const path = pathPrefix ? `${pathPrefix}.${key}` : key;

      // primitives
      if (typeof value === "string" || value === null) {
        const raw = getValueAtPath(formData, path);
        const val =
          typeof raw === "string" || typeof raw === "number" ? String(raw) : "";
        
        // Validation check for Nested fields
        const isError = showErrors && (!val || val.trim() === "");

        return (
          <div key={path}>
            <label className="block font-semibold text-gray-800">
              {humanize(key)}
            </label>
            <input
              type="text"
              value={val}
              onChange={(e) => handleChange(path, e.target.value as JsonValue)}
              className={`w-full p-2 border rounded-md mt-1 bg-white text-gray-900 placeholder-gray-400 ${
                  isError ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
          </div>
        );
      }

      if (typeof value === "boolean") {
        const raw = getValueAtPath(formData, path);
        const val = typeof raw === "boolean" ? raw : false;
        return (
          <div key={path} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={val}
              onChange={(e) =>
                handleChange(path, e.target.checked as JsonValue)
              }
            />
            <label className="font-semibold text-gray-800">
              {humanize(key)}
            </label>
          </div>
        );
      }

      if (Array.isArray(value)) {
        // render one item for now
        const itemsRaw = getValueAtPath(formData, path);
        const items = Array.isArray(itemsRaw) ? (itemsRaw as JsonValue[]) : [];
        return (
          <div key={path} className="p-2 border rounded-md bg-white">
            <label className="block font-semibold text-gray-800">
              {humanize(key)}
            </label>
            {Array.isArray(value) &&
            value.length > 0 &&
            typeof value[0] === "object" ? (
              // render fields for first object
              (items as JsonValue[]).map((it, idx) => (
                <div key={`${path}.${idx}`} className="mt-2 p-2 border rounded">
                  {renderObjectFields(value[0], `${path}.${idx}`)}
                </div>
              ))
            ) : (
              <input
                type="text"
                value={items
                  .map((v) =>
                    typeof v === "string" || typeof v === "number"
                      ? String(v)
                      : ""
                  )
                  .join(", ")}
                onChange={(e) =>
                  handleChange(
                    path,
                    e.target.value
                      .split(",")
                      .map((s) => s.trim()) as JsonValue[]
                  )
                }
                className="w-full p-2 border rounded-md mt-1 bg-white text-gray-900 placeholder-gray-400 border-gray-300"
              />
            )}
          </div>
        );
      }

      if (typeof value === "object") {
        return (
          <div key={path} className="p-2 border rounded-md bg-white">
            <label className="block font-semibold text-gray-800">
              {humanize(key)}
            </label>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderObjectFields(value, path)}
            </div>
          </div>
        );
      }

      return null;
    });
  }

  function getValueAtPath(obj: JsonValue, path: string): JsonValue | undefined {
    const parts = path.split(".");
    let cur: JsonValue = obj;
    for (const p of parts) {
      if (cur == null) return undefined;
      cur = (cur as JsonObject)[p];
    }
    return cur;
  }

  function renderLeafField(f: { path: string; schema: JsonValue }) {
    const { path, schema } = f;
    const key = path;

    const raw = getValueAtPath(formData, path);
    const val =
      typeof raw === "string" || typeof raw === "number" ? String(raw) : "";

    const error = validationErrors[path];
    const hasError = !!error;

    // Extract validation info from schema
    const schemaObj =
      typeof schema === "object" && schema !== null && !Array.isArray(schema)
        ? (schema as JsonObject)
        : {};
    const required = schemaObj.required as boolean | undefined;
    const fieldType = schemaObj.fieldType as string | undefined;
    const placeholder = schemaObj.placeholder as string | undefined;
    const pattern = schemaObj.pattern as string | undefined;
    const label = schemaObj.label as string | undefined;
    const options = schemaObj.options as
      | Array<{ value: string; label: string }>
      | undefined;

    // Use label from schema if available, otherwise humanize the path
    const displayLabel = label || humanize(path.split(".").slice(-1)[0]);

    // Handle checkbox field type
    if (fieldType === "checkbox") {
      const boolVal = typeof raw === "boolean" ? raw : false;
      return (
        <div key={key} className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`checkbox-${path}`}
            checked={boolVal}
            onChange={(e) => handleChange(path, e.target.checked as JsonValue)}
            className="w-5 h-5 cursor-pointer"
          />
          <label
            htmlFor={`checkbox-${path}`}
            className="font-semibold text-gray-800 cursor-pointer"
          >
            {displayLabel}
          </label>
        </div>
      );
    }

    // primitives and null -> text
    if (typeof schema === "string" || schema === null) {
      // Determine if this specific field is empty and errors are shown
      const isError = showErrors && (!val || val.trim() === "");

      return (
        <div key={key}>
          <label className="block font-semibold text-gray-800">
            {displayLabel}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            value={val}
            onChange={(e) => handleChange(path, e.target.value as JsonValue)}
            className={`w-full p-2 border rounded-md mt-1 bg-white text-gray-900 placeholder-gray-400 ${
              hasError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {hasError && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );
    }

    if (typeof schema === "boolean") {
      const boolVal = typeof raw === "boolean" ? raw : false;
      return (
        <div key={key} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={boolVal}
            onChange={(e) => handleChange(path, e.target.checked as JsonValue)}
          />
          <label className="font-semibold text-gray-800">{displayLabel}</label>
        </div>
      );
    }

    // Handle specific field types from schema
    if (fieldType === "radio" && options) {
      return (
        <div key={key}>
          <label className="block font-semibold text-gray-800 mb-2">
            {displayLabel}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <div className="space-y-2">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={path}
                  value={option.value}
                  checked={val === option.value}
                  onChange={(e) =>
                    handleChange(path, e.target.value as JsonValue)
                  }
                  className="w-4 h-4"
                />
                <span className="text-gray-800">{option.label}</span>
              </label>
            ))}
          </div>
          {hasError && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );
    }

    if (fieldType === "select" && options) {
      return (
        <div key={key}>
          <label className="block font-semibold text-gray-800">
            {displayLabel}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            value={val}
            onChange={(e) => handleChange(path, e.target.value as JsonValue)}
            className={`w-full p-2 border rounded-md mt-1 bg-white text-gray-900 ${
              hasError ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {hasError && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );
    }

    if (fieldType === "date") {
      return (
        <div key={key}>
          <label className="block font-semibold text-gray-800">
            {displayLabel}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="date"
            value={val}
            onChange={(e) => handleChange(path, e.target.value as JsonValue)}
            className={`w-full p-2 border rounded-md mt-1 bg-white text-gray-900 ${
              hasError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {hasError && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );
    }

    if (fieldType === "tel") {
      return (
        <div key={key}>
          <label className="block font-semibold text-gray-800">
            {displayLabel}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="tel"
            value={val}
            placeholder={placeholder}
            pattern={pattern}
            onChange={(e) => handleChange(path, e.target.value as JsonValue)}
            className={`w-full p-2 border rounded-md mt-1 bg-white text-gray-900 placeholder-gray-400 ${
              hasError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {hasError && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );
    }

    if (fieldType === "email") {
      return (
        <div key={key}>
          <label className="block font-semibold text-gray-800">
            {displayLabel}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="email"
            value={val}
            onChange={(e) => handleChange(path, e.target.value as JsonValue)}
            className={`w-full p-2 border rounded-md mt-1 bg-white text-gray-900 placeholder-gray-400 ${
              hasError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {hasError && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );
    }

    if (fieldType === "text") {
      return (
        <div key={key}>
          <label className="block font-semibold text-gray-800">
            {displayLabel}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            value={val}
            onChange={(e) => handleChange(path, e.target.value as JsonValue)}
            className={`w-full p-2 border rounded-md mt-1 bg-white text-gray-900 placeholder-gray-400 ${
              hasError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {hasError && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );
    }

    if (fieldType === "number") {
      return (
        <div key={key}>
          <label className="block font-semibold text-gray-800">
            {displayLabel}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="number"
            value={val}
            onChange={(e) => handleChange(path, e.target.value as JsonValue)}
            className={`w-full p-2 border rounded-md mt-1 bg-white text-gray-900 placeholder-gray-400 ${
              hasError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {hasError && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      );
    }

    if (Array.isArray(schema)) {
      // render as comma-separated for primitives or recurse for object arrays
      if (schema.length > 0 && typeof schema[0] === "object") {
        // try to render nested object fields for first item
        return (
          <div key={key} className="p-2 border rounded-md bg-white">
            <label className="block font-semibold text-gray-800">
              {displayLabel}
            </label>
            {renderObjectFields(schema[0], path)}
          </div>
        );
      }
      return (
        <div key={key}>
          <label className="block font-semibold text-gray-800">
            {displayLabel}
          </label>
          <input
            type="text"
            value={val}
            onChange={(e) =>
              handleChange(
                path,
                (e.target.value as string)
                  .split(",")
                  .map((s) => s.trim()) as unknown as JsonValue
              )
            }
            className="w-full p-2 border rounded-md mt-1 bg-white text-gray-900 placeholder-gray-400 border-gray-300"
          />
        </div>
      );
    }

    // fallback for object
    if (typeof schema === "object") {
      return (
        <div key={key} className="p-2 border rounded-md bg-white">
          <label className="block font-semibold text-gray-800">
            {displayLabel}
          </label>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderObjectFields(schema, path)}
          </div>
        </div>
      );
    }

    return null;
  }

  // keep reference to avoid linter "defined but never used" in some toolchains
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _keep_renderObjectFields = renderObjectFields;
}

export default function FormFillingPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading form...
        </div>
      }
    >
      <FormFillingPage />
    </Suspense>
  );
}