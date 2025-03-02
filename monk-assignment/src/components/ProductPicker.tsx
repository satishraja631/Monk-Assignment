
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Search from "./Search";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { toggleProductSelection, toggleVariantSelection, fetchProducts } from "../redux/productsSlice";
import _ from "lodash";

interface ProductPickerProps {
  onSelect: (selectedProducts: any[]) => void;
  onClose: () => void;
}

const ProductPicker: React.FC<ProductPickerProps> = ({ onSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();
  const { products, page, hasMore, loading } = useAppSelector((state) => state.products);
  const listRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (products.length === 0 && page === 1) {
      dispatch(fetchProducts({ page, searchQuery }));
    }
  }, [dispatch, products.length, page, searchQuery]);

  const handleScroll = useCallback(
    _.throttle(() => {
      if (!listRef.current || loading || !hasMore || isFetchingRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollHeight - (scrollTop + clientHeight) < 100) {
        isFetchingRef.current = true;
        dispatch(fetchProducts({ page: page + 1, searchQuery })).finally(() => {
          isFetchingRef.current = false;
        });
      }
    }, 1000),
    [dispatch, loading, hasMore, page, searchQuery]
  );

  useEffect(() => {
    const container = listRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleSelection = () => {
    const selectedProducts = products.filter((product) => product.selected);
    onSelect(selectedProducts);
  };
  const selectedProductCount = useMemo(() => {
  return products.filter((product) => product.selected).length;
}, [products]);
  return (
    <div className="container mx-auto bg-white shadow-md text-black h-[650px] rounded-sm relative">
      <div className="flex flex-row justify-between px-8 py-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold">Select Products</h1>
        <button onClick={onClose} className="text-gray-500 hover:text-black">✖</button>
      </div>

      <Search setSearchQuery={setSearchQuery} />

      {loading && products.length === 0 && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
        </div>
      )}

      <div ref={listRef} className="mt-4 max-h-[400px] overflow-y-auto px-4">
        {filteredProducts.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-4">No products found</p>
        )}

        <table className="w-full border-collapse">
  <tbody>
    {filteredProducts.map((product) => (
      <React.Fragment key={product.id}>
        
        <tr className="border-b border-gray-300 ">
          <td className="px-4 p-2 flex flex-row gap-4 items-center">
            <input
              type="checkbox"
              checked={product.selected || false}
              onChange={() => dispatch(toggleProductSelection(product.id))}
              className="accent-green-600"
            />
            <img src={product.image.src} alt={product.title} className="w-7 h-7 rounded" />
            <h1>{product.title}</h1>
          </td>
          
          
          
        </tr>

        {/*  Variants Row */}
        {product.variants.map((variant) => (
          <tr key={variant.id} className="border-b border-gray-200">
            
            <td className="p-2 flex flex-row justify-between">
              <div className="flex flex-row gap-6 ml-10">
              <input
                type="checkbox"
                checked={variant.selected || false}
                className="accent-green-600"
                onChange={() =>
                  dispatch(toggleVariantSelection({ productId: product.id, variantId: variant.id }))
                  
                }
              />
              <p>{variant.title}</p>
              </div>
              <p>${variant.price}</p>
            </td>

            
          </tr>
        ))}
      </React.Fragment>
    ))}
  </tbody>
</table>


        {loading && products.length > 0 && (
          <div className="text-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500 mx-auto"></div>
            <p>Loading more products...</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 flex items-center gap-4 justify-between">
        <p className="text-md">{selectedProductCount} product selected</p>
        <div className="flex gap-4">
        <button
          onClick={handleSelection}
          className="bg-white text-black border-1 border-black px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSelection}
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 cursor-pointer"
        >
          Add
        </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;


