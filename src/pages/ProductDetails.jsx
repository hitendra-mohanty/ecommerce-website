import React from 'react';
import { useState,useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';   
import { getProductById } from '../data/products';
import NotFoundPage from './NotFoundPage';

export default function ProductDetails() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch product details using the id from params
        const foundProduct = getProductById(id); // Assume this function fetches product details by ID

        // If product not found, navigate back to home 
        if(!foundProduct){
            navigate("*");
            return;
        }
        setProduct(foundProduct); // Set the product details in state
    },[id,navigate]); // Re-run effect if id or navigate changes

    if(!product){
        return <div>Loading...</div>; // Show loading state while fetching product details
    }

    return (
        <div className='page'> 
            <div className='container'>
                <div className='product-detail'>
                    <div className='product-details-image'>
                        <img src={product?.image} alt={product?.name} />
                    </div>
                    <div className='product-detail-content'>
                        <h1 className='product-detail-name'>{product?.name}</h1>
                        <p className='product-detail-price'>${product?.price.toFixed(2)}</p>
                        <p className='product-detail-description'>{product?.description}</p>
                        <button className='btn btn-primary'>Add To Cart</button>
                    </div>
                </div>
            </div>
        </div>
    )
}   