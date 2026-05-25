
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { ShoppingBag, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useCart } from '@/hooks/useCart.js';
import pb from '@/lib/pocketbaseClient';

const UserDashboard = () => {
  const { currentUser, updateProfile } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    city: currentUser?.city || '',
    postalCode: currentUser?.postalCode || ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await pb.collection('orders').getFullList({
        filter: `userId = "${currentUser.id}"`,
        sort: '-createdAt',
        $autoCancel: false
      });
      setOrders(data);
    } catch (error) {
      console.error('Error al cargar los pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await updateProfile(profileData);
      toast.success('¡Perfil actualizado con éxito!');
    } catch (error) {
      toast.error('Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
    } finally {
      setUpdating(false);
    }
  };

  const handleReorder = (order) => {
    order.items.forEach(item => {
      addToCart({ id: item.productId, name: item.name, price: item.price }, item.quantity);
    });
    toast.success('¡Artículos agregados al carrito!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-accent text-accent-foreground';
      case 'shipped':
        return 'bg-primary/20 text-primary';
      case 'processing':
        return 'bg-secondary text-secondary-foreground';
      case 'cancelled':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTranslatedStatus = (status) => {
    switch (status) {
      case 'delivered': return 'Entregado';
      case 'shipped': return 'Enviado';
      case 'processing': return 'Procesando';
      case 'cancelled': return 'Cancelado';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  return (
    <ProtectedRoute>
      <Helmet>
        <title>Mi Panel de Control - Valookie</title>
        <meta name="description" content="Gestiona tu cuenta Valookie, revisa tus pedidos y actualiza tu perfil." />
      </Helmet>

      <Header />

      <main className="py-12 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance" style={{letterSpacing: '-0.02em'}}>
              Mi panel de control
            </h1>
            <p className="text-lg text-muted-foreground">
              ¡Bienvenido de nuevo, {currentUser?.name || 'Amante de las cookies'}!
            </p>
          </div>

          <Tabs defaultValue="orders" className="space-y-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="orders">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Pedidos
              </TabsTrigger>
              <TabsTrigger value="profile">
                <UserIcon className="w-4 h-4 mr-2" />
                Perfil
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-6">
              <div className="bg-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Historial de pedidos</h2>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-muted rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Aún no tienes pedidos</h3>
                    <p className="text-muted-foreground mb-6">¡Comienza a comprar para ver tus pedidos aquí!</p>
                    <Button
                      onClick={() => window.location.href = '/shop'}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Explorar Productos
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID del Pedido</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Artículos</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                            <TableCell>
                              {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </TableCell>
                            <TableCell>{order.items?.length || 0} artículos</TableCell>
                            <TableCell className="font-bold text-primary">€{order.total?.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status)}>
                                {getTranslatedStatus(order.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReorder(order)}
                              >
                                Reordenar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <div className="bg-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Información del perfil</h2>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="bg-white text-gray-900 placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="bg-white text-gray-900 placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="bg-white text-gray-900 placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        className="bg-white text-gray-900 placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        value={profileData.city}
                        onChange={handleProfileChange}
                        className="bg-white text-gray-900 placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="postalCode">Código Postal</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        value={profileData.postalCode}
                        onChange={handleProfileChange}
                        className="bg-white text-gray-900 placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={updating}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {updating ? 'Actualizando...' : 'Actualizar Perfil'}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </ProtectedRoute>
  );
};

export default UserDashboard;
