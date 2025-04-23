import React, { useEffect, useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Products = () => {
  const [products, setProducts] = useState([]);

  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    category: '',
    image: ''
  });

  const [editProduct, setEditProduct] = useState(null); // product being edited

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Failed to fetch products', err));
  }, []);

  const handleDelete = (id) => {
    // (Optional: Add DELETE request to API later)
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    fetch('https://fakestoreapi.com/products', {
      method: 'POST',
      body: JSON.stringify(newProduct),
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts([data, ...products]); // show at top
        setNewProduct({ title: '', price: '', category: '', image: '' }); // reset form
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      <form onSubmit={handleAddProduct} style={{ marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Add New Product
        </Typography>

        <input type="text" name="title" placeholder="Title" value={newProduct.title} onChange={handleInputChange} required />
        <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleInputChange} required />
        <input type="text" name="category" placeholder="Category" value={newProduct.category} onChange={handleInputChange} required />
        <input type="text" name="image" placeholder="Image URL" value={newProduct.image} onChange={handleInputChange} />
        <button type="submit">Add Product</button>
      </form>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price ($)</TableCell>
              <TableCell align="right">Actions</TableCell> {/* 👈 new column */}
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell align="right">{product.price}</TableCell>
                <TableCell align="right">
                  {/* ✏️ Edit Button */}
                  <IconButton color="primary" onClick={() => setEditProduct(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={!!editProduct} onClose={() => setEditProduct(null)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {editProduct && (
            <>
              <TextField
                margin="dense"
                label="Title"
                fullWidth
                value={editProduct.title}
                onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Price"
                type="number"
                fullWidth
                value={editProduct.price}
                onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Category"
                fullWidth
                value={editProduct.category}
                onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProduct(null)}>Cancel</Button>
          <Button
            onClick={() => {
              fetch(`https://fakestoreapi.com/products/${editProduct.id}`, {
                method: 'PUT',
                body: JSON.stringify(editProduct),
                headers: { 'Content-Type': 'application/json' }
              })
                .then((res) => res.json())
                .then((updated) => {
                  setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
                  setEditProduct(null);
                });
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Products;
