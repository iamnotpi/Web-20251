import './ProductCard.scss';

const ProductCard = ({ product, onView, onEdit, onDelete }) => {
  const handleView = () => onView?.(product.id);
  const handleEdit = () => onEdit?.(product);
  const handleDelete = () => onDelete?.(product.id);

  return (
    <article className="product-card">
      <div className="product-card__image">
        <img src={product.images?.[0]} alt={product.name} loading="lazy" />
      </div>

      <div className="product-card__body">
        <div className="product-card__header">
          <h3 className="product-card__title">{product.name}</h3>
          <span className="product-card__price">${product.price.toFixed(2)}</span>
        </div>

        <p className="product-card__description">{product.description}</p>

        <div className="product-card__meta">
          <span className="product-card__rating" aria-label={`Rating ${product.rating} stars`}>
            ⭐ {product.rating.toFixed(1)}
          </span>
          <span className="product-card__stock">{product.stock} in stock</span>
        </div>

        <div className="product-card__tags">
          {product.tags?.map((tag) => (
            <span className="product-card__tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="product-card__actions">
        <button className="btn btn-outline-primary" type="button" onClick={handleView}>
          View
        </button>
        <button className="btn btn-outline-secondary" type="button" onClick={handleEdit}>
          Edit
        </button>
        <button className="btn btn-outline-danger" type="button" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </article>
  );
};

export default ProductCard;

