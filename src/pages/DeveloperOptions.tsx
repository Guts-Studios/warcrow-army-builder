import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { AdminOnly } from "@/utils/adminUtils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database, Trash2, Download, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DeveloperOptions = () => {
  const navigate = useNavigate();
  const { isWabAdmin, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleClearLocalStorage = () => {
    if (window.confirm("Are you sure you want to clear local storage? This will remove all your saved data.")) {
      localStorage.clear();
      alert("Local storage cleared!");
    }
  };

  const handleClearSessionStorage = () => {
    if (window.confirm("Are you sure you want to clear session storage?")) {
      sessionStorage.clear();
      alert("Session storage cleared!");
    }
  };

  const handleExportData = () => {
    const data = localStorage;
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "warcrow_army_builder_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      alert("No file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const data = JSON.parse(json);

        if (typeof data === 'object' && data !== null) {
          Object.keys(data).forEach(key => {
            localStorage.setItem(key, data[key]);
          });
          alert("Data imported successfully!");
        } else {
          alert("Invalid data format. Please import a valid JSON file.");
        }
      } catch (error) {
        console.error("Error importing data:", error);
        alert("Failed to import data. Please ensure the file is a valid JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <AdminOnly 
      isAuthenticated={isAuthenticated} 
      isWabAdmin={isWabAdmin} 
      fallback={null}
    >
      <div className="min-h-screen bg-warcrow-background text-warcrow-text p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/admin')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-warcrow-gold">Developer Options</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/50 border border-warcrow-gold/30">
              <CardHeader>
                <CardTitle className="text-xl text-warcrow-gold flex items-center"><Database className="mr-2 h-5 w-5" /> Storage Management</CardTitle>
                <CardDescription className="text-gray-300">Clear or export local storage for debugging.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleClearLocalStorage}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Local Storage
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleClearSessionStorage}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Session Storage
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-warcrow-gold/30 text-warcrow-gold"
                  onClick={handleExportData}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Local Storage
                </Button>
                <div>
                  <label htmlFor="import-data" className="text-sm text-gray-300 block mb-2">Import Local Storage:</label>
                  <input
                    type="file"
                    id="import-data"
                    accept=".json"
                    onChange={handleImportData}
                    className="text-warcrow-text bg-black/70 rounded px-4 py-2 w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border border-warcrow-gold/30">
              <CardHeader>
                <CardTitle className="text-xl text-warcrow-gold flex items-center"><AlertTriangle className="mr-2 h-5 w-5" /> Danger Zone</CardTitle>
                <CardDescription className="text-gray-300">Actions that could break things. Use with caution!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert variant="destructive">
                  <AlertDescription>
                    No actions available yet.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminOnly>
  );
};

export default DeveloperOptions;
