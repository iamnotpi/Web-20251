import { useEffect, useMemo, useState } from 'react';
import './ProductForm.scss';
import { productCategories } from '../../../data/mockProducts';

const defaultValues = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  rating: 0,
  category: 'Audio',
  tags: '',
  imageUrl: '',
};

const ProductForm = ({ initialValues, onSubmit, onCancel }) => {
  const [formValues, setFormValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...defaultValues,
        ...initialValues,
        tags: initialValues.tags?.join(', ') ?? '',
        imageUrl: initialValues.images?.[0] ?? '',
      });
    } else {
      setFormValues(defaultValues);
    }
  }, [initialValues]);

  const categories = useMemo(() => {
    const unique = new Set([...productCategories, initialValues?.category].filter(Boolean));
    return Array.from(unique);
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'price' ? value.replace(/[^\d.]/g, '') : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formValues.name.trim()) newErrors.name = 'Product name is required.';
    if (!formValues.description.trim()) newErrors.description = 'Description is required.';

    const price = parseFloat(formValues.price);
    if (Number.isNaN(price) || price <= 0) newErrors.price = 'Enter a valid price greater than 0.';

    const stock = Number.parseInt(formValues.stock, 10);
    if (Number.isNaN(stock) || stock < 0) newErrors.stock = 'Enter a non-negative stock number.';

    const rating = Number.parseFloat(formValues.rating);
    if (rating < 0 || rating > 5) newErrors.rating = 'Rating must be between 0 and 5.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formValues.name.trim(),
      description: formValues.description.trim(),
      price: Number.parseFloat(formValues.price),
      stock: Number.parseInt(formValues.stock, 10),
      rating: Number.parseFloat(formValues.rating) || 0,
      category: formValues.category,
      tags: formValues.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      images: formValues.imageUrl ? [formValues.imageUrl] : [],
    };

    onSubmit?.(payload);
  };

  return (
    <div className="product-form-overlay">
      <div className="product-form-card">
        <header className="product-form-card__header">
          <h2>{initialValues ? 'Edit Product' : 'Add Product'}</h2>
          <button className="btn-close" type="button" onClick={onCancel} aria-label="Close form" />
        </header>

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="product-form__grid">
            <label className="product-form__field">
              <span>Name</span>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                required
              />
              {errors.name && <small className="product-form__error">{errors.name}</small>}
            </label>

            <label className="product-form__field product-form__field--full">
              <span>Description</span>
              <textarea
                name="description"
                rows={4}
                value={formValues.description}
                onChange={handleChange}
              />
              {errors.description && (
                <small className="product-form__error">{errors.description}</small>
              )}
            </label>

            <label className="product-form__field">
              <span>Price (USD)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={formValues.price}
                onChange={handleChange}
              />
              {errors.price && <small className="product-form__error">{errors.price}</small>}
            </label>

            <label className="product-form__field">
              <span>Stock</span>
              <input
                type="number"
                min="0"
                name="stock"
                value={formValues.stock}
                onChange={handleChange}
              />
              {errors.stock && <small className="product-form__error">{errors.stock}</small>}
            </label>

            <label className="product-form__field">
              <span>Rating (0-5)</span>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                name="rating"
                value={formValues.rating}
                onChange={handleChange}
              />
              {errors.rating && <small className="product-form__error">{errors.rating}</small>}
            </label>

            <label className="product-form__field">
              <span>Category</span>
              <select name="category" value={formValues.category} onChange={handleChange}>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="product-form__field product-form__field--full">
              <span>Tags (comma separated)</span>
              <input name="tags" value={formValues.tags} onChange={handleChange} />
            </label>

            <label className="product-form__field product-form__field--full">
              <span>Image URL</span>
              <input name="imageUrl" value={formValues.imageUrl} onChange={handleChange} />
            </label>
          </div>

          <footer className="product-form__footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialValues ? 'Save Changes' : 'Create Product'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;

