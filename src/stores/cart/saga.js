import { cartService } from "@/services/cart";
import { getToken, setCart } from "@/utils";
import { call, delay, put, race, take } from "redux-saga/effects";
import { cartActions, getCartAction, removeCartItemAction } from ".";
import { authActions } from "../auth";

export function* fetchCartItem(action) {
  try {
    yield delay(300);
    if (action.payload.quantity >= 1) {
      yield call(
        cartService.addItem,
        action.payload.productId,
        action.payload.quantity
      );
      yield put(getCartAction());
      if (action.payload.showPopOver) {
        window.scroll({
          top: 0,
          behavior: "smooth",
        });
        yield put(cartActions.togglePopOver(action.payload));
      }
    } else {
      yield put(removeCartItemAction(action.payload.productId));
    }
  } catch (error) {
    console.error(error);
  }
}

export function* fetchRemoveItem(action) {
  try {
    yield put(
      cartActions.toggleProductLoading({
        productId: action.payload,
        loading: true,
      })
    );
    yield call(cartService.removeItem, action.payload);
    yield put(getCartAction());
    yield put(
      cartActions.toggleProductLoading({
        productId: action.payload,
        loading: false,
      })
    );
  } catch (error) {
    console.error(error);
  }
}
export function* fetchCart() {
  try {
    if (getToken()) {
      const { cart } = yield race({
        cart: call(cartService.getCart),
        logout: take(authActions.logout),
      });
      if (cart) {
        yield put(cartActions.setCart(cart.data));
      }
    }
  } catch (error) {
    console.error(error);
  }
}
export function* clearCart() {
  yield put(cartActions.setCart(null));
}

export function* setCartSaga(action) {
  setCart(action.payload);
}
