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
  Button,
  Card,
  Grid
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

      {/* <form onSubmit={handleAddProduct} style={{ marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Add New Product
        </Typography>

        <input type="text" name="title" placeholder="Title" value={newProduct.title} onChange={handleInputChange} required />
        <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleInputChange} required />
        <input type="text" name="category" placeholder="Category" value={newProduct.category} onChange={handleInputChange} required />
        <input type="text" name="image" placeholder="Image URL" value={newProduct.image} onChange={handleInputChange} />
        <button type="submit">Add Product</button>
      </form> */}

      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add New Product
        </Typography>

        <form onSubmit={handleAddProduct}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Title" name="title" value={newProduct.title} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Category" name="category" value={newProduct.category} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField fullWidth label="Image URL" name="image" value={newProduct.image} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Add Product
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>

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
      <Dialog open={!!editProduct} onClose={() => setEditProduct(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent dividers>
          {editProduct && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={editProduct.title}
                  onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Category"
                  value={editProduct.category}
                  onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProduct(null)} color="secondary">
            Cancel
          </Button>
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
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Products;
