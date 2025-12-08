import { cartService } from "@/services/cart";
import {
  getToken,
  handleError,
  storeAddressSelect,
  storeCart,
  storePreCheckoutData,
  storePreCheckoutResponse,
} from "@/utils";
import { call, delay, put, race, select, take } from "redux-saga/effects";
import {
  cartActions,
  getCartAction,
  removeCartItemAction,
  updateItemQuantitySuccessAction,
} from ".";
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
      yield put(updateItemQuantitySuccessAction(action.payload.productId));
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
    //yield put(updateItemQuantitySuccessAction(action.payload));
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
  storePreCheckoutData.clear();
  storePreCheckoutResponse.clear();
  storeAddressSelect.clear();
  storeCart.clear();
  yield put(cartActions.setCart(null));
  //yield put(cartActions.clearCart());
}

export function setCartSaga(action) {
  storeCart.set(action.payload);
}

export function* fetchSelectCartItem(action) {
  try {
    let {
      cart: { preCheckoutData },
    } = yield select();
    let { listItems } = preCheckoutData;
    listItems = [...listItems];
    const { productId, checked } = action.payload;
    if (checked) {
      listItems.push(productId);
    } else {
      listItems.filter((e) => e !== productId);
    }

    yield put(
      cartActions.setPreCheckoutData({ ...preCheckoutData, listItems })
    );
  } catch (error) {
    handleError(error);
  }
}

export function* fetchPreCheckout(action) {
  try {
    let {
      cart: { preCheckoutData },
    } = yield select();
    if (action.type === updateItemQuantitySuccessAction.toString()) {
      let productId = action.payload;
      if (!preCheckoutData.listItems.find((e) => e === productId)) return;
    }
    yield put(cartActions.togglePreCheckoutLoading(true));
    const res = yield call(cartService.preCheckout, preCheckoutData);
    yield put(cartActions.setPreCheckoutResponse(res.data));
    yield put(cartActions.togglePreCheckoutLoading(false));
    storePreCheckoutData.set(preCheckoutData);
    storePreCheckoutResponse.set(res.data);
  } catch (error) {
    handleError(error);
  }
}

export function* fetchAddPromotion(action) {
  try {
    yield put(cartActions.togglePromotionLoading(true));
    yield call(cartService.getPromotion, action.payload.data);
    yield put(cartActions.togglePromotionCode(action.payload.data));
    action.payload?.onSuccess?.();
  } catch (error) {
    action.payload?.onError?.(error);
  } finally {
    yield put(cartActions.togglePromotionLoading(false));
  }
}

export function* removePromotion(action) {
  yield put(cartActions.togglePromotionCode());
  action?.payload?.onSuccess?.();
}

export function* updatePreCheckoutData(action) {
  if (action.type === removeCartItemAction.toString()) {
    let {
      cart: { preCheckoutData },
    } = yield select();
    if (preCheckoutData.listItems.find((e) => e === action.payload)) {
      yield put(
        cartActions.setPreCheckoutData({
          ...preCheckoutData,
          listItems: preCheckoutData.listItems.listItems.filter(
            (e) => e !== action.payload
          ),
        })
      );
    }
  }
}
