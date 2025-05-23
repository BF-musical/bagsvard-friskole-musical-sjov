
export interface SiteData {
  general: {
    schoolName: string;
    musicalName: string;
    year: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    buttons: {
      primary?: string;
      secondary?: string;
    };
    image: string;
  };
  about: {
    title: string;
    subtitle: string;
    heading: string;
    paragraphs: string[];
    stats: {
      value: string;
      label: string;
    }[];
    image: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    images: {
      src: string;
      alt: string;
    }[];
  };
  cast: {
    title: string;
    subtitle: string;
    groups: {
      [key: string]: {
        name: string;
        role: string;
        grade: string;
      }[];
    };
  };
  info: {
    title: string;
    subtitle: string;
    performances: {
      date: string;
      time: string;
    }[];
    tickets: {
      type: string;
      price: string;
    }[];
    ticketNote?: string;
    address: {
      name: string;
      street: string;
      city: string;
    };
    practical: {
      title: string;
      content: string;
    }[];
  };
  contact: {
    title: string;
    subtitle: string;
    form: {
      namePlaceholder: string;
      emailPlaceholder: string;
      messagePlaceholder: string;
      submitButton: string;
      submittingButton: string;
    };
    contactInfo: {
      phone?: {
        number: string;
        hours: string;
      };
      email?: {
        address: string;
        note: string;
      };
      address?: {
        name: string;
        street: string;
        city: string;
      };
    };
  };
  footer: {
    copyright: string;
  };
  musical: {
    blue: string;
    orange: string;
    yellow: string;
    pink: string;
    light: string;
  };
}
