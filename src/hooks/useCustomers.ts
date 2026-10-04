import { useState, useCallback, useMemo } from 'react';
import { Customer, CustomerType, CustomerStatus } from '../types/customer';
import { INITIAL_CUSTOMERS } from '../data/sampleCustomerData';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [selectedType, setSelectedType] = useState<CustomerType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<CustomerStatus | 'all'>('all');
  const [selectedDivision, setSelectedDivision] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Add Customer
  const addCustomer = useCallback(
    (newCustData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalJobs' | 'completedJobs' | 'averageRating' | 'outstandingBalanceBDT' | 'lifetimeValueBDT'>) => {
      const id = `cust-${Date.now()}`;
      const customerCode = `CUST-${String(customers.length + 1).padStart(4, '0')}`;
      const customer: Customer = {
        ...newCustData,
        id,
        customerCode,
        totalJobs: 0,
        completedJobs: 0,
        averageRating: 5.0,
        outstandingBalanceBDT: 0,
        lifetimeValueBDT: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCustomers((prev) => [customer, ...prev]);
      return customer;
    },
    [customers.length]
  );

  // Update Customer
  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c))
    );
    setSelectedCustomer((prev) => (prev?.id === id ? { ...prev, ...updates, updatedAt: new Date() } : prev));
  }, []);

  // Delete Customer
  const deleteCustomer = useCallback((id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    if (selectedCustomer?.id === id) {
      setSelectedCustomer(null);
    }
  }, [selectedCustomer]);

  // Filtered List
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (selectedType !== 'all' && c.customerType !== selectedType) return false;
      if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
      if (selectedDivision !== 'all' && c.headOffice.division !== selectedDivision) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName =
          c.companyName.toLowerCase().includes(q) ||
          (c.companyNameBangla && c.companyNameBangla.includes(q));
        const matchCode = c.customerCode.toLowerCase().includes(q);
        const matchBin = c.nbrBin && c.nbrBin.includes(q);
        const matchPhone = c.primaryPhone.includes(q);
        const matchArea = c.headOffice.area.toLowerCase().includes(q);

        if (!matchName && !matchCode && !matchBin && !matchPhone && !matchArea) {
          return false;
        }
      }
      return true;
    });
  }, [customers, selectedType, selectedStatus, selectedDivision, searchQuery]);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === 'active').length;
    const enterprise = customers.filter((c) => c.customerType === 'enterprise').length;
    const totalRevenue = customers.reduce((sum, c) => sum + (c.lifetimeValueBDT || 0), 0);

    return {
      total,
      active,
      enterprise,
      totalRevenue,
    };
  }, [customers]);

  return {
    customers: filteredCustomers,
    allCustomers: customers,
    stats,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    selectedDivision,
    setSelectedDivision,
    searchQuery,
    setSearchQuery,
    isAddModalOpen,
    setIsAddModalOpen,
    selectedCustomer,
    setSelectedCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
