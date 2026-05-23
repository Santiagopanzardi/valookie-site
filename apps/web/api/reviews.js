export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const PLACE_ID = 'ChIJAymizii1pBIRxGpQ-Lj_r4k';
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=rating,userRatingCount,reviews`,
      {
        headers: {
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
        },
      }
    );

    const data = await response.json();

    const reviews = (data.reviews || []).map((r) => ({
      name: r.authorAttribution?.displayName || 'Cliente',
      photo: r.authorAttribution?.photoUri || null,
      rating: r.rating,
      text: r.originalText?.text || r.text?.text || '',
      date: r.publishTime,
      url: r.googleMapsUri,
    }));

    res.status(200).json({
      rating: data.rating,
      totalReviews: data.userRatingCount,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
}
