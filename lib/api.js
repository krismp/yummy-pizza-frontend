import getConfig from "next/config";
import fetch from "isomorphic-unfetch";

const { publicRuntimeConfig } = getConfig();

export const postLogin = async ({ email, password }) => {
  const res = await fetch(`${publicRuntimeConfig.API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password
    }),
  });

  const data = await res.json();

  return data;
}

export const postRegister = async ({ name, email, password, confirmPassword }) => {
  const res = await fetch(`${publicRuntimeConfig.API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      c_password: confirmPassword,
    }),
  });

  const data = await res.json();

  return data;
}

export const getProductDetail = async (productId) => {
  const res = await fetch(`${publicRuntimeConfig.API_BASE_URL}/products/${productId}`);
  const data = await res.json();

  return data;
}

export const getCart = async (cartId) => {
  const result = await fetch(
    `${publicRuntimeConfig.API_BASE_URL}/carts/${cartId}`,
  );

  const json = await result.json();

  return json;
}

export const postAddToCart = async ({ userId, cartId, productId, total, price }) => {
  const res = await fetch(`${publicRuntimeConfig.API_BASE_URL}/cart_items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      cart_id: cartId,
      product_id: productId,
      total: total,
      total_price_in_usd: price,
    }),
  });

  const data = await res.json();

  return data;
}

export const removeCartItem = async (itemId) => {
  const res = await fetch(`${publicRuntimeConfig.API_BASE_URL}/cart_items/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const data = await res.json();

  return data;
}

export const postCreateOrder = async ({ userId, cartId, address, deliveryCost, finalPrice }) => {
  const res = await fetch(`${publicRuntimeConfig.API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      cart_id: cartId,
      address,
      delivery_cost_in_usd: deliveryCost,
      final_price_in_usd: finalPrice,
      status: "completed",
    }),
  });

  const data = await res.json();

  return data;
}