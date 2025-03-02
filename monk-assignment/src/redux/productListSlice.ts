import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

// Define Interfaces
type DiscountType = "flat" | "percentage";

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
  isEmpty?: boolean; 
  discount?: { type: DiscountType; value: number }; 
}

// Define Product List State
interface ProductListState {
  selectedProducts: Product[];
}

// Initial State
const initialState: ProductListState = {
  selectedProducts: [
    {
      id: Date.now(), 
      title: "Select Product",
      variants: [],
      image: { id: null, product_id: null, src: "" },
      isEmpty: true,
    },
  ],
};

// Fetch selected products from `productsSlice`
export const fetchSelectedProducts = createAsyncThunk(
  "productList/fetchSelectedProducts",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const selectedProducts = state.products.products.filter((product) => product.selected);

    // Ensure at least one empty product if no selected products
    if (selectedProducts.length === 0) {
      return [
        {
          id: Date.now(),
          title: "Select Product",
          variants: [],
          image: { id: null, product_id: null, src: "" },
          isEmpty: true,
        },
      ];
    }

    return selectedProducts;
  }
);

const productListSlice = createSlice({
  name: "productList",
  initialState,
  reducers: {
   
    addEmptyProduct: (state) => {
      state.selectedProducts.push({
        id: Date.now(), 
        title: "Select Product",
        variants: [],
        image: { id: null, product_id: null, src: "" },
        isEmpty: true,
      });
    },

    // Replace any product (empty or existing) with selected products from Product Picker
    replaceProduct: (state, action: PayloadAction<{ index: number; products: Product[] }>) => {
      const { index, products } = action.payload;
      if (state.selectedProducts[index]) {
        const filteredProducts = products.map((product) => ({
        ...product,
        variants: product.variants.filter((variant) => variant.selected), // ✅ Block deselected variants
        }));
        state.selectedProducts.splice(index, 1, ...filteredProducts);
      }
    },

    // Remove a product (ensuring at least one empty product remains)
    removeProduct: (state, action: PayloadAction<number>) => {
      state.selectedProducts = state.selectedProducts.filter((product) => product.id !== action.payload);

      // Ensure at least one empty product remains
      if (state.selectedProducts.length === 0) {
        state.selectedProducts.push({
          id: Date.now(),
          title: "Empty Product",
          variants: [],
          image: { id: null, product_id: null, src: "" },
          isEmpty: true,
        });
      }
    },
    reorderProducts: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedProduct] = state.selectedProducts.splice(fromIndex, 1);
      state.selectedProducts.splice(toIndex, 0, movedProduct);
    },

    // Reorder variants within a product
    reorderVariants: (state, action: PayloadAction<{ productId: number; fromIndex: number; toIndex: number }>) => {
      const { productId, fromIndex, toIndex } = action.payload;
      const product = state.selectedProducts.find((p) => p.id === productId);
      if (product) {
        const [movedVariant] = product.variants.splice(fromIndex, 1);
        product.variants.splice(toIndex, 0, movedVariant);
      }
    },

    // Apply Discount to a Product
    applyDiscount: (state, action: PayloadAction<{ productId: number; type: DiscountType; value: number }>) => {
      const product = state.selectedProducts.find((p) => p.id === action.payload.productId);
      if (product) {
        product.discount = {
          type: action.payload.type,
          value: action.payload.value,
        };
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchSelectedProducts.fulfilled, (state, action) => {
      state.selectedProducts = action.payload;
    });
  },
});


export const { addEmptyProduct, replaceProduct, removeProduct, applyDiscount,reorderProducts,reorderVariants } = productListSlice.actions;


export default productListSlice.reducer;
