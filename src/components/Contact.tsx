
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getContactData } from '@/utils/dataUtils';
import type { SiteData } from '@/lib/supabase';

const Contact = () => {
  const [contactData, setContactData] = useState<SiteData['contact']>({
    title: "",
    subtitle: "",
    form: {
      namePlaceholder: "",
      emailPlaceholder: "",
      messagePlaceholder: "",
      submitButton: "",
      submittingButton: ""
    },
    contactInfo: {
      phone: {
        number: "",
        hours: ""
      },
      email: {
        address: "",
        note: ""
      },
      address: {
        name: "",
        street: "",
        city: ""
      }
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getContactData();
        setContactData(data);
      } catch (error) {
        console.error("Failed to fetch contact data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (isLoading) {
    return (
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          Loading contact section...
        </div>
      </section>
    );
  }

  // Check if specific contact info sections exist in the data
  const hasPhone = contactData.contactInfo?.phone && 
    (contactData.contactInfo.phone.number || contactData.contactInfo.phone.hours);
  
  const hasEmail = contactData.contactInfo?.email && 
    (contactData.contactInfo.email.address || contactData.contactInfo.email.note);
  
  const hasAddress = contactData.contactInfo?.address && 
    (contactData.contactInfo.address.name || 
     contactData.contactInfo.address.street || 
     contactData.contactInfo.address.city);
  
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 musical-header">{contactData.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{contactData.subtitle}</p>
        </div>
        
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
          <div className="space-y-6 w-full max-w-xl">
            {/* Only render phone info if it exists */}
            {hasPhone && (
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-musical-light flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-musical-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Telefon</h4>
                  {contactData.contactInfo.phone?.number && (
                    <p className="text-musical-orange">{contactData.contactInfo.phone.number}</p>
                  )}
                  {contactData.contactInfo.phone?.hours && (
                    <p className="text-sm text-gray-500">{contactData.contactInfo.phone.hours}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Only render email info if it exists */}
            {hasEmail && (
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-musical-light flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-musical-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Email</h4>
                  {contactData.contactInfo.email?.address && (
                    <p className="text-musical-orange">{contactData.contactInfo.email.address}</p>
                  )}
                  {contactData.contactInfo.email?.note && (
                    <p className="text-sm text-gray-500">{contactData.contactInfo.email.note}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Only render address info if it exists */}
            {hasAddress && (
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-musical-light flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-musical-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Adresse</h4>
                  {contactData.contactInfo.address?.name && (
                    <p className="text-gray-600">{contactData.contactInfo.address.name}</p>
                  )}
                  {contactData.contactInfo.address?.street && (
                    <p className="text-gray-600">{contactData.contactInfo.address.street}</p>
                  )}
                  {contactData.contactInfo.address?.city && (
                    <p className="text-gray-600">{contactData.contactInfo.address.city}</p>
                  )}
                </div>
              </div>
            )}

            {/* If no contact info sections are available, show a message */}
            {!hasPhone && !hasEmail && !hasAddress && (
              <p className="text-center text-gray-500">Ingen kontaktoplysninger tilgængelige.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
