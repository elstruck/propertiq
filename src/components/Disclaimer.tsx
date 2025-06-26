export function Disclaimer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-4 text-xs text-muted-foreground">
        <p>
          <strong>Important Disclaimer:</strong> Data provided via RapidAPI/Zillow—accuracy not guaranteed. 
          This tool provides no financial or brokerage advice. All real estate services provided by{' '}
          <strong>&lt;AgentName&gt;</strong>, Brokerage XYZ, TN License #######. 
          ProperTiQ is not a brokerage and does not provide real estate services. 
          All property analysis is for informational purposes only. 
          Please consult with qualified professionals for investment advice.
        </p>
        <p className="mt-2">
          © 2024 ProperTiQ. U.S.-only service. Property data may be inaccurate or outdated.
        </p>
      </div>
    </footer>
  );
} 