import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { getSiteData, updateSiteData } from '@/utils/dataUtils';
import { initializeSupabaseData } from '@/utils/initSupabase';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { SiteData } from '@/lib/supabase';

const Admin = () => {
  const { toast } = useToast();
  const [data, setData] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [session, setSession] = useState<any>(null);
  const [initMessage, setInitMessage] = useState<string>('');

  useEffect(() => {
    // Check if user is already authenticated with Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setIsLoading(false);
      }
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setIsAuthenticated(false);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching data for Admin page...');
      const siteData = await getSiteData();
      console.log('Received data:', siteData);
      setData(JSON.stringify(siteData, null, 2));
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast({
        title: "Fejl ved indlæsning",
        description: "Kunne ikke indlæse hjemmesidedata",
        variant: "destructive"
      });
      // Still set some default data to display
      const defaultData = { general: { schoolName: "Default School", musicalName: "Default Musical", year: "2023" } };
      setData(JSON.stringify(defaultData, null, 2));
      setIsLoading(false);
    }
  };

  const handleInitializeData = async () => {
    setIsInitializing(true);
    setInitMessage('');
    try {
      console.log('Initializing database...');
      const result = await initializeSupabaseData();
      
      setInitMessage(result.message);
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      
      if (result.success) {
        await fetchData();
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('Failed to initialize data:', error);
      setInitMessage(`Error: ${errorMsg}`);
      toast({
        title: "Error",
        description: `Failed to initialize data: ${errorMsg}`,
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password is now "musical2024" 
    if (password === 'musical2024') {
      setIsAuthenticated(true);
      toast({
        title: "Logget ind",
        description: "Du er nu logget ind som administrator",
      });
      fetchData(); // Fetch data immediately after login
    } else {
      toast({
        title: "Forkert kodeord",
        description: "Prøv igen.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      toast({
        title: "Logget ud",
        description: "Du er nu logget ud",
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSave = async () => {
    try {
      // Validate JSON
      const parsedData = JSON.parse(data) as SiteData;
      
      setIsSaving(true);
      // Save to Supabase
      const success = await updateSiteData(parsedData);
      
      if (success) {
        toast({
          title: "Ændringer gemt!",
          description: "Hjemmesiden er opdateret med dine ændringer.",
        });
      } else {
        throw new Error("Failed to update data");
      }
      
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving data:', error);
      setIsSaving(false);
      toast({
        title: "Fejl ved gemning",
        description: "Kontroller JSON-formateringen og prøv igen.",
        variant: "destructive"
      });
    }
  };

  const getFormattedExample = (section: string) => {
    try {
      const siteData = JSON.parse(data);
      switch(section) {
        case 'general':
          return `{
  "schoolName": "Bagsværd Friskole", // Skolens navn
  "musicalName": "Drømmenes Land",   // Musicalens navn
  "year": "2023"                     // Årstal
}`;
        case 'location':
          return `{
  "name": "Bagsværd Friskole",    // Stedets navn
  "street": "Skolevej 1",         // Gadenavn og nummer
  "city": "2880 Bagsværd"         // Postnummer og by
}`;
        case 'cast':
          return `{
  "name": "Emma Hansen",    // Personens navn
  "role": "Luna",           // Rolle i forestillingen
  "grade": "8. klasse"      // Klassetrin
}`;
        default:
          return '';
      }
    } catch (error) {
      return '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-musical-blue" />
          <p className="mt-4">Indlæser...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Kodeord</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderAdminPanel = () => (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Musical Hjemmeside Admin</h1>
          <div className="flex gap-2">
            <Button 
              onClick={handleInitializeData}
              disabled={isInitializing}
              variant="outline"
            >
              {isInitializing ? 'Initializing...' : 'Initialize Database'}
            </Button>
            <Button onClick={handleLogout}>Log ud</Button>
          </div>
        </div>
        
        {initMessage && (
          <Alert className={`mb-4 ${initMessage.includes('Error') ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
            <Info className="h-4 w-4" />
            <AlertTitle>{initMessage.includes('Error') ? 'Fejl' : 'Success'}</AlertTitle>
            <AlertDescription>{initMessage}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="editor" className="mb-6">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-4">
            <TabsTrigger value="editor">JSON Editor</TabsTrigger>
            <TabsTrigger value="guide">Vejledning</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Rediger Indhold</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Rediger JSON data direkte. Ændre tekst, billede URLs, og andre oplysninger.
                    Alle ændringer gemmes i Supabase databasen.
                  </p>
                  <Textarea
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="font-mono text-sm h-[500px]"
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Gemmer...' : 'Gem Ændringer'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="guide">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Sådan redigerer du hjemmesiden</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Kom i gang</h3>
                    <p className="mb-2">
                      Alle tekster, billeder og andre oplysninger er gemt i et JSON-format i Supabase databasen. 
                      Du kan redigere det hele ved at ændre værdierne i JSON-editoren.
                    </p>
                    <Alert className="bg-musical-light border-musical-blue">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Vigtig information</AlertTitle>
                      <AlertDescription>
                        Husk at gemme dine ændringer ved at klikke på "Gem Ændringer" knappen. 
                        Ændringerne gemmes øjeblikkeligt i databasen og vises på hjemmesiden.
                      </AlertDescription>
                    </Alert>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Generelle oplysninger</h3>
                    <p className="mb-2">Under "general" kan du ændre skolens navn, musicalens navn og årstal:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                      {getFormattedExample('general')}
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Billeder</h3>
                    <p className="mb-2">
                      Billeder er defineret som URL'er. Du kan ændre disse til links til dine egne billeder.
                      For eksempel: <code>"image": "/dit-billede.jpg"</code>
                    </p>
                    <p className="text-sm text-gray-600">
                      Upload dine billeder til Supabase Storage eller en anden billed-hostingtjeneste og brug URL'en.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Skolens placering</h3>
                    <p className="mb-2">Du kan opdatere skolens adresse under "info.address":</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                      {getFormattedExample('location')}
                    </pre>
                    <p className="mt-2">
                      For at opdatere kortet skal du også ændre iframe-koden i Location.tsx filen.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Medvirkende</h3>
                    <p className="mb-2">Under "cast.groups" kan du tilføje eller fjerne personer:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                      {getFormattedExample('cast')}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Ændringer gemmes i Supabase databasen og reflekteres øjeblikkeligt på hjemmesiden.
          </p>
        </div>
      </div>
    </div>
  );

  return renderAdminPanel();
};

export default Admin;
