
import { useState } from "react";
import { useDispatch } from "react-redux";
import {  removeProduct ,reorderVariants,} from "../redux/productListSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faGripVertical, faPencil } from "@fortawesome/free-solid-svg-icons";

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
  discount?: { type: "flat" | "percentage"; value: number };
}

interface ProductListItemProps {
  product: Product;
  index: number;
  onReplace: (index: number) => void;
  onRemove: () => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product, index, onReplace }) => {
  const dispatch = useDispatch();
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<"flat" | "percentage">("flat");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [showVariants, setShowVariants] = useState(false);
  const [draggedVariantIndex, setDraggedVariantIndex] = useState<number | null>(null);

  

  const handleDrop=(variantIndex: number) => {
            if (draggedVariantIndex !== null && draggedVariantIndex !== variantIndex) {
              dispatch(
                reorderVariants({
                  productId: product.id,
                  fromIndex: draggedVariantIndex,
                  toIndex: variantIndex,
                })
              );
            }
            setDraggedVariantIndex(null);
          }


  
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-row gap-6  ">
        {/* Product Title and Replace Button */}
        <span className="flex flex-row items-center gap-2"><FontAwesomeIcon icon={faGripVertical} style={{color: "#b3b6bc",}} />{index+1}. </span>
        <div className="flex items-center gap-4 w-[500px] p-2 border border-white rounded-lg shadow-md justify-between">
          <h3 className="text-gray-500">{product.title}</h3>
          <button onClick={() => onReplace(index)} className="text-gray-500 hover:text-gray-700">
            <FontAwesomeIcon icon={faPencil} />
          </button>
        </div>

        {/* Discount Section */}
        <div className="flex items-center gap-4">
          {/* If no discount is applied, show discount input fields */}
          {!product.discount ? (
            showDiscount ? (
              <div className="flex gap-4 w-[150px]">
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as "flat" | "percentage")}
                  className="border border-white p-1 w-[70px] rounded shadow-md"
                >
                  <option value="flat">Flat</option>
                  <option value="percentage">%Off</option>
                </select>

                <input
                  type="text"
                  min="0"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="border border-white p-1 w-[70px] rounded shadow-md"
                />

                
              </div>
            ) : (
              <button
                onClick={() => setShowDiscount(true)}
                className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-900 w-[150px]"
              >
                Apply Discount
              </button>
            )
          ) : (
            <div className="flex gap-4">
              <input
                type="number"
                value={product.discount.value}
                disabled
                className="border p-1 w-20 rounded"
              />
              <select
                value={product.discount.type}
                disabled
                className="border p-1 rounded w-20"
              >
                <option value="flat">Flat</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>
          )}
        </div>
        {/* Remove Product Button */}
      {!product.isEmpty && (
        <button
          onClick={() => dispatch(removeProduct(product.id))}
          className="text-gray-400 hover:text-gray-700"
        >
          X
        </button>
      )}
      
      </div>
      {/* Show/Hide Variants Button */}
      {product.variants.length > 1 && (
        <button
          onClick={() => setShowVariants((prev) => !prev)}
          className="text-blue-900 px-3 py-1 rounded w-[150px] relative ml-150 cursor-pointer"
        >
          {showVariants ? "Hide Variants" : "Show Variants"}
          <FontAwesomeIcon icon={showVariants ? faAngleUp : faAngleDown} className="mr-2" />
        </button>
      )}

      

      {/* Show variants */}
      {showVariants && product.variants.length > 0 && (
        <div className="mt-4">
         
          <ul className="list-disc pl-5">
            {product.variants.map((variant,variantIndex) => (
              <div 
              draggable
          onDragStart={() => setDraggedVariantIndex(variantIndex)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={()=>handleDrop(variantIndex)}
              className="flex flex-row gap-4 mb-4 px-8 ">
        
        <span className="flex flex-row items-center gap-1"><FontAwesomeIcon icon={faGripVertical} style={{color: "#b3b6bc",}} /> </span>
        <div className="flex items-center gap-4 w-[500px] bg-white p-2 border border-white rounded-xl shadow-md ">
          <h3 className="font-semibold">{variant.title}</h3>
          
        </div>

        
        <div className="flex items-center gap-4">
         
          {!product.discount ? (
            showDiscount ? (
              <div className="flex gap-4 w-[150px]">
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as "flat" | "percentage")}
                  className="border border-white p-1 w-[70px] rounded shadow-md"
                >
                  <option value="flat">Flat</option>
                  <option value="percentage">%Off</option>
                </select>

                <input
                  type="text"
                  min="0"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="border border-white p-1 w-[70px] rounded shadow-md"
                />

                
              </div>
            ) : (
              <button
                onClick={() => setShowDiscount(true)}
                className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-900 w-[150px]"
              >
                Apply Discount
              </button>
            )
          ) : (
            <div className="flex gap-4 w-[150px]">
              <input
                type="text"
                value={product.discount.value}
                disabled
                className="border border-white p-1 w-[70px] rounded shadow-md"
              />
              <select
                value={product.discount.type}
                disabled
                className="border border-white p-1 rounded w-[70px] shadow-md"
              >
                <option value="flat">Flat</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>
          )}
        </div>
        {/* Remove Product Button */}
      {!product.isEmpty && (
        <button
          onClick={() => dispatch(removeProduct(product.id))}
          className="text-gray-400 hover:text-gray-700"
        >
          X
        </button>   
      )}
      </div>
            ))}
          </ul>
        </div>
      )}

      
    </div>
  );
};

export default ProductListItem;



