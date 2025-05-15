
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { getSiteData, updateSiteData } from '@/utils/dataUtils';
import { initializeSupabaseData } from '@/utils/initSupabase';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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
  const [saveStatus, setSaveStatus] = useState<{success: boolean, message: string} | null>(null);
  const [activeTab, setActiveTab] = useState<string>('editor');
  const [activeGuideTab, setActiveGuideTab] = useState<string>('general');

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
      
      if (siteData) {
        setData(JSON.stringify(siteData, null, 2));
      } else {
        toast({
          title: "Ingen data fundet",
          description: "Der blev ikke fundet nogen data. Klik på 'Initialize Database' knappen.",
          variant: "destructive"
        });
        setData(JSON.stringify({}, null, 2));
      }
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitializeData = async () => {
    setIsInitializing(true);
    setInitMessage('');
    setSaveStatus(null);
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
    
    // Password is "musical2024" 
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
      setSaveStatus(null);
      toast({
        title: "Logget ud",
        description: "Du er nu logget ud",
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSave = async () => {
    setSaveStatus(null);
    try {
      // Validate JSON
      console.log('Attempting to parse JSON data...');
      let parsedData: SiteData;
      
      try {
        parsedData = JSON.parse(data) as SiteData;
        console.log('JSON parsed successfully:', parsedData);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        setSaveStatus({
          success: false,
          message: 'Ugyldig JSON formatering. Kontroller syntaksen og prøv igen.'
        });
        toast({
          title: "Fejl ved JSON validering",
          description: "Ugyldig JSON formatering. Kontroller syntaksen og prøv igen.",
          variant: "destructive"
        });
        return;
      }
      
      setIsSaving(true);
      // Save to Supabase
      console.log('Attempting to update site data...');
      const success = await updateSiteData(parsedData);
      
      if (success) {
        console.log('Data saved successfully!');
        setSaveStatus({
          success: true,
          message: 'Ændringer gemt! Hjemmesiden er opdateret med dine ændringer.'
        });
        toast({
          title: "Ændringer gemt!",
          description: "Hjemmesiden er opdateret med dine ændringer.",
        });
      } else {
        console.error('Failed to update data');
        setSaveStatus({
          success: false,
          message: 'Kunne ikke gemme data i databasen. Prøv igen senere.'
        });
        throw new Error("Failed to update data");
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setSaveStatus({
        success: false,
        message: 'Fejl ved gemning: ' + (error instanceof Error ? error.message : String(error))
      });
      toast({
        title: "Fejl ved gemning",
        description: "Kontroller JSON-formateringen og prøv igen.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getFormattedExample = (section: string) => {
    try {
      switch(section) {
        case 'general':
          return `{
  "general": {
    "schoolName": "Bagsværd Friskole", // Skolens navn
    "musicalName": "Drømmenes Land",   // Musicalens navn
    "year": "2023"                     // Årstal
  }
}`;
        case 'hero':
          return `{
  "hero": {
    "title": "Årets Musical",                 // Overskrift
    "subtitle": "\\\"Drømmenes Land\\\"",     // Undertitel (brug \\ før anførselstegn)
    "description": "Oplev magien...",         // Beskrivelse
    "buttons": {
      "primary": "Køb billetter",             // Tekst på primær knap (fjern hele linjen hvis knappen ikke skal vises)
      "secondary": "Se tider"                 // Tekst på sekundær knap (fjern hele linjen hvis knappen ikke skal vises)
    },
    "image": "/dit-billede.jpg"               // Sti til hero-billede
  }
}`;
        case 'about':
          return `{
  "about": {
    "title": "Om Musicalen",
    "subtitle": "Årets forestilling...",
    "heading": "Drømmenes Land",
    "paragraphs": [
      "Første afsnit med tekst...",          // Hvert element er et afsnit
      "Andet afsnit med tekst...",
      "Tredje afsnit med tekst..."
    ],
    "stats": [
      {
        "value": "12+",                     // Statistik værdi
        "label": "Originale sange"          // Statistik label
      },
      {
        "value": "45",
        "label": "Medvirkende"
      }
    ],
    "image": "/about-image.jpg"             // Sti til about-billede
  }
}`;
        case 'gallery':
          return `{
  "gallery": {
    "title": "Galleri",
    "subtitle": "Glimt fra prøver...",
    "images": [
      { "src": "/billede1.jpg", "alt": "Forestillingsbillede 1" },
      { "src": "/billede2.jpg", "alt": "Forestillingsbillede 2" },
      // Tilføj flere billeder efter behov...
    ]
  }
}`;
        case 'cast':
          return `{
  "cast": {
    "title": "Medvirkende",
    "subtitle": "Mød de talentfulde elever...",
    "groups": {
      "skuespillere": [                             // Kategori navn
        { 
          "name": "Emma Hansen",                    // Person navn
          "role": "Luna",                           // Personens rolle
          "grade": "8. klasse"                      // Klassetrin
        },
        // Tilføj flere personer efter behov...
      ],
      "dansere": [                                  // Ny kategori
        { 
          "name": "Isabella Møller", 
          "role": "Drømmefeen", 
          "grade": "6. klasse" 
        },
        // Tilføj flere personer efter behov...
      ]
      // Du kan tilføje flere kategorier efter behov
    }
  }
}`;
        case 'info':
          return `{
  "info": {
    "title": "Information",
    "subtitle": "Alt hvad du behøver at vide...",
    "performances": [                                   // Forestillinger
      { 
        "date": "Torsdag d. 15. juni 2023",            // Dato
        "time": "19:00 - 21:00"                        // Tidspunkt
      },
      // Tilføj flere forestillinger efter behov...
    ],
    "tickets": [                                       // Billettyper
      { 
        "type": "Voksne",                              // Billettype
        "price": "50 kr"                               // Pris
      },
      // Tilføj flere billettyper efter behov...
    ],
    "ticketNote": "Billetterne kan købes online...",   // Note om billetter (kan fjernes hvis ikke nødvendig)
    "address": {                                       // Adresse
      "name": "Bagsværd Friskole",
      "street": "Skolevej 1",
      "city": "2880 Bagsværd"
    },
    "practical": [                                     // Praktisk information
      {
        "title": "Parkering",                          // Titel på info
        "content": "Der er begrænset parkering..."     // Indhold
      },
      // Tilføj flere praktiske informationer efter behov...
    ]
  }
}`;
        case 'contact':
          return `{
  "contact": {
    "title": "Kontakt",
    "subtitle": "Har du spørgsmål...",
    "form": {
      "namePlaceholder": "Dit navn",                    // Placeholder til navn
      "emailPlaceholder": "din@email.dk",               // Placeholder til email
      "messagePlaceholder": "Skriv din besked her...",  // Placeholder til besked
      "submitButton": "Send besked",                    // Tekst på send-knap
      "submittingButton": "Sender..."                   // Tekst mens besked sendes
    },
    "contactInfo": {
      "phone": {                                       // Fjern hele phone objektet hvis du ikke vil vise telefon
        "number": "+45 12 34 56 78",                   // Telefonnummer
        "hours": "Mandag-Fredag: 9:00-15:00"           // Åbningstider
      },
      "email": {                                       // Fjern hele email objektet hvis du ikke vil vise email
        "address": "musical@bagsvaerd-friskole.dk",    // Email
        "note": "Vi svarer normalt inden for 24 timer" // Note om svartid
      },
      "address": {                                     // Fjern hele address objektet hvis du ikke vil vise adresse
        "name": "Bagsværd Friskole",
        "street": "Skolevej 1",
        "city": "2880 Bagsværd"
      }
    }
  }
}`;
        case 'colors':
          return `{
  "musical": {
    "blue": "#3A86FF",     // Primær blå farve
    "orange": "#FF8A00",   // Orange accentfarve
    "yellow": "#FFC53A",   // Gul accentfarve
    "pink": "#FF3A8C",     // Pink accentfarve
    "light": "#F9F7F3"     // Lysegrå baggrundsfarve
  }
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
        
        {saveStatus && (
          <Alert className={`mb-4 ${saveStatus.success ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
            {saveStatus.success ? 
              <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
              <AlertCircle className="h-4 w-4 text-red-600" />
            }
            <AlertTitle>{saveStatus.success ? 'Success' : 'Fejl'}</AlertTitle>
            <AlertDescription>{saveStatus.message}</AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
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
                    Rediger JSON data direkte. Ændre tekst, billede URLs, farver, og andre oplysninger.
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
                    className="bg-green-600 hover:bg-green-700"
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
                      Alle tekster, billeder, farver og andre oplysninger er gemt i et JSON-format i Supabase databasen. 
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
                    <h3 className="font-semibold text-lg mb-2">Hvad kan jeg redigere?</h3>
                    <p className="mb-4">
                      Du kan redigere ALT indhold på siden via JSON-editoren, herunder:
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                      {['general', 'hero', 'about', 'gallery', 'cast', 'info', 'contact', 'colors'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveGuideTab(tab)}
                          className={`border ${activeGuideTab === tab ? 'bg-musical-light border-musical-blue' : 'border-gray-200'} p-2 text-center rounded`}
                        >
                          {tab === 'general' ? 'Generelt' : 
                           tab === 'hero' ? 'Hero' :
                           tab === 'about' ? 'Om' :
                           tab === 'gallery' ? 'Galleri' :
                           tab === 'cast' ? 'Medvirkende' :
                           tab === 'info' ? 'Information' :
                           tab === 'contact' ? 'Kontakt' :
                           tab === 'colors' ? 'Farver' : tab}
                        </button>
                      ))}
                    </div>
                    
                    <div className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                      <pre>{getFormattedExample(activeGuideTab)}</pre>
                    </div>
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
                    <h3 className="font-semibold text-lg mb-2">JSON-formatering</h3>
                    <p className="mb-2">
                      Husk disse regler for korrekt JSON-formatering:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Brug dobbelte anførselstegn (<code>"</code>) omkring alle egenskabsnavne og strengværdier</li>
                      <li>Adskil egenskaber med komma (<code>,</code>)</li>
                      <li>Brug ikke komma efter den sidste egenskab i et objekt eller array</li>
                      <li>Hvis du vil bruge anførselstegn i en tekst, skal de escapes med en backslash: <code>\"Drømmenes Land\"</code></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Dynamisk fjernelse af elementer</h3>
                    <p className="mb-2">
                      Du kan fjerne elementer på hjemmesiden ved at fjerne deres data i JSON'en:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>For at fjerne en knap (f.eks. "Køb billetter"), fjern linjen med <code>"primary": "Køb billetter"</code></li>
                      <li>For at fjerne telefon i kontaktsektionen, fjern hele <code>"phone": {...}</code> objektet</li>
                      <li>For at fjerne et galleri-billede, fjern det pågældende objekt fra <code>"images"</code> arrayet</li>
                      <li>Alle sektioner tilpasser sig automatisk baseret på, hvilke data der er tilgængelige</li>
                    </ul>
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
