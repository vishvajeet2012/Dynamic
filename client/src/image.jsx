import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  Alert,
  Paper,
  Grid,
  TextField
} from '@mui/material';

const CategoryUpdateForm = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async () => {
    if (!categoryName || !categoryImage || !categoryDescription) {
      setMessage({ severity: 'error', text: 'All fields are required' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        subCategoryName: categoryName,
        subCategoryImage: categoryImage,
        subCategoryDescription: categoryDescription,
      };

      const response = await axios.post('http://localhost:4004/home/getallcategory', payload);

      setMessage({ severity: 'success', text: response.data.message || 'Category updated successfully' });

      setCategoryName('');
      setCategoryImage('');
      setCategoryDescription('');
    } catch (error) {
      console.error('Update error:', error);
      setMessage({
        severity: 'error',
        text: error.response?.data?.message || 'Failed to update category'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Update Category
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Category Name"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Category Image URL or String"
            fullWidth
            value={categoryImage}
            onChange={(e) => setCategoryImage(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Category Description"
            fullWidth
            multiline
            minRows={3}
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Updating...' : 'Update Category'}
          </Button>
        </Grid>

        {message && (
          <Grid item xs={12}>
            <Alert severity={message.severity}>
              {message.text}
            </Alert>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default CategoryUpdateForm;
