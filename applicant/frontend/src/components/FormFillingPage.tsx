"use client";
import { useState, useEffect } from "react";

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

export default function FormFillingPage({ onBack }: { onBack: () => void }) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
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
  const [loading, setLoading] = useState(true);

  const handleChange = (path: string, value: JsonValue) => {
    // update nested formData by path (dot separated)
    setFormData((prev) => {
      const clone: JsonObject = { ...(prev || {}) };
      const parts = path.split(".");
      let cur: unknown = clone;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        const curObj = cur as JsonObject;
        if (curObj[p] === undefined || curObj[p] === null)
          curObj[p] = {} as JsonObject;
        cur = curObj[p];
      }
      const lastKey = parts[parts.length - 1];
      (cur as JsonObject)[lastKey] = value;
      return clone;
    });
  };
  useEffect(() => {
    // fetch form definition from API
    const fetchForm = async () => {
      try {
        const res = await fetch("/api/get-form");
        const json = await res.json();
        setFormDef(json);
        // initialize formData with values from json (keeping structure)
        const initData = deepCloneAndEmpty(json) as JsonObject;
        setFormData(initData);
      } catch (err) {
        console.error("failed to load form", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation: require at least one non-empty field
    const isEmpty = isObjectEmptyValues(formData);
    if (isEmpty) {
      alert("Please fill at least one field before submitting.");
      return;
    }

    try {
      const res = await fetch("/api/save-form-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: formData,
          form: formDef?.formNumber || "unknown",
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      await res.json();
      alert("Form saved to form_input.json");
      onBack();
    } catch (err) {
      console.error(err);
      alert("Failed to save form input");
    }
  };
  // use the helper defined above

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading form...
      </div>
    );
  }

  // Desktop: use the richer card layout inspired by FormPage.tsx but keep dynamic fields
  if (isDesktop) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white overflow-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-[#B7C3C7] rounded-lg shadow-md w-full max-w-3xl my-7 px-6 py-6 flex flex-col gap-3"
        >
          <h2 className="text-2xl font-bold text-[#34495E] pt-2">
            Fill up form to proceed
          </h2>

          {/* Render dynamic fields from formDef (keeps the JSON-driven inputs) */}
          <div className="space-y-4">
            {formDef && renderObjectFields(formDef, "")}
          </div>

          <div className="flex justify-end mt-4 mb-4">
            <button
              type="submit"
              className="px-8 py-2 rounded-full bg-[#132437] text-white hover:bg-[#0f1a29]"
            >
              Submit
            </button>
          </div>
        </form>
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
            {/* Render dynamic fields from formDef */}
            {formDef && renderObjectFields(formDef, "")}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto bg-gray-400 text-white font-semibold py-2 px-6 rounded-full hover:bg-gray-500 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#1c2b39] text-white font-semibold py-2 px-6 rounded-full hover:bg-[#243647] transition-all"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
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
        return (
          <div key={path}>
            <label className="block font-semibold text-gray-800">
              {humanize(key)}
            </label>
            <input
              type="text"
              value={val}
              onChange={(e) => handleChange(path, e.target.value as JsonValue)}
              className="w-full p-2 border rounded-md mt-1 bg-white text-gray-900 placeholder-gray-400 border-gray-300"
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
}
