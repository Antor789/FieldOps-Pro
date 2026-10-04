import { useState, useCallback, useMemo } from 'react';
import {
  Customer,
  ServiceSite,
  Contact,
  CustomerInteraction,
  ServiceAgreement,
} from '../types/customer';
import { INITIAL_CUSTOMERS, INITIAL_CUSTOMER_INTERACTIONS } from '../data/sampleCustomerData';

export function useCustomerProfile(customerId: string) {
  const [customer, setCustomer] = useState<Customer>(() => {
    return INITIAL_CUSTOMERS.find((c) => c.id === customerId) || INITIAL_CUSTOMERS[0];
  });

  const [interactions, setInteractions] = useState<CustomerInteraction[]>(() => {
    return INITIAL_CUSTOMER_INTERACTIONS.filter((i) => i.customerId === customerId);
  });

  // Add Service Site
  const addSite = useCallback((newSite: Omit<ServiceSite, 'id' | 'customerId' | 'totalJobs'>) => {
    const id = `site-${Date.now()}`;
    const siteCode = `SITE-${String(customer.sites.length + 1).padStart(3, '0')}`;
    const fullSite: ServiceSite = {
      ...newSite,
      id,
      customerId: customer.id,
      siteCode,
      totalJobs: 0,
      isActive: true,
    };

    setCustomer((prev) => ({
      ...prev,
      sites: [...prev.sites, fullSite],
      updatedAt: new Date(),
    }));
    return fullSite;
  }, [customer.id, customer.sites.length]);

  // Add Contact
  const addContact = useCallback((newContact: Omit<Contact, 'id' | 'customerId'>) => {
    const id = `cnt-${Date.now()}`;
    const fullContact: Contact = {
      ...newContact,
      id,
      customerId: customer.id,
    };

    setCustomer((prev) => ({
      ...prev,
      contacts: [...prev.contacts, fullContact],
      updatedAt: new Date(),
    }));
    return fullContact;
  }, [customer.id]);

  // Add Interaction / Note
  const addInteraction = useCallback((newInteraction: Omit<CustomerInteraction, 'id' | 'customerId' | 'createdAt'>) => {
    const id = `act-${Date.now()}`;
    const fullInteraction: CustomerInteraction = {
      ...newInteraction,
      id,
      customerId: customer.id,
      createdAt: new Date(),
    };

    setInteractions((prev) => [fullInteraction, ...prev]);
    return fullInteraction;
  }, [customer.id]);

  return {
    customer,
    setCustomer,
    sites: customer.sites,
    contacts: customer.contacts,
    interactions,
    addSite,
    addContact,
    addInteraction,
  };
}
