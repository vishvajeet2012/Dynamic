import { useEffect, useState } from "react"
import { useGetAllOrder, useupdateOrderStatus } from "../../../hooks/userOrder"
import { 
  Package, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CreditCard, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  Filter,
  Search,
  Edit,
  Save,
  X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered']

export default function AdminOrder() {
  const { getallorder, loading, error, data } = useGetAllOrder()
  const { updateOrderStatus, loading: statusLoading, error: statusError, data: statusData } = useupdateOrderStatus()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [editingOrder, setEditingOrder] = useState(null)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    getallorder()
  }, [])

  // Refetch orders when status is updated successfully
  useEffect(() => {
    if (statusData && !statusError) {
      getallorder()
      setEditingOrder(null)
      setNewStatus("")
    }
  }, [statusData, statusError])

  const orders = data?.orders || []

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'processing':
        return <Package className="w-4 h-4 text-blue-500" />
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order?.user?.firstName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      order?.user?.lastName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      order?.user?.email?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      order?._id?.toLowerCase()?.includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase()
    
    return matchesSearch && matchesStatus
  })

  const handleEditStatus = (orderId, currentStatus) => {
    setEditingOrder(orderId)
    setNewStatus(currentStatus)
  }

  const handleCancelEdit = () => {
    setEditingOrder(null)
    setNewStatus("")
  }

  const handleUpdateStatus = async (orderId) => {
    if (!newStatus || newStatus === orders.find(o => o._id === orderId)?.status) {
      handleCancelEdit()
      return
    }
    
    try {
      await updateOrderStatus(orderId, newStatus)
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    // You can implement a modal or navigate to detailed view here
    console.log('View order details:', order)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <XCircle className="w-5 h-5" />
              <span>Error loading orders: {error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {orders.length} Total Orders
        </Badge>
      </div>

      {/* Status Error Display */}
      {statusError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2 text-red-700">
              <XCircle className="w-5 h-5" />
              <span>Error updating status: {statusError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by customer name, email, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Grid */}
      <div className="grid gap-6">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">No orders match your current filters.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order._id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center space-x-3">
                    <Package className="w-6 h-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">Order #{order._id.slice(-8)}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusIcon(order.status)}
                        {editingOrder === order._id ? (
                          <div className="flex items-center space-x-2">
                            <Select value={newStatus} onValueChange={setNewStatus}>
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ORDER_STATUSES.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(order._id)}
                              disabled={statusLoading}
                              className="h-8 px-2"
                            >
                              {statusLoading ? (
                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancelEdit}
                              className="h-8 px-2"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditStatus(order._id, order.status)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(order.totalPrice)}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(order.placedAt)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Customer Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Customer Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{order.user.firstName} {order.user.lastName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{order.user.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{order.shippingInfo.phoneNo}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Shipping Address
                    </h4>
                    <div className="text-sm text-gray-600">
                      <p>{order.shippingInfo.fullAddress}</p>
                      <p>{order.shippingInfo.city}, {order.shippingInfo.state}</p>
                      <p>{order.shippingInfo.country} - {order.shippingInfo.pincode}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <Package className="w-4 h-4 mr-2" />
                    Order Items ({order.orderItems.length})
                  </h4>
                  <div className="grid gap-2">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            {item?.image ? (
                              <img 
                                className="w-full h-full object-cover rounded-lg" 
                                src={item.image} 
                                alt={item.name || 'Product'} 
                              />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.name || 'Product Name'}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(item.price || 0)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment & Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">
                        {order.paymentMethod.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium">
                        Total: {formatCurrency(order.totalPrice)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    {editingOrder !== order._id && (
                      <Button 
                        size="sm"
                        onClick={() => handleEditStatus(order._id, order.status)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Update Status
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}