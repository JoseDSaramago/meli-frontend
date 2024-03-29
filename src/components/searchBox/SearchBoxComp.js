/* eslint-disable no-unused-vars */
import React, { useEffect, useContext, useState } from "react";
import "antd/dist/antd.css";
import "../../assets/css/components/searchBox.css";
import { Badge } from "antd";
import { BsSearch } from "react-icons/bs";
import { CgCloseO } from "react-icons/cg";
import { AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Service } from "../../services/api";
import meliLogo from "../../assets/images/logos/Logo_ML@2x.png";
import GeneralButton from "../buttons/GeneralButton";
import Renderif from "../Renderif";
import ProductContext from "../../context/productContext";
import WishtListBadge from "./whistListBadge";

function SearchBox() {
	const navigate = useNavigate();

	const { productState, setProductState } = useContext(ProductContext);

	const [state, setState] = useState({
		searchValue: "",
		searchIcon: false,
	});

	const onSearch = async (event) => {
		event.preventDefault();
		if (event.target.name === "search") {
			const onlyText = event.target.value.replace(
				/[^A-Za-z0-9' ']/gi,
				""
			);

			setState({
				searchValue: onlyText,
			});

			if (onlyText.length > 3) {
				let _searchToList = await Service(
					"GET",
					`items/search/pagination/${onlyText}/4/0`
				);

				setProductState({
					...productState,
					productsList: _searchToList.data.response,
					searchWords: onlyText,
				});
			}
		}
	};

	const searchProducts = async () => {
		setState({
			searchValue: "",
		});

		navigate(`/items?search=${productState.searchWords}`);
	};

	const goToHome = () => {
		navigate(`/`);
		setProductState({
			...productState,
			displayNav: false,
			products: [],
			product: [],
			isLoader: false,
		});
	};

	return (
		<>
			<div className="ml__searchBox bg-yellow bx-shadow-1">
				<div className="center_content">
					<div className="logo pointer" onClick={() => goToHome()}>
						<img
							className="d-none d-lg-block"
							src={meliLogo}
							alt="meli-logo"
						/>
					</div>

					<div className="content_search">
						<div className="inputBlock">
							<input
								type="text"
								name="search"
								placeholder="Nunca dejes de buscar"
								value={state?.searchValue}
								onChange={onSearch}
								maxLength={20}
							/>

							<Renderif
								isTrue={
									state.searchValue.length >= 3 &&
									productState.productsList?.items?.length >=
										0
								}
							>
								<div className="searchList">
									<div className="suggestions text-2nd-gray">
										Algunas de nuestras sugerencias:{" "}
									</div>

									{productState.productsList?.items?.map(
										(product, index) => {
											return (
												<>
													<li
														className="transition pointer"
														key={product.title}
														onClick={() => {
															setProductState({
																...productState,
																udpateState:
																	!productState.udpateState,
																productsID:
																	product.id,
																productsList:
																	[],
																isLoader: false,
															});
															navigate(
																`/items/${product.id}`
															);
														}}
													>
														<BsSearch className="transition" />
														{product.title}
													</li>
												</>
											);
										}
									)}

									<GeneralButton
										className="btn__normal btn__BigSize btn__blue transition mr-10"
										title="Realizar Búsqueda"
										onClick={() => searchProducts()}
									/>
								</div>

								<div className="closeIcon">
									<CgCloseO
										onClick={() =>
											setState({
												...state,
												searchValue: "",
											})
										}
									/>
								</div>
							</Renderif>

							<div
								className="searchBTN transition"
								onClick={() => {
									searchProducts();
								}}
							>
								<BsSearch className="text-1st-gray transition" />
							</div>
							<div className="clear"></div>

							<WishtListBadge />
						</div>
						<div className="clear"></div>
					</div>
				</div>
			</div>
		</>
	);
}

export default SearchBox;
