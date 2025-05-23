
import CsvUnitValidationPage from "@/components/admin/validations/CsvUnitValidationPage";

export default function ValidateCsvPage() {
  return (
    <div className="container">
      <CsvUnitValidationPage />
      
      <div className="mt-8 p-4 bg-black/70 border border-warcrow-gold/30 rounded-lg">
        <h2 className="text-warcrow-gold font-semibold mb-2">CSV File Location</h2>
        <p className="text-gray-300">
          The validator looks for CSV files in the <code className="bg-black/50 px-2 py-0.5 rounded">/public/data/reference-csv/units/</code> directory.
        </p>
        <p className="text-gray-300 mt-2">
          Make sure the following files exist in that location:
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
          <li>Northern Tribes.csv</li>
          <li>The Syenann.csv</li>
          <li>Hegemony of Embersig.csv</li>
          <li>Scions of Taldabaoth.csv</li>
        </ul>
      </div>
    </div>
  );
}
