import React, { useState, useEffect  } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../component/ProductCard';

const products = [
  { id: 1, name: 'کفش اسپرت مردانه', price: '850,000', image: '/images/shoes.jpg', category: 'کفش' ,discountPercent:10,sizes: [ { size: "40", stock: 5 },{ size: "41", stock: 0 },{ size: "42", stock: 3 },{ size: "43", stock: 3 }],colors: ['black', 'white', 'gray']},
  { id: 2, name: 'کتونی نایک', price: '1,200,000', image: '/images/nike.jpg', category: 'کفش' ,discountPercent:0,sizes: [ { size: "40", stock: 5 },{ size: "41", stock: 0 },{ size: "42", stock: 3 },{ size: "43", stock: 3 }],colors: ['blue', 'white']},
  { id: 3, name: 'پیراهن مردانه', price: '430,000', image: '/images/shirt.jpg', category: 'لباس' ,discountPercent:0, sizes: [ { size: "S", stock: 5 },{ size: "M", stock: 0 },{ size: "L", stock: 3 }], colors: ['white','black']},
  { id: 4, name: 'کیف چرمی زنانه', price: '670,000', image: '/images/bag.jpg', category: 'کیف' ,discountPercent:20 , colors:['white','black','blue']}
];

const categories = ['همه', 'کفش', 'لباس', 'کیف'];

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


    useEffect(() => {
        setSelectedCategory(categoryFromUrl);
        }, [categoryFromUrl]);
  

  return (
    <div className="container mt-5" style={{ maxWidth: '1200px' }}>
      
      <div className="row mb-4">
        <div className="col-12 col-md-8 mb-2">
          <input
            type="text"
            className="form-control text-center"
            placeholder="... جستجو بر اساس نام محصول"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-4">
          <select
            className="form-select formClass"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      
      <div className="row">
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
