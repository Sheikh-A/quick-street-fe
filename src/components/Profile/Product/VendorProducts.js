import React, { useState, useEffect } from 'react';
import { Product, EditProduct } from '../../index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

// styling
import profile from '../../../styles/scss/profile.module.scss';
import axiosWithAuth from '../../../utils/axiosWithAuth';

const VendorProducts = ({ vendorId }) => {
	const [products, setProducts] = useState([]);
	const [reloadProducts, setReloadProducts] = useState(false);
	// Opens EditingProduct MODAL    
	const [editingProd, setEditingProd] = useState(false);// change back to false
	// Passed to EditingProdcut MODAL            // change back to ""
	const [editingProdId, setEditingProdId] = useState("");


	// GET Vendor's products
	useEffect(() => {
		//console.log('USEEFFECT 2 Profile.js');
		axiosWithAuth()
			.get(`/vendors/${vendorId}/products`)
			.then(response => {
				console.log('GET Profile.js /vendors/:vendorId/products response', response);
				setProducts(response.data.data);
			})
			.catch(error => {
				console.log('ERROR Profile.js GET fetchProducts() vendors/:vendorId/products error: ', error)
			})


	}, [vendorId, reloadProducts, setReloadProducts])

	//console.log('VendorProducts.js products: ', products);

	const showEditProduct = (prodId) => {
		setEditingProdId(prodId);
		setEditingProd(true);
		console.log(`VenorProducts.js showEditingProduct prodId: `, prodId);
	};

	const createNewProduct = () => {
		axiosWithAuth()
			.post(`/vendors/${vendorId}/products`, {
				name: "Give your product a name!",
				price: 0
			})
			.then(response => {
				console.log('POST NEW PRODUCT VendorProduct.js createNewProduct() res:', response)
				//POST new product, then proceed directly to editing mode with the id. I this way we can reuse the EditingProductForm as is. 
				setEditingProdId(response.data.data._id);
				setEditingProd(true);
				setReloadProducts(!reloadProducts)
			})
			.catch(error => {
				console.log('VendorProduct.js createNewProduct() error', error)
			})
	}

	return (
		<div className={profile.products_container}>
			<div className={profile.products_wrapper}>
				{editingProd && <EditProduct
					setEditingProd={setEditingProd}
					product_id={editingProdId}
					reloadProducts={reloadProducts}
					setReloadProducts={setReloadProducts}
				/>}
				<header className={profile.vendor_product_list_title}>Products</header>

				<div className={profile.vendor_product_list_wrapper}>
					<button className="add_product_btn" onClick={createNewProduct}>
						<FontAwesomeIcon icon={faPlus} />
						Add product <br />
					</button>
					{products ? (
						products.map((p, idx) => (
							<div

								onClick={() => {
									showEditProduct(p._id);
								}}
								className="product-wrapper"
							>
								<Product
									key={idx}
									name={p.name}
									productId={p._id}
									price={p.price}
									img={p.imageId ? p.imageId : p.image_Id}
									setReloadProducts={setReloadProducts}
									reloadProducts={reloadProducts}
								/>
							</div>
						))
					) : (
							<p>you don't have any product yet</p>
						)}
				</div>
			</div>
		</div>
	);
};

export default VendorProducts;
