
import * as React from 'react';
import { ProvidersWrapper } from "@/components/providers/ProvidersWrapper";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppRoutes } from "@/components/routing/AppRoutes";

function App() {
  return (
    <ProvidersWrapper>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ProvidersWrapper>
  );
}

export default App;
