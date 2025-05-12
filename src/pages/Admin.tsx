
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { getSiteData } from '@/utils/dataUtils';
import { useToast } from '@/hooks/use-toast';

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
      
      // In a real implementation, we would save this to a database or file
      // For now, we just simulate the save operation
      
      // To see changes in this demo, user would need to manually update the siteData.json file
      // and rebuild the application
    } catch (error) {
      toast({
        title: "Ugyldig JSON",
        description: "Kontroller formateringen og prøv igen.",
        variant: "destructive"
      });
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
