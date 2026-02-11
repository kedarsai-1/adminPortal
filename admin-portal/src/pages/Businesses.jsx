import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { businessService } from '../services/api';

function BusinessModal({ business, onClose, onSave }) {
  const [formData, setFormData] = useState(business || {
    name: '',
    type: 'auction_market',
    gstin: '',
    pan: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {business ? 'Edit Business' : 'Add New Business'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Enter business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input"
                >
                  <option value="auction_market">Auction Market</option>
                  <option value="retail_shop">Retail Shop</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="transport">Transport</option>
                  <option value="cold_storage">Cold Storage</option>
                  <option value="distributor">Distributor</option>
                  <option value="manufacturer">Manufacturer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GSTIN
                </label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  className="input"
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN
                </label>
                <input
                  type="text"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  className="input"
                  placeholder="AAAAA0000A"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    contact: { ...formData.contact, phone: e.target.value }
                  })}
                  className="input"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    contact: { ...formData.contact, email: e.target.value }
                  })}
                  className="input"
                  placeholder="business@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.contact.website}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    contact: { ...formData.contact, website: e.target.value }
                  })}
                  className="input"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, street: e.target.value }
                  })}
                  className="input"
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, city: e.target.value }
                    })}
                    className="input"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, state: e.target.value }
                    })}
                    className="input"
                    placeholder="State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={formData.address.pincode}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, pincode: e.target.value }
                    })}
                    className="input"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, country: e.target.value }
                    })}
                    className="input"
                    placeholder="India"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input max-w-xs"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <button type="submit" className="btn btn-primary flex-1">
              {business ? 'Update Business' : 'Create Business'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Businesses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['businesses', searchTerm, typeFilter, statusFilter],
    queryFn: () => businessService.getAll({ 
      search: searchTerm,
      type: typeFilter,
      status: statusFilter
    }),
  });

  const createMutation = useMutation({
    mutationFn: businessService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['businesses']);
      toast.success('Business created successfully');
      setShowModal(false);
      setSelectedBusiness(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create business');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => businessService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['businesses']);
      toast.success('Business updated successfully');
      setShowModal(false);
      setSelectedBusiness(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update business');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: businessService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['businesses']);
      toast.success('Business deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete business');
    }
  });

  const handleSave = (formData) => {
    if (selectedBusiness) {
      updateMutation.mutate({ id: selectedBusiness._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this business?')) {
      deleteMutation.mutate(id);
    }
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      auction_market: 'bg-blue-100 text-blue-800',
      retail_shop: 'bg-green-100 text-green-800',
      wholesale: 'bg-purple-100 text-purple-800',
      transport: 'bg-orange-100 text-orange-800',
      cold_storage: 'bg-cyan-100 text-cyan-800',
      distributor: 'bg-pink-100 text-pink-800',
      manufacturer: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getVerificationIcon = (status) => {
    if (status === 'verified') return <CheckCircle className="w-5 h-5 text-success-600" />;
    if (status === 'pending') return <Clock className="w-5 h-5 text-warning-600" />;
    return <XCircle className="w-5 h-5 text-danger-600" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Businesses</h1>
          <p className="text-gray-600">Manage auction markets, retail shops, and service providers</p>
        </div>
        <button 
          onClick={() => {
            setSelectedBusiness(null);
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Business
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input w-full"
            >
              <option value="">All Types</option>
              <option value="auction_market">Auction Market</option>
              <option value="retail_shop">Retail Shop</option>
              <option value="wholesale">Wholesale</option>
              <option value="transport">Transport</option>
              <option value="cold_storage">Cold Storage</option>
              <option value="distributor">Distributor</option>
              <option value="manufacturer">Manufacturer</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-full"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Businesses</p>
              <h3 className="text-2xl font-bold text-gray-900">{data?.data?.length || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active</p>
              <h3 className="text-2xl font-bold text-success-600">
                {data?.data?.filter(b => b.status === 'active').length || 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-lg bg-success-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Auction Markets</p>
              <h3 className="text-2xl font-bold text-blue-600">
                {data?.data?.filter(b => b.type === 'auction_market').length || 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Retail Shops</p>
              <h3 className="text-2xl font-bold text-green-600">
                {data?.data?.filter(b => b.type === 'retail_shop').length || 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : data?.data?.length > 0 ? (
          data.data.map((business) => (
            <div key={business._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-lg">
                    {business.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{business.name}</h3>
                    <span className={`text-xs badge ${getTypeBadgeColor(business.type)} mt-1`}>
                      {business.type?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                {getVerificationIcon(business.verificationStatus || 'pending')}
              </div>

              <div className="space-y-2 mb-4">
                {business.contact?.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    {business.contact.phone}
                  </div>
                )}
                {business.contact?.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {business.contact.email}
                  </div>
                )}
                {business.address?.city && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {business.address.city}, {business.address.state}
                  </div>
                )}
              </div>

              {business.gstin && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">GSTIN</p>
                  <p className="text-sm font-mono font-semibold text-gray-900">{business.gstin}</p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-4 border-t">
                <button
                  onClick={() => {
                    setSelectedBusiness(business);
                    setShowModal(true);
                  }}
                  className="flex-1 btn btn-secondary text-sm"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(business._id)}
                  className="flex-1 btn btn-danger text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full card">
            <div className="flex flex-col items-center justify-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No businesses found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first business</p>
              <button 
                onClick={() => setShowModal(true)}
                className="btn btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Business
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <BusinessModal
          business={selectedBusiness}
          onClose={() => {
            setShowModal(false);
            setSelectedBusiness(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}