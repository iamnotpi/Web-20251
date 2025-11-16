import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import './ProductDetail.scss';
import ProductForm from '../../components/product/ProductForm/ProductForm';
import {
  clearSelectedProduct,
  deleteProduct,
  fetchProductById,
  selectSelectedProduct,
  selectSelectedProductError,
  selectSelectedProductStatus,
  updateProduct,
} from '../../store/slices/productSlice';

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const product = useSelector(selectSelectedProduct);
  const status = useSelector(selectSelectedProductStatus);
  const error = useSelector(selectSelectedProductError);

  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    dispatch(fetchProductById(productId));
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, productId]);

  const handleEdit = () => {
    setFormError(null);
    setIsEditing(true);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this product? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await dispatch(deleteProduct(productId)).unwrap();
      navigate('/products');
    } catch (deleteError) {
      setFormError(deleteError.message || 'Unable to delete product.');
    }
  };

  const handleUpdate = async (updates) => {
    try {
      await dispatch(updateProduct({ productId, updates })).unwrap();
      setIsEditing(false);
      setFormError(null);
    } catch (updateError) {
      setFormError(updateError.message || 'Unable to update product.');
    }
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setFormError(null);
  };

  if (status === 'loading') {
    return <main className="product-detail container">Loading product details...</main>;
  }

  if (error) {
    return (
      <main className="product-detail container product-detail--error">
        <h1>Unable to load product</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-detail container product-detail--error">
        <h1>Product not found</h1>
        <p>The requested product does not exist or has been removed.</p>
      </main>
    );
  }

  return (
    <main className="product-detail container">
      <div className="product-detail__breadcrumbs">
        <button type="button" onClick={() => navigate('/products')} className="btn btn-link">
          ← Back to products
        </button>
      </div>

      <section className="product-detail__content">
        <div className="product-detail__gallery">
          <img src={product.images?.[0]} alt={product.name} />
        </div>

        <div className="product-detail__info">
          <header>
            <h1>{product.name}</h1>
            <p className="product-detail__description">{product.description}</p>
          </header>

          <div className="product-detail__stats">
            <div>
              <span className="product-detail__stat-label">Price</span>
              <span className="product-detail__stat-value">${product.price.toFixed(2)}</span>
            </div>
            <div>
              <span className="product-detail__stat-label">Rating</span>
              <span className="product-detail__stat-value">⭐ {product.rating.toFixed(1)}</span>
            </div>
            <div>
              <span className="product-detail__stat-label">Stock</span>
              <span className="product-detail__stat-value">{product.stock} units</span>
            </div>
          </div>

          <div className="product-detail__meta">
            <span className="product-detail__pill">{product.category}</span>
            {product.tags?.map((tag) => (
              <span className="product-detail__tag" key={tag}>
                #{tag}
              </span>
            ))}
          </div>

          <div className="product-detail__actions">
            <button type="button" className="btn btn-outline-secondary" onClick={handleEdit}>
              Edit
            </button>
            <button type="button" className="btn btn-outline-danger" onClick={handleDelete}>
              Delete
            </button>
            <button type="button" className="btn btn-primary" disabled>
              Add to cart (coming soon)
            </button>
          </div>

          {formError && (
            <div className="product-detail__status product-detail__status--error">{formError}</div>
          )}
        </div>
      </section>

      {isEditing && (
        <ProductForm initialValues={product} onSubmit={handleUpdate} onCancel={handleCloseForm} />
      )}
    </main>
  );
};

export default ProductDetail;

