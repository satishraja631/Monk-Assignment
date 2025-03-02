


import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addEmptyProduct,
  replaceProduct,
  removeProduct,
  reorderProducts, 
} from "../redux/productListSlice";
import ProductListItem from "./ProductListItem";
import ProductPicker from "./ProductPicker";



const ProductList = () => {
  const dispatch = useAppDispatch();
  const selectedProducts = useAppSelector((state) => state.productList.selectedProducts);
  const [pickerIndex, setPickerIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  

  // Open Product Picker
  const openProductPicker = (index: number) => setPickerIndex(index);

  // Replace product with selected ones
  const handleReplaceProduct = (selectedProducts: any[]) => {
    if (pickerIndex !== null) {
      dispatch(replaceProduct({ index: pickerIndex, products: selectedProducts }));
      setPickerIndex(null);
    }
  };

  // Drag start event
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  // Drag over event (needed to allow dropping)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Drop event (handle reordering)
  const handleDrop = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      dispatch(reorderProducts({ fromIndex: draggedIndex, toIndex: index }));
    }
    setDraggedIndex(null);
  };

  return (
    <div className={`space-y-4 p-4 ${pickerIndex !== null ? "bg-gray-100" : ""} py-16`}>
      <h2 className="flex text-xl font-semibold mb-4  px-58">Add Products</h2>
       <span className="flex gap-6 px-64 justify-between font-semibold"><p className="px-16">Product</p><p>Discount</p></span>
      <div className="space-y-4">
        
        {selectedProducts.map((product, index) => (
        
          <div
            key={product.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            className="p-4 rounded-lg flex justify-between items-center  cursor-move"

          >  
            
            
            <ProductListItem product={product} index={index} onReplace={openProductPicker} onRemove={() => dispatch(removeProduct(product.id))} />
            
          
            
          </div>
          
        ))}
        
      </div>

      {/* Add Empty Product Button */}
      <button
        onClick={() => dispatch(addEmptyProduct())}
        className="text-green-600 px-4 py-2 rounded border-1 border-green-600 ml-140 text-md  w-[170px]"
      >
        Add Product
      </button>

      {/* Product Picker Modal */}
      {pickerIndex !== null && (
        <div className="mt-4 flex justify-center">
          <div className=" mt-4   w-[600px] h-[700px]">
            <ProductPicker onSelect={handleReplaceProduct} onClose={() => setPickerIndex(null)}  />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;

