import { fireEvent, render, screen } from '@testing-library/react';
import ProductCard from './ProductCard';

jest.mock('./ProductCard.scss', () => ({}));

const product = {
  id: 'prod-card',
  name: 'Aurora Wireless Headphones',
  description: 'Comfortable over-ear headphones with active noise cancellation.',
  price: 149.99,
  stock: 120,
  rating: 4.5,
  tags: ['wireless', 'noise-cancelling'],
  images: ['https://example.com/image.jpg'],
};

describe('<ProductCard />', () => {
  it('renders product content', () => {
    render(<ProductCard product={product} />);

    expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument();
    expect(screen.getByAltText(product.name)).toHaveAttribute('src', product.images[0]);
    expect(screen.getByText(`$${product.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(product.description)).toBeInTheDocument();
    expect(screen.getByText(/120 in stock/i)).toBeInTheDocument();
    expect(screen.getByText(/⭐ 4.5/)).toBeInTheDocument();
    expect(screen.getByText('wireless')).toBeInTheDocument();
    expect(screen.getByText('noise-cancelling')).toBeInTheDocument();
  });

  it('calls action callbacks when buttons are clicked', () => {
    const onView = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(<ProductCard product={product} onView={onView} onEdit={onEdit} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole('button', { name: /view/i }));
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(onView).toHaveBeenCalledWith(product.id);
    expect(onEdit).toHaveBeenCalledWith(product);
    expect(onDelete).toHaveBeenCalledWith(product.id);
  });
});

