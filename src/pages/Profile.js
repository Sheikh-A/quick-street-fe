import React, { useState, useEffect } from 'react';
import {
	About,
	VendorProducts,
	Bulletin,
	BannerUploader,
	Nav
} from '../components/index';
import { Placeholder } from '../assets/images/index';
//Styles
import profile from '../styles/scss/profile.module.scss';
//Font awesom
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faPen } from '@fortawesome/free-solid-svg-icons';
import { Image, CloudinaryContext, Transformation } from 'cloudinary-react';
import axiosWithAuth from '../utils/axiosWithAuth';

const Profile = props => {
	// It all starts here!...with vendorId from localStorage
	const vendorId = localStorage.getItem('user_id');
	const [vendorInfo, setVendorInfo] = useState({
		location: {
			zipcode: "18641"
		}
	});
	const [bannerInfo, setBannerInfo] = useState('no_banner.jpg');

	const [productImagesIds, setProductImagesIds] = useState([]);

	// Booleans 

	const [editingName, setEditingName] = useState(false);
	// bool for reloading products after product update. 

	const [editAbout, setEditAbout] = useState(false);
	const [editBusinessName, setEditBusinessName] = useState(false);
	//console.log('Profile.js vendorInfo: ', vendorInfo);



	useEffect(() => {
		//console.log('USEEFFECT 1 Profile.js');
		axiosWithAuth()
			.get(
				`/vendors/${vendorId}`
			)
			.then(response => {
				setVendorInfo(response.data.data);
				/* setBannerInfo(vendorInfo.data.data.vendor_banner); */
				console.log('GET useEffect Profile.js setVendorInfo(response)', response);

			})
			.catch(error => {
				console.log('ERROR Profile.js GET vendors/:vendorId error: ', error)
			})

	}, [vendorId]);


	const editName = () => {
		setEditBusinessName(!editBusinessName);
	};

	const saveName = e => {
		e.preventDefault();
		axiosWithAuth()
			.put(
				`https://quickstlabs.herokuapp.com/api/v1.0/vendors/${vendorId}`,
				vendorInfo
			)
			.then(res => {
				// console.log(`update vendor info`, res);
				setVendorInfo(res.data.data);
			})
			.catch(err => {
				console.log('ERROR PUT SAVE NAME', err);
			});
	};

	const editProfile = () => {
		// console.log(`edit profile clicked`);
		setEditAbout(!editAbout);
	};

	const saveProfile = (e) => {
		if (e) {
			e.preventDefault();
		}

		//console.log('SAVE PROFILE vendorInfo', vendorInfo);
		axiosWithAuth()
			.put(
				`https://quickstlabs.herokuapp.com/api/v1.0/vendors/${vendorId}`,
				vendorInfo
			)
			.then(res => {
				console.log(`update vendor info`, res);
				setVendorInfo(res.data.data);
			})
			.catch(err => {
				console.log('VendorProf. PUT error ', err);
			});
	};

	return (
		<div className={profile.banner_container}>
			<Nav {...vendorInfo} />
			<div className={profile.banner_wrapper}>
				<div className={profile.banner_text_btns}>
					<div className={profile.vendor_header_name}>
						<input
							onChange={e => {
								if (editBusinessName) {
									setVendorInfo({
										...vendorInfo,
										business_name: e.target.value
									});
								}
							}}
							value={vendorInfo.business_name}
							className={editingName ? profile.glowing_border : 'none'}
						/>
					</div>

					<div className={profile.vendor_profile_btn_group}>
						<FontAwesomeIcon
							id={profile.pen}
							className={`${profile.icon} " " ${
								editingName ? profile.red_edit : profile.normal_pen
								}`}
							icon={faPen}
							onClick={() => {
								editName();
								setEditingName(!editingName);
							}}
						/>
						<FontAwesomeIcon
							id={profile.save}
							className={profile.icon}
							icon={faSave}
							onClick={e => {
								saveName(e);
								setEditingName(false);
							}}
						/>

						{/* <img src={create} alt='create' onClick={editProfile} />
            <img src={save} alt='save' onClick={saveProfile} /> */}
					</div>
				</div>

				<div className={profile.vendor_banner_image_container}>
					{vendorInfo.vendor_banner !== `no-photo.jpg` ? (
						<CloudinaryContext cloudName='quickstlabs'>
							<Image
								className={profile.vendor_banner_image}
								publicId={vendorInfo.vendor_banner}
							>
								<Transformation
									gravity='center'
									height='355'
									width='1062'
									crop='fill'
								/>
							</Image>
						</CloudinaryContext>
					) : (
							<img
								className='vendor_banner_image'
								src={Placeholder}
								alt='vendor header'
							/>
						)}
					<div className={profile.vendor_banner_upload}>
						<BannerUploader
							vendorId={vendorId}
							vendorInfo={vendorInfo}
							setBannerInfo={setBannerInfo}
							bannerInfo={bannerInfo}
						/>
					</div>
				</div>
			</div>

			<div>
				<About
					vendorInfo={vendorInfo}
					editAbout={editAbout}
					editProfile={editProfile}
					saveProfile={saveProfile}
					setVendorInfo={setVendorInfo}
				/>
				<VendorProducts

					vendorId={vendorInfo._id}
				/>
				<Bulletin vendorId={vendorId} />
			</div>
		</div>
	);
};

export default Profile;
