import Image from "next/image";
import institute_logo from "@/assets/institute.png";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-white px-6 py-8">
      {/* Header */}
      <header className="w-full flex items-center gap-2 border-b pb-2">
        <Image src={institute_logo} alt="Institute Logo" width={25} height={25} />
        <h1 className="text-lg font-semibold text-gray-950">Institute Name</h1>
      </header>

      {/* QR Scanner Section */}
      <main className="flex flex-col items-center justify-center flex-1">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Scan to Begin</h2>

        {/* QR Code Placeholder */}
        <div className="border-8 border-gray-400 rounded-lg p-20 mb-2">
        </div>
        <p className="text-sm text-gray-950">
          Scan the QR Code to connect to host server
        </p>
        {/* Camera Button */}
        <button className="mt-6 p-4 rounded-full bg-gray-100 hover:bg-gray-200 shadow-md">
        </button>
      </main>
      {/* Bottom Actions */}
    </div>
    //add buttons above
  );
}