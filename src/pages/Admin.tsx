
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { getSiteData } from '@/utils/dataUtils';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Admin = () => {
  const { toast } = useToast();
  const [data, setData] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const siteData = getSiteData();
    setData(JSON.stringify(siteData, null, 2));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in a real app, use proper authentication
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      toast({
        title: "Forkert kodeord",
        description: "Prøv igen.",
        variant: "destructive"
      });
    }
  };

  const handleSave = () => {
    try {
      // Validate JSON
      JSON.parse(data);
      
      setIsSaving(true);
      // In a real app, this would send the data to a server
      setTimeout(() => {
        setIsSaving(false);
        toast({
          title: "Ændringer gemt!",
          description: "Siden skal genindlæses for at se ændringerne.",
        });
      }, 1000);
    } catch (error) {
      toast({
        title: "Ugyldig JSON",
        description: "Kontroller formateringen og prøv igen.",
        variant: "destructive"
      });
    }
  };

  const getFormattedExample = (section: string) => {
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
  };

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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Musical Hjemmeside Admin</h1>
          <Button onClick={() => setIsAuthenticated(false)}>Log ud</Button>
        </div>
        
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
                      Alle tekster, billeder og andre oplysninger er gemt i et JSON-format. 
                      Du kan redigere det hele ved at ændre værdierne i JSON-editoren.
                    </p>
                    <Alert className="bg-musical-light border-musical-blue">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Vigtig information</AlertTitle>
                      <AlertDescription>
                        Husk at gemme dine ændringer ved at klikke på "Gem Ændringer" knappen. 
                        Genindlæs siden efter gemning for at se ændringerne.
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
                      Upload dine billeder til en billed-hostingtjeneste og brug URL'en, eller placer dem i "public" mappen og angiv relativ sti.
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
            Bemærk: I denne demo-version gemmes ændringer ikke permanent. I en rigtig implementering 
            ville ændringerne blive gemt i en database eller fil.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
