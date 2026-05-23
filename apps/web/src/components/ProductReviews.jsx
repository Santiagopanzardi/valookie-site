
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Star, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';

const ProductReviews = ({ productId }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const data = await pb.collection('reviews').getFullList({
        filter: `productId = "${productId}"`,
        sort: '-createdAt',
        $autoCancel: false
      });
      setReviews(data);
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Por favor, inicia sesión para dejar una reseña.');
      return;
    }

    setSubmitting(true);
    try {
      await pb.collection('reviews').create({
        productId,
        userId: currentUser.id,
        rating,
        reviewText
      }, { $autoCancel: false });

      toast.success('¡Reseña enviada con éxito!');
      setShowForm(false);
      setRating(5);
      setReviewText('');
      fetchReviews();
    } catch (error) {
      toast.error('Error al enviar la reseña. Por favor, inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'fill-primary text-primary' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse w-48"></div>
        <div className="h-24 bg-muted rounded animate-pulse"></div>
        <div className="h-24 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-secondary/30 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Calificación de Google Maps</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex">{renderStars(Math.round(averageRating))}</div>
          <span className="text-2xl font-bold text-primary">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-muted-foreground">
            ({reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Reseñas de Clientes</h3>
        {isAuthenticated && !showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Escribir una Reseña
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 space-y-4">
          <div>
            <Label>Calificación</Label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-all duration-200"
                >
                  <Star
                    className={`w-8 h-8 ${star <= rating ? 'fill-primary text-primary' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="reviewText">Tu Reseña</Label>
            <Textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Comparte tu opinión sobre este producto..."
              rows={4}
              className="bg-white text-gray-900 placeholder:text-gray-500"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitting ? 'Enviando...' : 'Enviar Reseña'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl">
            <p className="text-muted-foreground">Aún no hay reseñas. ¡Sé el primero en reseñar este producto!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-card rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(review.rating)}</div>
                  <span className="font-medium">{review.rating}.0</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {review.reviewText && (
                <p className="text-foreground leading-relaxed">{review.reviewText}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
