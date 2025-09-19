import React, { useState, useEffect  } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../component/ProductCard';
import Select from 'react-select';

const products = [
  { id: 1, name: 'کفش اسپرت مردانه', price: '850,000', image: '/images/shoes.jpg', category: 'کفش' ,discountPercent:10,sizes: [ { size: "40", stock: 5 },{ size: "41", stock: 0 },{ size: "42", stock: 3 },{ size: "43", stock: 3 }],colors: ['black', 'white', 'gray']},
  { id: 2, name: 'کتونی نایک', price: '1,200,000', image: '/images/nike.jpg', category: 'کفش' ,discountPercent:0,sizes: [ { size: "40", stock: 5 },{ size: "41", stock: 0 },{ size: "42", stock: 3 },{ size: "43", stock: 3 }],colors: ['blue', 'white']},
  { id: 3, name: 'پیراهن مردانه', price: '430,000', image: '/images/shirt.jpg', category: 'لباس' ,discountPercent:0, sizes: [ { size: "S", stock: 5 },{ size: "M", stock: 0 },{ size: "L", stock: 3 }], colors: ['white','black']},
  { id: 4, name: 'کیف چرمی زنانه', price: '670,000', image: '/images/bag.jpg', category: 'کیف' ,discountPercent:20 , colors:['white','black','blue']}
];

const categories = ['همه', 'کفش', 'لباس', 'کیف'];

const brand = { hex: "#1C1F33", rgb: "28,31,51" };

const customStylesCategory = {
  control: (base, state) => ({
    ...base,
    direction: "ltr",                 // ✅ فلش راست
    textAlign: "center",
    backgroundColor: "#FAF3E0",
    borderColor: state.isFocused ? "#001f3f" : "#ccc",
    boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(0, 31, 63, 0.25)" : null,
    "&:hover": { borderColor: "#001f3f" },
  }),
  valueContainer: (base) => ({
    ...base,
    direction: "rtl",                 // ✅ متن RTL
    justifyContent: "center",
    paddingRight: "2.25rem",
    paddingLeft:  "2.25rem",
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: "block",
    alignSelf: "center",
    height: "60%",
    backgroundColor: "rgba(0,31,63,.25)",
    marginInline: ".25rem",
  }),
  singleValue: (base) => ({ ...base, textAlign: "center", color: "#001f3f", width:"100%" }),
  placeholder: (base) => ({ ...base, textAlign: "center", width:"100%" }),
  option: (base, state) => ({
    ...base,
    textAlign: "center",
    backgroundColor: state.isFocused ? "#f0e3c4" : "#FAF3E0",
    color: "#001f3f",
    "&:active": { backgroundColor: "#f5e3b3" },
  }),
  menu: (base) => ({
    ...base,
    direction: "rtl",
    textAlign: "center",
    backgroundColor: "#FAF3E0",
    border: "1px solid #001f3f",
    zIndex: 9999,
    left: "50%",
    transform: "translateX(-50%)",
    width: "max-content",
    minWidth: "100%",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};






const Home = () => {
    
    const [searchParams] = useSearchParams();
    const categoryFromUrl = searchParams.get('category') || 'همه';

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

    const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'همه' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
    });
    
    const categoryOptions = categories.map((cat) => ({ value: cat, label: cat }));

    useEffect(() => {
        setSelectedCategory(categoryFromUrl);
        }, [categoryFromUrl]);
  

  return (
    <div className="container mt-5" style={{ maxWidth: '1200px' }}>
      
      <div className="row mb-4">
        <div className="col-12 col-md-8 mb-2">
          <input
            type="text"
            style={{backgroundColor: "#FAF3E0"}}
            className="form-control text-center"
            placeholder="... جستجو بر اساس نام محصول"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-4">
          
            <Select
              classNamePrefix="rs"
              isSearchable={false}
              options={categoryOptions}
              value={categoryOptions.find(o => o.value === selectedCategory)}
              onChange={(opt) => setSelectedCategory(opt?.value ?? "همه")}
              menuPortalTarget={typeof window !== "undefined" ? document.body : null}
              menuPosition="fixed"
              styles={customStylesCategory}
            />
        </div>

      </div>

      
      <div className= "row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="text-center text-muted">محصولی یافت نشد</div>
        )}
      </div>
    </div>
  );
};

export default Home;
