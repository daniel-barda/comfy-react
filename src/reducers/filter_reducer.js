import { act } from 'react-dom/test-utils';
import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from '../actions';

const filter_reducer = (state, action) => {
  if (action.type === LOAD_PRODUCTS) {
    let max_price = action.payload.map(p => p.price);

    max_price = Math.max(...max_price);

    return {
      ...state,
      all_products: [...action.payload],
      filtered_products: [...action.payload],
      filters: { ...state.filters, max_price, price: max_price },
    };
  }

  if (action.type === SET_GRIDVIEW) {
    return { ...state, grid_view: true };
  }

  if (action.type === SET_LISTVIEW) {
    return { ...state, grid_view: false };
  }

  if (action.type === UPDATE_SORT) {
    return { ...state, sort: action.payload };
  }

  if (action.type === SORT_PRODUCTS) {
    const { filtered_products, sort } = state;
    let tempProducts = [...filtered_products];

    if (sort === 'price-lowest') {
      tempProducts = tempProducts.sort((a, b) => a.price - b.price);
      return { ...state, filtered_products: tempProducts };
    }
    if (sort === 'price-highest') {
      tempProducts = tempProducts.sort((a, b) => b.price - a.price);
      return { ...state, filtered_products: tempProducts };
    }

    if (sort === 'name-a') {
      tempProducts = tempProducts.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      return { ...state, filtered_products: tempProducts };
    }
    if (sort === 'name-z') {
      tempProducts = tempProducts.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
      return { ...state, filtered_products: tempProducts };
    }
    return { ...state, filtered_products: tempProducts };
  }

  if (action.type === UPDATE_FILTERS) {
    const { name, value } = action.payload;
    return { ...state, filters: { ...state.filters, [name]: value } }; // spread operator
  }

  if (action.type === FILTER_PRODUCTS) {
    const { all_products } = state;
    const { text, company, category, color, price, shipping } = state.filters;

    let tempProducts = [...all_products];

    // search
    if (text) {
      tempProducts = tempProducts.filter(product =>
        product.name.toLowerCase().startsWith(text)
      );
    }

    // category
    if (category !== 'all') {
      tempProducts = tempProducts.filter(
        product => product.category === category
      );
    }

    // company
    if (company !== 'all') {
      tempProducts = tempProducts.filter(
        product => product.company === company
      );
    }

    // colors
    if (color !== 'all') {
      tempProducts = tempProducts.filter(product =>
        product.colors.find(c => c === color)
      );
    }

    // price
    tempProducts = tempProducts.filter(product => product.price <= price);

    // shipping
    if (shipping) {
      tempProducts = tempProducts.filter(product => product.shipping === true);
    }

    return { ...state, filtered_products: tempProducts };
  }

  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      filters: {
        ...state.filters,
        text: '',
        company: 'all',
        category: 'all',
        color: 'all',
        price: state.filters.max_price,
        shipping: false,
      },
    };
  }

  throw new Error(`No Matching "${action.type}" - action type`);
};

export default filter_reducer;
