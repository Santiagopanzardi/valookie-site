import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const CATEGORY_OPTIONS = [
  'Cookie',
  'Cookie Vegana',
  'Sin Gluten',
  'Medialuna & Chipas',
  'Otros Dulces',
];

export function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loadingProduct, setLoadingProduct] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      ingredients: '',
      allergens: '',
      stock: 0,
      inStock: true,
      isFeatured: false,
      isPopular: false,
      isBestSeller: false,
      isGlutenFree: false,
      isVegan: false,
    },
  });

  const inStock = watch('inStock');
  const isFeatured = watch('isFeatured');
  const isPopular = watch('isPopular');
  const isBestSeller = watch('isBestSeller');
  const isGlutenFree = watch('isGlutenFree');
  const isVegan = watch('isVegan');

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const product = await pb.collection('products').getOne(id);
      reset({
        name: product.name || '',
        description: product.description || '',
        price: product.price ?? '',
        originalPrice: product.originalPrice ?? '',
        ingredients: product.ingredients || '',
        allergens: product.allergens || '',
        stock: product.stock ?? 0,
        inStock: !!product.inStock,
        isFeatured: !!product.isFeatured,
        isPopular: !!product.isPopular,
        isBestSeller: !!product.isBestSeller,
        isGlutenFree: !!product.isGlutenFree,
        isVegan: !!product.isVegan,
      });
      setSelectedCategories(product.categories || []);
      if (product.image) {
        setCurrentImage(pb.files.getUrl(product, product.image));
      }
    } catch (error) {
      console.error('Error al cargar producto:', error);
      toast.error('Error al cargar el producto');
      navigate('/admin/products');
    } finally {
      setLoadingProduct(false);
    }
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('price', Number(data.price));
      if (data.originalPrice) {
        formData.append('originalPrice', Number(data.originalPrice));
      }
      formData.append('ingredients', data.ingredients || '');
      formData.append('allergens', data.allergens || '');
      formData.append('stock', Number(data.stock) || 0);
      formData.append('inStock', data.inStock);
      formData.append('isFeatured', data.isFeatured);
      formData.append('isPopular', data.isPopular);
      formData.append('isBestSeller', data.isBestSeller);
      formData.append('isGlutenFree', data.isGlutenFree);
      formData.append('isVegan', data.isVegan);

      // Multi-select: append each category separately for PocketBase
      selectedCategories.forEach((cat) => {
        formData.append('categories', cat);
      });

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (isEditing) {
        await pb.collection('products').update(id, formData);
        toast.success('Producto actualizado');
      } else {
        await pb.collection('products').create(formData);
        toast.success('Producto creado');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error al guardar producto:', error);
      toast.error('Error al guardar el producto');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Editar producto' : 'Nuevo producto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic info */}
        <Card>
          <CardHeader>
            <CardTitle>Informacion basica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                {...register('name', { required: 'El nombre es obligatorio' })}
                placeholder="Nombre del producto"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripcion</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Descripcion del producto"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price', { required: 'El precio es obligatorio' })}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">Precio original</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('originalPrice')}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORY_OPTIONS.map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${cat}`}
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                  />
                  <Label htmlFor={`cat-${cat}`} className="cursor-pointer">
                    {cat}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ingredients & Allergens */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredientes y alergenos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredientes</Label>
              <Textarea
                id="ingredients"
                {...register('ingredients')}
                placeholder="Lista de ingredientes"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergens">Alergenos</Label>
              <Textarea
                id="allergens"
                {...register('allergens')}
                placeholder="Alergenos (gluten, lactosa, frutos secos...)"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stock & flags */}
        <Card>
          <CardHeader>
            <CardTitle>Stock y opciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                {...register('stock')}
                className="max-w-[200px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="inStock" className="cursor-pointer">En stock</Label>
                <Switch
                  id="inStock"
                  checked={inStock}
                  onCheckedChange={(val) => setValue('inStock', val)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="isFeatured" className="cursor-pointer">Destacado</Label>
                <Switch
                  id="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={(val) => setValue('isFeatured', val)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="isPopular" className="cursor-pointer">Popular</Label>
                <Switch
                  id="isPopular"
                  checked={isPopular}
                  onCheckedChange={(val) => setValue('isPopular', val)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="isBestSeller" className="cursor-pointer">Mas vendido</Label>
                <Switch
                  id="isBestSeller"
                  checked={isBestSeller}
                  onCheckedChange={(val) => setValue('isBestSeller', val)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="isGlutenFree" className="cursor-pointer">Sin gluten</Label>
                <Switch
                  id="isGlutenFree"
                  checked={isGlutenFree}
                  onCheckedChange={(val) => setValue('isGlutenFree', val)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="isVegan" className="cursor-pointer">Vegano</Label>
                <Switch
                  id="isVegan"
                  checked={isVegan}
                  onCheckedChange={(val) => setValue('isVegan', val)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image */}
        <Card>
          <CardHeader>
            <CardTitle>Imagen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentImage && !selectedFile && (
              <div className="space-y-2">
                <Label>Imagen actual</Label>
                <img
                  src={currentImage}
                  alt="Producto"
                  className="w-32 h-32 rounded-lg object-cover border"
                />
              </div>
            )}

            {selectedFile && (
              <div className="space-y-2">
                <Label>Nueva imagen</Label>
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-32 h-32 rounded-lg object-cover border"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="image">
                {isEditing ? 'Cambiar imagen' : 'Subir imagen'}
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedFile(file);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditing ? 'Guardar cambios' : 'Crear producto'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
