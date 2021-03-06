import React, { useState, useEffect } from 'react';
import { Image, CloudinaryContext, Transformation } from 'cloudinary-react';
import axiosWithAuth from '../../../utils/axiosWithAuth';
import editingProduct from '../../../styles/scss/vendor/editingProduct.module.scss';
// import modal from '../../../styles/scss/browseModal.module.scss';
import { EditProductForm, ProductImageUploader } from '../../index';
// import { Modal } from '../../index';
const EditProduct = (props) => {
  const { setReloadProducts, reloadProducts, showEditProduct } = props;
  const [images, setImages] = useState([]);
  const [product, setProduct] = useState({ diet: [''] });
  // POPUP Bools
  const [editingDetails, setEditingDetails] = useState(false); // change back to false
  const [detailsSaved, setDetailsSaved] = useState(false);
  const [allChangesSaved, setAllChangesSaved] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [imageDeleted, setImageDeleted] = useState(false);
  const [productDeleted, setProductDeleted] = useState(false);
  // Bool to reload images after POST or DELETE request passed to ProductImageUploader
  const [reloadingImages, setReloadingImages] = useState(false);



  useEffect(() => {
    //console.log('USEEFFECT 4 EditProducts.js GET /products/:prodcutId')
    // loading images popup on (off in next useEffect)
    // setLoadingImages(true);
    // get product (details)
    axiosWithAuth()
      /* ${props.product_id} */
      .get(`/products/${props.product_id}`)
      .then((response) => {
        console.log('RESPONSE');
        // console.log(response);
        setProduct(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }); // removed , [] dependency

  useEffect(
    () => {
      // get all images of same product in previous request.
      //console.log('USEEFFECT 5 EditProducts.js GET /products/:prodcutId/product-images')
      axiosWithAuth()
        /* ${props.product_id} */
        .get(`/products/${props.product_id}/product-images`)
        .then((response) => {
          setImages(response.data.data);
          // loading popup off
          setLoadingImages(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  ); // removed ,  [reloadingImages] dependency

  const delHover = (imgId, span, inOut) => {
    if (inOut === 'in') {
      document.getElementById(imgId).style.border = "solid red 3px";
      document.getElementById(span).style.display = 'block';
      document.getElementById(imgId).style.transition = "border .3s";

    }
    if (inOut === 'out') {
      document.getElementById(imgId).style.border = "none";
      document.getElementById(span).style.display = 'none';
    }
  }

  const finishedEditing = () => {
    setAllChangesSaved(true);
    setReloadProducts(!reloadProducts);
    submitProductDetails();
    setTimeout(function () {
      setAllChangesSaved(false);
      props.setEditingProd(false);
    }, 2000);
  };

  const submitProductDetails = () => {
    const vendorId = localStorage.getItem('user_id');
    setDetailsSaved(true);
    setTimeout(function () {
      setDetailsSaved(false);
    }, 1500);

    console.log('PUT subitProd.Details payload: ', { ...product });

    axiosWithAuth()
      .put(`/products/${product._id}`, { ...product, vendorId })
      .then((res) => {
        console.log('PUT res EditProduct.js submitProd.Details: res ', res);
      })
      .catch((err) => {
        console.log('PUT error & product_id & token:::', err, product._id, localStorage.getItem('token'));
      });
  };

  const leaveWithoutSave = () => {
    setConfirmClose(false);
    props.setEditingProd(false);
  };

  const saveAllAndClose = () => {
    const vendorId = localStorage.getItem('user_id');
    setConfirmClose(false);
    setAllChangesSaved(true);
    setReloadProducts(!reloadProducts);
    submitProductDetails();
    setTimeout(function () {
      setAllChangesSaved(false);
      props.setEditingProd(false);
    }, 2000);

    console.log('PUT Edit.P saveAllAndClose payload: ', { ...product });

    axiosWithAuth()
      .put(`/products/${product._id}`, { ...product, vendorId })
      .then((res) => {
        console.log('PUT res EditProduct.js submitProd.Details: res ', res);
      })
      .catch((err) => {
        console.log('PUT error & product_id & token:::', err, product._id, localStorage.getItem('token'));
      });
  };

  const deleteImage = (image_id) => {
    console.log('EditProduct.js delteImage image_id', image_id);

    const vendorId = { vendorId: product.vendor._id };
    console.log('EditProduct.js delteImage vendorId = ', vendorId);
    console.log('EditProduct.js delteImage  product.vendor._id: ', product.vendor._id);
    axiosWithAuth()
      .delete(`/product-images/${image_id}`, { data: vendorId })
      .then((res) => {
        console.log('DELETE deleteImage EditProduct.js: ', res);
        setReloadingImages(!reloadingImages);
        setImageDeleted(true);
        setTimeout(function () {
          setImageDeleted(false);
        }, 2000);
      })
      .catch((err) => {
        console.log('deleteImage ', err.message);
      });
  };

  const deleteProduct = () => {
    const vendorId = { vendorId: product.vendor._id };
    axiosWithAuth()
      .delete(`/products/${props.product_id}`, { data: vendorId })
      .then((response) => {
        console.log('DELETE EditProduct.js deleteProduct :', response);
        setReloadProducts(!reloadProducts);
        setProductDeleted(true);

        setTimeout(function () {
          setProductDeleted(false);
          props.setEditingProd(false);
        }, 2000);
      })
      .catch((err) => {
        console.log('Error DELETE EditProduct.js deleteProduct', err);
      });
  };

  return (

    <div className={`${editingProduct.container}`}>
      <div className={editingProduct.inner_wrapper}>
        <i onClick={() => setConfirmClose(true)} className={`fa fa-times ${editingProduct.close_x}`} />
        <div className={editingProduct.top_content}>

          {/* ========= Whole-Modal-POPUPS =========== */}
          {allChangesSaved && ( // big save button
            <div className={editingProduct.all_saved_popup}>
              <h3>
                {' '}
                <i className="fa fa-check" />&nbsp;All your changes to "<span>{product.name}</span>" have been
      						saved!{' '}
              </h3>
            </div>
          )}
          {confirmDelete && ( // ask vendor if okay to delete -- sames styles as confirm_close_popup
            <div className={editingProduct.confirm_close_popup}>
              <div className={editingProduct.confirm_close_popup_info}>
                <h3>
                  {' '}
                  <i className="fa fa-exclamation" />&nbsp;Are you sure you want to delete "<span>{product.name}</span>"?
      						</h3>
                <button onClick={deleteProduct} className="btn btn-danger">
                  Delete Product
      						</button>
                <button onClick={() => setConfirmDelete(false)} className="btn btn-primary">
                  Back to Editing
      						</button>
              </div>
            </div>
          )}
          {productDeleted && ( // confirmation product was deleted
            <div className={editingProduct.all_saved_popup}>
              <h3>
                <i className="fa fa-check" />&nbsp;Product "<span>{product.name}</span>" has been deleted!{' '}
              </h3>
            </div>
          )}
          {confirmClose && ( // asks to close the window from close x click
            <div className={editingProduct.confirm_close_popup}>
              <div className={editingProduct.confirm_close_popup_info}>
                <h3>
                  {' '}
                  <i className="fa fa-exclamation" />&nbsp;Are you sure you want to close? Make sure your
      							changes to "<span>{product.name}</span>" have been saved!{' '}
                </h3>
                <button onClick={leaveWithoutSave} className={editingProduct.discard_changes_btn}>
                  Discard Changes
      						</button>
                <button onClick={() => setConfirmClose(false)} className={editingProduct.continue_editing_btn}>
                  Continue Editing
      						</button>
                <button onClick={saveAllAndClose} className={editingProduct.save_and_close_btn}>
                  Save and Close
      						</button>
              </div>
            </div>
          )}

          {/* ============= LEFT ============================ */}
          <div className={`${editingProduct.edit_product_left} ${editingProduct.inner_container}`}>
            <div className={editingProduct.left_upper_container}>
              <div className={editingProduct.add_image_btns}>
                <ProductImageUploader
                  productId={product._id}
                  setReloadingImages={setReloadingImages}
                  reloadingImages={reloadingImages}
                />
              </div>
              {/* Image deleted POPUP */}
              {imageDeleted ? ( // <<<<<< TURNARY
                <h1>
                  <i className="fa fa-check" /> Image Deleted!
      						</h1>
              ) : ( //<<<<<<<< : else: 
                  <div className={editingProduct.images_container}>
                    {loadingImages ? ( // <<<<<< TURNARY
                      <h1>...Loading Images</h1>
                    ) : ( //<<<<<<<< : else:
                        images.map((image, index) => (
                          <div id={image.public_id} key={image._id} className={`${editingProduct.image_wrapper}`}>

                            {images && <i
                              onMouseEnter={() => delHover(image.public_id, index, 'in')}
                              onMouseLeave={() => delHover(image.public_id, index, 'out')}
                              onClick={() => deleteImage(image._id)} className="fa fa-minus-circle" />}
                            <span id={index} className={editingProduct.delete_span} >DELETE</span>
                            <CloudinaryContext cloudName="quickstlabs">
                              <Image publicId={image.public_id}>
                                <Transformation width="150" height="150" crop="fill" />
                              </Image>
                            </CloudinaryContext>
                          </div>
                        ))
                      )}
                  </div>
                )}{' '}
              {/* closing turnary bracket */}
            </div>


          </div>
          {/* END LEFT */}
          {/* ============= RIGHT ============================ */}

          <div className={`${editingProduct.edit_product_right} ${editingProduct.inner_container}`}>
            <div onClick={() => {
              setEditingDetails(!editingDetails)

            }}>
              {/* ==== details saved POPUP  ======*/}
              {detailsSaved && (
                <div className={editingProduct.details_saved_popup}>
                  <h3>
                    <i className="fa fa-check" /> Product Details Saved!
      						</h3>
                </div>
              )}
              <h4 className={editingProduct.edit_details_btn} >
                <i className="fa fa-edit" />Edit Details
      						</h4>
            </div>


            {editingDetails ? ( // <<<<< TURNARY
              <EditProductForm product={product} reloadProducts={reloadProducts} setReloadProducts={setReloadProducts} setProduct={setProduct} submitProductDetails={submitProductDetails} setEditingDetails={setEditingDetails} showEditProduct={showEditProduct} />
            ) : ( // : else do this:
                <div className={editingProduct.details_container}>
                  <div className={editingProduct.details_wrapper}>
                    <div className={editingProduct.input_wrapper}>
                      <label htmlFor="">Product Name: </label>
                      <h1>{product.name}</h1>
                    </div>

                    <div className={editingProduct.input_wrapper}>
                      <label htmlFor="">Product Description: </label>
                      <p>{product.description}</p>
                    </div>

                    <div className={editingProduct.input_wrapper}>
                      <label htmlFor="diet">Dietary Category(ies): </label>
                      <div className={editingProduct.diet_category_container}>
                        {product && product.diet.map((category) => <p>{category} &nbsp;</p>)}
                      </div>
                    </div>
                    <div className={editingProduct.input_wrapper}>
                      <label htmlFor="">Price: </label>
                      <p>
                        ${product.price}/{product.unit}
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>{/* END TOP_CONTENT */}
        <div className={editingProduct.btn_container}>
          <button onClick={finishedEditing} className={editingProduct.finished_editing_btn}>
            <i className="fa fa-check" /> Finished Editing
    					</button>
          <button onClick={() => setConfirmDelete(true)} className={editingProduct.delete_product_btn}>
            <i className="fa fa-exclamation-triangle" /> Delete Product
    					</button>
        </div>

      </div>
    </div>



  );
};

export default EditProduct;