import { useCart } from '@/hooks/useCart'
import { removeCartItemAction, updateCardItemAction } from '@/stores/cart'
import { currency } from '@/utils'
import { Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { PopConfirm } from '../PopConfirm'

export const CartItem = ({ productId, product, quantity }) => {
    const dispatch = useDispatch()
    const [_quantity, setQuantity] = useState(quantity)
    const { loading } = useCart()
    const _loading = loading[productId] || false
    const [openPopConfirm, setOpenPopConfirm] = useState(false)
    const [openPopConfirmQuantity, setOpenPopConfirmQuantity] = useState(false)

    useEffect(() => {
        if (_quantity !== quantity) {
            setQuantity(quantity)
        }
    }, [quantity])
    const onDecrement = () => {
        setQuantity(_quantity - 1)
        dispatch(updateCardItemAction({
            productId,
            quantity: _quantity - 1,
        }))
    }
    const onIncrement = () => {
        //inputRef.current.value++;
        setQuantity(_quantity + 1)
        dispatch(updateCardItemAction({
            productId,
            quantity: _quantity + 1,
        }))
    }
    const onUpdateQuantity = (val) => {
        dispatch(updateCardItemAction({
            productId,
            quantity: val,
        }))
    }
    const onRemoveCartItem = () => {
        dispatch(removeCartItemAction(productId))
    }
    return (
        <Spin spinning={_loading}>
            <li className="list-group-item">
                <div className="row align-items-center">
                    <div className="w-[120px]">
                        {/* Image */}
                        <a href="./product.html">
                            <img className="img-fluid" src={product.thumbnail_url} alt="..." />
                        </a>
                    </div>
                    <div className="flex-1 px-2">
                        {/* Title */}
                        <p className="font-size-sm mb-6">
                            <a className="text-body" href="./product.html">{product.name}</a> <br />
                            <span className="card-product-price">
                                {
                                    product.real_price < product.price ?
                                        <>
                                            <span className="sale text-primary">{currency(product.real_price)}</span>
                                            <span className="text-muted line-through ml-1 inline-block">{currency(product.price)}</span>
                                        </> :
                                        <span className="text-muted line-through ml-1">{currency(product.real_price)}</span>
                                }
                            </span>
                        </p>
                        {/*Footer */}
                        <div className="d-flex align-items-center">
                            {/* Select */}
                            <div className="btn-group btn-quantity">
                                <PopConfirm
                                    open={openPopConfirmQuantity}
                                    onOpenChange={visible => setOpenPopConfirmQuantity(visible)}
                                    disabled={_quantity > 1 ? true : false} showCancel={false} okText="Xóa"
                                    placement="bottomRight"
                                    title="Thông báo" description="Bạn có chắc chắn muốn xóa sản phẩm này?"
                                    onConfirm={() => {
                                        setOpenPopConfirmQuantity(false)
                                        onRemoveCartItem()
                                    }}>
                                    <button onClick={_quantity > 1 ? onDecrement : undefined} className="btn">-</button>
                                </PopConfirm>
                                <input onBlur={(ev) => {
                                    let val = parseInt(ev.target.value)
                                    if (!val) {
                                        val = 1
                                        setQuantity(val)
                                    }
                                    if (val !== quantity) {
                                        onUpdateQuantity(val)
                                    }
                                }} value={_quantity} onChange={ev => setQuantity(ev.target.value)} />
                                <button onClick={onIncrement} className="btn">+</button>
                            </div>
                            {/* Remove */}
                            <PopConfirm
                                open={openPopConfirm}
                                onOpenChange={visible => setOpenPopConfirm(visible)}
                                showCancel={false} okText="Xóa" placement="bottomRight"
                                title="Thông báo" description="Bạn có chắc chắn muốn xóa sản phẩm này?"
                                onConfirm={() => {
                                    setOpenPopConfirm(false)
                                    onRemoveCartItem()
                                }}>
                                <a onClick={(ev) => ev.preventDefault()} className="font-size-xs text-gray-400 ml-auto" href="#!">
                                    <i className="fe fe-x" /> Xóa
                                </a>
                            </PopConfirm>
                        </div>
                    </div>
                </div>
            </li>
        </Spin>
    )
}
