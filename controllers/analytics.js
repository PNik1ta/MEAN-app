const moment = require('moment');
const Order = require('../models/Order');
const order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');
//TODO: overview
module.exports.overview = async (req, res) => {
	try {
		const allOrders = await Order.find({ user: req.user.id }).sort({ date: 1 });
		const ordersMap = getOrdersMap(allOrders);
		const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [];

		//Yesterday orders count 
		const yesterdayOrdersNumber = yesterdayOrders.length;
		// Orders count
		const totalOrdersNumber = allOrders.length;
		// Days count
		const daysNumber = Object.keys(ordersMap).length;
		//Orders in one day
		const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0);
		//Orders count percent
		const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);
		// Total gain
		const totalGain = calculatePrice(allOrders);
		// Gain in day
		const gainPerDay = totalGain / daysNumber;
		// Yesterday gain
		const yesterdayGain = calculatePrice(yesterdayOrders);
		// Gain percent
		const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2);
		// Gain comparison
		const compareGain = (yesterdayGain - gainPerDay).toFixed(2);
		// Orders count comparison
		const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2);

		res.status(200).json({
			gain: {
				percent: Math.abs(+gainPercent),
				compare: Math.abs(+compareGain),
				yesterday: +yesterdayGain,
				isHigher: gainPercent > 0
			},
			orders: {
				percent: Math.abs(+ordersPercent),
				compare: Math.abs(+compareNumber),
				yesterday: +yesterdayOrdersNumber,
				isHigher: ordersPercent > 0
			}
		});
	} catch (error) {
		errorHandler(res, error);
		console.log(error);
	}
}

//TODO: analytics
module.exports.analytics = async (req, res) => {
	try {
		const allOrders = await Order.find({ user: req.user.id }).sort({ date: 1 });
		const ordersMap = getOrdersMap(allOrders);

		const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length);

		const chart = Object.keys(ordersMap).map(label => {
			const gain = calculatePrice(ordersMap[label]);
			const order = ordersMap[label].length;
			return { label, order, gain };
		})

		res.status(200).json({
			average, chart
		})
	} catch (e) {
		errorHandler(res, e);
	}
}

function getOrdersMap(orders = []) {
	const daysOrder = {};
	orders.forEach(order => {
		const date = moment(order.date).format('DD.MM.YYYY');

		if (date === moment().format('DD.MM.YYYY')) {
			return;
		}

		if (!daysOrder[date]) {
			daysOrder[date] = [];
		}

		daysOrder[date].push(order);
	})

	return daysOrder;
}

function calculatePrice(orders = []) {
	return orders.reduce((total, order) => {
		const orderPrice = order.list.reduce((orderTotal, item) => {
			return orderTotal += item.cost * item.quantity;
		}, 0);
		return total += orderPrice;
	}, 0);
}