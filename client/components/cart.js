import React from 'react';
import { connect } from 'react-redux';
import { removedPoster } from '../store/cart';
import RemoveButton from './RemoveButton';
import {
	checkOutThunk,
	fetchCompleteOrder,
	fetchOpenOrder,
} from '../store/order';

const poster1 = {
	id: 1,
	name: 'groomingbymoonlight',
	creator: 'carol merle',
	price: 20,
	size: '18" x 12"',
	quantity: 100,
	description: "It's a cat, it's a moon, what more would you want",
	imageUrl: 'https://loremflickr.com/320/240',
};

class Cart extends React.Component {
	constructor() {
		super();

		this.removeFromCart = this.removeFromCart.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentDidMount() {
		const userId = this.props.match.path.split('/')[2];
		console.log('this.props.match.path', userId);
		this.props.loadOpenOrder(userId);
	}

	handleDelete(posterId) {
		this.props.removeAPoster(posterId);
	}
	removeFromCart(product) {
		this.props.removeItem(product);
	}

	handleSubmit(event) {
		event.preventDefault();
		console.log('handle submit')
		const userId = this.props.match.path.split('/')[2];
		const orderId = this.props.order.openOrder.id
		this.props.checkOut(userId, orderId);
		// this.props.history.push(`/thankyou`)
	}
	render() {
		console.log('this.props', this.props);
		console.log('this.props.order', this.props.order);
		// order = this.props.order
		// cartDetail = this.props.order.cartDetail
		return (
			<div>
				<h1>Shopping Cart</h1>

				<div className='shopping-cart'>
					{/* <div className='column-labels'>
						<label className='product-details'>{poster1.name}</label>
						<label className='product-price'>{poster1.price}</label>
						<label className='product-quantity'>{poster1.quantity}</label>
						<label className='product-removal'>Remove</label>
						<label className='product-line-price'>Total</label>
					</div> */}
					{/* {this.props.postersInCart.map((poster) => {
						return (
							<div className='product' key={poster.id}>
								<div className='product-image'>
									<img src='https://loremflickr.com/320/240' />
								</div>
								<div className='product-details'>
									<div className='product-title'>{poster.name}</div>
									<p className='product-description'>{poster.description}</p>
								</div>
								<div className='product-price'>{poster.price}</div>
								<div className='product-removal'>
									<button className='delete-btn' onClick={() => this.handleDelete(poster.id)}>
										Remove
									</button>
									;
								</div>
								<div className='product-line-price'>25.98</div>
							</div>
						);
					})} */}
					{this.props.order?.cartPosters &&
						this.props.order.cartPosters.map((orderDetail) => {
							return (
								<div key={orderDetail.id}>
									<div>
										<img src={orderDetail.posters[0].imageUrl} />
									</div>
									<div>Poster Name: {orderDetail.posters[0].name} </div>
									<div>Poster Size: {orderDetail.posters[0].size} </div>
									<div>Poster Creator: {orderDetail.posters[0].creator} </div>
									<div>
										Poster Description: {orderDetail.posters[0].description}
									</div>
									<div>Poster Price: ${orderDetail.posters[0].price} </div>
									
									<div>
										<button>Remove</button>
									</div>
									<br />
									<div></div>
									<div></div>
								</div>
							);
						})}
				</div>
				<form>
					<button value='submit' onClick={this.handleSubmit}>
						Check Out
					</button>
				</form>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	postersInCart: state.cart.cart.posters,
	order: state.order,
});

const mapDispatchToProps = (dispatch, {history}) => ({
	loadOpenOrder: (userId) => dispatch(fetchOpenOrder(userId)),
	removeAPoster: (posterId) => dispatch(removedPoster(posterId)),
	checkOut: (userId, orderId) => dispatch(checkOutThunk(userId, orderId, history)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
