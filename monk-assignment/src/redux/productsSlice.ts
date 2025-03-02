
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const API_URL = "https://stageapi.monkcommerce.app/task/products/search";
const API_KEY = import.meta.env.VITE_PRODUCTS_API_KEY;
const LIMIT = 10; // Number of products per request

// ** Define Interfaces **
interface Variant {
  id: number;
  product_id: number;
  title: string;
  price: number;
  selected?: boolean;
}

interface Product {
  id: number;
  title: string;
  variants: Variant[];
  image: { id: number | null; product_id: number | null; src: string };
  selected?: boolean;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  searchQuery: string;
}

// ** Initial State **
const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  searchQuery: "",
};

// ** Fetch Products (Supports Search & Pagination) **
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  
  async ({ page, searchQuery }: { page: number; searchQuery: string }, { rejectWithValue }) => {
    
    try {
      const response = await fetch(`${API_URL}?search=${searchQuery}&page=${page}&limit=${LIMIT}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      return { products: Array.isArray(data) ? data : [], page, searchQuery };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
  }
);

// ** Products Slice **
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    
    toggleProductSelection: (state, action: PayloadAction<number>) => {
  const product = state.products.find((p) => p.id === action.payload);
  if (product) {
    product.selected = !product.selected;

    //  If product is selected, select all variants
    //  If product is deselected, deselect all variants
    product.variants.forEach((variant) => {
      variant.selected = product.selected;
    });
  }
},

toggleVariantSelection: (state, action: PayloadAction<{ productId: number; variantId: number }>) => {
  const product = state.products.find((p) => p.id === action.payload.productId);
  if (product) {
    const variant = product.variants.find((v) => v.id === action.payload.variantId);
    if (variant) {
      variant.selected = !variant.selected;
    }

    // Product checkbox remains selected even if only one variant is selected.
    product.selected = product.variants.some((v) => v.selected);
    
  }
},


    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.products = []; // Reset product list on new search
      state.page = 1; // Reset pagination
      state.hasMore = true; // Allow fetching more results
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.searchQuery !== state.searchQuery) return; // Prevent race conditions

        if (action.payload.page === 1) {
          state.products = action.payload.products; // Replace products on new search
        } else {
          state.products = [...state.products, ...action.payload.products]; // Append more products
        }

        state.hasMore = action.payload.products.length === LIMIT;
        state.page += 1;
      })
      
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { toggleProductSelection, toggleVariantSelection, setSearchQuery } = productsSlice.actions;
export default productsSlice.reducer;

