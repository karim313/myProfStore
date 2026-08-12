import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Package,
  ChevronDown,
  Calendar,
  CheckCircle2,
  Truck,
  Box,
  AlertCircle,
  FileText,
  HelpCircle,
  Lock,
  ChevronRight,
  RefreshCw,
  CreditCard,
} from 'lucide-react';
import { getOrders, paymentsGateway } from '@/api/axios';
import './Orders.css';
import { toast } from 'sonner';

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface Order {
  orderId: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [payingOrderId, setPayingOrderId] = useState<number | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      setIsAuthenticated(true);
      const res = await getOrders();
      // Ensure the response is an array
      if (Array.isArray(res)) {
        setOrders(res);
      } else if (res && Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (res && typeof res === 'object') {
        // Fallback for nested objects
        const items = res.items || res.orders || [];
        setOrders(Array.isArray(items) ? items : []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch your orders. Please try again later.');
      toast.error('Could not load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId: number) => {
    const next = new Set(expandedOrders);
    if (next.has(orderId)) {
      next.delete(orderId);
    } else {
      next.add(orderId);
    }
    setExpandedOrders(next);
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Helper to format currency
  const formatPrice = (price: number) => {
    return `$${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Helper to determine active step in order tracking stepper
  const getStepStatus = (status: string, stepName: string) => {
    const statusLower = status.toLowerCase();
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIdx = steps.indexOf(statusLower);
    const targetIdx = steps.indexOf(stepName.toLowerCase());

    if (statusLower === 'cancelled') {
      return 'inactive';
    }

    if (targetIdx < currentIdx) {
      return 'completed';
    } else if (targetIdx === currentIdx) {
      return 'active';
    } else {
      return 'inactive';
    }
  };

  const handleInvoiceDownload = (orderId: number) => {
    toast.success(`Invoice for Order #${orderId} has been generated and download started!`);
  };

  const handleContactSupport = (orderId: number) => {
    toast.info(`Redirecting to support ticket for Order #${orderId}...`);
  };

  const handlePayNow = async (orderId: number) => {
    setPayingOrderId(orderId);
    try {
      const paymentRes = await paymentsGateway(orderId);
      const redirectUrl = paymentRes?.redirectUrl || paymentRes?.paymentUrl || paymentRes?.url || (typeof paymentRes === 'string' ? paymentRes : null);

      if (redirectUrl) {
        toast.success('Redirecting to Paymob payment gateway...');
        window.location.href = redirectUrl;
      } else {
        toast.error('Could not retrieve payment link. Please try again.');
      }
    } catch (err) {
      console.error('Failed to pay for order:', err);
      toast.error('Failed to initiate payment. Please contact support.');
    } finally {
      setPayingOrderId(null);
    }
  };

  // Filter and sort logic
  const filteredOrders = orders
    .filter((order) => {
      // 1. Search term match (Order ID or product name)
      const matchesSearch =
        order.orderId.toString().includes(searchTerm) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // 2. Status filter match
      const matchesStatus =
        statusFilter === 'All' ||
        order.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'price-desc') {
        return b.totalPrice - a.totalPrice;
      } else if (sortBy === 'price-asc') {
        return a.totalPrice - b.totalPrice;
      }
      return 0;
    });

  if (!isAuthenticated) {
    return (
      <main className="orders-page">
        <div className="orders-container">
          <div className="orders-login-needed">
            <div className="orders-login-icon-wrap">
              <Lock size={44} />
            </div>
            <h2>Authentication Required</h2>
            <p>Please sign in to your account to view and manage your order history.</p>
            <Link to="/login" className="order-action-btn primary text-decoration-none">
              Sign In to Account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-container">
        {/* Breadcrumb & Header */}
        <div className="orders-header">
          <div className="orders-breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <span>My Orders</span>
          </div>
          <h1 className="orders-title">
            My Orders
            {orders.length > 0 && (
              <span className="orders-count-badge">{orders.length}</span>
            )}
          </h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="orders-loader-container">
            <div className="orders-spinner" />
            <p className="font-semibold text-slate-600">Retrieving your orders...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="orders-empty-state">
            <div className="orders-empty-icon-wrap text-red-500 bg-red-50">
              <AlertCircle size={44} />
            </div>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button onClick={fetchOrders} className="order-action-btn primary">
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </button>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {orders.length === 0 ? (
              <div className="orders-empty-state">
                <div className="orders-empty-icon-wrap">
                  <Package size={44} />
                </div>
                <h2>No Orders Yet</h2>
                <p>It looks like you haven't placed any orders with us yet. Explore our top categories and find your perfect products!</p>
                <Link to="/category" className="order-action-btn primary text-decoration-none">
                  Browse Products
                </Link>
              </div>
            ) : (
              <>
                {/* Search, Filter & Sort Controls */}
                <div className="orders-controls-bar">
                  <div className="orders-search-wrapper">
                    <Search className="orders-search-icon" size={18} />
                    <input
                      type="text"
                      className="orders-search-input"
                      placeholder="Search by Order ID or Product Name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="orders-right-filters">
                    <div className="orders-status-tabs">
                      {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`orders-tab-btn ${statusFilter === status ? 'active' : ''}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>

                    <select
                      className="orders-sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price-desc">Total: High to Low</option>
                      <option value="price-asc">Total: Low to High</option>
                    </select>
                  </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                  <div className="orders-empty-state">
                    <div className="orders-empty-icon-wrap">
                      <Search size={44} />
                    </div>
                    <h2>No Matching Orders</h2>
                    <p>We couldn't find any orders matching your search query or selected status filter.</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('All');
                      }}
                      className="order-action-btn primary"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {filteredOrders.map((order) => {
                      const isExpanded = expandedOrders.has(order.orderId);
                      const statusClass = order.status.toLowerCase();

                      return (
                        <div key={order.orderId} className="order-card">
                          {/* Order Header / Accordion Trigger */}
                          <div
                            className="order-card-header"
                            onClick={() => toggleExpand(order.orderId)}
                          >
                            <div className="order-id-block">
                              <span className="order-id-label">Order</span>
                              <span className="order-id-val">#ORD-{order.orderId}</span>
                            </div>

                            <div className="order-meta-block">
                              <div className="order-meta-item">
                                <span className="order-meta-label">Date Placed</span>
                                <span className="order-meta-val">{formatDate(order.createdAt)}</span>
                              </div>
                              <div className="order-meta-item">
                                <span className="order-meta-label">Total Amount</span>
                                <span className="order-meta-val order-price-val">
                                  {formatPrice(order.totalPrice)}
                                </span>
                              </div>
                            </div>

                            <div>
                              <span className={`order-status-badge ${statusClass}`}>
                                {order.status}
                              </span>
                            </div>

                            <button
                              className={`order-toggle-btn ${isExpanded ? 'expanded' : ''}`}
                              aria-label="Toggle Details"
                            >
                              <ChevronDown size={18} />
                            </button>
                          </div>

                          {/* Collapsible Order Details */}
                          {isExpanded && (
                            <div className="order-card-body">
                              {/* Order Shipping/Tracking Stepper */}
                              {statusClass !== 'cancelled' ? (
                                <div className="order-tracking-section">
                                  <h4 className="order-tracking-title">Delivery Status</h4>
                                  <div className="order-stepper">
                                    <div className={`stepper-step ${getStepStatus(order.status, 'pending')}`}>
                                      <div className="stepper-icon-wrap">
                                        <Calendar size={15} />
                                      </div>
                                      <span className="stepper-label">Order Placed</span>
                                    </div>

                                    <div className={`stepper-step ${getStepStatus(order.status, 'processing')}`}>
                                      <div className="stepper-icon-wrap">
                                        <Box size={15} />
                                      </div>
                                      <span className="stepper-label">Processing</span>
                                    </div>

                                    <div className={`stepper-step ${getStepStatus(order.status, 'shipped')}`}>
                                      <div className="stepper-icon-wrap">
                                        <Truck size={15} />
                                      </div>
                                      <span className="stepper-label">Shipped</span>
                                    </div>

                                    <div className={`stepper-step ${getStepStatus(order.status, 'delivered')}`}>
                                      <div className="stepper-icon-wrap">
                                        <CheckCircle2 size={15} />
                                      </div>
                                      <span className="stepper-label">Delivered</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-4 mb-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl flex items-center gap-3">
                                  <AlertCircle size={20} className="shrink-0" />
                                  <div>
                                    <h4 className="font-bold text-xs uppercase tracking-wider">Order Cancelled</h4>
                                    <p className="text-sm mt-0.5">This order has been cancelled and is no longer being processed.</p>
                                  </div>
                                </div>
                              )}

                              {/* Items list */}
                              <div className="order-items-section">
                                <h4 className="order-section-title">Items Ordered</h4>
                                <div className="order-items-list">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="order-item-row">
                                      <div className="order-item-name">{item.productName}</div>
                                      <div className="order-item-price">
                                        Unit Price: {formatPrice(item.price)}
                                      </div>
                                      <div className="order-item-qty">
                                        Qty: {item.quantity}
                                      </div>
                                      <div className="order-item-total">
                                        Subtotal: {formatPrice(item.totalPrice)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Actions / Receipt Info */}
                              <div className="order-card-footer">
                                <span className="order-footer-note">
                                  Payment Method: Credit Card / Debit Card (Standard checkout)
                                </span>
                                <div className="order-action-btns">
                                  {order.status.toLowerCase() === 'pending' && (
                                    <button
                                      onClick={() => handlePayNow(order.orderId)}
                                      disabled={payingOrderId === order.orderId}
                                      className="order-action-btn primary"
                                    >
                                      <CreditCard size={16} />
                                      {payingOrderId === order.orderId ? 'Processing...' : 'Pay Now'}
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleInvoiceDownload(order.orderId)}
                                    className="order-action-btn"
                                  >
                                    <FileText size={16} />
                                    Invoice
                                  </button>
                                  <button
                                    onClick={() => handleContactSupport(order.orderId)}
                                    className="order-action-btn"
                                  >
                                    <HelpCircle size={16} />
                                    Support
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
